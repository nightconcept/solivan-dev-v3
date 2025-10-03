/**
 * Webmentions Client Script with Multi-Layer Caching
 * Handles fetching, caching, and displaying webmentions from webmention.io
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    CACHE_KEY: 'webmentions_cache',
    SESSION_KEY: 'webmentions_session',
    CACHE_DURATION: 30 * 60 * 1000, // 30 minutes
    STALE_THRESHOLD: 5 * 60 * 1000, // 5 minutes
    RATE_LIMIT_KEY: 'webmentions_ratelimit',
    RATE_LIMIT_DURATION: 60 * 1000, // 1 minute per URL
    MAX_CACHE_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days
    WEBMENTION_API: 'https://webmention.io/api/mentions.jf2',
    DOMAIN: 'solivan.dev'
  };

  // Cache utilities
  const Cache = {
    // LocalStorage cache
    getLocal(url) {
      try {
        const cache = JSON.parse(localStorage.getItem(CONFIG.CACHE_KEY) || '{}');
        const entry = cache[url];

        if (entry && Date.now() - entry.timestamp < CONFIG.CACHE_DURATION) {
          return entry.data;
        }
      } catch (e) {
        console.warn('LocalStorage cache read failed:', e);
      }
      return null;
    },

    setLocal(url, data) {
      try {
        const cache = JSON.parse(localStorage.getItem(CONFIG.CACHE_KEY) || '{}');
        cache[url] = {
          data,
          timestamp: Date.now()
        };
        localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify(cache));
      } catch (e) {
        console.warn('LocalStorage cache write failed:', e);
      }
    },

    // SessionStorage cache
    getSession(url) {
      try {
        const cache = JSON.parse(sessionStorage.getItem(CONFIG.SESSION_KEY) || '{}');
        return cache[url] || null;
      } catch (e) {
        console.warn('SessionStorage cache read failed:', e);
      }
      return null;
    },

    setSession(url, data) {
      try {
        const cache = JSON.parse(sessionStorage.getItem(CONFIG.SESSION_KEY) || '{}');
        cache[url] = data;
        sessionStorage.setItem(CONFIG.SESSION_KEY, JSON.stringify(cache));
      } catch (e) {
        console.warn('SessionStorage cache write failed:', e);
      }
    },

    // Check if cache is stale
    isStale(url, threshold = CONFIG.STALE_THRESHOLD) {
      try {
        const cache = JSON.parse(localStorage.getItem(CONFIG.CACHE_KEY) || '{}');
        const entry = cache[url];

        if (!entry) return true;
        return Date.now() - entry.timestamp > threshold;
      } catch (e) {
        return true;
      }
    },

    // Cleanup old cache entries
    cleanup() {
      try {
        const cache = JSON.parse(localStorage.getItem(CONFIG.CACHE_KEY) || '{}');
        const now = Date.now();
        let changed = false;

        for (const [url, entry] of Object.entries(cache)) {
          if (now - entry.timestamp > CONFIG.MAX_CACHE_AGE) {
            delete cache[url];
            changed = true;
          }
        }

        if (changed) {
          localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify(cache));
        }
      } catch (e) {
        console.warn('Cache cleanup failed:', e);
      }
    }
  };

  // Rate limiter
  const RateLimiter = {
    canFetch(url) {
      try {
        const limits = JSON.parse(localStorage.getItem(CONFIG.RATE_LIMIT_KEY) || '{}');
        const lastAttempt = limits[url];
        const now = Date.now();

        if (lastAttempt && now - lastAttempt < CONFIG.RATE_LIMIT_DURATION) {
          return false;
        }

        limits[url] = now;
        localStorage.setItem(CONFIG.RATE_LIMIT_KEY, JSON.stringify(limits));
        return true;
      } catch (e) {
        console.warn('Rate limiter failed:', e);
        return true;
      }
    }
  };

  // API fetcher
  async function fetchWebmentions(targetUrl) {
    // Check rate limit
    if (!RateLimiter.canFetch(targetUrl)) {
      console.log('Rate limited, using cached data');
      return Cache.getLocal(targetUrl) || { type: 'feed', children: [] };
    }

    try {
      const response = await fetch(`${CONFIG.WEBMENTION_API}?target=${encodeURIComponent(targetUrl)}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch webmentions:', error);
      // Return cached data if available
      return Cache.getLocal(targetUrl) || { type: 'feed', children: [] };
    }
  }

  // Parse mentions by type
  function parseMentions(data) {
    const mentions = {
      likes: [],
      reposts: [],
      replies: [],
      mentions: []
    };

    if (!data.children || !Array.isArray(data.children)) {
      return mentions;
    }

    data.children.forEach(item => {
      const type = item['wm-property'];

      switch(type) {
        case 'like-of':
          mentions.likes.push(item);
          break;
        case 'repost-of':
          mentions.reposts.push(item);
          break;
        case 'in-reply-to':
          mentions.replies.push(item);
          break;
        case 'mention-of':
          mentions.mentions.push(item);
          break;
        default:
          mentions.mentions.push(item);
      }
    });

    return mentions;
  }

  // Detect platform from URL
  function detectPlatform(url) {
    if (!url) return 'web';

    if (url.includes('bsky.app') || url.includes('bsky.social')) {
      return 'bluesky';
    } else if (url.includes('mastodon') || url.includes('fosstodon') || url.includes('mstdn')) {
      return 'mastodon';
    } else if (url.includes('twitter.com') || url.includes('x.com')) {
      return 'twitter';
    }

    return 'web';
  }

  // Format date
  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 30) return `${days}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }

  // Sanitize HTML content
  function sanitizeHTML(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }

  // Render webmentions
  function renderWebmentions(mentions, container) {
    const { likes, reposts, replies, mentions: generalMentions } = mentions;

    // Combine all mentions for unified display
    const allMentions = [
      ...likes.map(m => ({ ...m, type: 'like' })),
      ...reposts.map(m => ({ ...m, type: 'repost' })),
      ...replies.map(m => ({ ...m, type: 'reply' })),
      ...generalMentions.map(m => ({ ...m, type: 'mention' }))
    ];

    // Sort by date (newest first)
    allMentions.sort((a, b) => {
      const dateA = new Date(a.published || a['wm-received']);
      const dateB = new Date(b.published || b['wm-received']);
      return dateB - dateA;
    });

    // Update stats
    const statsContainer = container.querySelector('.webmentions-stats');
    if (statsContainer) {
      const likeCount = likes.length;
      const commentCount = replies.length + generalMentions.length + reposts.length;

      statsContainer.innerHTML = `
        <span class="likes-count">❤️ ${likeCount}</span>
        <span class="replies-count ml-4">💬 ${commentCount}</span>
      `;
    }

    // Render all mentions
    const listContainer = container.querySelector('.webmentions-list');
    if (listContainer) {
      if (allMentions.length === 0) {
        listContainer.innerHTML = '<p class="text-muted-foreground text-sm">No mentions yet. Be the first to engage!</p>';
      } else {
        listContainer.innerHTML = allMentions.map(mention => {
          const mentionType = mention.type;
          const authorName = mention.author?.name || 'Anonymous';
          const authorUrl = mention.author?.url || mention.url;
          const authorPhoto = mention.author?.photo || '/default-avatar.png';
          const date = formatDate(mention.published || mention['wm-received']);
          const content = mention.content?.html || mention.content?.text || '';

          let actionText = 'mentioned this';
          if (mentionType === 'like') actionText = 'liked this';
          if (mentionType === 'repost') actionText = 'reposted this';
          if (mentionType === 'reply') actionText = 'replied';

          return `
            <div class="webmention-item">
              <img src="${authorPhoto}"
                   alt="${authorName}"
                   class="webmention-avatar"
                   loading="lazy">
              <div class="webmention-content">
                <div class="webmention-meta">
                  <a href="${authorUrl}"
                     target="_blank"
                     rel="noopener noreferrer"
                     class="webmention-author">
                    ${authorName}
                  </a>
                  ${actionText} on ${date}
                </div>
                ${content && mentionType !== 'like' ? `
                  <div class="webmention-text">
                    ${sanitizeHTML(content)}
                  </div>
                ` : ''}
              </div>
            </div>
          `;
        }).join('');
      }
    }
  }

  // Main loader function
  async function loadWebmentions(targetUrl, container) {
    const loadingEl = container.querySelector('.webmentions-loading');
    const errorEl = container.querySelector('.webmentions-error');
    const contentEl = container.querySelector('.webmentions-container');

    // Check session cache first
    let data = Cache.getSession(targetUrl);

    // If not in session, check local cache
    if (!data) {
      data = Cache.getLocal(targetUrl);
      if (data) {
        Cache.setSession(targetUrl, data);
      }
    }

    // Show cached data immediately if available
    if (data) {
      loadingEl?.classList.add('hidden');
      contentEl?.classList.remove('hidden');
      const mentions = parseMentions(data);
      renderWebmentions(mentions, container);
      container.dataset.status = 'cached';
    }

    // Check if we need to refresh
    if (!data || Cache.isStale(targetUrl)) {
      // Fetch fresh data in the background
      try {
        const freshData = await fetchWebmentions(targetUrl);

        // Only update if data has changed
        if (JSON.stringify(freshData) !== JSON.stringify(data)) {
          Cache.setLocal(targetUrl, freshData);
          Cache.setSession(targetUrl, freshData);

          const mentions = parseMentions(freshData);
          renderWebmentions(mentions, container);
          container.dataset.status = 'fresh';
        }

        loadingEl?.classList.add('hidden');
        contentEl?.classList.remove('hidden');
      } catch (error) {
        console.error('Failed to load webmentions:', error);

        if (!data) {
          // Only show error if we have no cached data
          loadingEl?.classList.add('hidden');
          errorEl?.classList.remove('hidden');
        }
      }
    }
  }

  // Initialize on DOM ready
  function init() {
    const container = document.querySelector('.webmentions');
    if (!container) return;

    // Get target URL from data attribute or current page
    const targetUrl = container.dataset.targetUrl || window.location.href;

    // Clean up old cache entries occasionally (10% chance)
    if (Math.random() < 0.1) {
      Cache.cleanup();
    }

    // Load webmentions
    loadWebmentions(targetUrl, container);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();