import { MagnifyingGlass, ChefHat } from '@phosphor-icons/react'
import { Input } from './ui/input'
import { ThemeToggle } from './theme-toggle'

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ChefHat size={32} className="text-primary" weight="fill" />
            <h1 className="text-2xl font-bold text-foreground">Gordon's Recipe Collection</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative w-full max-w-sm">
              <MagnifyingGlass size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}