import { Recipe, RecipeStats } from './types'

// Import all recipe markdown files as raw strings
const recipeModules = import.meta.glob('/content/recipes/*.md', { 
  eager: true,
  query: '?raw',
  import: 'default'
})

const parseFrontmatter = (content: string): { frontmatter: any; body: string } => {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)
  
  if (!match) {
    return { frontmatter: {}, body: content }
  }

  const [, frontmatterText, body] = match
  const frontmatter: any = {}
  
  // Parse YAML-like frontmatter
  const lines = frontmatterText.split('\n')
  let currentKey = ''
  let inArray = false
  let arrayItems: string[] = []
  
  lines.forEach(line => {
    const arrayItemMatch = line.match(/^\s*-\s+(.+)$/)
    if (arrayItemMatch) {
      // Array item
      arrayItems.push(arrayItemMatch[1])
      inArray = true
    } else {
      // Save previous array if we were in one
      if (inArray && currentKey) {
        frontmatter[currentKey] = arrayItems
        arrayItems = []
        inArray = false
      }
      
      const keyValueMatch = line.match(/^(\w+):\s*(.*)$/)
      if (keyValueMatch) {
        const [, key, value] = keyValueMatch
        currentKey = key
        
        if (value.trim() === '') {
          // Might be start of array
          arrayItems = []
        } else {
          frontmatter[key] = value.trim()
        }
      }
    }
  })
  
  // Save last array if needed
  if (inArray && currentKey) {
    frontmatter[currentKey] = arrayItems
  }
  
  return { frontmatter, body }
}

const parseMarkdown = (content: string): { intro: string; ingredients: string[]; instructions: string[] } => {
  // Split by headers (####)
  const sections = content.split(/^####\s+/m)
  
  let intro = ''
  let ingredients: string[] = []
  let instructions: string[] = []
  
  sections.forEach((section, index) => {
    const trimmedSection = section.trim()
    
    if (index === 0) {
      // First section is intro
      intro = trimmedSection
    } else if (trimmedSection.startsWith('**Ingredients**') || trimmedSection.toLowerCase().startsWith('ingredients')) {
      // Parse ingredients
      const lines = trimmedSection.split('\n').slice(1) // Skip the header line
      
      lines.forEach(line => {
        const bulletMatch = line.match(/^\*\s+(.+)$/)
        if (bulletMatch) {
          ingredients.push(bulletMatch[1].trim())
        }
        // Also handle sub-sections like "For the Masala:"
        const subheaderMatch = line.match(/^\*\*(.+):\*\*$/)
        if (subheaderMatch) {
          ingredients.push(subheaderMatch[1] + ':')
        }
      })
    } else if (trimmedSection.startsWith('**Instructions**') || trimmedSection.toLowerCase().startsWith('instructions')) {
      // Parse instructions
      const lines = trimmedSection.split('\n').slice(1) // Skip the header line
      let currentInstruction = ''
      
      lines.forEach(line => {
        const numberedMatch = line.match(/^\d+\.\s+(.+)$/)
        if (numberedMatch) {
          if (currentInstruction) {
            instructions.push(currentInstruction.trim())
          }
          currentInstruction = numberedMatch[1]
        } else if (line.trim().startsWith('*')) {
          // Bullet point within instruction
          currentInstruction += '\n   ' + line.trim()
        } else if (line.trim()) {
          currentInstruction += ' ' + line.trim()
        }
      })
      
      if (currentInstruction) {
        instructions.push(currentInstruction.trim())
      }
    }
  })
  
  return { intro, ingredients, instructions }
}

const loadRecipesFromContent = (): Recipe[] => {
  const recipes: Recipe[] = []
  
  for (const [path, module] of Object.entries(recipeModules)) {
    const content = module as unknown as string
    
    if (typeof content !== 'string') {
      console.warn('Skipping non-string module:', path)
      continue
    }
    
    const { frontmatter, body } = parseFrontmatter(content)
    const { intro, ingredients, instructions } = parseMarkdown(body)
    
    // Extract slug from filename
    const filename = path.split('/').pop()?.replace('.md', '') || ''
    
    const recipe: Recipe = {
      slug: filename,
      frontmatter: {
        title: frontmatter.title || 'Untitled Recipe',
        date: frontmatter.date || new Date().toISOString(),
        source: frontmatter.source || 'Unknown',
        category: frontmatter.category || 'Uncategorized',
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        prepTime: frontmatter.prepTime || '',
        cookTime: frontmatter.cookTime || '',
        totalTime: frontmatter.totalTime || '',
        servings: frontmatter.servings || '',
        description: frontmatter.description || '',
        heroImage: frontmatter.heroImage,
        images: Array.isArray(frontmatter.images) ? frontmatter.images : []
      },
      content: body,
      intro: frontmatter.description || intro || body.substring(0, 200).replace(/[#*_\[\]]/g, '') + '...',
      ingredients,
      instructions,
      notes: '' // Could parse a Notes section if present
    }
    
    recipes.push(recipe)
  }
  
  return recipes
}

// Load recipes once
let cachedRecipes: Recipe[] | null = null

export const getRecipes = (): Recipe[] => {
  if (!cachedRecipes) {
    cachedRecipes = loadRecipesFromContent()
    // Sort by date descending (newest first)
    cachedRecipes.sort((a, b) => {
      const dateA = new Date(a.frontmatter.date).getTime()
      const dateB = new Date(b.frontmatter.date).getTime()
      return dateB - dateA
    })
  }
  return cachedRecipes
}

export const getRecipeBySlug = (slug: string): Recipe | undefined => {
  return getRecipes().find(recipe => recipe.slug === slug)
}

export const getRecipeStats = (): RecipeStats => {
  const recipes = getRecipes()
  const categories = [...new Set(recipes.map(recipe => recipe.frontmatter.category))]
  
  return {
    totalRecipes: recipes.length,
    categories,
    totalCategories: categories.length
  }
}

export const searchRecipes = (query: string, category?: string, tag?: string): Recipe[] => {
  let recipes = getRecipes()
  
  if (query) {
    recipes = recipes.filter(recipe =>
      recipe.frontmatter.title.toLowerCase().includes(query.toLowerCase())
    )
  }
  
  if (category && category !== 'All') {
    recipes = recipes.filter(recipe => recipe.frontmatter.category === category)
  }
  
  if (tag && tag !== 'All') {
    recipes = recipes.filter(recipe => recipe.frontmatter.tags.includes(tag))
  }
  
  return recipes
}