import { unified } from "unified";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import Slugger from "github-slugger";
import type { Heading, Root, Text } from "@types/mdast";

// Define the structure for each TOC item
export interface TOCItem {
  id: string;
  title: string;
  level: number;
}

/**
 * Extracts headings from markdown content to generate a Table of Contents structure.
 * @param markdownContent The raw markdown string.
 * @returns A promise that resolves to an array of TOCItem objects.
 */
export async function extractHeadings(
  markdownContent: string,
): Promise<TOCItem[]> {
  const headings: TOCItem[] = [];
  const slugger = new Slugger(); // Initialize slugger for generating unique IDs

  // Define a simple inline plugin to collect headings
  const collectHeadings = () => (tree: Root) => {
    visit(tree, "heading", (node: Heading) => {
      // Manually extract text content from heading children
      const title = node.children
        .filter((child): child is Text => child.type === "text") // Filter for text nodes and assert type
        .map((child) => child.value)
        .join("");
      const id = slugger.slug(title); // Generate a URL-friendly slug/ID
      const level = node.depth; // Get the heading level (1 for h1, 2 for h2, etc.)

      headings.push({ id, title, level });
    });
  };

  // Create the processor
  const processor = unified()
    .use(remarkParse) // Parse the markdown into an AST
    .use(collectHeadings); // Add our custom plugin to collect headings

  // Parse the content to get the AST
  const tree = processor.parse(markdownContent);

  // Run the plugins (specifically collectHeadings) on the AST
  await processor.run(tree);

  // Reset slugger for potential subsequent calls if this function were reused in a single process
  // (though likely not necessary in this specific Next.js page context)
  slugger.reset();

  return headings;
}
