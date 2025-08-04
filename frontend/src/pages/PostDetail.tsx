import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { 
  Calendar, 
  User, 
  MessageCircle, 
  Send, 
  Trash2, 
  Edit,
  ArrowLeft
} from 'lucide-react'
import { api } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { getImageUrl } from '../utils/imageUtils'

interface Post {
  id: number
  title: string
  content: string
  image_url?: string
  created_at: string
  updated_at: string
  author: {
    id: number
    username: string
    email: string
  }
}

interface Comment {
  id: number
  content: string
  created_at: string
  author: {
    id: number
    username: string
    email: string
  }
}

interface CommentForm {
  content: string
}

const PostDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [commentLoading, setCommentLoading] = useState(false)
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CommentForm>()

  useEffect(() => {
    if (id) {
      fetchPost()
      fetchComments()
    }
  }, [id])

  const fetchPost = async () => {
    try {
      const response = await api.get<Post>(`/posts/${id}`)
      setPost(response.data)
    } catch (error) {
      console.error('Error fetching post:', error)
      toast.error('Failed to load post')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await api.get<Comment[]>(`/posts/${id}/comments`)
      setComments(response.data)
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const onSubmitComment = async (data: CommentForm) => {
    if (!user) {
      toast.error('Please login to comment')
      return
    }

    setCommentLoading(true)
    try {
      const response = await api.post<Comment>(`/posts/${id}/comments`, data)
      setComments([...comments, response.data])
      reset()
      toast.success('Comment added successfully!')
    } catch (error) {
      console.error('Error adding comment:', error)
      toast.error('Failed to add comment')
    } finally {
      setCommentLoading(false)
    }
  }

  const deleteComment = async (commentId: number) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await api.delete(`/comments/${commentId}`)
        setComments(comments.filter(comment => comment.id !== commentId))
        toast.success('Comment deleted successfully')
      } catch (error) {
        console.error('Error deleting comment:', error)
        toast.error('Failed to delete comment')
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-dark-300 mt-4">Loading post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Post not found</h2>
          <p className="text-dark-300 mb-4">The post you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-dark-300 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Posts</span>
          </Link>
        </motion.div>

        {/* Post Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-8"
        >
          {/* Featured Image */}
          {post.image_url && (
            <div className="mb-6">
              <img
                src={getImageUrl(post.image_url)}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  const target = e.target as HTMLImageElement
                  target.src = 'https://via.placeholder.com/800x400/374151/9CA3AF?text=No+Image'
                }}
              />
            </div>
          )}

          {/* Post Header */}
          <header className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center space-x-6 text-sm text-dark-400 mb-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{post.author.username}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.created_at)}</span>
              </div>
            </div>

            {/* Author Actions */}
            {user && user.id === post.author.id && (
              <div className="flex items-center space-x-4">
                <Link
                  to={`/edit-post/${post.id}`}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Post</span>
                </Link>
              </div>
            )}
          </header>

          {/* Post Content */}
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-dark-300 leading-relaxed">
              {post.content}
            </div>
          </div>
        </motion.article>

        {/* Comments Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center space-x-2 mb-6">
            <MessageCircle className="w-5 h-5 text-primary-500" />
            <h2 className="text-2xl font-bold text-white">
              Comments ({comments.length})
            </h2>
          </div>

          {/* Add Comment Form */}
          {user ? (
            <form onSubmit={handleSubmit(onSubmitComment)} className="mb-8">
              <div className="mb-4">
                <textarea
                  {...register('content', {
                    required: 'Comment content is required',
                    minLength: {
                      value: 3,
                      message: 'Comment must be at least 3 characters'
                    }
                  })}
                  rows={3}
                  className="input-field w-full resize-none"
                  placeholder="Share your thoughts..."
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-400">{errors.content.message}</p>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={commentLoading}
                className="inline-flex items-center space-x-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {commentLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Add Comment</span>
                  </>
                )}
              </motion.button>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-dark-700 rounded-lg">
              <p className="text-dark-300">
                Please{' '}
                <Link to="/login" className="text-primary-500 hover:text-primary-400">
                  login
                </Link>{' '}
                to leave a comment.
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-b border-dark-700 pb-6 last:border-b-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-semibold text-white">
                          {comment.author.username}
                        </span>
                        <span className="text-sm text-dark-400">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-dark-300">{comment.content}</p>
                    </div>
                    {user && user.id === comment.author.id && (
                      <button
                        onClick={() => deleteComment(comment.id)}
                        className="ml-4 p-1 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded transition-colors duration-200"
                        title="Delete comment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-dark-400 mx-auto mb-4" />
                <p className="text-dark-300">No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default PostDetail 