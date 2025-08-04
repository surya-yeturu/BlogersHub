import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { getImageUrl } from '../utils/imageUtils'

interface Post {
  id: number
  title: string
  content: string
  image_url?: string
  created_at: string
  author: {
    id: number
    username: string
    email: string
  }
}

interface PostCardProps {
  post: Post
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="card hover:shadow-xl transition-all duration-300 group"
    >
      {/* Image */}
      {post.image_url && (
        <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
          <img
            src={getImageUrl(post.image_url)}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement
              target.src = 'https://via.placeholder.com/400x300/374151/9CA3AF?text=No+Image'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/50 to-transparent"></div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-primary-400 transition-colors duration-200">
          {post.title}
        </h3>
        
        <p className="text-dark-300 mb-4 line-clamp-3">
          {truncateContent(post.content)}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-dark-400 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{post.author.username}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Read More Button */}
        <Link
          to={`/post/${post.id}`}
          className="inline-flex items-center space-x-2 text-primary-500 hover:text-primary-400 font-medium transition-colors duration-200"
        >
          <span>Read More</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
    </motion.div>
  )
}

export default PostCard 