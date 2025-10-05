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
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden"
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden">
        {frontmatter.heroImage ? (
          <img
            src={frontmatter.heroImage}
            alt={frontmatter.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextElementSibling?.classList.remove('hidden')
            }}
          />
        ) : null}
        <div className={`${frontmatter.heroImage ? 'hidden' : ''} w-full h-full bg-muted flex items-center justify-center`}>
          <div className="text-center">
            <Clock size={48} className="mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground font-medium">{frontmatter.category}</p>
          </div>
        </div>
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
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {intro}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{frontmatter.totalTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{frontmatter.servings}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {frontmatter.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {frontmatter.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{frontmatter.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}