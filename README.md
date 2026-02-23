# SadakScore

**Rate India's roads. Hold contractors accountable.**

SadakScore is a citizen-powered platform for rating road quality across India. Photograph a road, score its condition on a 0-10 scale, and contribute to an open database of road contractor performance.

**Live at [projects.sreeragsuresh.com](https://projects.sreeragsuresh.com)**

## About

India's roads are built and maintained by thousands of contractors, but there's no easy way for citizens to hold them accountable. SadakScore changes that by letting anyone rate a road section, attach photos, and track contractor performance over time.

This is **V1** - a working first version with the core features in place. The long-term hope is for this to grow into a community-driven project where citizens, journalists, and civic organizations contribute to transparency in road infrastructure.

## Features

- Rate road sections on a 0-10 scale with structured location input (state, district, road type)
- Upload photos with automatic GPS extraction from EXIF data
- Browse all rated roads with filters by state, road type, and sort options
- Contractor leaderboard ranked by average road quality
- Dispute system for contractors to challenge ratings
- User authentication with credentials and OAuth support

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3
- **Database**: PostgreSQL with Prisma 7
- **Auth**: NextAuth v4 (JWT strategy)
- **Package Manager**: pnpm

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL

# Push schema to database
pnpm db:push

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Contributing

This project is in its early stages and contributions are welcome. Whether it's bug fixes, new features, better UI, data analysis, or just ideas - all help is appreciated.

If you're interested in contributing, open an issue or submit a pull request.

## Roadmap

- Government data integration (PMGSY, NHAI, State PWD)
- Temporal tracking to measure road deterioration over time
- Mobile app
- More granular location data and map views
- Community moderation tools

## License

MIT
