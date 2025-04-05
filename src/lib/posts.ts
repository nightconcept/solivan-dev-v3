import fs from "fs";
import path from "path";
import matter from "gray-matter";
import process from "node:process";

// Define the structure of the frontmatter we expect
interface PostFrontmatter {
  title: string;
  date: string; // Keep as string for now, convert to Date for sorting
  author?: string | string[]; // Allow single or multiple authors
  tags?: string[];
  description?: string;
  // Add other fields from your frontmatter if needed
  // Removed index signature [key: string]: any; to resolve lint error
}

// Define the structure of the post metadata returned by getAllPosts
export interface PostMetadata extends PostFrontmatter {
  slug: string;
  dateObject: Date; // Add a Date object for reliable sorting
  excerpt: string; // Add excerpt field
  readTime: string; // Add read time field
  content?: string; // Make content optional as it might not be included
}

// Define the structure of the full post data returned by getPostBySlug
export interface PostData {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
}

// Moved postsDirectory calculation inside getAllPosts

export function getAllPosts(
  options?: { includeContent?: boolean },
): PostMetadata[] {
  const includeContent = options?.includeContent ?? true; // Default to including content
  const postsDirectory = path.join(process.cwd(), "src/content/blog"); // Calculate directory path here
  let filenames: string[];
  try {
    filenames = fs.readdirSync(postsDirectory);
  } catch (error) {
    console.error("Error reading posts directory:", postsDirectory, error);
    return []; // Return empty array if directory doesn't exist or isn't readable
  }

  const allPostsData = filenames
    .filter((filename) => filename.endsWith(".md")) // Only process markdown files
    .map((filename): PostMetadata | null => {
      // Remove ".md" from file name to get slug
      const slug = filename.replace(/\.md$/, "");

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, filename);
      let fileContents: string;
      try {
        fileContents = fs.readFileSync(fullPath, "utf8");
      } catch (error) {
        console.error(`Error reading file: ${fullPath}`, error);
        return null; // Skip this file if unreadable
      }

      // Use gray-matter to parse the post metadata section
      try {
        const { data, content } = matter(fileContents);

        // Validate required frontmatter fields
        if (!data.title || !data.date) {
          console.warn(
            `Skipping ${filename}: Missing required frontmatter (title, date).`,
          );
          return null;
        }

        const dateObject = new Date(data.date);
        if (isNaN(dateObject.getTime())) {
          console.warn(
            `Skipping ${filename}: Invalid date format (${data.date}).`,
          );
          return null;
        }

        // --- Excerpt Generation ---
        // Remove markdown formatting for a cleaner excerpt
        const plainContent = content
          .replace(/---[\s\S]*?---/, "") // Remove frontmatter if somehow included
          .replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
          .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Remove markdown links, keep text
          .replace(/[`\*_#]+/g, "") // Remove markdown syntax characters
          .replace(/\s+/g, " ") // Normalize whitespace
          .trim();
        const excerpt = plainContent.length > 150
          ? plainContent.substring(0, 150) + "..."
          : plainContent;

        // --- Read Time Calculation (Simple) ---
        const wordsPerMinute = 200; // Average reading speed
        const wordCount = plainContent.split(/\s+/).length;
        const readTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
        const readTime = `${readTimeMinutes} min`;

        // Combine the data with the slug, excerpt, and readTime
        // Destructure slug from frontmatter data, collect the rest
        // Cast the frontmatter data to the expected type
        const frontmatter = data as PostFrontmatter;

        return {
          ...frontmatter, // Spread the validated frontmatter properties first
          slug: slug, // Explicitly use the slug derived from the filename (overwrites frontmatter slug if present)
          dateObject, // Use Date object for sorting
          excerpt,
          readTime,
          ...(includeContent && { content }), // Conditionally include content
        };
      } catch (error) {
        console.error(`Error processing file ${filename}:`, error);
        return null; // Skip file if processing fails
      }
    })
    .filter((post): post is PostMetadata => post !== null); // Filter out null values from errors/skips

  // Sort posts by date (newest first)
  return allPostsData.sort((a, b) =>
    b.dateObject.getTime() - a.dateObject.getTime()
  );
}

export function getPostBySlug(slug: string): PostData | null {
  const postsDirectory = path.join(process.cwd(), "src/content/blog"); // Calculate directory path here too
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  try {
    if (!fs.existsSync(fullPath)) {
      console.warn(
        `Post file not found for slug: ${slug} at path: ${fullPath}`,
      );
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const { data, content } = matter(fileContents);

    // Validate required frontmatter fields
    if (!data.title || !data.date) {
      console.warn(
        `Post ${slug}.md: Missing required frontmatter (title, date). Content might still be loaded.`,
      );
      // Decide if you want to return null or proceed without full metadata
    }

    return {
      slug,
      frontmatter: data as PostFrontmatter,
      content,
    };
  } catch (error) {
    console.error(`Error processing post for slug ${slug}:`, error);
    return null; // Return null on any processing error
  }
}
