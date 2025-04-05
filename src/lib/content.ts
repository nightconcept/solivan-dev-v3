import fs from "fs";
import path from "path";
import matter from "gray-matter";
import process from "node:process";
// Removed unused notFound import

// Define the structure of the frontmatter we expect for general pages
interface PageFrontmatter {
  title: string;
  date?: string; // Optional date
  author?: string | string[];
  description?: string;
  // Add other fields you might expect in top-level markdown files
  // Removed index signature [key: string]: any; to resolve lint error
}

// Define the structure of the data returned by getMarkdownPageBySlug
export interface PageData {
  slug: string;
  frontmatter: PageFrontmatter;
  content: string;
}

// Define the structure for page metadata returned by getAllMarkdownPages
export interface PageMetadata {
  slug: string;
  // Add any other metadata you might want to expose, e.g., title from frontmatter
  // title?: string;
}

const contentDirectory = path.join(process.cwd(), "src/content");

/**
 * Retrieves the content and frontmatter for a specific top-level markdown page.
 * @param slug The slug of the page (filename without .md).
 * @returns PageData object or null if not found.
 */
export function getMarkdownPageBySlug(slug: string): PageData | null {
  // Ignore common static file requests that might fall through to this dynamic route
  if (slug === "favicon.ico") {
    return null;
  }

  const fullPath = path.join(contentDirectory, `${slug}.md`);

  try {
    if (!fs.existsSync(fullPath)) {
      console.warn(
        `Markdown page file not found for slug: ${slug} at path: ${fullPath}`,
      );
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Basic validation (at least a title is good practice)
    if (!data.title) {
      console.warn(`Page ${slug}.md: Missing 'title' in frontmatter.`);
      // Decide if you want to return null or proceed with a default title
      // For now, we proceed but this might cause issues in rendering
    }

    return {
      slug,
      frontmatter: data as PageFrontmatter, // Type assertion
      content,
    };
  } catch (error) {
    console.error(`Error processing markdown page for slug ${slug}:`, error);
    return null; // Return null on any processing error
  }
}

/**
 * Retrieves metadata (currently just slugs) for all top-level markdown files
 * in the content directory, excluding subdirectories like 'blog'.
 * @returns An array of PageMetadata objects.
 */
export function getAllMarkdownPages(): PageMetadata[] {
  let filenames: string[];
  try {
    // Read directory entries
    const entries = fs.readdirSync(contentDirectory, { withFileTypes: true });

    // Filter for top-level .md files only
    filenames = entries
      .filter((dirent) => dirent.isFile() && dirent.name.endsWith(".md"))
      .map((dirent) => dirent.name);
  } catch (error) {
    console.error("Error reading content directory:", contentDirectory, error);
    return []; // Return empty array if directory doesn't exist or isn't readable
  }

  const allPagesData = filenames
    .map((filename): PageMetadata | null => {
      const slug = filename.replace(/\.md$/, "");
      // Optionally, you could read frontmatter here too if needed for listing pages
      // For generateStaticParams, only the slug is strictly required.
      return { slug };
    })
    .filter((page): page is PageMetadata => page !== null); // Filter out potential nulls if logic changes

  return allPagesData;
}
