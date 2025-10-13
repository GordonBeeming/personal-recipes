import { ArrowLeft, Clock, Users, CalendarBlank, Printer, Share, Eraser, X, CaretLeft, CaretRight, Images } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Checkbox } from './ui/checkbox'
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Header } from './Header'
import { formatDate } from '../lib/formatDate'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useIsMobile } from '../hooks/use-mobile'
import { useState, useEffect, useRef, createContext, useContext, useMemo, useCallback } from 'react'
import React from 'react'
import { cn } from '../lib/utils'
import { useTina } from 'tinacms/dist/react'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import type { RecipeQuery } from '../../tina/__generated__/types'

// Context to track list type for Tina markdown
const ListTypeContext = createContext<'ul' | 'ol' | null>(null)

// Context to provide checkbox state and toggle handler
interface CheckboxContextValue {
  checkedItems: Record<string, boolean>
  onToggle: (key: string, checked: boolean) => void
}
const CheckboxContext = createContext<CheckboxContextValue | null>(null)

// CheckboxListItem component - reads state from context
interface CheckboxListItemProps {
  children: React.ReactNode
  itemKey: string
}

// Helper function to extract text content from React children
const extractTextFromChildren = (children: React.ReactNode): string => {
  if (typeof children === 'string') {
    return children
  }
  if (typeof children === 'number') {
    return String(children)
  }
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join('')
  }
  if (React.isValidElement(children) && children.props.children) {
    return extractTextFromChildren(children.props.children)
  }
  return ''
}

const CheckboxListItem = ({ children, itemKey }: CheckboxListItemProps) => {
  const context = useContext(CheckboxContext)
  
  if (!context) {
    throw new Error('CheckboxListItem must be used within CheckboxContext.Provider')
  }

  const { checkedItems, onToggle } = context
  const checked = checkedItems[itemKey] || false

  return (
    <li className="flex items-start gap-3 my-2">
      <Checkbox
        id={`checkbox-${itemKey}`}
        checked={checked}
        onCheckedChange={(newChecked) => onToggle(itemKey, newChecked as boolean)}
        className="mt-1 flex-shrink-0"
        aria-label={`Mark "${extractTextFromChildren(children)}" as complete`}
      />
      <label
        htmlFor={`checkbox-${itemKey}`}
        className={`flex-1 cursor-pointer select-none ${checked ? 'line-through text-muted-foreground' : ''
          }`}
      >
        {children}
      </label>
    </li>
  )
}

interface RecipeDetailProps {
  data: RecipeQuery
  query: string
  variables: { relativePath: string }
  onBack: () => void
}

export function RecipeDetail({ data, query, variables, onBack }: RecipeDetailProps) {
  // Always use Tina for live editing
  const { data: tinaData } = useTina({ data, query, variables })

  // Extract recipe data from Tina
  const recipe = tinaData.recipe
  
  if (!recipe) {
    return <div>Recipe not found</div>
  }

  const frontmatter = {
    title: recipe.title,
    description: recipe.description || '',
    date: recipe.date,
    source: recipe.source,
    category: recipe.category,
    tags: recipe.tags,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    totalTime: recipe.totalTime,
    servings: recipe.servings,
    heroImage: recipe.heroImage || undefined,
    thumbnailImage: recipe.thumbnailImage || undefined,
    images: recipe.images?.filter((img): img is string => img !== null) || [],
  }

  const content = recipe.body
  const isMobile = useIsMobile()

  // Store checkbox states in localStorage with recipe slug as key
  // Extract slug from variables.relativePath (e.g., "recipe-name.md" -> "recipe-name")
  const slug = variables.relativePath.replace(/\.md$/, '')
  const [checkedItems, setCheckedItems] = useLocalStorage<Record<string, boolean>>(
    `recipe-progress-${slug}`,
    {}
  )

  // Track if any items are checked
  const [hasCheckedItems, setHasCheckedItems] = useState(false)

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxImage, setLightboxImage] = useState<string>('')
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Lazy loading state for gallery images
  const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set())
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  // Gallery visibility state for mobile - hide initially on mobile to save bandwidth
  const [showGallery, setShowGallery] = useState(!isMobile)

  useEffect(() => {
    setHasCheckedItems(Object.values(checkedItems).some(checked => checked))
  }, [checkedItems])

  // Update gallery visibility when device type changes
  useEffect(() => {
    if (!isMobile) {
      setShowGallery(true)
    }
  }, [isMobile])

  // Set up Intersection Observer for lazy loading gallery images
  useEffect(() => {
    if (!frontmatter.images || frontmatter.images.length === 0) return
    if (!showGallery) return // Don't set up observer if gallery is hidden

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = imageRefs.current.indexOf(entry.target as HTMLDivElement)
            if (index !== -1) {
              setVisibleImages(prev => new Set([...prev, index]))
              observer.unobserve(entry.target)
            }
          }
        })
      },
      {
        rootMargin: '50px', // Start loading 50px before the image enters viewport
      }
    )

    imageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [frontmatter.images, showGallery])

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        navigateLightbox('prev')
      } else if (e.key === 'ArrowRight') {
        navigateLightbox('next')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, lightboxIndex, frontmatter.images])

  const openLightbox = (image: string, index: number) => {
    // Ensure the clicked image is marked as visible (in case it wasn't loaded yet)
    setVisibleImages(prev => new Set([...prev, index]))
    setLightboxImage(image)
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (!frontmatter.images) return

    const newIndex = direction === 'next'
      ? (lightboxIndex + 1) % frontmatter.images.length
      : (lightboxIndex - 1 + frontmatter.images.length) % frontmatter.images.length

    setLightboxIndex(newIndex)
    setLightboxImage(frontmatter.images[newIndex])
  }

  const handleCheckboxChange = useCallback((key: string, checked: boolean) => {
    setCheckedItems(prev => ({
      ...prev,
      [key]: checked
    }))
  }, [setCheckedItems])

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

  // Memoize TinaMarkdown components - only recreate when handler changes, not when state changes
  const tinaComponents = useMemo(() => {
    // Create a list item component
    const ListItem = (props: any) => {
      const listType = useContext(ListTypeContext)
      
      // If it's an ordered list, render normally
      if (listType === 'ol') {
        return <li className="my-1">{props.children}</li>
      }

      // Unordered list item - render as checkbox
      // Extract text content from children to create unique key
      const itemText = extractTextFromChildren(props.children)
      // Use slug + text for uniqueness (in case of duplicate items across sections)
      const itemKey = `${slug}-${itemText.slice(0, 100).trim()}`
      
      // Debug logging to see what keys are being generated
      console.log('ListItem key:', itemKey, 'text:', itemText.slice(0, 50))

      return (
        <CheckboxListItem key={itemKey} itemKey={itemKey}>
          {props.children}
        </CheckboxListItem>
      )
    }

    return {
      ul: (props: any) => {
        return (
          <ListTypeContext.Provider value="ul">
            <ul className="space-y-1 list-none pl-0">
              {props.children}
            </ul>
          </ListTypeContext.Provider>
        )
      },
      ol: (props: any) => {
        return (
          <ListTypeContext.Provider value="ol">
            <ol className="space-y-2 list-decimal pl-6">
              {props.children}
            </ol>
          </ListTypeContext.Provider>
        )
      },
      li: ListItem,
    }
  }, []) // No dependencies - components never change

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
              <CheckboxContext.Provider value={{ checkedItems, onToggle: handleCheckboxChange }}>
                <div className="prose prose-gray max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-blockquote:text-muted-foreground prose-code:text-foreground prose-pre:bg-muted prose-th:text-foreground prose-td:text-foreground">
                  <TinaMarkdown content={content} components={tinaComponents} />
                </div>
              </CheckboxContext.Provider>
            </CardContent>
          </Card>

          {/* Gallery section - only show if there are images */}
          {frontmatter.images && frontmatter.images.length > 0 && (
            showGallery ? (
              <Card>
                <CardHeader>
                  <CardTitle>Recipe Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {frontmatter.images.map((image, index) => (
                      <div
                        key={index}
                        ref={(el) => (imageRefs.current[index] = el)}
                        className="aspect-square overflow-hidden rounded-md bg-muted"
                      >
                        {visibleImages.has(index) ? (
                          <img
                            src={image}
                            alt={`${frontmatter.title} step ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                            onClick={() => openLightbox(image, index)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                openLightbox(image, index)
                              }
                            }}
                            aria-label={`View full size image ${index + 1} of ${frontmatter.images.length}`}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            Loading...
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <Button
                    onClick={() => setShowGallery(true)}
                    variant="outline"
                    size="lg"
                    className="w-full"
                    aria-label={`View recipe gallery (${frontmatter.images.length} images)`}
                  >
                    <Images size={20} className="mr-2" aria-hidden="true" />
                    View Gallery ({frontmatter.images.length} {frontmatter.images.length === 1 ? 'image' : 'images'})
                  </Button>
                </CardContent>
              </Card>
            )
          )}
        </article>

        {/* Lightbox Dialog */}
        <DialogPrimitive.Root open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay
              className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 cursor-pointer"
              onClick={() => setLightboxOpen(false)}
            />
            <DialogPrimitive.Content
              className={cn(
                "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]",
                "w-[90vw] h-auto max-w-4xl max-h-[85vh]",
                "focus:outline-none"
              )}
              aria-describedby={undefined}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <DialogPrimitive.Close asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-50 rounded-full bg-black/50 hover:bg-black/70 text-white"
                    aria-label="Close lightbox"
                  >
                    <X size={24} aria-hidden="true" />
                  </Button>
                </DialogPrimitive.Close>

                {frontmatter.images && frontmatter.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 z-50 rounded-full bg-black/50 hover:bg-black/70 text-white"
                      onClick={() => navigateLightbox('prev')}
                      aria-label="Previous image"
                    >
                      <CaretLeft size={32} aria-hidden="true" weight="bold" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 z-50 rounded-full bg-black/50 hover:bg-black/70 text-white"
                      onClick={() => navigateLightbox('next')}
                      aria-label="Next image"
                    >
                      <CaretRight size={32} aria-hidden="true" weight="bold" />
                    </Button>
                  </>
                )}

                <DialogPrimitive.Title className="sr-only">
                  {`Image ${lightboxIndex + 1} of ${frontmatter.images?.length || 1} - ${frontmatter.title}`}
                </DialogPrimitive.Title>

                <img
                  src={lightboxImage}
                  alt={`${frontmatter.title} - Full size view ${lightboxIndex + 1} of ${frontmatter.images?.length || 1}`}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />

                {frontmatter.images && frontmatter.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm" role="status" aria-live="polite">
                    {lightboxIndex + 1} / {frontmatter.images.length}
                  </div>
                )}
              </div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>

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