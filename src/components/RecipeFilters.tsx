import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { X, MagnifyingGlass } from '@phosphor-icons/react'

interface RecipeFiltersProps {
  categories: string[]
  tags: string[]
  selectedCategory: string
  selectedTag: string
  searchQuery: string
  onCategoryChange: (category: string) => void
  onTagChange: (tag: string) => void
  onSearchChange: (query: string) => void
  onClearFilters: () => void
}

export function RecipeFilters({
  categories,
  tags,
  selectedCategory,
  selectedTag,
  searchQuery,
  onCategoryChange,
  onTagChange,
  onSearchChange,
  onClearFilters
}: RecipeFiltersProps) {
  const hasActiveFilters = selectedCategory !== 'All' || selectedTag !== 'All' || searchQuery !== ''

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        <div className="space-y-1 flex-1">
          <label htmlFor="recipe-search" className="text-sm font-medium text-muted-foreground">
            Search
          </label>
          <div className="relative">
            <MagnifyingGlass 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              aria-hidden="true"
            />
            <Input
              id="recipe-search"
              type="search"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
              aria-label="Search recipes by name or ingredient"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="category-filter" className="text-sm font-medium text-muted-foreground">
            Category
          </label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger id="category-filter" className="w-full sm:w-48" aria-label="Filter by category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label htmlFor="tag-filter" className="text-sm font-medium text-muted-foreground">
            Tags
          </label>
          <Select value={selectedTag} onValueChange={onTagChange}>
            <SelectTrigger id="tag-filter" className="w-full sm:w-48" aria-label="Filter by tag">
              <SelectValue placeholder="Select tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Tags</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="flex items-center gap-2"
            aria-label="Clear all filters and search"
          >
            <X size={14} aria-hidden="true" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  )
}