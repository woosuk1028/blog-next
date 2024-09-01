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

    if (!editor) return null;

    return (
        <div className="flex space-x-2 bg-gray-100 p-2 rounded-md">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`p-2 rounded-md ${
                    editor.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                }`}
            >
                Bold
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`p-2 rounded-md ${
                    editor.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                }`}
            >
                Italic
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`p-2 rounded-md ${
                    editor.isActive('codeBlock') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                }`}
            >
                Code Block
            </button>

            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="upload"
            />
            <label htmlFor="upload" className="p-2 rounded-md bg-white text-gray-700 cursor-pointer">
                Upload Image
            </label>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                disabled={!editor.can().chain().focus().toggleUnderline().run()}
                className={`p-2 rounded-md ${
                    editor.isActive('underline') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                }`}
            >
                Underline
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                disabled={!editor.can().chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded-md ${
                    editor.isActive('heading', { level: 1 }) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                }`}
            >
                H1
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                disabled={!editor.can().chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded-md ${
                    editor.isActive('heading', { level: 2 }) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                }`}
            >
                H2
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                disabled={!editor.can().chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-2 rounded-md ${
                    editor.isActive('heading', { level: 3 }) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                }`}
            >
                H3
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                disabled={!editor.can().chain().focus().toggleBulletList().run()}
                className={`p-2 rounded-md ${
                    editor.isActive('bulletList') ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                }`}
            >
                List
            </button>
        </div>
    );
}
