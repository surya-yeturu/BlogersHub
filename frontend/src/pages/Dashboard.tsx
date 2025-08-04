import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, Calendar, FileText } from 'lucide-react'
import { api } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

interface Post {
  id: number
  title: string
  content: string
  image_url?: string
  is_published: boolean
  created_at: string
  updated_at: string
}

const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchUserPosts()
  }, [])

  const fetchUserPosts = async () => {
    try {
      const response = await api.get(`/users/${user?.id}/posts`)
      setPosts(response.data)
    } catch (error) {
      console.error('Error fetching user posts:', error)
      toast.error('Failed to load your posts')
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (postId: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/posts/${postId}`)
        setPosts(posts.filter(post => post.id !== postId))
        toast.success('Post deleted successfully')
      } catch (error) {
        console.error('Error deleting post:', error)
        toast.error('Failed to delete post')
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  const publishedPosts = posts.filter(post => post.is_published)
  const draftPosts = posts.filter(post => !post.is_published)

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-dark-300 mt-2">
                Welcome back, {user?.username}! Manage your blog posts and track your activity.
              </p>
            </div>
            <Link
              to="/create-post"
              className="mt-4 sm:mt-0 inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Post</span>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-dark-300 text-sm">Total Posts</p>
                <p className="text-2xl font-bold text-white">{posts.length}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-dark-300 text-sm">Published</p>
                <p className="text-2xl font-bold text-white">{publishedPosts.length}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-dark-300 text-sm">Drafts</p>
                <p className="text-2xl font-bold text-white">{draftPosts.length}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Posts List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6">Your Posts</h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-dark-300 mt-4">Loading your posts...</p>
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border border-dark-700 rounded-lg p-4 hover:bg-dark-700 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            post.is_published 
                              ? 'bg-green-600/20 text-green-400' 
                              : 'bg-yellow-600/20 text-yellow-400'
                          }`}>
                            {post.is_published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <p className="text-dark-300 mb-3">
                          {truncateContent(post.content)}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-dark-400">
                          <span>Created: {formatDate(post.created_at)}</span>
                          {post.updated_at !== post.created_at && (
                            <span>Updated: {formatDate(post.updated_at)}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Link
                          to={`/post/${post.id}`}
                          className="p-2 text-dark-400 hover:text-white hover:bg-dark-600 rounded-lg transition-colors duration-200"
                          title="View Post"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/edit-post/${post.id}`}
                          className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-600/20 rounded-lg transition-colors duration-200"
                          title="Edit Post"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-lg transition-colors duration-200"
                          title="Delete Post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-12 h-12 text-dark-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
                <p className="text-dark-300 mb-6">
                  Start writing your first blog post and share your stories with the world.
                </p>
                <Link
                  to="/create-post"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Your First Post</span>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard 