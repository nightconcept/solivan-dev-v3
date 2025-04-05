import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import fs from "fs";
import path from "path";
import process from "node:process";
// Declare variables to hold imported functions
let getAllMarkdownPages: typeof import("./content").getAllMarkdownPages;
let getMarkdownPageBySlug: typeof import("./content").getMarkdownPageBySlug;

// Mock the 'fs' module
vi.mock("fs");

// Define mock paths *before* any imports that might use them
const MOCK_CWD = "/mock/project";
const MOCK_CONTENT_DIR = "/mock/project/src/content"; // Updated mock path

// Mock process.cwd() globally for this test file
vi.spyOn(process, "cwd").mockReturnValue(MOCK_CWD);

// Use vi.doMock to ensure 'path' is mocked *before* lib/content is imported
vi.doMock("path", async () => {
  const actual = await vi.importActual<typeof path>("path");
  return {
    ...actual,
    join: vi.fn((...args: string[]) => {
      // Check if this is the specific call defining contentDirectory in lib/content.ts
      if (
        args.length === 2 && args[0] === MOCK_CWD && args[1] === "src/content"
      ) {
        // Check for 'src/content'
        return MOCK_CONTENT_DIR; // Return our mock path
      }
      // Use actual join for other calls
      return actual.join(...args);
    }),
  };
});

// Removed top-level await import

describe("lib/content", () => {
  // The original describe block starts here
  // Import the module before tests run, after mocks are set up
  beforeAll(async () => {
    const contentModule = await import("./content");
    getAllMarkdownPages = contentModule.getAllMarkdownPages;
    getMarkdownPageBySlug = contentModule.getMarkdownPageBySlug;
  });

  // No longer mocking process.cwd() here, it's done globally
  beforeEach(() => {
    // Reset mocks before each test, but process.cwd spy and path.join mock persist
    vi.clearAllMocks(); // Use clearAllMocks instead of reset to keep mock implementations
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restore all mocks, including the process.cwd spy
  });
  // --- Tests for getAllMarkdownPages ---
  describe("getAllMarkdownPages", () => {
    it("should return slugs for top-level markdown files and filter others", () => {
      // Use the mocked constant now
      const expectedDir = MOCK_CONTENT_DIR;
      const mockEntries = [
        { name: "about.md", isFile: () => true, isDirectory: () => false },
        { name: "archives.md", isFile: () => true, isDirectory: () => false },
        { name: "image.png", isFile: () => true, isDirectory: () => false }, // Non-markdown file
        { name: "blog", isFile: () => false, isDirectory: () => true }, // Directory
        { name: "data.json", isFile: () => true, isDirectory: () => false }, // Non-markdown file
      ];

      // Configure fs mocks
      const mockedFs = vi.mocked(fs);
      // Mock implementation should now receive the MOCK_CONTENT_DIR
      mockedFs.readdirSync.mockImplementation((dirPath, options) => {
        if (dirPath === MOCK_CONTENT_DIR && options?.withFileTypes) {
          return mockEntries as fs.Dirent[]; // Use the correct type fs.Dirent[]
        }
        // Log the received path for debugging if it fails
        console.error(
          `readdirSync mock received unexpected path: ${dirPath}, expected: ${MOCK_CONTENT_DIR}`,
        );
        throw new Error(
          `Unexpected path or options in readdirSync mock: ${dirPath}`,
        );
      });

      const pages = getAllMarkdownPages();

      // Assertions
      expect(pages).toHaveLength(2); // Only 'about.md' and 'archives.md'
      expect(pages).toEqual([{ slug: "about" }, { slug: "archives" }]);
      // Assert based on the dynamically calculated path
      expect(mockedFs.readdirSync).toHaveBeenCalledWith(expectedDir, {
        withFileTypes: true,
      });
      // Ensure readFileSync was NOT called, as this function only lists slugs
      expect(mockedFs.readFileSync).not.toHaveBeenCalled();
    });

    // The previous test already covers ignoring subdirectories and non-markdown files implicitly.
    it("should handle directory read errors gracefully", () => {
      // Use the mocked constant now
      const expectedDir = MOCK_CONTENT_DIR;
      // Configure fs mocks
      const mockedFs = vi.mocked(fs);
      const readError = new Error("Simulated EACCES error reading directory");
      mockedFs.readdirSync.mockImplementation((dirPath) => {
        // Check the path before throwing
        if (dirPath === MOCK_CONTENT_DIR) {
          throw readError;
        }
        console.error(
          `readdirSync (error test) mock received unexpected path: ${dirPath}, expected: ${MOCK_CONTENT_DIR}`,
        );
        throw new Error(`Unexpected path in readdirSync mock: ${dirPath}`);
      });

      // Suppress console.error expected during this test
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(
        () => {},
      );

      const pages = getAllMarkdownPages();

      expect(pages).toEqual([]); // Should return empty array on error
      // Assert based on the dynamically calculated path
      expect(mockedFs.readdirSync).toHaveBeenCalledWith(expectedDir, {
        withFileTypes: true,
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error reading content directory:",
        expectedDir,
        readError,
      );

      consoleErrorSpy.mockRestore(); // Restore console.error
    });
    // Parsing/filtering based on frontmatter is NOT done by this function.
    // Note: Frontmatter tests removed as they are not applicable to getAllMarkdownPages
  });

  // --- Tests for getMarkdownPageBySlug ---
  describe("getMarkdownPageBySlug", () => {
    it("should return page data including content for a valid slug", () => {
      const slug = "about";
      const mockFilename = `${slug}.md`;
      const mockFileContent = `---
title: Mock About Page
description: A test page.
---

This is the content of the about page.
`;
      // Use the mocked constant now
      const expectedPath = `${MOCK_CONTENT_DIR}/${mockFilename}`; // Use simple string concat now

      // Configure fs mocks
      const mockedFs = vi.mocked(fs);
      // Mock implementations should receive path based on MOCK_CONTENT_DIR
      mockedFs.existsSync.mockImplementation((p) => p === expectedPath);
      mockedFs.readFileSync.mockImplementation((p) => {
        if (p === expectedPath) {
          return mockFileContent;
        }
        console.error(
          `readFileSync (valid slug) mock received unexpected path: ${p}, expected: ${expectedPath}`,
        );
        throw new Error(`Unexpected path requested in readFileSync mock: ${p}`);
      });

      const pageData = getMarkdownPageBySlug(slug);

      expect(pageData).not.toBeNull();
      expect(pageData?.slug).toBe(slug);
      expect(pageData?.frontmatter.title).toBe("Mock About Page");
      expect(pageData?.frontmatter.description).toBe("A test page.");
      expect(pageData?.content.trim()).toBe(
        "This is the content of the about page.",
      );
      expect(mockedFs.existsSync).toHaveBeenCalledWith(expectedPath);
      expect(mockedFs.readFileSync).toHaveBeenCalledWith(expectedPath, "utf8");
    });

    it("should return null if the page file does not exist", () => {
      const slug = "non-existent-page";
      // Use the mocked constant now
      const expectedPath = `${MOCK_CONTENT_DIR}/${slug}.md`;

      // Configure fs mocks
      const mockedFs = vi.mocked(fs);
      // Mock implementation should receive path based on MOCK_CONTENT_DIR
      mockedFs.existsSync.mockImplementation((p) => {
        if (p === expectedPath) return false; // Simulate not found for the specific path
        console.warn(
          `existsSync (not found test) mock received unexpected path: ${p}, expected: ${expectedPath}`,
        );
        return true; // Assume other paths exist for simplicity if needed elsewhere
      });

      const pageData = getMarkdownPageBySlug(slug);

      expect(pageData).toBeNull();
      expect(mockedFs.existsSync).toHaveBeenCalledWith(expectedPath);
      expect(mockedFs.readFileSync).not.toHaveBeenCalled(); // Should not attempt read
    });

    it("should return null on file read error", () => {
      const slug = "read-error-page";
      // Use the mocked constant now
      const expectedPath = `${MOCK_CONTENT_DIR}/${slug}.md`;

      // Configure fs mocks
      const mockedFs = vi.mocked(fs);
      // Mock implementations should receive path based on MOCK_CONTENT_DIR
      mockedFs.existsSync.mockImplementation((p) => p === expectedPath); // File exists...
      mockedFs.readFileSync.mockImplementation((p) => {
        if (p === expectedPath) {
          throw new Error("Simulated EACCES error"); // ...but cannot be read
        }
        console.error(
          `readFileSync (read error test) mock received unexpected path: ${p}, expected: ${expectedPath}`,
        );
        throw new Error(`Unexpected path requested in readFileSync mock: ${p}`);
      });

      // Suppress console.error expected during this test
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(
        () => {},
      );

      const pageData = getMarkdownPageBySlug(slug);

      expect(pageData).toBeNull();
      expect(mockedFs.existsSync).toHaveBeenCalledWith(expectedPath);
      expect(mockedFs.readFileSync).toHaveBeenCalledWith(expectedPath, "utf8");
      expect(consoleErrorSpy).toHaveBeenCalled(); // Check if error was logged

      consoleErrorSpy.mockRestore(); // Restore console.error
    });

    // Rewriting this specific test block to ensure correct syntax
    it("should return null on frontmatter parsing error", () => {
      const slug = "bad-fm-page";
      const mockFilename = `${slug}.md`;
      const mockFileContent = `---
title: Bad Frontmatter" // Missing closing quote
date: 2024-01-05
invalid_yaml: : :
---

Content here.
`;
      // Use the mocked constant now
      const expectedPath = `${MOCK_CONTENT_DIR}/${mockFilename}`;

      // Configure fs mocks
      const mockedFs = vi.mocked(fs);
      // Mock implementations should receive path based on MOCK_CONTENT_DIR
      mockedFs.existsSync.mockImplementation((p) => p === expectedPath);
      mockedFs.readFileSync.mockImplementation((p) => {
        if (p === expectedPath) {
          return mockFileContent; // Return content with bad frontmatter
        }
        console.error(
          `readFileSync (bad fm test) mock received unexpected path: ${p}, expected: ${expectedPath}`,
        );
        throw new Error(`Unexpected path requested in readFileSync mock: ${p}`);
      }); // Correct closing for readFileSync.mockImplementation

      // Suppress console.error expected during this test
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(
        () => {},
      );

      const pageData = getMarkdownPageBySlug(slug);

      expect(pageData).toBeNull(); // Should fail gracefully
      expect(mockedFs.existsSync).toHaveBeenCalledWith(expectedPath);
      expect(mockedFs.readFileSync).toHaveBeenCalledWith(expectedPath, "utf8");
      expect(consoleErrorSpy).toHaveBeenCalled(); // Check if error was logged

      consoleErrorSpy.mockRestore(); // Restore console.error
    }); // Correct closing for it(...) block

    it("should return page data and log warning if title is missing in frontmatter", () => {
      const slug = "missing-title-page";
      const mockFilename = `${slug}.md`;
      const mockFileContent = `---
description: A page without a title.
date: 2024-01-06
---

Content is still here.
`;
      const expectedPath = `${MOCK_CONTENT_DIR}/${mockFilename}`;

      // Configure fs mocks
      const mockedFs = vi.mocked(fs);
      mockedFs.existsSync.mockImplementation((p) => p === expectedPath);
      mockedFs.readFileSync.mockImplementation((p) => {
        if (p === expectedPath) return mockFileContent;
        throw new Error(`Unexpected path in readFileSync mock: ${p}`);
      });

      // Spy on console.warn
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(
        () => {},
      );

      const pageData = getMarkdownPageBySlug(slug);

      expect(pageData).not.toBeNull(); // Page should still be returned
      expect(pageData?.slug).toBe(slug);
      expect(pageData?.frontmatter.title).toBeUndefined(); // Title is missing
      expect(pageData?.frontmatter.description).toBe("A page without a title.");
      expect(pageData?.content.trim()).toBe("Content is still here.");
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        `Page ${slug}.md: Missing 'title' in frontmatter.`,
      );

      consoleWarnSpy.mockRestore(); // Restore console.warn
    });

    // Note: 'should correctly parse frontmatter and content' is covered by the first test.
  }); // End describe('getMarkdownPageBySlug')
}); // End describe('lib/content')
