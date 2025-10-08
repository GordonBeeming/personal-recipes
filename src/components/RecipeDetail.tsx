import { ArrowLeft, Clock, Users, CalendarBlank, Printer, Share, Eraser } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Checkbox } from './ui/checkbox'
import { Recipe } from '../lib/types'
import { Header } from './Header'
import { formatDate } from '../lib/formatDate'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

interface RecipeDetailProps {
  recipe: Recipe
  onBack: () => void
}

export function RecipeDetail({ recipe, onBack }: RecipeDetailProps) {
  const { frontmatter, content } = recipe
  
  // Store checkbox states in localStorage with recipe slug as key
  const [checkedItems, setCheckedItems] = useLocalStorage<Record<string, boolean>>(
    `recipe-progress-${recipe.slug}`,
    {}
  )
  
  // Track if any items are checked
  const [hasCheckedItems, setHasCheckedItems] = useState(false)
  
  useEffect(() => {
    setHasCheckedItems(Object.values(checkedItems).some(checked => checked))
  }, [checkedItems])

  const handleCheckboxChange = (index: number, checked: boolean) => {
    setCheckedItems(prev => ({
      ...prev,
      [index]: checked
    }))
  }

  const handleClearProgress = () => {
    setCheckedItems({})
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

  // Custom markdown components to replace list items with checkboxes
  const components: Components = {
    li: ({ children, ...props }) => {
      // Generate a unique index for this list item based on its position in the document
      const itemText = String(children)
      const itemIndex = itemText.slice(0, 50) // Use first 50 chars as unique identifier
      const isChecked = checkedItems[itemIndex] || false

      return (
        <li {...props} className="flex items-start gap-3 my-2">
          <Checkbox
            id={`checkbox-${itemIndex}`}
            checked={isChecked}
            onCheckedChange={(checked) => handleCheckboxChange(itemIndex, checked as boolean)}
            className="mt-1 flex-shrink-0"
            aria-label={`Mark "${itemText}" as complete`}
          />
          <label
            htmlFor={`checkbox-${itemIndex}`}
            className={`flex-1 cursor-pointer select-none ${
              isChecked ? 'line-through text-muted-foreground' : ''
            }`}
          >
            {children}
          </label>
        </li>
      )
    },
    ul: ({ children, ...props }) => (
      <ul {...props} className="space-y-1 list-none pl-0">
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol {...props} className="space-y-1 list-none pl-0">
        {children}
      </ol>
    ),
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onLogoClick={onBack} />
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-6 hover:bg-muted"
          aria-label="Go back to recipe list"
        >
          <ArrowLeft size={16} className="mr-2" aria-hidden="true" />
          Back to Recipes
        </Button>

        <article className="space-y-6">
          <header>
            <h1 className="text-4xl font-bold text-foreground mb-4">{frontmatter.title}</h1>
            
            {frontmatter.heroImage && (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-6 bg-muted">
                <img
                  src={frontmatter.heroImage}
                  alt={`${frontmatter.title} - ${frontmatter.category} recipe`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </header>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recipe Details</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrint} aria-label="Print recipe">
                    <Printer size={16} className="mr-2" aria-hidden="true" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare} aria-label="Share recipe">
                    <Share size={16} className="mr-2" aria-hidden="true" />
                    Share
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <CalendarBlank size={16} className="text-muted-foreground" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date Added</p>
                    <p className="font-medium">{formatDate(frontmatter.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-muted-foreground" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-muted-foreground">Prep Time</p>
                    <p className="font-medium">{frontmatter.prepTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-muted-foreground" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-muted-foreground">Cook Time</p>
                    <p className="font-medium">{frontmatter.cookTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-muted-foreground" aria-hidden="true" />
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
                <div className="flex flex-wrap gap-2" role="list" aria-label="Recipe tags">
                  {frontmatter.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" role="listitem">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main content area with fluid markdown rendering and checkboxes */}
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-gray max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-blockquote:text-muted-foreground prose-code:text-foreground prose-pre:bg-muted prose-th:text-foreground prose-td:text-foreground">
                <ReactMarkdown components={components}>{content}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Gallery section - only show if there are images */}
          {frontmatter.images && frontmatter.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recipe Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {frontmatter.images.map((image, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-md bg-muted">
                      <img
                        src={image}
                        alt={`${frontmatter.title} step ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </article>

        {/* Clear Progress Button - Fixed bottom right */}
        {hasCheckedItems && (
          <div className="fixed bottom-6 right-6 z-50">
            <Button
              onClick={handleClearProgress}
              variant="destructive"
              size="lg"
              className="shadow-lg hover:shadow-xl transition-shadow"
              aria-label="Clear recipe progress"
            >
              <Eraser size={20} className="mr-2" aria-hidden="true" />
              Clear Progress
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}