interface ContentTypeSelectorProps {
  contentType: 'richtext' | 'canvas'
  onChange: (type: 'richtext' | 'canvas') => void
}

const ContentTypeSelector = ({ contentType, onChange }: ContentTypeSelectorProps) => {
  return (
    <div className="mt-4 sm:mt-6 mb-4 sm:mb-6">
      <label className="block text-sm font-semibold text-vandyke mb-3">
        Content Type
      </label>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => onChange('richtext')}
          className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
            contentType === 'richtext'
              ? 'bg-vandyke text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="truncate">Rich Text Content</span>
        </button>
        <button
          type="button"
          onClick={() => onChange('canvas')}
          className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
            contentType === 'canvas'
              ? 'bg-vandyke text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          <span className="truncate">Visual Canvas Editor</span>
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {contentType === 'richtext' 
          ? '✍️ Use rich text editor for traditional blog-style content with formatting' 
          : '🎨 Use visual canvas editor for custom layouts and design elements (WYSIWYG)'}
      </p>
    </div>
  )
}

export default ContentTypeSelector
