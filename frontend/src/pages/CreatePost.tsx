import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Save, Image, Eye, EyeOff } from 'lucide-react'
import { api } from '../services/api'
import toast from 'react-hot-toast'

interface CreatePostForm {
  title: string
  content: string
  image_url?: string
  is_published: boolean
}

const CreatePost = () => {
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CreatePostForm>({
    defaultValues: {
      is_published: true
    }
  })

  const content = watch('content')
  const imageUrl = watch('image_url')

  const onSubmit = async (data: CreatePostForm) => {
    setLoading(true)
    try {
      await api.post('/posts', data)
      toast.success('Post created successfully!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error('Failed to create post')
    } finally {
      setLoading(false)
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
      toast.success('Image added successfully!')
    }
  }

  const handleImageUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value
    setImagePreview(url)
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white">Create New Post</h1>
          <p className="text-dark-300 mt-2">
            Share your thoughts and experiences with the world
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
                  <span>Upload Image</span>
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
                      onClick={() => setImagePreview(null)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                )}
                <input
                  type="url"
                  placeholder="Enter image URL"
                  value={imagePreview || ''}
                  onChange={handleImageUrlChange}
                  className="input-field w-full"
                />
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
                <span className="ml-2 text-sm text-white">Publish immediately</span>
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
                disabled={loading}
                className="inline-flex items-center space-x-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Create Post</span>
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

export default CreatePost 