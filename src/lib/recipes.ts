import { Recipe, RecipeStats } from './types'

const parseMarkdown = (content: string, frontmatter: any): { intro: string; ingredients: string[]; instructions: string[]; notes: string } => {
  const sections = content.split(/^### /m)
  
  let intro = ''
  let ingredients: string[] = []
  let instructions: string[] = []
  let notes = ''
  
  sections.forEach((section, index) => {
    if (index === 0) {
      intro = section.trim()
    } else if (section.startsWith('Ingredients')) {
      const ingredientText = section.replace('Ingredients\n', '')
      ingredients = ingredientText
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^-\s*/, '').trim())
    } else if (section.startsWith('Instructions')) {
      const instructionText = section.replace('Instructions\n', '')
      instructions = instructionText
        .split('\n')
        .filter(line => line.trim().match(/^\d+\./))
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
    } else if (section.startsWith('Notes')) {
      notes = section.replace('Notes\n', '').trim()
    }
  })
  
  return { intro, ingredients, instructions, notes }
}

export const sampleRecipes: Recipe[] = [
  {
    slug: 'durban-beef-curry',
    frontmatter: {
      title: 'Authentic Durban Beef Curry',
      date: '2023-10-26',
      source: 'Family Recipe',
      category: 'Dinner',
      tags: ['Beef', 'Curry', 'Spicy', 'Family Favorite'],
      prepTime: '25 minutes',
      cookTime: '2 hours',
      totalTime: '2 hours 25 minutes',
      servings: '4-6',
      heroImage: '/images/durban-curry-hero.jpg',
      images: ['/images/durban-curry-1.jpg', '/images/durban-curry-2.jpg']
    },
    content: 'A rich and aromatic curry that brings the authentic flavors of Durban to your kitchen. This family recipe has been passed down through generations.',
    intro: 'A rich and aromatic curry that brings the authentic flavors of Durban to your kitchen. This family recipe has been passed down through generations.',
    ingredients: [
      '1 kg beef chuck, cut into cubes',
      '3 tbsp vegetable oil',
      '2 large onions, sliced',
      '4 cloves garlic, minced',
      '2 tbsp curry powder',
      '1 tsp turmeric',
      '2 bay leaves',
      '400ml coconut milk',
      '2 tomatoes, chopped',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Heat oil in a large pot over medium-high heat',
      'Brown the beef cubes on all sides, about 8 minutes total',
      'Add onions and cook until softened, about 5 minutes',
      'Add garlic, curry powder, and turmeric. Cook for 1 minute',
      'Add tomatoes, coconut milk, and bay leaves',
      'Bring to a boil, then reduce heat and simmer for 1.5-2 hours',
      'Season with salt and pepper before serving'
    ],
    notes: 'This curry tastes even better the next day. Serve with basmati rice and naan bread for the complete experience.'
  },
  {
    slug: 'classic-chocolate-chip-cookies',
    frontmatter: {
      title: 'Classic Chocolate Chip Cookies',
      date: '2023-09-15',
      source: 'Grandma\'s Recipe Book',
      category: 'Dessert',
      tags: ['Cookies', 'Chocolate', 'Baking', 'Sweet'],
      prepTime: '15 minutes',
      cookTime: '12 minutes',
      totalTime: '27 minutes',
      servings: '24 cookies'
    },
    content: 'The perfect chocolate chip cookie recipe that delivers crispy edges and chewy centers every single time.',
    intro: 'The perfect chocolate chip cookie recipe that delivers crispy edges and chewy centers every single time.',
    ingredients: [
      '2¼ cups all-purpose flour',
      '1 tsp baking soda',
      '1 tsp salt',
      '1 cup butter, softened',
      '¾ cup granulated sugar',
      '¾ cup brown sugar, packed',
      '2 large eggs',
      '2 tsp vanilla extract',
      '2 cups chocolate chips'
    ],
    instructions: [
      'Preheat oven to 375°F (190°C)',
      'Mix flour, baking soda, and salt in a bowl',
      'Cream butter and both sugars until light and fluffy',
      'Beat in eggs one at a time, then vanilla',
      'Gradually blend in flour mixture',
      'Stir in chocolate chips',
      'Drop rounded tablespoons onto ungreased cookie sheets',
      'Bake 9-11 minutes until golden brown'
    ],
    notes: 'For extra chewy cookies, slightly underbake them. Store in an airtight container for up to a week.'
  },
  {
    slug: 'mediterranean-quinoa-salad',
    frontmatter: {
      title: 'Mediterranean Quinoa Salad',
      date: '2023-11-02',
      source: 'Modern Cookbook',
      category: 'Lunch',
      tags: ['Healthy', 'Vegetarian', 'Mediterranean', 'Quick'],
      prepTime: '20 minutes',
      cookTime: '15 minutes',
      totalTime: '35 minutes',
      servings: '4',
      heroImage: '/images/quinoa-salad-hero.jpg'
    },
    content: 'A fresh and nutritious salad packed with Mediterranean flavors, perfect for a light lunch or dinner.',
    intro: 'A fresh and nutritious salad packed with Mediterranean flavors, perfect for a light lunch or dinner.',
    ingredients: [
      '1 cup quinoa, rinsed',
      '2 cups vegetable broth',
      '1 cucumber, diced',
      '2 tomatoes, chopped',
      '½ red onion, finely diced',
      '½ cup kalamata olives, pitted',
      '½ cup feta cheese, crumbled',
      '¼ cup fresh parsley, chopped',
      '3 tbsp olive oil',
      '2 tbsp lemon juice',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Cook quinoa in vegetable broth according to package directions',
      'Let quinoa cool completely',
      'Combine cucumber, tomatoes, red onion, and olives in a large bowl',
      'Add cooled quinoa and mix well',
      'Whisk together olive oil and lemon juice',
      'Pour dressing over salad and toss',
      'Top with feta cheese and parsley',
      'Season with salt and pepper'
    ],
    notes: 'This salad gets better as it sits. Make it a few hours ahead for the best flavor.'
  }
]

export const getRecipes = (): Recipe[] => {
  return sampleRecipes
}

export const getRecipeBySlug = (slug: string): Recipe | undefined => {
  return sampleRecipes.find(recipe => recipe.slug === slug)
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