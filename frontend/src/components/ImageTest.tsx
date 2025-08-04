import { getImageUrl } from '../utils/imageUtils'

interface ImageTestProps {
  imageUrl?: string
  alt?: string
  className?: string
}

const ImageTest: React.FC<ImageTestProps> = ({ 
  imageUrl, 
  alt = "Test image", 
  className = "w-full h-48 object-cover rounded-lg" 
}) => {
  if (!imageUrl) {
    return (
      <div className={`${className} bg-dark-700 flex items-center justify-center text-dark-400`}>
        No image available
      </div>
    )
  }

  const processedUrl = getImageUrl(imageUrl)

  return (
    <img
      src={processedUrl}
      alt={alt}
      className={className}
      onError={(e) => {
        console.error('Image failed to load:', processedUrl)
        const target = e.target as HTMLImageElement
        target.src = 'https://via.placeholder.com/400x300/374151/9CA3AF?text=Image+Failed+To+Load'
      }}
      onLoad={() => {
        console.log('Image loaded successfully:', processedUrl)
      }}
    />
  )
}

export default ImageTest 