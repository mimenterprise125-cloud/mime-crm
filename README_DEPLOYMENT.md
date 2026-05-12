# MIM Enterprises - CRM & Website

Premium uPVC doors & windows CRM system with public-facing website built with React, TypeScript, and Supabase.

## Features

- **Public Website**: Homepage, product showcase, projects gallery, contact form
- **CRM Dashboard**: Leads management, quotations, projects, payments tracking
- **Employee Module**: Attendance calendar with quick mark functionality
- **My Works**: Customer lookup by phone number to view project status
- **Performance Optimized**: Mobile-first design with disabled animations on mobile for better performance

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Routing**: TanStack Router
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion (optimized for mobile)
- **Backend**: Supabase (PostgreSQL)
- **Build Tool**: Vite
- **Deployment**: Vercel

## Environment Variables

Create a `.env.local` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview
```

## Deployment to Vercel

This project includes `vercel.json` configuration for proper SPA routing:

1. **Connect GitHub to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import the `mime-crm` repository

2. **Environment Variables** in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

3. **Deployment**:
   - Vercel automatically builds and deploys on `git push`
   - Uses `vercel.json` for SPA routing configuration
   - Assets cached with long-term headers

## Key Routes

### Public
- `/` - Homepage with hero, products, projects
- `/products` - Product showcase
- `/projects` - Projects gallery
- `/contact` - Contact form
- `/configurator` - Window configurator tool

### Authentication Required
- `/login` - Admin login
- `/dashboard` - Main dashboard
- `/leads` - Leads management
- `/quotation` - Quotation creation
- `/projects-crm` - CRM projects
- `/payments` - Payment tracking
- `/employees` - Employee management

## Vercel Configuration

The `vercel.json` file handles:
- SPA routing (all routes redirect to `/index.html`)
- Asset caching with immutable headers
- Build command, output directory, and environment setup

**Routing Issue Fix**: If you see `NOT_FOUND` errors on page reload, the `vercel.json` configuration ensures all routes are properly redirected to the React app for client-side routing.

## Performance Optimizations

- Mobile animations disabled for better performance
- Particle effects disabled on mobile
- Lazy loading on all images
- Optimized Reveal and AnimatedWindow components
- Reduced blur effects on mobile devices

## Contact

For issues and feature requests, contact MIM Enterprises at mimenterprise125@gmail.com

## License

Proprietary - MIM Enterprises 2026
