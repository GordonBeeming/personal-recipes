import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import satori from 'satori'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')

// Parse frontmatter from markdown
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/
  const match = content.match(frontmatterRegex)
  
  if (!match) {
    return {}
  }

  const frontmatterText = match[1]
  const frontmatter = {}
  
  const lines = frontmatterText.split('\n')
  let currentKey = ''
  let inArray = false
  let arrayItems = []
  
  lines.forEach(line => {
    const arrayItemMatch = line.match(/^\s*-\s+(.+)$/)
    if (arrayItemMatch) {
      arrayItems.push(arrayItemMatch[1])
      inArray = true
    } else {
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
          arrayItems = []
        } else {
          frontmatter[key] = value.trim()
        }
      }
    }
  })
  
  if (inArray && currentKey) {
    frontmatter[currentKey] = arrayItems
  }
  
  return frontmatter
}

// Load all recipes
function loadRecipes() {
  const recipesDir = join(projectRoot, 'content', 'recipes')
  const files = readdirSync(recipesDir).filter(f => f.endsWith('.md'))
  
  return files.map(file => {
    const content = readFileSync(join(recipesDir, file), 'utf-8')
    const frontmatter = parseFrontmatter(content)
    const slug = file.replace('.md', '')
    
    return {
      slug,
      frontmatter: {
        title: frontmatter.title || 'Untitled Recipe',
        category: frontmatter.category || 'Uncategorized',
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        prepTime: frontmatter.prepTime || '',
        cookTime: frontmatter.cookTime || '',
        totalTime: frontmatter.totalTime || '',
        servings: frontmatter.servings || '',
        thumbnailImage: frontmatter.thumbnailImage || ''
      }
    }
  })
}

// Create OG image structure for satori
function createOGImageStructure(recipe, thumbnailImageBase64) {
  const { title, category, prepTime, cookTime, servings, tags } = recipe.frontmatter
  
  // Determine font size based on title length
  let titleFontSize = 68
  if (title.length > 75) {
    titleFontSize = 48
  } else if (title.length > 50) {
    titleFontSize = 56
  }
  
  // Truncate title if too long
  let displayTitle = title
  if (title.length > 95) {
    displayTitle = title.slice(0, 92) + '…'
  }
  
  // Limit tags to 5
  const displayTags = tags.slice(0, 5)
  
  // Build recipe info children array
  const recipeInfoChildren = []
  if (prepTime) {
    recipeInfoChildren.push({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center'
        },
        children: `⏱️ ${prepTime}`
      }
    })
  }
  if (cookTime) {
    recipeInfoChildren.push({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center'
        },
        children: `🔥 ${cookTime}`
      }
    })
  }
  if (servings) {
    recipeInfoChildren.push({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center'
        },
        children: `👥 ${servings}`
      }
    })
  }
  
  // Build tags children array
  const tagsChildren = displayTags.map(tag => ({
    type: 'span',
    key: tag,
    props: {
      style: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: '#46CBFF',
        padding: '8px 16px',
        borderRadius: '9999px',
        fontSize: 24,
        flexShrink: 0
      },
      children: tag
    }
  }))
  
  // Build footer children array
  const footerChildren = [
    // Domain
    {
      type: 'div',
      props: {
        style: {
          position: 'absolute',
          bottom: 40,
          left: 60,
          fontSize: 28,
          color: '#E0E0E0'
        },
        children: 'recipes.gordonbeeming.com'
      }
    },
    // Author info
    {
      type: 'div',
      props: {
        style: {
          position: 'absolute',
          bottom: 40,
          right: 60,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end'
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                fontSize: 28,
                fontWeight: 'bold',
                color: '#FFFFFF'
              },
              children: 'Gordon Beeming'
            }
          },
          {
            type: 'div',
            props: {
              style: {
                marginTop: '8px',
                fontSize: 22,
                color: '#E0E0E0'
              },
              children: 'Personal Recipe Collection'
            }
          }
        ]
      }
    }
  ]
  
  // Add tags if present
  if (displayTags.length > 0) {
    footerChildren.push({
      type: 'div',
      props: {
        style: {
          position: 'absolute',
          bottom: 85,
          left: 60,
          right: 420,
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'nowrap',
          overflow: 'hidden',
          gap: '12px'
        },
        children: tagsChildren
      }
    })
  }
  
  // Build main children array
  const mainChildren = []
  
  // Add background image if present
  if (thumbnailImageBase64) {
    mainChildren.push({
      type: 'div',
      props: {
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.15,
          display: 'flex'
        },
        children: {
          type: 'img',
          props: {
            src: thumbnailImageBase64,
            style: {
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }
          }
        }
      }
    })
  }
  
  // Add main content
  mainChildren.push({
    type: 'div',
    props: {
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      },
      children: [
        // Header
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: '60px 60px 0 60px',
              width: '100%'
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 32,
                    color: '#57606a',
                    fontWeight: 600
                  },
                  children: 'Recipe'
                }
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 28,
                    color: '#57606a',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    padding: '12px 24px',
                    borderRadius: '9999px',
                    fontWeight: 500
                  },
                  children: category
                }
              }
            ]
          }
        },
        // Title and details
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '40px 60px'
            },
            children: [
              // Title
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: titleFontSize,
                    fontWeight: 700,
                    color: '#1A1A1A',
                    lineHeight: 1.2,
                    padding: '0 30px',
                    marginBottom: '40px'
                  },
                  children: displayTitle
                }
              },
              // Recipe info
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    gap: '40px',
                    fontSize: 24,
                    color: '#57606a',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    padding: '20px 40px',
                    borderRadius: '12px'
                  },
                  children: recipeInfoChildren
                }
              }
            ]
          }
        },
        // Footer
        {
          type: 'div',
          props: {
            style: {
              width: '100%',
              height: '160px',
              backgroundColor: '#003353',
              color: '#FFFFFF',
              display: 'flex',
              position: 'relative'
            },
            children: footerChildren
          }
        }
      ]
    }
  })
  
  return {
    type: 'div',
    props: {
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F6F8FA',
        fontFamily: 'sans-serif',
        position: 'relative'
      },
      children: mainChildren
    }
  }
}

// Generate OG image for a recipe
async function generateOGImage(recipe, fontData) {
  console.log(`Generating OG image for: ${recipe.frontmatter.title}`)
  
  // Load thumbnail image if available (smaller than hero image)
  let thumbnailImageBase64 = null
  if (recipe.frontmatter.thumbnailImage) {
    try {
      const imagePath = join(projectRoot, 'public', recipe.frontmatter.thumbnailImage)
      
      // Resize the image to be even smaller for satori (max 400px wide)
      const resizedImageBuffer = await sharp(imagePath)
        .resize(400, null, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .jpeg({ quality: 60 }) // Convert to JPEG with lower quality for smaller size
        .toBuffer()
      
      const base64 = resizedImageBuffer.toString('base64')
      thumbnailImageBase64 = `data:image/jpeg;base64,${base64}`
      console.log(`  ✓ Loaded and resized thumbnail image: ${recipe.frontmatter.thumbnailImage} (${Math.round(base64.length / 1024)}KB)`)
    } catch (err) {
      console.warn(`  Warning: Could not load thumbnail image: ${recipe.frontmatter.thumbnailImage} - ${err.message}`)
    }
  }
  
  // Create SVG using satori
  const svg = await satori(
    createOGImageStructure(recipe, thumbnailImageBase64),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Roboto',
          data: fontData,
          weight: 700,
          style: 'normal'
        }
      ]
    }
  )
  
  // Convert SVG to PNG using sharp
  const pngBuffer = await sharp(Buffer.from(svg))
    .png()
    .toBuffer()
  
  return pngBuffer
}

// Main function
async function main() {
  console.log('Starting OG image generation...\n')
  
  // Load font
  const fontPath = join(projectRoot, 'public', 'fonts', 'Roboto-Bold.ttf')
  const fontData = readFileSync(fontPath)
  
  // Create output directory
  const outputDir = join(projectRoot, 'public', 'og-images')
  mkdirSync(outputDir, { recursive: true })
  
  // Load recipes
  const recipes = loadRecipes()
  console.log(`Found ${recipes.length} recipes\n`)
  
  // Generate OG images
  for (const recipe of recipes) {
    try {
      const pngBuffer = await generateOGImage(recipe, fontData)
      const outputPath = join(outputDir, `${recipe.slug}.png`)
      writeFileSync(outputPath, pngBuffer)
      console.log(`  ✓ Created: og-images/${recipe.slug}.png`)
    } catch (err) {
      console.error(`  ✗ Failed to generate OG image for ${recipe.slug}:`, err.message)
      console.error('    Stack:', err.stack)
    }
  }
  
  console.log('\nOG image generation complete!')
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
