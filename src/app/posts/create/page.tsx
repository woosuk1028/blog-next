"use client";

import React, { useState, useEffect, useRef } from 'react';

export default function Create() {
    const editorRef = useRef<{ CKEditor: any, ClassicEditor: any } | null>(null);
    const [editorLoaded, setEditorLoaded] = useState(false);
    const { CKEditor, ClassicEditor } = editorRef.current || {};

    useEffect(() => {
        editorRef.current = {
            CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
            ClassicEditor: require('@ckeditor/ckeditor5-build-classic')
        };
        setEditorLoaded(true);
    }, []);

    return (
        <div className="pb-5">
            <form>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">글쓰기</h2>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 ">
                            <div className="sm:col-span-4">
                                <label htmlFor="title"
                                       className="block text-sm font-medium leading-6 text-gray-900">제목</label>
                                <div className="mt-2">
                                    <div
                                        className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                                        <input type="text" name="title" id="title" autoComplete="title"
                                               className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                               placeholder="title"/>
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-4">
                                <label htmlFor="content"
                                       className="block text-sm font-medium leading-6 text-gray-900">내용</label>
                                <div className="mt-2">
                                    {editorLoaded ? (
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data='<p></p>'
                                            config={{
                                                extraPlugins: [MyCustomUploadAdapterPlugin],
                                                toolbar: [
                                                    'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote',
                                                    'imageUpload', 'codeBlock', '|', 'undo', 'redo'
                                                ],
                                                image: {
                                                    toolbar: [
                                                        'imageTextAlternative', 'imageStyle:full', 'imageStyle:side'
                                                    ]
                                                }
                                            }}
                                            onInit={(editor: any) => {
                                                console.log('Editor is ready to use!', editor);
                                            }}
                                            onChange={(event: any, editor: any) => {
                                                const data = editor.getData();
                                                console.log({ event, editor, data });
                                            }}
                                        />
                                    ) : (
                                        <div>Editor loading</div>
                                    )}
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
    );
}

// 커스텀 이미지 업로드 어댑터 플러그인
function MyCustomUploadAdapterPlugin(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
        return new MyUploadAdapter(loader);
    };
}

// 업로드 어댑터 구현
class MyUploadAdapter {
    private loader: any;

    constructor(loader: any) {
        this.loader = loader;
    }

    upload() {
        return this.loader.file
            .then((file: any) => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve({ default: reader.result });
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            }));
    }

    abort() {
        // 업로드가 중단될 때의 로직을
    }
}
