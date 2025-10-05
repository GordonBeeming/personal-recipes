export interface RecipeFrontmatter {
  title: string
  date: string
  source: string
  category: string
  tags: string[]
  prepTime: string
  cookTime: string
  totalTime: string
  servings: string
  heroImage?: string
  images?: string[]
}

export interface Recipe {
  slug: string
  frontmatter: RecipeFrontmatter
  content: string
  intro: string
  ingredients: string[]
  instructions: string[]
  notes: string
}

export interface RecipeStats {
  totalRecipes: number
  categories: string[]
  totalCategories: number
}