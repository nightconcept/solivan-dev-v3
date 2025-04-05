import { describe, expect, it } from "vitest";
import { generatePageMetadata, siteMetadataConfig } from "./metadata.config";
import type { Metadata } from "next";

// Helper function to access the private formatTagForTitle function via the template
const testFormatTagForTitle = (tagSlug: string): string => {
  const title = siteMetadataConfig.tagPageTitleTemplate(tagSlug);
  // Extract the formatted tag from the template string
  const match = title.match(/"([^"]+)"/);
  return match ? match[1] : "";
};

describe("metadata.config", () => {
  describe("formatTagForTitle (tested via tagPageTitleTemplate)", () => {
    it("should format a single word tag", () => {
      expect(testFormatTagForTitle("typescript")).toBe("Typescript");
    });

    it("should format a multi-word tag with hyphens", () => {
      expect(testFormatTagForTitle("next-js")).toBe("Next Js");
    });

    it("should handle empty string", () => {
      expect(testFormatTagForTitle("")).toBe("");
    });

    it("should handle tags with numbers (though formatting might not change them)", () => {
      expect(testFormatTagForTitle("version-1")).toBe("Version 1");
    });

    it("should handle tags with mixed case (input gets lowercased effectively by replace)", () => {
      // Assuming input slugs are generally lowercase, but testing robustness
      expect(testFormatTagForTitle("React-Native")).toBe("React Native");
    });
  });

  describe("siteMetadataConfig", () => {
    it("should have the correct baseTitle", () => {
      expect(siteMetadataConfig.baseTitle).toBe("/home/danny");
    });

    it("should have the correct blogListTitle", () => {
      expect(siteMetadataConfig.blogListTitle).toBe("Blog Pages");
    });

    it("should have the correct aboutPageTitle", () => {
      expect(siteMetadataConfig.aboutPageTitle).toBe("About Me");
    });

    it("should generate the correct tag page title using the template", () => {
      expect(siteMetadataConfig.tagPageTitleTemplate("react-hooks")).toBe(
        'Posts tagged with "React Hooks"',
      );
      expect(siteMetadataConfig.tagPageTitleTemplate("css")).toBe(
        'Posts tagged with "Css"',
      );
    });
  });

  describe("generatePageMetadata", () => {
    it("should return the provided metadata object", () => {
      const override: Metadata = {
        title: "My Custom Page Title",
        description: "A specific description for this page.",
        keywords: ["custom", "metadata"],
      };
      const expectedMetadata: Metadata = {
        title: "My Custom Page Title", // Currently, it just returns the override title
        description: "A specific description for this page.",
        keywords: ["custom", "metadata"],
      };
      expect(generatePageMetadata(override)).toEqual(expectedMetadata);
    });

    it("should handle metadata with only a title", () => {
      const override: Metadata = {
        title: "Another Title",
      };
      const expectedMetadata: Metadata = {
        title: "Another Title",
      };
      expect(generatePageMetadata(override)).toEqual(expectedMetadata);
    });

    it("should handle empty override object", () => {
      const override: Metadata = {};
      const expectedMetadata: Metadata = {
        title: undefined, // Title is undefined in the override
      };
      expect(generatePageMetadata(override)).toEqual(expectedMetadata);
    });

    it("should correctly spread additional properties", () => {
      const override: Metadata = {
        title: "Test Title",
        openGraph: {
          title: "OG Title",
          description: "OG Description",
        },
        twitter: {
          card: "summary_large_image",
        },
      };
      const expectedMetadata: Metadata = {
        title: "Test Title",
        openGraph: {
          title: "OG Title",
          description: "OG Description",
        },
        twitter: {
          card: "summary_large_image",
        },
      };
      expect(generatePageMetadata(override)).toEqual(expectedMetadata);
    });
  });
});
