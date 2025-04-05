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
