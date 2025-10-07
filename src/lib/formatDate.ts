/**
 * Format a date string to "dd MMM yyyy" format (e.g., "07 Jan 2025")
 * @param dateString - ISO date string or any valid date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  
  // Get day with leading zero if needed
  const day = date.getDate().toString().padStart(2, '0')
  
  // Get month abbreviation
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = monthNames[date.getMonth()]
  
  // Get full year
  const year = date.getFullYear()
  
  return `${day} ${month} ${year}`
}
