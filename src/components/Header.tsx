import { ChefHat } from '@phosphor-icons/react'
import { ThemeToggle } from './theme-toggle'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ChefHat size={32} className="text-primary" weight="fill" aria-hidden="true" />
            <h1 className="text-2xl font-bold text-foreground">Gordon's Recipe Collection</h1>
          </div>
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}