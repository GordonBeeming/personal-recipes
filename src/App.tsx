import { useState, useMemo } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom'
import { Header } from './components/Header'
import { RecipeCard } from './components/RecipeCard'
import { RecipeDetail } from './components/RecipeDetail'
import { RecipeFilters } from './components/RecipeFilters'
import { RecipeStatsComponent } from './components/RecipeStats'
import { NotFoundPage } from './components/NotFoundPage'
import { ScrollToTop } from './components/ScrollToTop'
import { Button } from './components/ui/button'
import { getRecipes, getRecipeStats, searchRecipes, getRecipeBySlug } from './lib/recipes'

function HomePage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedTag, setSelectedTag] = useState('All')

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

  if (!slug) {
    return <NotFoundPage />
  }

  const recipe = getRecipeBySlug(slug)

  if (!recipe) {
    return <NotFoundPage />
  }

  const handleBack = () => {
    navigate('/')
  }

  return <RecipeDetail recipe={recipe} onBack={handleBack} />
}

function App() {
  return (
    <BrowserRouter>
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