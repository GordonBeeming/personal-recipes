import { useState, useMemo, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom'
import { Header } from './components/Header'
import { RecipeCard } from './components/RecipeCard'
import { RecipeDetail } from './components/RecipeDetail'
import { RecipeFilters } from './components/RecipeFilters'
import { RecipeStatsComponent } from './components/RecipeStats'
import { NotFoundPage } from './components/NotFoundPage'
import { ScrollToTop } from './components/ScrollToTop'
import { Button } from './components/ui/button'
import { useMetaTags } from './hooks/useMetaTags'
import { getRecipes, getRecipeStats, searchRecipes, getRecipeBySlug } from './lib/recipes'
import client from '../tina/__generated__/client'
import type { RecipeQuery } from '../tina/__generated__/types'

function HomePage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedTag, setSelectedTag] = useState('All')
  
  // Set default meta tags for homepage
  useMetaTags({
    title: "Gordon's Recipe Collection",
    description: "A personal collection of family recipes featuring authentic Durban curries, roasts, and more. Discover delicious recipes with detailed instructions and cooking times.",
    url: window.location.origin
  })

  const recipes = getRecipes()
  const stats = getRecipeStats()

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    recipes.forEach(recipe => {
      recipe.frontmatter.tags.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [recipes])

  const filteredRecipes = useMemo(() => {
    return searchRecipes(searchQuery, selectedCategory, selectedTag)
  }, [searchQuery, selectedCategory, selectedTag])

  const handleRecipeClick = (recipeSlug: string) => {
    navigate(`/recipe/${recipeSlug}`)
  }

  const handleBackToList = () => {
    navigate('/')
  }

  const handleClearFilters = () => {
    setSelectedCategory('All')
    setSelectedTag('All')
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onLogoClick={handleBackToList} />
      
      <main className="container mx-auto px-4 py-8">
        <RecipeStatsComponent stats={stats} />
        
        <div className="mb-6">
          <RecipeFilters
            categories={stats.categories}
            tags={allTags}
            selectedCategory={selectedCategory}
            selectedTag={selectedTag}
            searchQuery={searchQuery}
            onCategoryChange={setSelectedCategory}
            onTagChange={setSelectedTag}
            onSearchChange={setSearchQuery}
            onClearFilters={handleClearFilters}
          />
        </div>

        <div className="mb-4" role="status" aria-live="polite">
          <p className="text-sm text-muted-foreground">
            Showing {filteredRecipes.length} of {stats.totalRecipes} recipes
          </p>
        </div>

        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.slug}
                recipe={recipe}
                onClick={() => handleRecipeClick(recipe.slug)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12" role="status">
            <div className="text-6xl mb-4" aria-hidden="true">🍳</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No recipes found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or clearing the filters to see more recipes.
            </p>
            <Button
              onClick={handleClearFilters}
              variant="link"
              className="text-primary"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

function RecipePage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [tinaData, setTinaData] = useState<{
    data: RecipeQuery
    query: string
    variables: { relativePath: string }
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch Tina data for live editing, fallback to static data for production
  useEffect(() => {
    // Check if slug exists
    if (!slug) {
      setError('No recipe slug provided')
      setLoading(false)
      return
    }

    // Check if recipe exists
    const recipe = getRecipeBySlug(slug)
    if (!recipe) {
      setError('Recipe not found')
      setLoading(false)
      return
    }

    const fetchTinaData = async () => {
      try {
        setLoading(true)
        const relativePath = `${slug}.md`
        
        try {
          // Try to fetch from Tina (works in dev with Tina server running)
          const result = await client.queries.recipe({
            relativePath
          })
          
          if (result.data) {
            setTinaData({
              data: result.data,
              query: result.query,
              variables: { relativePath }
            })
            setError(null)
            return
          }
        } catch (tinaErr) {
          // Tina fetch failed (expected in production), fall back to static data
          console.log('Tina client unavailable, using static recipe data')
        }
        
        // Fallback: Create mock Tina data structure from static recipe
        // This allows RecipeDetail to work in production without Tina Cloud
        const mockTinaData = {
          data: {
            recipe: {
              __typename: 'Recipe' as const,
              id: relativePath,
              _sys: {
                filename: slug,
                basename: slug,
                breadcrumbs: [slug],
                path: relativePath,
                relativePath: relativePath,
                extension: '.md'
              },
              title: recipe.frontmatter.title,
              description: recipe.frontmatter.description || null,
              date: recipe.frontmatter.date,
              source: recipe.frontmatter.source,
              category: recipe.frontmatter.category,
              tags: recipe.frontmatter.tags,
              prepTime: recipe.frontmatter.prepTime,
              cookTime: recipe.frontmatter.cookTime,
              totalTime: recipe.frontmatter.totalTime,
              servings: recipe.frontmatter.servings,
              heroImage: recipe.frontmatter.heroImage || null,
              thumbnailImage: recipe.frontmatter.thumbnailImage || null,
              images: (recipe.frontmatter.images && recipe.frontmatter.images.length > 0) ? recipe.frontmatter.images : null,
              body: recipe.content as any // Tina expects rich-text format
            }
          },
          query: '', // Not needed for static data
          variables: { relativePath }
        }
        
        setTinaData(mockTinaData as any)
        setError(null)
      } catch (err) {
        console.error('Failed to load recipe data:', err)
        setError('Failed to load recipe data')
      } finally {
        setLoading(false)
      }
    }

    fetchTinaData()
  }, [slug])

  const handleBack = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4" aria-hidden="true">🍳</div>
          <p className="text-muted-foreground">Loading recipe...</p>
        </div>
      </div>
    )
  }

  if (error || !tinaData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4" aria-hidden="true">❌</div>
          <p className="text-destructive mb-4">{error || 'Failed to load recipe'}</p>
          <Button onClick={handleBack} variant="outline">
            Back to Recipes
          </Button>
        </div>
      </div>
    )
  }

  return (
    <RecipeDetail 
      data={tinaData.data}
      query={tinaData.query}
      variables={tinaData.variables}
      onBack={handleBack} 
    />
  )
}

function App() {
  return (
    <BrowserRouter basename="/personal-recipes">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipe/:slug" element={<RecipePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App