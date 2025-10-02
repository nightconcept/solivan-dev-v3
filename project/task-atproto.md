# Astro Blog + ATProto/Fediverse Integration Plan

## Overview
Integrate an Astro blog (hosted on Neocities) with both AT Protocol (Bluesky) and ActivityPub (Mastodon/Fediverse) using Webmentions for a unified comments system.

## Goals
1. Syndicate blog posts to both Bluesky and Mastodon
2. Display comments/replies from both networks using Webmentions
3. Keep everything compatible with static hosting on Neocities
4. Implement robust caching to minimize API calls

## Architecture

### Components
- **Astro static site** - Main blog, builds to static HTML/CSS/JS
- **Webmention.io** - Receives and stores webmentions (free service)
- **Bridgy** - Converts social media interactions to webmentions
  - bsky.brid.gy for Bluesky
  - fed.brid.gy for Mastodon
- **Client-side JS** - Fetches and displays webmentions with multi-layer caching

### Data Flow
```
1. Publish blog post → Neocities
2. Syndicate to Bluesky + Mastodon
3. People reply on social media
4. Bridgy polls social APIs (~30min intervals)
5. Bridgy sends webmentions to webmention.io
6. Blog page fetches mentions via client-side JS (with caching)
7. Display unified comments section
```

### Caching Strategy
- **SessionStorage**: Instant access during same session
- **LocalStorage**: 30-minute cache across sessions
- **Rate Limiting**: Max 1 API call per minute per URL
- **Progressive Loading**: Show cached data immediately, refresh in background
- **Build-time Cache** (optional): Pre-fetch during build for initial data

## Phase 1: Basic Setup
- [ ] Set up webmention.io account with your domain
- [ ] Add IndieAuth to your domain for authentication
- [x] Add webmention endpoints to Astro layout head (implemented)
- [ ] Set up Bridgy accounts:
  - [ ] bsky.brid.gy for Bluesky
  - [ ] fed.brid.gy for Mastodon
- [ ] Enable automatic polling on Bridgy

## Phase 2: Syndication System
- [x] Install dependencies (@atproto/api, masto)
- [x] Create utility to post to both Bluesky and Mastodon (implemented)
- [x] Add frontmatter fields to blog posts for storing social post IDs (implemented)
- [x] Create npm script for syndication (implemented)
- [x] Handle authentication securely with environment variables (implemented)

## Phase 3: Webmentions Component
- [x] Create Astro Webmentions component (implemented)
- [x] Create client-side JS with multi-layer caching (implemented)
- [x] Parse and group mentions by type (likes, reposts, comments)
- [x] Add styling for comment cards, avatars, and platform badges

## Phase 4: Integration
- [x] Add Webmentions component to blog post layout (implemented)
- [x] Add "Reply on Bluesky/Mastodon" call-to-action links (implemented)
- [ ] Test the complete flow end-to-end (requires accounts)

## Phase 5: Enhancements (Optional)
- [ ] Add RSS feed
- [x] Cache webmentions in localStorage (implemented in Phase 3)
- [ ] Add moderation/filtering
- [ ] Implement build-time optimization
- [ ] Set up automated rebuilds via GitHub Actions
- [ ] Add engagement analytics

## File Structure
```
astro-blog/
├── src/
│   ├── components/
│   │   └── Webmentions.astro
│   ├── layouts/
│   │   └── BlogPost.astro
│   ├── scripts/
│   │   └── webmentions.js
│   ├── styles/
│   │   └── webmentions.css
│   └── utils/
│       └── syndicate.js
├── .env
└── package.json
```

## Environment Variables Needed
```
BLUESKY_IDENTIFIER
BLUESKY_PASSWORD
MASTODON_INSTANCE
MASTODON_ACCESS_TOKEN
WEBMENTION_IO_TOKEN (optional)
```

## Key Dependencies
- @atproto/api (for Bluesky)
- masto or similar (for Mastodon)

## API Endpoints
- **Webmention.io**: Fetch mentions via REST API
- **Bluesky**: AT Protocol via @atproto/api
- **Mastodon**: REST API for posting statuses

## Testing Checklist
- [ ] Webmention endpoint discoverable
- [ ] Bridgy successfully polling accounts
- [ ] Posts syndicate to both platforms
- [ ] Replies convert to webmentions
- [ ] Webmentions display correctly
- [ ] Platform badges show correctly
- [ ] Links work to original posts
- [ ] Responsive design works
- [ ] Fast page loads
- [ ] Works on Neocities static hosting

## Success Criteria
✅ Blog posts appear on both Bluesky and Mastodon
✅ Replies from both platforms display as comments
✅ Unified comment section with platform badges
✅ Fast page loads (< 2s)
✅ Works on static Neocities hosting
✅ Minimal manual work after initial setup

## Documentation Resources
- Webmention.io: https://webmention.io/
- Bridgy for Bluesky: https://bsky.brid.gy/
- Bridgy for Mastodon: https://fed.brid.gy/
- AT Protocol docs: https://docs.bsky.app/
- Mastodon API: https://docs.joinmastodon.org/
- Webmention spec: https://www.w3.org/TR/webmention/

## Important Notes
- Static hosting means all comment loading is client-side or build-time
- Bridgy has ~30min polling delay (not real-time)
- Webmention.io free tier is sufficient for personal blogs (10,000 requests/month)
- Sanitize HTML content from external sources
- Consider privacy implications of displaying social media content
- Caching strategy minimizes API calls (typically <1,000/month with caching)
- Comments controlled per-post via `comments: true/false` frontmatter

## Setup Instructions

### 1. Register Accounts
1. **Webmention.io**:
   - Go to https://webmention.io
   - Sign in with your domain using IndieAuth
   - Get your webmention endpoint URLs

2. **Bridgy**:
   - Go to https://bsky.brid.gy
   - Connect your Bluesky account
   - Go to https://fed.brid.gy
   - Connect your Mastodon account
   - Enable automatic polling for both

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

### 3. Test Syndication
```bash
npm run syndicate -- --post="blog/your-post-slug"
```

### 4. Verify Webmentions
After syndication and ~30 minutes for Bridgy polling:
- Check https://webmention.io/[yourdomain]/check
- Visit your blog post to see comments appearing