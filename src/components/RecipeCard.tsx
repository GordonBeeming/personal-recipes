import { Clock, Users } from '@phosphor-icons/react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Recipe } from '../lib/types'

interface RecipeCardProps {
  recipe: Recipe
  onClick: () => void
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  const { frontmatter, intro } = recipe
  
  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden gap-0 py-0"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      tabIndex={0}
      role="article"
      aria-label={`Recipe: ${frontmatter.title}`}
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {(frontmatter.thumbnailImage || frontmatter.heroImage) ? (
          <img
            src={frontmatter.thumbnailImage || frontmatter.heroImage}
            alt={`${frontmatter.title} - ${frontmatter.category} recipe`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <span className="text-4xl" aria-hidden="true">🍳</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
            {frontmatter.category}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {frontmatter.title}
        </h3>
        
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {frontmatter.description || intro}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Clock size={14} aria-hidden="true" />
            <span>{frontmatter.totalTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} aria-hidden="true" />
            <span>{frontmatter.servings}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1.5" aria-label="Recipe tags">
          {frontmatter.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}