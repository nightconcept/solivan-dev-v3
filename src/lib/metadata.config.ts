import { Metadata } from "next"; // Import Metadata type for better typing

// Function to format tag names consistently (e.g., capitalize)
const formatTagForTitle = (tagSlug: string): string => {
  const tagName = tagSlug.replace(/-/g, " ");
  return tagName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const siteMetadataConfig = {
  baseTitle: "/home/danny", // Optional: Keep the base title if needed for other pages
  blogListTitle: "Blog Pages",
  aboutPageTitle: "About Me", // Added title for the About page
  tagPageTitleTemplate: (tagSlug: string): string => {
    const formattedTag = formatTagForTitle(tagSlug);
    return `Posts tagged with "${formattedTag}"`;
  },
  // We can add default descriptions or other metadata here later
};

// Helper function to generate metadata objects, potentially merging with defaults
// This helper is not strictly needed for the current task but can be useful later
export function generatePageMetadata(override: Metadata): Metadata {
  // Example: Merging with a default description if needed
  // const defaultDescription = "Personal blog and website";
  return {
    // title: override.title ? `${override.title} | ${siteMetadataConfig.baseTitle}` : siteMetadataConfig.baseTitle, // Example: Appending base title
    title: override.title, // Keep it simple for now, just use the override
    // description: override.description || defaultDescription,
    ...override, // Spread other potential metadata properties
  };
}
