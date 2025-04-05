import { getCollection, type CollectionEntry } from "astro:content";

// Helper function to strip Markdown more thoroughly
export function stripMarkdown(markdown: string = ''): string {
  // Remove HTML tags (basic)
  markdown = markdown.replace(/<[^>]*>/g, '');

  // Remove code blocks first (multi-line)
  markdown = markdown.replace(/```[\s\S]*?```/g, '');
  markdown = markdown.replace(/~~~[\s\S]*?~~~/g, '');

  // Remove headers (entire line)
  markdown = markdown.replace(/^#+\s+.*$/gm, '');

  // Remove horizontal rules
  markdown = markdown.replace(/^(\*|-|_){3,}\s*$/gm, '');

  // Remove blockquotes marker
  markdown = markdown.replace(/^>\s?/gm, '');

  // Remove list markers
  markdown = markdown.replace(/^[\*\-\+]\s+/gm, '');
  markdown = markdown.replace(/^\d+\.\s+/gm, '');

  // Remove images
  markdown = markdown.replace(/!\[.*?\]\(.*?\)/g, '');

  // Remove links, keeping the text
  markdown = markdown.replace(/\[(.*?)\]\(.*?\)/g, '$1');

  // Remove bold/italics/strikethrough
  markdown = markdown.replace(/(\*\*|__)(.*?)\1/g, '$2'); // Bold
  markdown = markdown.replace(/(\*|_)(.*?)\1/g, '$2');   // Italics
  markdown = markdown.replace(/~~(.*?)~~/g, '$1');      // Strikethrough

  // Remove inline code
  markdown = markdown.replace(/`([^`]+)`/g, '$1');

  // Remove extra whitespace and newlines
  markdown = markdown.replace(/\n+/g, ' '); // Replace newlines with spaces
  markdown = markdown.replace(/\s{2,}/g, ' '); // Replace multiple spaces with single space

  return markdown.trim(); // Trim leading/trailing whitespace
}

// Helper function for word-aware truncation
export function truncateDescription(text: string, maxLength: number = 150): string {
  const strippedText = stripMarkdown(text); // Use the exported stripMarkdown
  if (strippedText.length <= maxLength) {
    return strippedText;
  }
  // Find the last space within the maxLength
  const lastSpaceIndex = strippedText.lastIndexOf(' ', maxLength);
  // If no space found, just truncate (edge case)
  const truncatedText = lastSpaceIndex > 0 ? strippedText.substring(0, lastSpaceIndex) : strippedText.substring(0, maxLength);
  return truncatedText + "...";
}

// Calculate read time
export function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  // Use stripped markdown for more accurate word count
  const wordCount = stripMarkdown(content).split(/\s+/).length; // Use the exported stripMarkdown
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}
// Define the expected shape of a validated post
type ValidPost = {
  slug: string;
  title: string;
  description: string;
  date: Date;
  author: string;
  draft: boolean;
  body: string;
};

// Helper function to fetch, validate, sort, and optionally limit blog posts
export async function getValidBlogPosts(limit?: number): Promise<Array<ValidPost>> {
  // Fetch blog posts from the 'blog' collection
  const allPostsRaw = await getCollection("blog");

  // Filter posts to ensure they have a valid publication date and map to the expected structure
  const validPosts = allPostsRaw
    .filter((post): post is CollectionEntry<"blog"> & { data: { date: Date } } => post.data.date instanceof Date) // Type guard for date
    .map((post): ValidPost => {
      // Handle potential array/undefined author - adjust logic if needed based on actual schema
      let authorString = "Unknown Author";
      if (Array.isArray(post.data.author)) {
        authorString = post.data.author.join(", ");
      } else if (typeof post.data.author === 'string' && post.data.author) {
        authorString = post.data.author;
      }

      return {
        slug: post.id, // Use post.id as the source for the slug
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
