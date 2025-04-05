import { describe, expect, it } from "vitest";
import { extractHeadings, TOCItem } from "./toc";

describe("extractHeadings", () => {
  it("should extract headings with different levels", async () => {
    const markdownContent = `
# Heading 1
Some text.
## Heading 2
More text.
### Heading 3
Even more text.
## Another Heading 2
Final text.
`;
    const expectedHeadings: TOCItem[] = [
      { id: "heading-1", title: "Heading 1", level: 1 },
      { id: "heading-2", title: "Heading 2", level: 2 },
      { id: "heading-3", title: "Heading 3", level: 3 },
      { id: "another-heading-2", title: "Another Heading 2", level: 2 },
    ];
    const headings = await extractHeadings(markdownContent);
    expect(headings).toEqual(expectedHeadings);
  });

  it("should return an empty array if no headings are present", async () => {
    const markdownContent = `
This is a paragraph.
Another paragraph without any headings.
* List item 1
* List item 2
`;
    const headings = await extractHeadings(markdownContent);
    expect(headings).toEqual([]);
  });

  it("should handle headings with special characters in titles", async () => {
    const markdownContent = `
# Heading with $pecial Ch@racters!
## Another one: is it "ok"?
`;
    const expectedHeadings: TOCItem[] = [
      {
        id: "heading-with-pecial-chracters",
        title: "Heading with $pecial Ch@racters!",
        level: 1,
      },
      {
        id: "another-one-is-it-ok",
        title: 'Another one: is it "ok"?',
        level: 2,
      },
    ];
    const headings = await extractHeadings(markdownContent);
    expect(headings).toEqual(expectedHeadings);
  });

  it("should generate unique slugs for duplicate titles", async () => {
    const markdownContent = `
# Duplicate Title
## Duplicate Title
### Duplicate Title
`;
    // github-slugger appends '-1', '-2', etc. for duplicates
    const expectedHeadings: TOCItem[] = [
      { id: "duplicate-title", title: "Duplicate Title", level: 1 },
      { id: "duplicate-title-1", title: "Duplicate Title", level: 2 },
      { id: "duplicate-title-2", title: "Duplicate Title", level: 3 },
    ];
    const headings = await extractHeadings(markdownContent);
    expect(headings).toEqual(expectedHeadings);
  });

  it("should return an empty array for empty markdown content", async () => {
    const markdownContent = "";
    const headings = await extractHeadings(markdownContent);
    expect(headings).toEqual([]);
  });

  it("should handle headings with inline code or links", async () => {
    // Note: Current implementation only extracts 'text' nodes.
    // Inline code (`code`) and links (`link`) text content won't be included.
    // This test reflects the current behavior.
    const markdownContent = `
# Heading with \`inline code\`
## Heading with [a link](http://example.com)
### Just Text
`;
    const expectedHeadings: TOCItem[] = [
      { id: "heading-with-", title: "Heading with ", level: 1 }, // 'inline code' is lost, slug reflects this
      { id: "heading-with--1", title: "Heading with ", level: 2 }, // 'a link' is lost, slug reflects this and uniqueness
      { id: "just-text", title: "Just Text", level: 3 },
    ];
    const headings = await extractHeadings(markdownContent);
    expect(headings).toEqual(expectedHeadings);
  });
});
