import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Save, Image, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { api } from '../services/api'
import toast from 'react-hot-toast'
import { getImageUrl } from '../utils/imageUtils'

interface EditPostForm {
  title: string
  content: string
  image_url?: string
  is_published: boolean
}

interface Post {
  id: number
  title: string
  content: string
  image_url?: string
  is_published: boolean
  author_id: number
}

const EditPost = () => {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [post, setPost] = useState<Post | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<EditPostForm>()

  const content = watch('content')
  const imageUrl = watch('image_url')

  useEffect(() => {
    if (id) {
      fetchPost()
    }
  }, [id])

  const fetchPost = async () => {
    try {
      const response = await api.get<Post>(`/posts/${id}`)
      const postData = response.data
      setPost(postData)
      
      // Pre-populate form
      setValue('title', postData.title)
      setValue('content', postData.content)
      setValue('image_url', postData.image_url || '')
      setValue('is_published', postData.is_published)
      
      // Set image preview
      if (postData.image_url) {
        setImagePreview(getImageUrl(postData.image_url) || null)
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      toast.error('Failed to load post')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: EditPostForm) => {
    setSaving(true)
    try {
      await api.put(`/posts/${id}`, data)
      toast.success('Post updated successfully!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Error updating post:', error)
      toast.error('Failed to update post')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // For demo purposes, we'll use a placeholder image URL
      // In a real app, you'd upload to a service like Cloudinary or AWS S3
      const imageUrl = URL.createObjectURL(file)
      setImagePreview(imageUrl)
      setValue('image_url', imageUrl)
      toast.success('Image updated successfully!')
    }
  }

  const handleImageUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value
    setImagePreview(url)
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
          <p className="text-dark-300 mb-4">The post you're trying to edit doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center space-x-2 text-dark-300 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
          <h1 className="text-3xl font-bold text-white">Edit Post</h1>
          <p className="text-dark-300 mt-2">
            Update your post content and settings
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
                Post Title *
              </label>
              <input
                id="title"
                type="text"
                {...register('title', {
                  required: 'Title is required',
                  minLength: {
                    value: 5,
                    message: 'Title must be at least 5 characters'
                  }
                })}
                className="input-field w-full"
                placeholder="Enter your post title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Featured Image
              </label>
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 border border-dark-600 rounded-lg hover:bg-dark-700 transition-colors duration-200">
                  <Image className="w-4 h-4" />
                  <span>Update Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {imagePreview && (
                  <div className="flex items-center space-x-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setValue('image_url', '')}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="content" className="block text-sm font-medium text-white">
                  Content *
                </label>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center space-x-2 text-sm text-dark-300 hover:text-white"
                >
                  {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
                </button>
              </div>
              
              {!showPreview ? (
                <textarea
                  id="content"
                  rows={15}
                  {...register('content', {
                    required: 'Content is required',
                    minLength: {
                      value: 50,
                      message: 'Content must be at least 50 characters'
                    }
                  })}
                  className="input-field w-full resize-none"
                  placeholder="Write your post content here... You can use Markdown formatting."
                />
              ) : (
                <div className="bg-dark-800 border border-dark-600 rounded-lg p-4 min-h-[400px]">
                  <div className="prose prose-invert max-w-none">
                    <h1 className="text-2xl font-bold text-white mb-4">{watch('title') || 'Untitled'}</h1>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Featured"
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div className="whitespace-pre-wrap text-dark-300">
                      {content || 'No content yet...'}
                    </div>
                  </div>
                </div>
              )}
              {errors.content && (
                <p className="mt-1 text-sm text-red-400">{errors.content.message}</p>
              )}
            </div>

            {/* Publish Settings */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('is_published')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-dark-600 rounded bg-dark-800"
                />
                <span className="ml-2 text-sm text-white">Publish this post</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-dark-700">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 border border-dark-600 text-white rounded-lg hover:bg-dark-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={saving}
                className="inline-flex items-center space-x-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Update Post</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Markdown Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 card"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Markdown Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-dark-300">
            <div>
              <p><strong>**Bold text**</strong> - Makes text bold</p>
              <p><em>*Italic text*</em> - Makes text italic</p>
              <p># Heading - Creates a heading</p>
              <p>[Link text](url) - Creates a link</p>
            </div>
            <div>
              <p>![Alt text](image_url) - Adds an image</p>
              <p>`code` - Inline code</p>
              <p>``` - Code block</p>
              <p>- List item - Creates a list</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default EditPost 