import { useState } from 'react'
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>
  isLoading: boolean
}

export default function FileUpload({ onUpload, isLoading }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      await onUpload(file)
    }
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      await onUpload(file)
    }
  }

  return (
    <div className="w-full">
      <div
        className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg transition-colors
          ${dragActive 
            ? 'border-blue-500 bg-blue-50/5' 
            : 'border-gray-600 hover:border-gray-500'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          disabled={isLoading}
          accept=".txt,.pdf,.doc,.docx,.csv,.json,.xml,.md"
        />
        
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <ArrowUpTrayIcon className="w-10 h-10 text-gray-400 mb-3" />
          <p className="mb-2 text-sm text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-400">
            Support for common document formats (max. 10MB)
          </p>
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>
    </div>
  )
}
