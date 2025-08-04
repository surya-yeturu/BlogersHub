// Utility function to get the correct image URL
export const getImageUrl = (imageUrl?: string): string | undefined => {
  if (!imageUrl) return undefined
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }
  
  // If it's a relative path, prepend the backend URL
  if (imageUrl.startsWith('/')) {
    return `http://localhost:8000${imageUrl}`
  }
  
  // If it's just a filename, assume it's in the uploads directory
  return `http://localhost:8000/uploads/${imageUrl}`
}

// Utility function to get a placeholder image
export const getPlaceholderImage = (): string => {
  return 'https://via.placeholder.com/400x300/374151/9CA3AF?text=No+Image'
} 