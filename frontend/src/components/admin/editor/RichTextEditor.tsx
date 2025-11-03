import { useMemo } from 'react'
import { motion } from 'framer-motion'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  isFullscreen: boolean
  onToggleFullscreen: () => void
}

const RichTextEditor = ({ value, onChange, isFullscreen, onToggleFullscreen }: RichTextEditorProps) => {
  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }, { 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false
    }
  }), [])

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-semibold text-vandyke">
          Rich Text Content
        </label>
        <motion.button
          onClick={onToggleFullscreen}
          className="flex items-center gap-2 px-2 sm:px-3 py-1.5 bg-vandyke/10 hover:bg-vandyke/20 text-vandyke rounded-lg text-xs sm:text-sm font-medium transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isFullscreen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            )}
          </svg>
          <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          <span className="sm:hidden">{isFullscreen ? 'Exit' : 'Full'}</span>
        </motion.button>
      </div>
      
      {/* Editor */}
      <motion.div
        className={`bg-white rounded-lg sm:rounded-xl overflow-hidden border-2 border-dun/40 transition-all ${
          isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'relative'
        }`}
        animate={isFullscreen ? { scale: 1, opacity: 1 } : {}}
      >
        {isFullscreen && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-vandyke to-walnut text-white p-3 sm:p-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2 sm:gap-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <h3 className="font-bold text-sm sm:text-lg">Rich Text Editor - Fullscreen</h3>
            </div>
            <button
              onClick={onToggleFullscreen}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all text-sm sm:text-base"
            >
              Exit Fullscreen
            </button>
          </div>
        )}
        
        <div className={`${isFullscreen ? 'pt-14 sm:pt-16 h-full' : ''}`}>
          <style>{`
            .quill-fullscreen .ql-container {
              height: calc(100vh - 10rem) !important;
              font-size: 14px;
            }
            @media (min-width: 640px) {
              .quill-fullscreen .ql-container {
                height: calc(100vh - 12rem) !important;
                font-size: 16px;
              }
            }
            .quill-fullscreen .ql-editor {
              padding: 1.5rem;
              max-width: 1200px;
              margin: 0 auto;
            }
            @media (min-width: 640px) {
              .quill-fullscreen .ql-editor {
                padding: 3rem;
              }
            }
            .quill-normal .ql-container {
              height: 300px;
            }
            @media (min-width: 640px) {
              .quill-normal .ql-container {
                height: 400px;
              }
            }
            .ql-editor img {
              max-width: 100%;
              height: auto;
              display: block;
              margin: 1rem auto;
              cursor: move;
              border: 2px solid transparent;
              transition: all 0.3s;
              border-radius: 8px;
            }
            .ql-editor img:hover {
              border-color: #5D4037;
              box-shadow: 0 4px 12px rgba(93, 64, 55, 0.2);
            }
            .ql-editor img.ql-image-selected {
              border-color: #5D4037;
              box-shadow: 0 0 0 3px rgba(93, 64, 55, 0.1);
            }
            .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
            .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
              content: 'Small';
            }
            .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
            .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
              content: 'Large';
            }
            .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
            .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
              content: 'Huge';
            }
            /* Mobile toolbar adjustments */
            @media (max-width: 640px) {
              .ql-toolbar.ql-snow {
                padding: 6px;
              }
              .ql-toolbar.ql-snow .ql-formats {
                margin-right: 8px;
              }
              .ql-snow .ql-picker-label {
                padding: 2px 4px;
              }
              .ql-editor {
                font-size: 14px;
                padding: 12px;
              }
            }
          `}</style>
          <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange}
            modules={quillModules}
            className={isFullscreen ? 'quill-fullscreen' : 'quill-normal'}
            placeholder="Start writing your content here... You can add text, images, videos, and more."
          />
        </div>
      </motion.div>
    </div>
  )
}

export default RichTextEditor
