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
  
  // Category-specific placeholder images
  const getPlaceholderImage = (category: string) => {
    const placeholderMap: Record<string, string> = {
      'dinner': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=225&fit=crop&auto=format&q=80',
      'dessert': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=225&fit=crop&auto=format&q=80',
      'lunch': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=225&fit=crop&auto=format&q=80',
      'breakfast': 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=225&fit=crop&auto=format&q=80',
      'appetizer': 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=225&fit=crop&auto=format&q=80',
      'snack': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=225&fit=crop&auto=format&q=80'
    }
    return placeholderMap[category.toLowerCase()] || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=225&fit=crop&auto=format&q=80'
  }
  
  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden"
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
      <div className="relative aspect-video overflow-hidden">
        <img
          src={frontmatter.heroImage || getPlaceholderImage(frontmatter.category)}
          alt={`${frontmatter.title} - ${frontmatter.category} recipe`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            // Fallback to a general cooking-themed placeholder
            e.currentTarget.src = getPlaceholderImage('general')
          }}
        />
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