import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Color from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Heading from '@tiptap/extension-heading'
import Placeholder from '@tiptap/extension-placeholder'
import { Button } from '@/components/ui/button'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  HighlighterIcon,
  X,
  Check
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 hover:text-blue-700 underline'
        }
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Highlight.configure({
        multicolor: true
      }),
      Color,
      ListItem,
      BulletList,
      OrderedList,
      Heading.configure({
        levels: [1, 2, 3]
      }),
      Placeholder.configure({
        placeholder
      })
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    }
  })

  if (!editor) {
    return null
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
      setLinkUrl('')
      setShowLinkInput(false)
    }
  }

  const toggleHeading = (level: 1 | 2 | 3) => {
    editor.chain().focus().toggleHeading({ level }).run()
  }

  return (
    <div className="relative min-h-[200px] w-full rounded-lg border border-gray-200 bg-white">
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50/80 p-2 backdrop-blur">
        {/* Text Style */}
        <div className="flex items-center gap-0.5 border-r border-gray-200 pr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive('bold') && "bg-gray-200"
            )}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive('italic') && "bg-gray-200"
            )}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive('underline') && "bg-gray-200"
            )}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLinkInput(!showLinkInput)}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive('link') && "bg-gray-200"
            )}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive('highlight') && "bg-gray-200"
            )}
          >
            <HighlighterIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-0.5 border-r border-gray-200 pr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive({ textAlign: 'left' }) && "bg-gray-200"
            )}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive({ textAlign: 'center' }) && "bg-gray-200"
            )}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive({ textAlign: 'right' }) && "bg-gray-200"
            )}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-0.5 border-r border-gray-200 pr-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive('bulletList') && "bg-gray-200"
            )}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive('orderedList') && "bg-gray-200"
            )}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleHeading(1)}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive('heading', { level: 1 }) && "bg-gray-200"
            )}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleHeading(2)}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive('heading', { level: 2 }) && "bg-gray-200"
            )}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleHeading(3)}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive('heading', { level: 3 }) && "bg-gray-200"
            )}
          >
            <Heading3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="absolute left-2 top-14 z-20 flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
          <input
            type="url"
            placeholder="Enter URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="h-8 rounded-md border border-gray-200 px-2 text-sm focus:border-gray-300 focus:outline-none"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={addLink}
            className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowLinkInput(false)
              setLinkUrl('')
            }}
            className="h-8 w-8 p-0 text-gray-600 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Bubble Menu */}
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive('bold') && "bg-gray-200"
            )}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive('italic') && "bg-gray-200"
            )}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive('underline') && "bg-gray-200"
            )}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLinkInput(!showLinkInput)}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive('link') && "bg-gray-200"
            )}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={cn(
              "h-8 w-8 p-0",
              editor.isActive('highlight') && "bg-gray-200"
            )}
          >
            <HighlighterIcon className="h-4 w-4" />
          </Button>
        </BubbleMenu>
      )}

      <EditorContent 
        editor={editor} 
        className="min-h-[200px] px-4 py-3 prose prose-sm max-w-none focus:outline-none"
      />
    </div>
  )
} 