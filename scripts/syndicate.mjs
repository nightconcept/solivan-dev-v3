#!/usr/bin/env node

/**
 * Syndication Script
 * Posts blog content to Bluesky and Mastodon
 *
 * Usage:
 *   npm run syndicate -- --post="blog/your-post-slug"
 *   node scripts/syndicate.mjs --post="blog/your-post-slug"
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import dotenv from 'dotenv';
import { BskyAgent } from '@atproto/api';
import { createRestAPIClient } from 'masto';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Creates a social media post text from blog post data
 */
function createPostText(content, maxLength = 300) {
  const { title, url, description, tags } = content;

  let text = title;

  // Add description if there's room
  if (description) {
    const potentialText = `${title}\n\n${description}`;
    if (potentialText.length + url.length + 10 < maxLength) {
      text = potentialText;
    }
  }

  // Add URL
  text += `\n\n${url}`;

  // Add hashtags if there's room
  if (tags && tags.length > 0) {
    const hashtags = tags.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ');
    const potentialText = `${text}\n\n${hashtags}`;
    if (potentialText.length <= maxLength) {
      text = potentialText;
    }
  }

  return text;
}

/**
 * Post to Bluesky
 */
async function postToBluesky(content, config) {
  try {
    const agent = new BskyAgent({
      service: 'https://bsky.social'
    });

    // Login
    await agent.login({
      identifier: config.identifier,
      password: config.password
    });

    // Create post text (Bluesky has 300 char limit)
    const text = createPostText(content, 300);

    // Create the post
    const response = await agent.post({
      text,
      createdAt: new Date().toISOString()
    });

    if (response.uri) {
      // Convert AT URI to web URL
      // Format: at://did:plc:xxx/app.bsky.feed.post/yyy
      const parts = response.uri.replace('at://', '').split('/');
      const handle = config.identifier.replace('.bsky.social', '');
      const postId = parts[parts.length - 1];

      const url = `https://bsky.app/profile/${handle}.bsky.social/post/${postId}`;

      return {
        url,
        id: response.uri
      };
    }

    return { error: 'No URI in Bluesky response' };
  } catch (error) {
    console.error('Bluesky posting error:', error);
    return { error: error.message || 'Unknown error' };
  }
}

/**
 * Post to Mastodon
 */
async function postToMastodon(content, config) {
  try {
    const client = createRestAPIClient({
      url: config.instance,
      accessToken: config.accessToken
    });

    // Create post text (Mastodon typically has 500 char limit)
    const text = createPostText(content, 500);

    // Create the post (status)
    const status = await client.v1.statuses.create({
      status: text,
      visibility: 'public'
    });

    if (status.url && status.id) {
      return {
        url: status.url,
        id: status.id
      };
    }

    return { error: 'No URL in Mastodon response' };
  } catch (error) {
    console.error('Mastodon posting error:', error);
    return { error: error.message || 'Unknown error' };
  }
}

/**
 * Syndicate a blog post to configured social media platforms
 */
async function syndicatePost(content, config) {
  const result = {
    errors: []
  };

  // Post to Bluesky if configured
  if (config.bluesky) {
    const blueskyResult = await postToBluesky(content, config.bluesky);

    if (blueskyResult.error) {
      result.errors.push(`Bluesky: ${blueskyResult.error}`);
    } else {
      result.blueskyUrl = blueskyResult.url;
      result.blueskyPostId = blueskyResult.id;
    }
  }

  // Post to Mastodon if configured
  if (config.mastodon) {
    const mastodonResult = await postToMastodon(content, config.mastodon);

    if (mastodonResult.error) {
      result.errors.push(`Mastodon: ${mastodonResult.error}`);
    } else {
      result.mastodonUrl = mastodonResult.url;
      result.mastodonPostId = mastodonResult.id;
    }
  }

  return result;
}

/**
 * Get syndication config from environment variables
 */
function getSyndicationConfig() {
  const config = {};

  // Bluesky config
  if (process.env.BLUESKY_IDENTIFIER && process.env.BLUESKY_PASSWORD) {
    config.bluesky = {
      identifier: process.env.BLUESKY_IDENTIFIER,
      password: process.env.BLUESKY_PASSWORD
    };
  }

  // Mastodon config
  if (process.env.MASTODON_INSTANCE && process.env.MASTODON_ACCESS_TOKEN) {
    config.mastodon = {
      instance: process.env.MASTODON_INSTANCE,
      accessToken: process.env.MASTODON_ACCESS_TOKEN
    };
  }

  return config;
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};

  for (const arg of args) {
    if (arg.startsWith('--post=')) {
      options.post = arg.split('=')[1];
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    }
  }

  return options;
}

/**
 * Display help message
 */
function showHelp() {
  console.log(`
Syndication Script - Post blog content to social media

Usage:
  npm run syndicate -- --post="blog/your-post-slug"
  node scripts/syndicate.mjs --post="blog/your-post-slug"

Options:
  --post=SLUG    The blog post slug to syndicate (required)
  --help, -h     Show this help message

Environment Variables Required:
  BLUESKY_IDENTIFIER    Your Bluesky handle
  BLUESKY_PASSWORD      Your Bluesky app password
  MASTODON_INSTANCE     Your Mastodon instance URL
  MASTODON_ACCESS_TOKEN Your Mastodon access token
  SITE_URL              Your site URL (optional, defaults to https://your-site.com)

Example:
  npm run syndicate -- --post="blog/my-awesome-post"
  `);
}

/**
 * Load and parse a blog post
 */
async function loadBlogPost(slug) {
  // Remove 'blog/' prefix if present
  const cleanSlug = slug.replace(/^blog\//, '');

  // Try to find the post
  const possiblePaths = [
    path.join(__dirname, '..', 'src', 'content', 'blog', `${cleanSlug}.md`),
    path.join(__dirname, '..', 'src', 'content', 'blog', `${cleanSlug}.mdx`)
  ];

  for (const filePath of possiblePaths) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const { data, content: body } = matter(content);

      return {
        data,
        body,
        slug: cleanSlug,
        filePath
      };
    } catch (error) {
      // File doesn't exist, try next
      continue;
    }
  }

  throw new Error(`Blog post not found: ${slug}`);
}

/**
 * Update frontmatter with syndication URLs
 */
async function updateFrontmatter(filePath, syndicationData) {
  const content = await fs.readFile(filePath, 'utf-8');
  const { data, content: body } = matter(content);

  // Update syndication fields
  if (syndicationData.blueskyUrl) {
    data.blueskyPostId = syndicationData.blueskyPostId;
    if (!data.syndicationUrls) {
      data.syndicationUrls = [];
    }
    if (!data.syndicationUrls.includes(syndicationData.blueskyUrl)) {
      data.syndicationUrls.push(syndicationData.blueskyUrl);
    }
  }

  if (syndicationData.mastodonUrl) {
    data.mastodonPostId = syndicationData.mastodonPostId;
    if (!data.syndicationUrls) {
      data.syndicationUrls = [];
    }
    if (!data.syndicationUrls.includes(syndicationData.mastodonUrl)) {
      data.syndicationUrls.push(syndicationData.mastodonUrl);
    }
  }

  // Rebuild the file
  const newContent = matter.stringify(body, data);
  await fs.writeFile(filePath, newContent);
}

/**
 * Main syndication function
 */
async function main() {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  if (!options.post) {
    console.error('Error: --post argument is required');
    showHelp();
    process.exit(1);
  }

  try {
    console.log(`Loading blog post: ${options.post}`);
    const post = await loadBlogPost(options.post);

    // Check if already syndicated
    if (post.data.syndicationUrls && post.data.syndicationUrls.length > 0) {
      console.log('⚠️  This post has already been syndicated:');
      post.data.syndicationUrls.forEach(url => console.log(`  - ${url}`));

      const readline = await import('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const answer = await new Promise(resolve => {
        rl.question('Do you want to syndicate again? (y/N): ', resolve);
      });
      rl.close();

      if (answer.toLowerCase() !== 'y') {
        console.log('Syndication cancelled.');
        process.exit(0);
      }
    }

    // Build the post URL (adjust this based on your site structure)
    const siteUrl = process.env.SITE_URL || 'https://your-site.com';
    const postUrl = `${siteUrl}/blog/${post.slug}`;

    // Prepare content for syndication
    const content = {
      title: post.data.title,
      url: postUrl,
      description: post.data.description,
      tags: post.data.tags
    };

    console.log('\nSyndicating post:');
    console.log(`  Title: ${content.title}`);
    console.log(`  URL: ${content.url}`);

    // Get syndication config
    const config = getSyndicationConfig();

    if (!config.bluesky && !config.mastodon) {
      console.error('\n❌ No social media accounts configured!');
      console.error('Please set up environment variables for Bluesky and/or Mastodon');
      console.error('See .env.example for required variables');
      process.exit(1);
    }

    // Syndicate the post
    console.log('\nPosting to social media...');
    const result = await syndicatePost(content, config);

    // Display results
    if (result.blueskyUrl) {
      console.log(`✅ Posted to Bluesky: ${result.blueskyUrl}`);
    }

    if (result.mastodonUrl) {
      console.log(`✅ Posted to Mastodon: ${result.mastodonUrl}`);
    }

    if (result.errors.length > 0) {
      console.error('\n❌ Errors occurred:');
      result.errors.forEach(error => console.error(`  - ${error}`));
    }

    // Update frontmatter with syndication URLs
    if (result.blueskyUrl || result.mastodonUrl) {
      console.log('\nUpdating post frontmatter with syndication URLs...');
      await updateFrontmatter(post.filePath, result);
      console.log('✅ Frontmatter updated successfully');
    }

    // Success message
    if ((result.blueskyUrl || result.mastodonUrl) && result.errors.length === 0) {
      console.log('\n🎉 Syndication completed successfully!');
      console.log('\nNext steps:');
      console.log('1. Wait ~30 minutes for Bridgy to poll and send webmentions');
      console.log('2. Check your blog post to see comments appearing');
      console.log('3. Verify webmentions at https://webmention.io/[yourdomain]/check');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});