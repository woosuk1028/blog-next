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
                console.log(data);
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
                <div className="post-detail">
                    <h1>{post.title}</h1>
                    {post.contents && (
                        <div
                            dangerouslySetInnerHTML={{ __html: post.contents }}
                        />
                    )}
                </div>
            ) : (
                <div>No Post Found</div>
            )}
        </div>
    );
}