import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getAllMarkdownPages, getMarkdownPageBySlug } from "@/lib/content";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Breadcrumb from "@/components/breadcrumb";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export type Props = {
  params: Promise<{ page: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Generate metadata for the page dynamically
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  const { page: pageSlug } = params;

  const pageData = getMarkdownPageBySlug(pageSlug);

  if (!pageData) {
    // If the page isn't found by slug, return basic 'Not Found' metadata.
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: pageData.frontmatter.title,
    description: pageData.frontmatter.description || "",
  };
}

// Generates static paths for all top-level markdown pages.
// This allows Next.js to pre-render these pages at build time for better performance.

// deno-lint-ignore require-await
export async function generateStaticParams() {
  const pages = getAllMarkdownPages();
  return pages.map((page) => ({
    // The key 'page' must match the dynamic route segment `[page]` in the folder structure.
    page: page.slug,
  }));
}

export default async function Page(props: Props) {
  const params = await props.params;

  const { page: pageSlug } = params;

  const pageData = await getMarkdownPageBySlug(pageSlug);

  // If page data couldn't be retrieved for the given slug, render the standard Next.js 404 page.
  if (!pageData) {
    notFound(); // This function interrupts rendering and shows the 404 page.
  }

  // Capitalize the page slug for the breadcrumb label if title is missing (fallback)
  const pageTitle = pageData.frontmatter.title ||
    pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="container mx-auto px-4">
        <Header />
        <div className="mx-auto mt-8 max-w-3xl">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: pageTitle, href: `/${pageSlug}` },
            ]}
          />
          <article className="relative mt-8">
            <h1 className="mb-8 text-3xl font-bold">{pageTitle}</h1>
            {/* Apply Tailwind Typography plugin styles for readable markdown rendering */}
            <div className="prose dark:prose-invert lg:prose-lg prose-headings:scroll-mt-20 prose-a:text-primary hover:prose-a:text-primary/80 max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                  rehypeSlug, // Automatically add 'id' attributes to headings (e.g., <h2 id="some-title">).
                  [
                    rehypeAutolinkHeadings, // Adds anchor links to headings, requires rehypeSlug first.
                    {
                      // Configure how the autolinks behave and appear.
                      behavior: "append", // Add the link icon *after* the heading text.
                      properties: {
                        className: ["anchor-link"],
                        ariaHidden: true,
                        tabIndex: -1,
                      },
                      // Define the content of the link itself. Here, it's an empty span
                      // intended to be styled with CSS to show a link icon (e.g., #).
                      content: () => [
                        {
                          type: "element",
                          tagName: "span",
                          properties: {
                            className: "heading-link-icon",
                            "aria-hidden": "true",
                          },
                          children: [], // The link has no visible text content itself.
                        },
                      ],
                    },
                  ],
                ]}
              >
                {pageData.content}
              </ReactMarkdown>
            </div>
          </article>
        </div>
        <Footer />
      </div>
    </div>
  );
}
