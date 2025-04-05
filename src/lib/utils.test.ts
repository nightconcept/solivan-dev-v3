import { describe, it, expect, vi, type Mock } from 'vitest';
import {
  stripMarkdown,
  truncateDescription,
  calculateReadTime,
  getValidBlogPosts,
} from './utils';
import { getCollection, type CollectionEntry } from 'astro:content';

// Mock the getCollection function from astro:content
vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
}));

describe('Utils', () => {
  describe('stripMarkdown', () => {
    it('should remove HTML tags', () => {
      expect(stripMarkdown('<p>Hello</p>')).toBe('Hello');
    });

    it('should remove code blocks', () => {
      expect(stripMarkdown('```code```')).toBe('');
      expect(stripMarkdown('~~~code~~~')).toBe('');
      expect(stripMarkdown('Some text ```code``` more text')).toBe('Some text more text');
    });

    it('should remove headers', () => {
      expect(stripMarkdown('# Header')).toBe('');
      expect(stripMarkdown('## Subheader')).toBe('');
      expect(stripMarkdown('### Another Subheader')).toBe('');
      expect(stripMarkdown('Some text # Header more text')).toBe('Some text more text');
    });

    it('should remove horizontal rules', () => {
      expect(stripMarkdown('---')).toBe('');
      expect(stripMarkdown('***')).toBe('');
      expect(stripMarkdown('___')).toBe('');
      expect(stripMarkdown('Some text --- more text')).toBe('Some text  more text');
    });

    it('should remove blockquotes', () => {
      expect(stripMarkdown('> Quote')).toBe('');
      expect(stripMarkdown('Some text > Quote more text')).toBe('Some text  more text');
    });

    it('should remove list markers', () => {
      expect(stripMarkdown('* List item')).toBe('');
      expect(stripMarkdown('- List item')).toBe('');
      expect(stripMarkdown('+ List item')).toBe('');
      expect(stripMarkdown('1. Numbered item')).toBe('');
      expect(stripMarkdown('Some text * List item more text')).toBe('Some text  more text');
    });

    it('should remove images', () => {
      expect(stripMarkdown('![alt](url)')).toBe('');
      expect(stripMarkdown('Some text ![alt](url) more text')).toBe('Some text more text');
    });

    it('should remove links', () => {
      expect(stripMarkdown('[Link](url)')).toBe('Link');
      expect(stripMarkdown('Some text [Link](url) more text')).toBe('Some text Link more text');
    });

    it('should remove bold/italics/strikethrough', () => {
      expect(stripMarkdown('**Bold**')).toBe('Bold');
      expect(stripMarkdown('__Bold__')).toBe('Bold');
      expect(stripMarkdown('*Italic*')).toBe('Italic');
      expect(stripMarkdown('_Italic_')).toBe('Italic');
      expect(stripMarkdown('~~Strikethrough~~')).toBe('Strikethrough');
      expect(stripMarkdown('Some text **Bold** more text')).toBe('Some text Bold more text');
    });

    it('should remove inline code', () => {
      expect(stripMarkdown('`code`')).toBe('code');
      expect(stripMarkdown('Some text `code` more text')).toBe('Some text code more text');
    });

    it('should remove extra whitespace and newlines', () => {
      expect(stripMarkdown('  Hello  \n\n  World  ')).toBe('Hello World');
    });

    it('should handle empty input', () => {
      expect(stripMarkdown()).toBe('');
      expect(stripMarkdown('')).toBe('');
    });

    it('should handle mixed markdown', () => {
      const mixedMarkdown = `
      # Header
      This is some text with **bold** and *italics*.
      > A quote
      - A list item
      \`inline code\`
      !alt
      Link
      ~~~
      code block
      ~~~
      `;
      const expected = 'This is some text with bold and italics. A quote A list item inline code Link';
      expect(stripMarkdown(mixedMarkdown)).toBe(expected);
    });
  });

  describe('truncateDescription', () => {
    it('should truncate text to the specified length', () => {
      const text = 'This is a long sentence that needs to be truncated.';
      expect(truncateDescription(text, 20).length).toBeLessThanOrEqual(23); // 20 + 3 for ellipsis
      expect(truncateDescription(text, 20)).toBe('This is a long...');
    });

    it('should not truncate text if it is shorter than the max length', () => {
      const text = 'Short text.';
      expect(truncateDescription(text, 20)).toBe('Short text.');
    });

    it('should truncate at the last space before the max length', () => {
      const text = 'This is a long sentence that needs to be truncated.';
      expect(truncateDescription(text, 30)).toBe('This is a long sentence that...');
    });

    it('should handle text with a period at the end', () => {
      const text = 'This is a long sentence that ends with a period.';
      expect(truncateDescription(text, 30)).toBe('This is a long sentence that...');
    });

    it('should handle text with no spaces', () => {
      const text = 'Thisisalongwordthatneedstobetruncated.';
      expect(truncateDescription(text, 10)).toBe('Thisisalo...');
    });
    it('should handle text with a period at the end and no spaces', () => {
      const text = 'Thisisalongwordthatneedstobetruncated.';
      expect(truncateDescription(text, 11)).toBe('Thisisalon...');
    });
  });

  describe('calculateReadTime', () => {
    it('should calculate the correct reading time', () => {
      const text = 'This is a short text.'; // 5 words
      expect(calculateReadTime(text)).toBe('1 min read');

      const longText = 'word '.repeat(400); // 400 words
      expect(calculateReadTime(longText)).toBe('2 min read');

      const veryLongText = 'word '.repeat(1000); // 1000 words
      expect(calculateReadTime(veryLongText)).toBe('5 min read');
    });

    it('should handle empty text', () => {
      expect(calculateReadTime('')).toBe('1 min read');
    });

    it('should handle markdown in text', () => {
      const markdownText = '# Header\nThis is some **bold** text.';
      expect(calculateReadTime(markdownText)).toBe('1 min read');
    });
  });

  describe('getValidBlogPosts', () => {
    it('should return an empty array if no posts are found', async () => {
      (getCollection as Mock).mockResolvedValue([]);
      const posts = await getValidBlogPosts();
      expect(posts).toEqual([]);
    });

    it('should filter out posts with invalid dates', async () => {
      (getCollection as Mock).mockResolvedValue([
        { id: 'post1', data: { title: 'Post 1', date: new Date() }, body: 'body1' },
        { id: 'post2', data: { title: 'Post 2', date: 'invalid date' }, body: 'body2' },
      ]);
      const posts = await getValidBlogPosts();
      expect(posts.length).toBe(1);
      expect(posts[0].title).toBe('Post 1');
    });

    it('should map posts to the correct structure', async () => {
      (getCollection as Mock).mockResolvedValue([
        { id: 'post1', data: { title: 'Post 1', description: 'Desc 1', date: new Date(2023, 10, 20), author: 'Author 1', draft: false }, body: 'body1' },
      ]);
      const posts = await getValidBlogPosts();
      expect(posts.length).toBe(1);
      expect(posts[0].slug).toBe('post1');
      expect(posts[0].title).toBe('Post 1');
      expect(posts[0].description).toBe('Desc 1');
      expect(posts[0].date).toEqual(new Date(2023, 10, 20));
      expect(posts[0].author).toBe('Author 1');
      expect(posts[0].draft).toBe(false);
      expect(posts[0].body).toBe('body1');
    });

    it('should sort posts by date (newest first)', async () => {
      (getCollection as Mock).mockResolvedValue([
        { id: 'post1', data: { title: 'Post 1', date: new Date(2023, 10, 20) }, body: 'body1' },
        { id: 'post2', data: { title: 'Post 2', date: new Date(2023, 10, 25) }, body: 'body2' },
        { id: 'post3', data: { title: 'Post 3', date: new Date(2023, 10, 15) }, body: 'body3' },
      ]);
      const posts = await getValidBlogPosts();
      expect(posts.length).toBe(3);
      expect(posts[0].title).toBe('Post 2');
      expect(posts[1].title).toBe('Post 1');
      expect(posts[2].title).toBe('Post 3');
    });

    it('should limit the number of returned posts', async () => {
      (getCollection as Mock).mockResolvedValue([
        { id: 'post1', data: { title: 'Post 1', date: new Date(2023, 10, 20) }, body: 'body1' },
        { id: 'post2', data: { title: 'Post 2', date: new Date(2023, 10, 25) }, body: 'body2' },
        { id: 'post3', data: { title: 'Post 3', date: new Date(2023, 10, 15) }, body: 'body3' },
      ]);
      const posts = await getValidBlogPosts(3);
      expect(posts.length).toBe(3);
    });

    it('should handle undefined or array author', async () => {
      (getCollection as Mock).mockResolvedValue([
        { id: 'post1', data: { title: 'Post 1', date: new Date(), author: undefined }, body: 'body1' },
        { id: 'post2', data: { title: 'Post 2', date: new Date(), author: ['Author A', 'Author B'] }, body: 'body2' },
        { id: 'post3', data: { title: 'Post 3', date: new Date(), author: 'Author C' }, body: 'body3' },
      ]);
      const posts = await getValidBlogPosts();
      expect(posts.length).toBe(3);
      expect(posts[0].author).toBe('Unknown Author');
      expect(posts[1].author).toBe('Author A, Author B');
      expect(posts[2].author).toBe('Author C');
    });
    it('should handle undefined title, description, draft, and body', async () => {
      (getCollection as Mock).mockResolvedValue([
        { id: 'post1', data: { date: new Date() }, body: undefined },
      ]);
      const posts = await getValidBlogPosts();
      expect(posts.length).toBe(1);
      expect(posts[0].title).toBe('Untitled Post');
      expect(posts[0].description).toBe('');
      expect(posts[0].draft).toBe(false);
      expect(posts[0].body).toBe('');
    });
  });
});
