const QuickTipsPanel = () => {
  return (
    <div className="bg-gradient-to-br from-vandyke/5 to-walnut/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-dun/20">
      <h3 className="text-sm font-bold text-vandyke mb-3">Quick Tips</h3>
      <ul className="space-y-2 text-xs text-battleshipgray">
        <li className="flex items-start gap-2">
          <span className="text-vandyke mt-0.5 flex-shrink-0">•</span>
          <span>Banner: Landscape format (16:9) recommended</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-vandyke mt-0.5 flex-shrink-0">•</span>
          <span>Thumbnail: Square or portrait format works best</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-vandyke mt-0.5 flex-shrink-0">•</span>
          <span>Max file size: 5MB per image</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-vandyke mt-0.5 flex-shrink-0">•</span>
          <span>SEO-friendly URL generated from title</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-vandyke mt-0.5 flex-shrink-0">•</span>
          <span>Use Ctrl+S to save your work anytime</span>
        </li>
      </ul>
    </div>
  )
}

export default QuickTipsPanel
