'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CharacterCount from '@tiptap/extension-character-count'
import { Card } from '@/components/ui/Card'
import { updateSpec } from '@/actions/specifications'
import { useEffect, useState } from 'react'
import { Bold, Italic, Heading1, Heading2, List, ListOrdered } from 'lucide-react'

export function SpecEditor({ spec }: { spec: any }) {
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')

  const editor = useEditor({
    extensions: [
      StarterKit,
      CharacterCount.configure({ limit: null })
    ],
    content: spec.content || '<p></p>',
    onUpdate: () => setSaveStatus('unsaved'),
    immediatelyRender: false, // Fix TipTap SSR Hydration error
  })

  // Auto-save effect
  useEffect(() => {
    if (!editor || saveStatus !== 'unsaved') return

    const timeoutId = setTimeout(async () => {
      setIsSaving(true)
      setSaveStatus('saving')
      try {
        await updateSpec(spec.id, editor.getJSON(), editor.getText())
        setSaveStatus('saved')
      } catch (err) {
        console.error("Failed to auto-save", err)
        setSaveStatus('unsaved')
      } finally {
        setIsSaving(false)
      }
    }, 2000) // Auto save after 2s of inactivity

    return () => clearTimeout(timeoutId)
  }, [editor?.getJSON(), saveStatus, spec.id])

  if (!editor) return null

  return (
    <Card className="flex flex-col h-[calc(100vh-12rem)] p-0 overflow-hidden border-[--border-strong]">
      <div className="flex items-center justify-between border-b border-[--border-subtle] bg-[--bg-surface] p-2">
        <div className="flex gap-1">
          <button 
            onClick={() => editor.chain().focus().toggleBold().run()} 
            className={`p-1.5 rounded hover:bg-[--bg-hover] transition-colors ${editor.isActive('bold') ? 'bg-[--bg-hover] text-[--accent]' : 'text-[--text-secondary]'}`}>
            <Bold className="h-4 w-4" />
          </button>
          <button 
            onClick={() => editor.chain().focus().toggleItalic().run()} 
            className={`p-1.5 rounded hover:bg-[--bg-hover] transition-colors ${editor.isActive('italic') ? 'bg-[--bg-hover] text-[--accent]' : 'text-[--text-secondary]'}`}>
            <Italic className="h-4 w-4" />
          </button>
          <div className="w-px h-5 bg-[--border-subtle] mx-1 my-auto" />
          <button 
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
            className={`p-1.5 rounded hover:bg-[--bg-hover] transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-[--bg-hover] text-[--accent]' : 'text-[--text-secondary]'}`}>
            <Heading1 className="h-4 w-4" />
          </button>
          <button 
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
            className={`p-1.5 rounded hover:bg-[--bg-hover] transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-[--bg-hover] text-[--accent]' : 'text-[--text-secondary]'}`}>
            <Heading2 className="h-4 w-4" />
          </button>
          <div className="w-px h-5 bg-[--border-subtle] mx-1 my-auto" />
          <button 
            onClick={() => editor.chain().focus().toggleBulletList().run()} 
            className={`p-1.5 rounded hover:bg-[--bg-hover] transition-colors ${editor.isActive('bulletList') ? 'bg-[--bg-hover] text-[--accent]' : 'text-[--text-secondary]'}`}>
            <List className="h-4 w-4" />
          </button>
          <button 
            onClick={() => editor.chain().focus().toggleOrderedList().run()} 
            className={`p-1.5 rounded hover:bg-[--bg-hover] transition-colors ${editor.isActive('orderedList') ? 'bg-[--bg-hover] text-[--accent]' : 'text-[--text-secondary]'}`}>
            <ListOrdered className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-[--text-muted]">
          {saveStatus === 'saved' && <><span className="w-1.5 h-1.5 rounded-full bg-[--success]"></span> Saved</>}
          {saveStatus === 'saving' && <><span className="w-1.5 h-1.5 rounded-full bg-[--warning] animate-pulse"></span> Saving...</>}
          {saveStatus === 'unsaved' && <><span className="w-1.5 h-1.5 rounded-full bg-[--text-muted]"></span> Unsaved changes</>}
          <span className="ml-2 pl-2 border-l border-[--border-subtle] tabular-nums">{editor.storage.characterCount.words()} words</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-[--bg-elevated]">
        <EditorContent editor={editor} className="prose prose-invert prose-headings:font-serif prose-h1:text-3xl prose-h2:text-2xl prose-a:text-[--accent] max-w-none p-8 outline-none min-h-full" />
      </div>
    </Card>
  )
}
