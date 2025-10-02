import { BskyAgent } from "@atproto/api";
import { createRestAPIClient } from "masto";

interface SyndicationConfig {
  bluesky?: {
    identifier: string;
    password: string;
  };
  mastodon?: {
    instance: string;
    accessToken: string;
  };
}

interface PostContent {
  title: string;
  url: string;
  description?: string;
  tags?: string[];
}

interface SyndicationResult {
  blueskyUrl?: string;
  blueskyPostId?: string;
  mastodonUrl?: string;
  mastodonPostId?: string;
  errors: string[];
}

/**
 * Creates a social media post text from blog post data
 */
function createPostText(content: PostContent, maxLength: number = 300): string {
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
    const hashtags = tags.map((tag) => `#${tag.replace(/\s+/g, "")}`).join(" ");
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
async function postToBluesky(
  content: PostContent,
  config: NonNullable<SyndicationConfig["bluesky"]>,
): Promise<{ url?: string; id?: string; error?: string }> {
  try {
    const agent = new BskyAgent({
      service: "https://bsky.social",
    });

    // Login
    await agent.login({
      identifier: config.identifier,
      password: config.password,
    });

    // Create post text (Bluesky has 300 char limit)
    const text = createPostText(content, 300);

    // Create the post
    const response = await agent.post({
      text,
      createdAt: new Date().toISOString(),
    });

    if (response.uri) {
      // Convert AT URI to web URL
      // Format: at://did:plc:xxx/app.bsky.feed.post/yyy
      const parts = response.uri.replace("at://", "").split("/");
      const handle = config.identifier.replace(".bsky.social", "");
      const postId = parts[parts.length - 1];

      const url = `https://bsky.app/profile/${handle}.bsky.social/post/${postId}`;

      return {
        url,
        id: response.uri,
      };
    }

    return { error: "No URI in Bluesky response" };
  } catch (error) {
    console.error("Bluesky posting error:", error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Post to Mastodon
 */
async function postToMastodon(
  content: PostContent,
  config: NonNullable<SyndicationConfig["mastodon"]>,
): Promise<{ url?: string; id?: string; error?: string }> {
  try {
    const client = createRestAPIClient({
      url: config.instance,
      accessToken: config.accessToken,
    });

    // Create post text (Mastodon typically has 500 char limit)
    const text = createPostText(content, 500);

    // Create the post (status)
    const status = await client.v1.statuses.create({
      status: text,
      visibility: "public",
    });

    if (status.url && status.id) {
      return {
        url: status.url,
        id: status.id,
      };
    }

    return { error: "No URL in Mastodon response" };
  } catch (error) {
    console.error("Mastodon posting error:", error);
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Syndicate a blog post to configured social media platforms
 */
export async function syndicatePost(content: PostContent, config: SyndicationConfig): Promise<SyndicationResult> {
  const result: SyndicationResult = {
    errors: [],
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
export function getSyndicationConfig(): SyndicationConfig {
  const config: SyndicationConfig = {};

  // Bluesky config
  if (process.env.BLUESKY_IDENTIFIER && process.env.BLUESKY_PASSWORD) {
    config.bluesky = {
      identifier: process.env.BLUESKY_IDENTIFIER,
      password: process.env.BLUESKY_PASSWORD,
    };
  }

  // Mastodon config
  if (process.env.MASTODON_INSTANCE && process.env.MASTODON_ACCESS_TOKEN) {
    config.mastodon = {
      instance: process.env.MASTODON_INSTANCE,
      accessToken: process.env.MASTODON_ACCESS_TOKEN,
    };
  }

  return config;
}
