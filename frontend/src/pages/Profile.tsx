import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  User, 
  Mail, 
  Calendar, 
  FileText, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  Settings
} from 'lucide-react'
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

const Profile = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchUserPosts()
    }
  }, [user])

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
      month: 'long',
      day: 'numeric'
    })
  }

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  const publishedPosts = posts.filter(post => post.is_published)
  const draftPosts = posts.filter(post => !post.is_published)

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Please login</h2>
          <p className="text-dark-300 mb-4">You need to be logged in to view your profile.</p>
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <span>Login</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{user.username}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-dark-300">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {formatDate(user.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <Link
                to="/create-post"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>New Post</span>
              </Link>
              <button className="inline-flex items-center space-x-2 px-4 py-2 border border-dark-600 hover:bg-dark-700 text-white font-medium rounded-lg transition-colors duration-200">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="card text-center">
            <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{posts.length}</h3>
            <p className="text-dark-300">Total Posts</p>
          </div>
          <div className="card text-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{publishedPosts.length}</h3>
            <p className="text-dark-300">Published</p>
          </div>
          <div className="card text-center">
            <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{draftPosts.length}</h3>
            <p className="text-dark-300">Drafts</p>
          </div>
          <div className="card text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">1</h3>
            <p className="text-dark-300">Account</p>
          </div>
        </motion.div>

        {/* Posts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Your Posts</h2>
              <Link
                to="/create-post"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Create Post</span>
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-dark-300 mt-4">Loading your posts...</p>
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border border-dark-700 rounded-lg p-6 hover:bg-dark-700 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-semibold text-white">{post.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            post.is_published 
                              ? 'bg-green-600/20 text-green-400' 
                              : 'bg-yellow-600/20 text-yellow-400'
                          }`}>
                            {post.is_published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        
                        {post.image_url && (
                          <div className="mb-3">
                            <img
                              src={post.image_url}
                              alt={post.title}
                              className="w-32 h-20 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        
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

export default Profile 