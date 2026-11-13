import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/preview'],
      },
      {
        userAgent: [
          'Amazonbot',
          'anthropic-ai',
          'Applebot-Extended',
          'Bytespider',
          'CCBot',
          'ClaudeBot',
          'FacebookBot',
          'Google-Extended',
          'GPTBot',
          'PerplexityBot',
        ],
        disallow: '/',
      },
    ],
    sitemap: undefined,
  }
}
