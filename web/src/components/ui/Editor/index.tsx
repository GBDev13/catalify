import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { FiBold, FiItalic, FiList } from 'react-icons/fi'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import Placeholder from '@tiptap/extension-placeholder'
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import { TfiListOl } from 'react-icons/tfi'
import clsx from 'clsx'
import { ErrorOption } from 'react-hook-form'
import { useEffect } from 'react'

type EditorProps = {
  label?: string
  content: string
  onContentUpdated: (content: string) => void
  error?: ErrorOption
}

export const Editor = ({ label, content, onContentUpdated, error }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Typography,
      Placeholder.configure({
        placeholder: 'Descreva seu produto...',
        emptyEditorClass:
          'before:content-[attr(data-placeholder)] before:text-slate-400 before:h-0 before:float-left before:pointer-events-none',
      }),
      BulletList.configure({
        HTMLAttributes: {
            class: 'list-disc pl-5',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
            class: 'list-decimal pl-5',
        },
      }), 
      ListItem
    ],
    editorProps: {
      attributes: {
        class: 'focus:outline-none prose prose-headings:mt-0 min-h-[150px] py-2 px-4 !text-slate-800 text-sm',
      },
    },
    onUpdate: ({ editor }) => {
      onContentUpdated(editor.getHTML())
    },
    content,
  })

  if(!editor) return null

  const hasError = !!error;

  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-slate-500 mb-1">
        {label}
        </label>
      )}
      <div className={clsx("border border-slate-200 sm:text-sm bg-slate-100 rounded", {
        "border-red-400": hasError,
      })}>
        <header className={clsx("flex items-center gap-2 border-b border-b-slate-200 py-2 px-4", {
          "border-b-red-400": hasError,
        })}>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            tabIndex={-1}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleBold()
                .run()
            }
            className={clsx("hover:indigo-500", {
              "text-indigo-500": editor.isActive('bold')
            })}
            type="button"
          >
            <FiBold />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            tabIndex={-1}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleItalic()
                .run()
            }
            className={clsx("hover:indigo-500", {
              "text-indigo-500": editor.isActive('italic')
            })}
            type="button"
          >
            <FiItalic />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            tabIndex={-1}
            className={clsx("hover:indigo-500", {
              "text-indigo-500": editor.isActive('bulletList')
            })}
            type="button"
          >
            <FiList />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            tabIndex={-1}
            className={clsx("hover:indigo-500", {
              "text-indigo-500": editor.isActive('orderedList')
            })}
            type="button"
          >
            <TfiListOl />
          </button>
        </header>
        <EditorContent editor={editor} />
      </div>

      {hasError && (
        <span className="text-red-400 text-xs mt-2">{error.message}</span>
      )}
    </div>
  )
}