# Recipe Website

A personal recipe website built with React, Vite, TypeScript, and Tailwind CSS, powered by **Tina CMS** for content management.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server (without CMS)
npm run dev:prod

# Or start with Tina CMS (requires setup - see below)
npm run dev
```

Visit `http://localhost:5173`

## 📝 Content Management with Tina CMS

This project uses Tina CMS for managing recipes. You can edit content visually through the admin interface.

### Setup Tina Cloud (Required for Production)

For complete setup instructions, see **[Tina Cloud Setup Guide](docs/TINA_CLOUD_SETUP.md)**.

Quick overview:
1. Create account at https://app.tina.io/
2. Create a project and get your credentials
3. Add GitHub secrets: `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN`
4. Deploy - admin will be available at `/admin`

### Local Development with CMS

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Add your Tina Cloud credentials to .env

# 3. Start dev server with CMS
npm run dev

# 4. Access admin at http://localhost:5173/admin
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start Vite + Tina CMS dev server
- `npm run dev:prod` - Start Vite only (faster, no CMS)
- `npm run build` - Build for production (requires Tina Cloud credentials)
- `npm run build:local` - Build without Tina Cloud
- `npm run lint` - Run ESLint
- `npm run test` - Run Playwright tests
- `npm run test:ui` - Run tests in UI mode

### Project Structure

```
├── content/recipes/      # Recipe markdown files (managed by Tina)
├── src/                  # React application source
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   └── utils/           # Utility functions
├── tina/                # Tina CMS configuration
│   └── config.ts        # Content schema
├── public/              # Static assets
└── docs/                # Project documentation
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed
```

Tests cover:
- Homepage and recipe display
- Search and filtering
- Dark mode toggle
- Keyboard accessibility
- Responsive design

## 📚 Documentation

- **[Tina Cloud Setup](docs/TINA_CLOUD_SETUP.md)** - Complete CMS setup guide
- **[Task History](docs/tasks/)** - Development task logs
- **[PRD](docs/PRD.md)** - Product requirements (if available)

## 🚢 Deployment

This project is configured for GitHub Pages deployment:

1. Push to `main` branch
2. GitHub Actions automatically builds and deploys
3. Site available at your GitHub Pages URL
4. Admin panel available at `/admin`

## 🎨 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4
- **Build Tool**: Vite 6
- **CMS**: Tina CMS (cloud-hosted)
- **UI Components**: Radix UI, shadcn/ui patterns
- **State Management**: TanStack Query
- **Testing**: Playwright

## 📄 License

MIT License - See LICENSE file for details

---

Built with ❤️ using GitHub Spark and Tina CMS
