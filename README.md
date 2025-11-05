# ChirpChirp UI

A Next.js frontend for browsing bird watching images, exploring species data, and analyzing activity trends.

## Features

- 🖼️ **Image Gallery** - Browse bird photos with species attributions in a responsive grid layout
- 🦅 **Species Explorer** - Detailed species breakdown with sighting counts, temperature insights, and photo galleries
- 📊 **Activity Trends** - Analyze bird activity patterns by time of day, day of week, and moon phases
- 🔍 **Species Filtering** - Filter images by specific bird species
- 📧 **Email Subscriptions** - Subscribe to receive daily summaries and special sighting alerts
- 🎨 **Modern UI** - Built with Tailwind CSS and Radix UI components
- ⚡ **Server Components** - Next.js 15 with React Server Components for optimal performance

## Setup

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Core API Service URL
NEXT_PUBLIC_CORE_API_URL=http://localhost:8080

# Email Service URL
NEXT_PUBLIC_EMAIL_SERVICE_URL=http://localhost:3001
```

**Note**: Currently, API URLs are configured in `lib/constants.ts`. Update `lib/constants.ts` to use environment variables:

```typescript
export const CORE_BE_API_URL =
  process.env.NEXT_PUBLIC_CORE_API_URL || "http://localhost:8080";

export const EMAIL_SERVICE_API_URL =
  process.env.NEXT_PUBLIC_EMAIL_SERVICE_URL || "http://localhost:3001";
```

### 3. Run the Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Pages

- **Home (`/`)** - Image gallery with species carousel filter. Query param: `?species=Blue%20Jay`
- **Species (`/species`)** - Species breakdown with insights, statistics, and individual galleries
- **Trends (`/trends`)** - Activity analysis by time of day, day of week, moon phases, and temperature
- **Subscribe (`/subscribe`)** - Email subscription form

## Integration with Backend Services

### Core API Service

Endpoints used:

- `GET /images` - Get paginated images with attributions
- `GET /images/:id` - Get specific image with attributions
- `GET /species` - Get all species with counts

### Email Service

Endpoints used:

- `POST /subscribe` - Subscribe to email notifications
- `POST /unsubscribe` - Unsubscribe from emails

## Architecture

```
chirpchirp-ui/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home (gallery)
│   ├── species/page.tsx    # Species breakdown
│   ├── trends/page.tsx     # Activity trends
│   └── subscribe/page.tsx  # Email subscription
├── components/             # React components
│   ├── MainGalleryCard.tsx
│   ├── SpeciesCarousel.tsx
│   ├── SpeciesList.tsx
│   ├── SubscribeForm.tsx
│   └── navigation/
├── lib/
│   ├── constants.ts        # API URLs
│   ├── data/index.ts       # Data fetching
│   └── subscribe/index.ts  # Subscription handlers
└── types/                  # TypeScript definitions
```

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Runtime**: Node.js / Bun
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Development

```bash
# Development mode
bun run dev

# Build for production
bun run build

# Start production server
bun run start

# Linting
bun run lint
```

## Troubleshooting

### API connection errors

- Check that Core API Service is running
- Verify API URLs in `lib/constants.ts`
- Verify CORS settings on backend services

### Images not loading

- Check image URLs are publicly accessible
- Verify Next.js image configuration in `next.config.ts`
- Ensure images use HTTPS

### Species filter not working

- Verify species name matches exactly (case-sensitive)
- Check browser console for API errors

### Build errors

- Run `bun install` to ensure dependencies are installed
- Clear `.next` folder: `rm -rf .next && bun run build`

## Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Configure environment variables:
   - `NEXT_PUBLIC_CORE_API_URL`
   - `NEXT_PUBLIC_EMAIL_SERVICE_URL`
4. Deploy

### Other Platforms

1. Build: `bun run build`
2. Start: `bun run start`
3. Set environment variables in hosting platform
4. Update `lib/constants.ts` to use environment variables

## License

MIT
