import React, { useCallback } from 'react';
import { Editor } from '@tiptap/react';

interface ToolBarProps {
    editor: Editor | null;
    addImage: (file: File) => Promise<void>; // addImage를 props로 받아옴
}

export default function ToolBar({ editor, addImage }: ToolBarProps) { // addImage prop을 사용

    const handleFileChange = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            if (!editor) return;

            const files = event.target.files;
            if (files && files[0]) {
                try {
                    await addImage(files[0]); // addImage 함수 호출
                } catch (error) {
                    console.error('Image upload failed:', error);
                }
            }
        },
        [editor, addImage]
    );

    const setLink = useCallback(() => {
        if (!editor) return;

        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        // cancelled
        if (url === null) {
            return
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink()
                .run()

            return
        }

        // update link
        editor.chain().focus().extendMarkRange('link').setLink({ href: url })
            .run()
    }, [editor]);

    if (!editor) return null;

    return (
        <div className="flex space-x-2 bg-gray-100 p-2 rounded-md">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`editor-btn p-2 rounded-md ${
                    editor.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                }`}
            >
                <span className="material-symbols-outlined">
                format_bold
                </span>
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`editor-btn p-2 rounded-md ${
                    editor.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                }`}
            >
                <span className="material-symbols-outlined">
                format_italic
                </span>
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`editor-btn p-2 rounded-md ${
                    editor.isActive('codeBlock') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                }`}
            >
                <span className="material-symbols-outlined">
                code_blocks
                </span>
            </button>

            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="upload"
            />
            <label htmlFor="upload" className="editor-btn p-2 rounded-md bg-white text-gray-700 cursor-pointer">
                <span className="material-symbols-outlined">
                image
                </span>
            </label>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                disabled={!editor.can().chain().focus().toggleUnderline().run()}
                className={`editor-btn p-2 rounded-md ${
                    editor.isActive('underline') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                }`}
            >
                <span className="material-symbols-outlined">
                format_underlined
                </span>
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}
                disabled={!editor.can().chain().focus().toggleHeading({level: 1}).run()}
                className={`editor-btn p-2 rounded-md ${
                    editor.isActive('heading', {level: 1}) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                }`}
            >
                <span className="material-symbols-outlined">
                format_h1
                </span>
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}
                disabled={!editor.can().chain().focus().toggleHeading({level: 2}).run()}
                className={`editor-btn p-2 rounded-md ${
                    editor.isActive('heading', {level: 2}) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                }`}
            >
                <span className="material-symbols-outlined">
                format_h2
                </span>
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({level: 3}).run()}
                disabled={!editor.can().chain().focus().toggleHeading({level: 3}).run()}
                className={`editor-btn p-2 rounded-md ${
                    editor.isActive('heading', {level: 3}) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                }`}
            >
                <span className="material-symbols-outlined">
                format_h3
                </span>
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                disabled={!editor.can().chain().focus().toggleBulletList().run()}
                className={`editor-btn p-2 rounded-md ${
                    editor.isActive('bulletList') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                }`}
            >
                <span className="material-symbols-outlined">
                format_list_bulleted
                </span>
            </button>

            <button
                type="button"
                onClick={setLink}
                disabled={!editor.can().chain().focus().toggleBulletList().run()}
                className={`editor-btn p-2 rounded-md ${
                    editor.isActive('link') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                }`}
            >
                <span className="material-symbols-outlined">
                link
                </span>
            </button>
        </div>
    );
}
