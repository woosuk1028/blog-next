"use client";

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import Head from 'next/head';
import ToolBar from '../../../components/ToolBar';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import CodeBlock from '@tiptap/extension-code-block';
import ImageResize from "tiptap-extension-resize-image";
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Document from '@tiptap/extension-document';
import Heading from '@tiptap/extension-heading';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';

interface TiptapProps {
    content: string;
}

export default function Create() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [contents, setContents] = useState('');
    const [category, setCategory] = useState('');
    const [tag, setTag] = useState('');

    const editor = useEditor({
        extensions: [
            StarterKit,
            Highlight,
            Image.configure({
                inline: true,
            }),
            CodeBlock,
            ImageResize,
            Link,
            Underline,
            Document,
            Paragraph,
            Text,
            Heading.configure({
                levels: [1, 2, 3],
            }),
            BulletList.configure({
                keepMarks: true,
            }),
            ListItem,
            Placeholder.configure({
                placeholder: '글을 입력해주세요...',
            }),
        ],
        content: ``,
        editorProps: {
            attributes: {
                class: 'tiptap-editor',
            },
        },
        editable: true,
        autofocus: true,
        injectCSS: true,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            const data = editor.getHTML();
            const processedData = data.replace(/<p><\/p>/g, '<p><br></p>');
            setContents(processedData);
        },
    });

    // 커스텀 이미지 업로드 명령어
    const addImage = async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/api/posts/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const data = await response.json();
            const uploadedFileUrl = data.files[0].url;
            editor?.commands.setImage({ src: uploadedFileUrl });
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    if (!editor) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const postData = {
            title,
            category,
            contents,
            tag,
        };

        try {
            const response = await fetch('/api/posts/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (response.ok) {
                const data = await response.json();
                if (data != 0) router.push('/posts');
                console.log('Post created successfully: ', data);
            } else {
                console.error('Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <>
            <Head>
                <title>Seok2 Create Page</title>
            </Head>
            <div className="pb-5">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12 mt-10">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Write</h2>

                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 ">
                                <div className="sm:col-span-4">
                                    <label htmlFor="title"
                                           className="block text-sm font-medium leading-6 text-gray-900">제목</label>
                                    <div className="mt-2">
                                        <div
                                            className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                                            <input type="text" name="title" id="title" autoComplete="title"
                                                   value={title}
                                                   onChange={(e) => setTitle(e.target.value)}
                                                   className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                   placeholder="title"/>
                                        </div>
                                    </div>
                                </div>

                                <div className="sm:col-span-4">
                                    <label htmlFor="category"
                                           className="block text-sm font-medium leading-6 text-gray-900">카테고리</label>
                                    <div className="mt-2">
                                        <input type="text" name="category" id="category" autoComplete="category"
                                               value={category}
                                               onChange={(e) => setCategory(e.target.value)}
                                               className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                               placeholder="category"/>
                                    </div>
                                </div>

                                <div className="sm:col-span-4">
                                    <label htmlFor="content"
                                           className="block text-sm font-medium leading-6 text-gray-900">내용</label>
                                    <div className="mt-2">
                                        <ToolBar editor={editor} addImage={addImage} />
                                        <EditorContent
                                            editor={editor}
                                            className="border border-gray-300 rounded-md p-4 min-h-[150px] focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-4">
                                    <label htmlFor="tag"
                                           className="block text-sm font-medium leading-6 text-gray-900">태그</label>
                                    <div className="mt-2">
                                        <input type="text" name="tag" id="tag" autoComplete="tag"
                                               value={tag}
                                               onChange={(e) => setTag(e.target.value)}
                                               className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                               placeholder="tag"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
                        <button type="submit"
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
