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

# Start development server (recommended - fast and simple)
npm run dev:prod

# Or start with Tina CMS admin (requires Tina Cloud setup)
npm run dev
```

Visit `http://localhost:5000`

> **💡 Tip**: Use `npm run dev:prod` for regular development. Only use `npm run dev` if you need the CMS admin interface at `/admin`.

## ⚠️ Troubleshooting

### Getting 403 Forbidden Error?

If you see a 403 error when running `npm run dev`, it's because Tina CMS is trying to authenticate without valid credentials.

**Quick Fix**: Use `npm run dev:prod` instead - it runs the app without Tina CMS (faster and no authentication needed).

See **[403 Error Fix Guide](docs/tasks/20251007-04-fix-403-forbidden-npm-dev.md)** for details.

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

- `npm run dev:prod` - **Recommended**: Start Vite dev server (fast, no CMS)
- `npm run dev` - Start Vite + Tina CMS (requires Tina Cloud credentials)
- `npm run build` - Build for production (requires Tina Cloud credentials)
- `npm run build:local` - Build without Tina Cloud (faster)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

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

Tests have been removed from this project in favor of manual testing. See the development workflow in the documentation for testing guidelines.

## 📚 Documentation

- **[Tina Cloud Setup](docs/TINA_CLOUD_SETUP.md)** - Complete CMS setup guide
- **[403 Error Fix](docs/tasks/20251007-04-fix-403-forbidden-npm-dev.md)** - Fix 403 Forbidden errors
- **[Task History](docs/tasks/)** - Development task logs

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
- **Routing**: React Router
- **Markdown**: React Markdown, Marked

## 📄 License

MIT License - See LICENSE file for details

---

Built with ❤️ using GitHub Spark and Tina CMS
