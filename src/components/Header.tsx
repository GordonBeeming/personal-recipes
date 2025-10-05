import { ChefHat } from '@phosphor-icons/react'
import { ThemeToggle } from './theme-toggle'

interface HeaderProps {
  onLogoClick?: () => void
}

export function Header({ onLogoClick }: HeaderProps) {
  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick()
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
            aria-label="Go to home page"
          >
            <ChefHat size={32} className="text-primary" weight="fill" aria-hidden="true" />
            <h1 className="text-2xl font-bold text-foreground">Gordon's Recipe Collection</h1>
          </button>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}