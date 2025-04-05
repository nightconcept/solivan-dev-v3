// scripts/new-blog.js
import process from "node:process";
const fs = require("fs");
const path = require("path");
const { format } = require("date-fns"); // Use date-fns for formatting

// Helper function for sanitizing title to slug/filename base
// Converts to lowercase, replaces spaces with hyphens, removes most non-alphanumeric chars
function sanitizeTitle(title) {
  return (
    title
      .toLowerCase()
      // Remove characters that are not letters (incl. Unicode), numbers, spaces, or hyphens
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .trim() // Remove leading/trailing whitespace
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-")
  ); // Replace multiple hyphens with single one
}

// Helper function to format date locally with timezone offset
function getFormattedLocalDate() {
  const now = new Date();
  // Format like: 2025-04-03T06:55:46-07:00
  try {
    return format(now, "yyyy-MM-dd'T'HH:mm:ssXXX");
  } catch (e) {
    console.error("Error formatting date. Ensure 'date-fns' is installed.", e);
    // Fallback to basic ISO string if formatting fails
    return now.toISOString();
  }
}

const args = process.argv.slice(2);

if (args.length !== 1) {
  console.error(
    "Usage: node scripts/new-blog.js <filename.md | Blog Post Title>",
  );
  process.exit(1);
}

const inputArg = args[0];
let filename;
let slug;
let title = ""; // Default title is empty (will use template's default)

// Determine if input is filename or title, derive slug/filename/title
if (inputArg.endsWith(".md")) {
  // Input is a filename
  filename = inputArg;
  slug = path.basename(filename, ".md");
  // Basic validation for filename-derived slug
  if (
    !slug || slug.includes("/") || slug.includes("\\") || slug.includes("..")
  ) {
    console.error(
      `Error: Invalid filename or slug derived from filename: "${inputArg}"`,
    );
    process.exit(1);
  }
  // Title will remain empty, using the template default
} else {
  // Input is treated as a title
  title = inputArg.trim(); // Use the argument directly as title, trim whitespace
  if (!title) {
    console.error("Error: Blog post title cannot be empty.");
    process.exit(1);
  }
  slug = sanitizeTitle(title);
  if (!slug) {
    console.error(
      `Error: Could not generate a valid slug from the title: "${title}"`,
    );
    process.exit(1);
  }
  filename = `${slug}.md`;
  console.log(`Generated filename: "${filename}"`);
}

const targetDir = path.join("src", "content", "blog");
const targetPath = path.join(targetDir, filename);
const templatePath = path.join("src", "templates", "blog.md");

// 1. Ensure target directory exists
try {
  fs.mkdirSync(targetDir, { recursive: true });
} catch (err) {
  console.error(`Error creating directory ${targetDir}:`, err);
  process.exit(1);
}

// 2. Check if file already exists
if (fs.existsSync(targetPath)) {
  console.error(`Error: File already exists at ${targetPath}`);
  process.exit(1);
}

// 3. Read the template file
let templateContent;
try {
  templateContent = fs.readFileSync(templatePath, "utf8");
} catch (err) {
  console.error(`Error reading template file ${templatePath}:`, err);
  process.exit(1);
}

// 4. Get local date and replace placeholders
const localDate = getFormattedLocalDate();

templateContent = templateContent.replace(/^slug:.*$/m, `slug: "${slug}"`);
templateContent = templateContent.replace(/^date:.*$/m, `date: ${localDate}`);
templateContent = templateContent.replace(
  /^lastmod:.*$/m,
  `lastmod: ${localDate}`,
);

// Only replace title if it was derived from the input argument
if (title) {
  // Use JSON.stringify to handle quotes and special characters within the title correctly
  templateContent = templateContent.replace(/^title:.*$/m, `title: ${title}`);
}

// 5. Write the new file
try {
  fs.writeFileSync(targetPath, templateContent, "utf8");
  console.log(`Successfully created blog post at ${targetPath}`);
} catch (err) {
  console.error(`Error writing file ${targetPath}:`, err);
  process.exit(1);
}
