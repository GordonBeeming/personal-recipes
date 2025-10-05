import { ArrowLeft, Clock, Users, CalendarBlank, Printer, Share } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Recipe } from '../lib/types'
import ReactMarkdown from 'react-markdown'

interface RecipeDetailProps {
  recipe: Recipe
  onBack: () => void
}

export function RecipeDetail({ recipe, onBack }: RecipeDetailProps) {
  const { frontmatter, content } = recipe

  // Category-specific placeholder images
  const getPlaceholderImage = (category: string, size: 'hero' | 'gallery' = 'hero') => {
    const dimensions = size === 'hero' ? 'w=800&h=450' : 'w=300&h=300'
    const placeholderMap: Record<string, string> = {
      'dinner': `https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?${dimensions}&fit=crop&auto=format&q=80`,
      'dessert': `https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?${dimensions}&fit=crop&auto=format&q=80`,
      'lunch': `https://images.unsplash.com/photo-1512621776951-a57141f2eefd?${dimensions}&fit=crop&auto=format&q=80`,
      'breakfast': `https://images.unsplash.com/photo-1484723091739-30a097e8f929?${dimensions}&fit=crop&auto=format&q=80`,
      'appetizer': `https://images.unsplash.com/photo-1551218808-94e220e084d2?${dimensions}&fit=crop&auto=format&q=80`,
      'snack': `https://images.unsplash.com/photo-1578985545062-69928b1d9587?${dimensions}&fit=crop&auto=format&q=80`
    }
    return placeholderMap[category.toLowerCase()] || `https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?${dimensions}&fit=crop&auto=format&q=80`
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: frontmatter.title,
          text: `Check out this recipe: ${frontmatter.title}`,
          url: window.location.href
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      await navigator.clipboard.writeText(window.location.href)
      alert('Recipe link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-6 hover:bg-muted"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Recipes
        </Button>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">{frontmatter.title}</h1>
            
            <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-6">
              <img
                src={frontmatter.heroImage || getPlaceholderImage(frontmatter.category, 'hero')}
                alt={frontmatter.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to a general cooking-themed placeholder
                  e.currentTarget.src = getPlaceholderImage('general', 'hero')
                }}
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recipe Details</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer size={16} className="mr-2" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share size={16} className="mr-2" />
                    Share
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <CalendarBlank size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date Added</p>
                    <p className="font-medium">{new Date(frontmatter.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Prep Time</p>
                    <p className="font-medium">{frontmatter.prepTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Cook Time</p>
                    <p className="font-medium">{frontmatter.cookTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Servings</p>
                    <p className="font-medium">{frontmatter.servings}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Recipe Source</p>
                <p className="font-medium">{frontmatter.source}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {frontmatter.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main content area with fluid markdown rendering */}
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-gray max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-blockquote:text-muted-foreground prose-code:text-foreground prose-pre:bg-muted prose-th:text-foreground prose-td:text-foreground">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Gallery section moved after recipe content */}
          <Card>
            <CardHeader>
              <CardTitle>Recipe Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {frontmatter.images && frontmatter.images.length > 0 ? (
                  frontmatter.images.map((image, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-md">
                      <img
                        src={image}
                        alt={`${frontmatter.title} step ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        onError={(e) => {
                          // Fallback to category-specific gallery placeholders
                          e.currentTarget.src = getPlaceholderImage(frontmatter.category, 'gallery')
                        }}
                      />
                    </div>
                  ))
                ) : (
                  // Show category-appropriate placeholder images when no gallery images exist
                  Array.from({ length: 6 }, (_, index) => {
                    const categoryPlaceholders: Record<string, string[]> = {
                      'dinner': [
                        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=300&fit=crop&auto=format&q=80',
                        'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=300&fit=crop&auto=format&q=80',
                        'https://images.unsplash.com/photo-1586816001966-79b736744398?w=300&h=300&fit=crop&auto=format&q=80',
                        'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=300&h=300&fit=crop&auto=format&q=80',
                        'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=300&fit=crop&auto=format&q=80',
                        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=300&fit=crop&auto=format&q=80'
                      ],
                      'dessert': [
                        'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=300&h=300&fit=crop&auto=format&q=80',
                        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop&auto=format&q=80',
                        'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&h=300&fit=crop&auto=format&q=80',
                        'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=300&h=300&fit=crop&auto=format&q=80',
                        'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=300&h=300&fit=crop&auto=format&q=80',
                        'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=300&fit=crop&auto=format&q=80'
                      ],
                      'lunch': [
                        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop&auto=format&q=80',
                        'https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=300&fit=crop&auto=format&q=80',
                        'https://images.unsplash.com/photo-1565299585323-38174c25f2a3?w=300&h=300&fit=crop&auto=format&q=80',
                        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=300&fit=crop&auto=format&q=80',
                        'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=300&h=300&fit=crop&auto=format&q=80',
                        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop&auto=format&q=80'
                      ]
                    }
                    
                    const categoryImages = categoryPlaceholders[frontmatter.category.toLowerCase()] || [
                      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&auto=format&q=80',
                      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&h=300&fit=crop&auto=format&q=80',
                      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=300&fit=crop&auto=format&q=80',
                      'https://images.unsplash.com/photo-1586816001966-79b736744398?w=300&h=300&fit=crop&auto=format&q=80',
                      'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=300&h=300&fit=crop&auto=format&q=80',
                      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=300&fit=crop&auto=format&q=80'
                    ]
                    
                    return (
                      <div key={index} className="aspect-square overflow-hidden rounded-md">
                        <img
                          src={categoryImages[index % categoryImages.length]}
                          alt={`${frontmatter.title} preparation step ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        />
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}