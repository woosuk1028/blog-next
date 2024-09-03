"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
    seq: number;
    title: string;
    contents?: string;
    category: string;
    tag: string;
    views: number;
    create_date: string;
}

export default function DetailPage({params}: {params: {id: string}}) {
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const response = await fetch('/api/posts/detail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ seq: parseInt(params.id) })
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch post details.');
                }

                const data = await response.json();
                setPost(data.detail);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [params.id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {post ? (
                <div className="post-detail xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
                    <div className="pt-6 xl:pb-6">
                        <h1>{post.title}</h1>
                        <div className="text-gray-500">
                            <p>
                            <span className="text-sm bg-green-200">
                                {post.category}
                            </span>
                            </p>
                            <span>{new Date(post.create_date).toLocaleString()}</span>
                        </div>
                    </div>
                    {post.contents && (
                        <div
                            className="pt-5 pb-5"
                            dangerouslySetInnerHTML={{__html: post.contents}}
                        />
                    )}
                    <div className="pt-4 text-right">
                        <span className="text-sm bg-amber-200">
                            {post.tag}
                        </span>
                    </div>
                </div>
                ) : (
                <div>No Post Found</div>
            )}
        </div>
    );
}