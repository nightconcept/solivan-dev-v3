import rss from "@astrojs/rss";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";
import { getValidBlogPosts } from "../lib/utils"; // Import the utility function

export async function GET(context) {
  const posts = await getValidBlogPosts(); // Use the utility function
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      title: post.title,
      pubDate: post.date, // Use the date field from the post
      description: post.description,
      link: `/blog/${post.slug}/`, // Use the slug field from the post
    })),
  });
}
