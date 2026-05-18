# Next.js App Router SEO Fix for HubIRL

Here are the snippets you requested for your Next.js App Router deployment on Vercel.

### 1. `app/sitemap.ts`
This defines an SEO-compliant dynamic sitemap for your root, `/dashboard`, and `/analytics` routes.

```typescript
import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://hubirl.ai';

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/analytics`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];
}
```

### 2. `middleware.ts`
Update your middleware matcher configuration so Googlebot won't get caught in authentication loops or blocked by route protections when trying to fetch your `sitemap.xml` and `robots.txt`.

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Your authentication or custom middleware logic here...
  
  return NextResponse.next();
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * - sitemap.xml, sitemap.js, robots.txt (SEO files)
   */
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap\\.xml|sitemap\\.js|robots\\.txt).*)',
  ],
};
```
