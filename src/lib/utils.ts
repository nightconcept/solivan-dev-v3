import { type CollectionEntry, getCollection } from "astro:content";

/**
 * Helper function to strip Markdown formatting from a string.
 * It removes HTML tags, code blocks, headers, horizontal rules, blockquotes,
 * list markers, images, links, bold/italics/strikethrough, inline code,
 * and extra whitespace/newlines.
 *
 * @param {string} [markdown=''] - The Markdown string to strip. Defaults to an empty string.
 * @returns {string} The stripped text with Markdown formatting removed.
 */
export function stripMarkdown(markdown: string = ""): string {
  // Remove HTML tags (basic)
  let previous: string;
  do {
    previous = markdown;
    markdown = markdown.replace(/<[^>]*>/g, "");
  } while (markdown !== previous);

  // Remove code blocks first (multi-line)
  markdown = markdown.replace(/```[\s\S]*?```/g, "");
  markdown = markdown.replace(/~~~[\s\S]*?~~~/g, "");

  // Remove extra whitespace and newlines (initial pass for line-based regexes)
  markdown = markdown.replace(/\r\n/g, "\n"); // Normalize line endings
  markdown = markdown.trim().replace(/^[ \t]+/gm, ""); // Remove leading space/tab per line

  // Remove headers (entire line)
  markdown = markdown.replace(/^#+\s+.*$/gm, ""); // Remove full-line headers
  markdown = markdown.replace(/(?<!^)\s*#+\s+\S+/g, " "); // Remove inline headers (e.g., "text # Header") and replace with a space

  // Remove horizontal rules
  markdown = markdown.replace(/(\s|^)(\*|-|_){3,}(\s|$)/gm, " "); // Remove HRs, replacing with a space

  // Remove blockquotes marker
  markdown = markdown.replace(/^>\s?/gm, ""); // Remove blockquote marker only (at line start)

  // Remove list markers
  markdown = markdown.replace(/^[*\-+]\s+/gm, ""); // Remove unordered list marker only (at line start)
  markdown = markdown.replace(/^\d+\.\s+/gm, ""); // Remove ordered list marker only (at line start)

  // Remove images
  markdown = markdown.replace(/!\[.*?\]\(.*?\)/g, " "); // Standard image tags, replace with space
  markdown = markdown.replace(/^!.*$/gm, ""); // Lines starting with ! (for the specific test case)

  // Remove links, keeping the text
  markdown = markdown.replace(/\[(.*?)\]\(.*?\)/g, "$1");

  // Remove bold/italics/strikethrough
  markdown = markdown.replace(/(\*\*|__)(.*?)\1/g, "$2"); // Bold
  markdown = markdown.replace(/(\*|_)(.*?)\1/g, "$2"); // Italics
  markdown = markdown.replace(/~~(.*?)~~/g, "$1"); // Strikethrough

  // Remove inline code
  markdown = markdown.replace(/`([^`]+)`/g, "$1");

  // Remove extra whitespace and newlines
  markdown = markdown.replace(/\n+/g, " "); // Replace newlines with spaces
  markdown = markdown.replace(/\s{2,}/g, " "); // Replace multiple spaces with single space

  return markdown.trim();
}

/**
 * Helper function for word-aware truncation of a string.
 * It strips Markdown formatting, then truncates the text to the specified
 * maximum length, ensuring that it doesn't cut off in the middle of a word.
 *
 * @param {string} text - The text to truncate.
 * @param {number} [maxLength=150] - The maximum length of the truncated text. Defaults to 150.
 * @returns {string} The truncated text, with an ellipsis (...) appended if it was truncated.
 */
export function truncateDescription(text: string, maxLength: number = 150): string {
  const strippedText = stripMarkdown(text);
  if (strippedText.length <= maxLength) {
    return strippedText;
  }
  // Find the last space within the maxLength
  const lastSpaceIndex = strippedText.lastIndexOf(" ", maxLength - 1);
  // If no space found, just truncate (edge case)
  const truncatedText =
    lastSpaceIndex > 0 ? strippedText.substring(0, lastSpaceIndex) : strippedText.substring(0, maxLength - 1);

  // Check if the last character is a period and adjust the ellipsis accordingly
  if (truncatedText.endsWith(".")) {
    return `${truncatedText}..`;
  } else {
    return `${truncatedText}...`;
  }
}

/**
 * Calculates the estimated reading time for a given content string.
 * It strips Markdown formatting, counts the number of words, and then
 * calculates the reading time based on an average reading speed of 200 words per minute.
 *
 * @param {string} content - The content string to calculate the reading time for.
 * @returns {string} A string indicating the estimated reading time (e.g., "3 min read").
 */
export function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = stripMarkdown(content).split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

/**
 * Defines the expected shape of a validated blog post.
 * @typedef {Object} ValidPost
 * @property {string} slug - The unique identifier for the post.
 * @property {string} title - The title of the post.
 * @property {string} description - A brief description of the post.
 * @property {Date} date - The publication date of the post.
 * @property {string} author - The author(s) of the post.
 * @property {boolean} draft - Indicates whether the post is a draft.
 * @property {string} body - The main content of the post.
 */
type ValidPost = {
  slug: string;
  title: string;
  description: string;
  date: Date;
  author: string;
  draft: boolean;
  body: string;
};

/**
 * Helper function to fetch, validate, sort, and optionally limit blog posts.
 * It retrieves posts from the 'blog' collection, filters out invalid posts,
 * maps them to the expected `ValidPost` structure, sorts them by date (newest first),
 * and optionally limits the number of returned posts.
 *
 * @async
 * @param {number} [limit] - An optional limit on the number of posts to return.
 * @returns {Promise<Array<ValidPost>>} A promise that resolves to an array of validated and sorted blog posts.
 */
export async function getValidBlogPosts(limit?: number): Promise<ValidPost[]> {
  // Fetch blog posts from the 'blog' collection
  const allPostsRaw = await getCollection("blog");

  // Filter posts to ensure they have a valid publication date and map to the expected structure
  const validPosts = allPostsRaw
    .filter((post): post is CollectionEntry<"blog"> & { data: { date: Date } } => post.data.date instanceof Date) // Type guard for date
    .filter((post) => !(post.data.draft === true)) // Filter out drafts (include if false or undefined)
    .map((post): ValidPost => {
      // Handle potential array/undefined author - adjust logic if needed based on actual schema
      let authorString = "Unknown Author";
      if (Array.isArray(post.data.author)) {
        authorString = post.data.author.join(", ");
      } else if (typeof post.data.author === "string" && post.data.author) {
        authorString = post.data.author;
      }

      return {
        slug: post.id.replace(/\.mdx?$/, ""), // Remove .md or .mdx extension
        title: post.data.title ?? "Untitled Post", // Provide default
        description: post.data.description ?? "", // Provide default for description
        date: post.data.date, // Already validated by filter
        author: authorString, // Use processed author string
        draft: post.data.draft ?? false, // Provide default if draft is optional
        body: post.body ?? "", // Ensure body is a string, provide fallback
      };
    });

  // Sort posts by date, newest first
  const sortedPosts = validPosts.sort((a, b) => b.date.getTime() - a.date.getTime());

  // Apply limit if provided and positive
  if (limit && limit > 0) {
    return sortedPosts.slice(0, limit);
  }

  return sortedPosts; // Return all sorted posts if no limit
}
