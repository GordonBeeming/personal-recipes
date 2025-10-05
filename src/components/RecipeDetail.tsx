import { useState } from 'react'
import { ArrowLeft, Clock, Users, CalendarBlank, Printer, Share } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Checkbox } from './ui/checkbox'
import { Separator } from './ui/separator'
import { Recipe } from '../lib/types'
import { useKV } from '@github/spark/hooks'

interface RecipeDetailProps {
  recipe: Recipe
  onBack: () => void
}

export function RecipeDetail({ recipe, onBack }: RecipeDetailProps) {
  const { frontmatter, intro, ingredients, instructions, notes } = recipe
  const [checkedIngredientsStr, setCheckedIngredientsStr] = useKV(`recipe-${recipe.slug}-checked`, '[]')
  const checkedIngredients = JSON.parse(checkedIngredientsStr || '[]') as number[]

  const handleIngredientCheck = (index: number, checked: boolean) => {
    const currentList = checkedIngredients || []
    let newList: number[]
    
    if (checked) {
      newList = [...currentList, index]
    } else {
      newList = currentList.filter(i => i !== index)
    }
    
    setCheckedIngredientsStr(JSON.stringify(newList))
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: frontmatter.title,
          text: intro,
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
            
            {frontmatter.heroImage && (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-6">
                <img
                  src={frontmatter.heroImage}
                  alt={frontmatter.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}

            {frontmatter.images && frontmatter.images.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {frontmatter.images.map((image, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-md">
                      <img
                        src={image}
                        alt={`${frontmatter.title} step ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
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

          {intro && (
            <Card>
              <CardHeader>
                <CardTitle>About This Recipe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{intro}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Ingredients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Checkbox
                      id={`ingredient-${index}`}
                      checked={checkedIngredients.includes(index)}
                      onCheckedChange={(checked) => handleIngredientCheck(index, checked as boolean)}
                      className="mt-1"
                    />
                    <label
                      htmlFor={`ingredient-${index}`}
                      className={`text-sm cursor-pointer ${
                        checkedIngredients.includes(index) ? 'line-through text-muted-foreground' : ''
                      }`}
                    >
                      {ingredient}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-relaxed pt-1">{instruction}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}