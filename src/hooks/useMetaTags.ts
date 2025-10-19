import { useEffect } from 'react'

interface MetaTag {
  name?: string
  property?: string
  content: string
}

interface MetaTagsProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

export function useMetaTags({ title, description, image, url }: MetaTagsProps) {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title
    }
    
    // Define meta tags to update
    const metaTags: MetaTag[] = []
    
    if (description) {
      metaTags.push(
        { name: 'description', content: description },
        { property: 'og:description', content: description },
        { name: 'twitter:description', content: description }
      )
    }
    
    if (title) {
      metaTags.push(
        { property: 'og:title', content: title },
        { name: 'twitter:title', content: title }
      )
    }
    
    if (image) {
      // Make sure image URL is absolute
      const imageUrl = image.startsWith('http') ? image : `${window.location.origin}${image}`
      metaTags.push(
        { property: 'og:image', content: imageUrl },
        { name: 'twitter:image', content: imageUrl },
        { name: 'twitter:card', content: 'summary_large_image' }
      )
    }
    
    if (url) {
      metaTags.push(
        { property: 'og:url', content: url }
      )
    }
    
    // Add og:type for recipes
    metaTags.push(
      { property: 'og:type', content: 'website' }
    )
    
    // Update or create meta tags
    metaTags.forEach(({ name, property, content }) => {
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`
      let metaTag = document.querySelector(selector) as HTMLMetaElement
      
      if (!metaTag) {
        metaTag = document.createElement('meta')
        if (name) {
          metaTag.name = name
        } else if (property) {
          metaTag.setAttribute('property', property)
        }
        document.head.appendChild(metaTag)
      }
      
      metaTag.content = content
    })
    
    // Cleanup function
    return () => {
      // Reset to default on unmount (optional)
      document.title = "Gordon's Recipe Collection"
    }
  }, [title, description, image, url])
}
