"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import sanitizeHtml from 'sanitize-html';

interface Post {
    seq: number;
    title: string;
    category: string;
    contents: string;
    tag: string;
    views: number;
    create_date: string;
}

export default function Posts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/posts/list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setPosts(data.list);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 로딩 상태 표시
    if (loading) return <div>Loading...</div>;

    // 에러 상태 표시
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="pb-5">
            <div className="py-5">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Posts</h1>
                <p className="text-lg font-bold text-gray-500">포스트</p>
            </div>

            <ul className="divide-y divide-gray-200 -m-4 md:-m-0">
                {posts.map((post) => (
                    <li key={post.seq} className="py-3 p-4">
                        <Link href={`/posts/${post.seq}`} className="group">
                            <div className="mb-1 md:mb-2">
                                <span className="text-sm bg-green-200">{post.category}</span>
                            </div>

                            <div>
                                <h1 className="text-lg md:text-2xl col-span-12 md:col-span-9 mb-2 group-hover:text-blue-600">{post.title}</h1>
                                <div
                                    className="col-span-9 md:row-start-2 text-sm md:text-base flex flex-col justify-start md:py-2">
                                    <p className="overflow-ellipsis break-words overflow-hidden h-10 md:h-12 text-gray-400">
                                        {post.contents && (
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: sanitizeHtml(post.contents, {
                                                        allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'p' ], // 허용할 태그만 나열
                                                        allowedAttributes: {
                                                            'a': [ 'href' ], // 특정 태그에 대한 허용된 속성
                                                        },
                                                    })
                                                }}
                                            />
                                        )}
                                    </p>

                                    <div className="flex mt-2 md:mt-4 text-gray-500">{new Date(post.create_date).toLocaleString()}</div>
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}

            </ul>
        </div>
    );
}