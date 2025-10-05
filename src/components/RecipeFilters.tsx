import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'
import { X } from '@phosphor-icons/react'

interface RecipeFiltersProps {
  categories: string[]
  tags: string[]
  selectedCategory: string
  selectedTag: string
  onCategoryChange: (category: string) => void
  onTagChange: (tag: string) => void
  onClearFilters: () => void
}

export function RecipeFilters({
  categories,
  tags,
  selectedCategory,
  selectedTag,
  onCategoryChange,
  onTagChange,
  onClearFilters
}: RecipeFiltersProps) {
  const hasActiveFilters = selectedCategory !== 'All' || selectedTag !== 'All'

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="flex flex-col sm:flex-row gap-4 flex-1">
        <div className="space-y-1">
          <label className="text-sm font-medium text-muted-foreground">Category</label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-full sm:w-48">
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
          <label className="text-sm font-medium text-muted-foreground">Tags</label>
          <Select value={selectedTag} onValueChange={onTagChange}>
            <SelectTrigger className="w-full sm:w-48">
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
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="flex items-center gap-2"
        >
          <X size={14} />
          Clear Filters
        </Button>
      )}
    </div>
  )
}