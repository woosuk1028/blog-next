"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
    id: string;
    title: string;
    content: string;
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

                const data: Post = await response.json();
                setPost(data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [params.id]);

    // if (loading) return <div>Loading...</div>;
    // if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {post ? (  // post가 존재할 경우 렌더링
                <div>
                    <h1>{post.title}</h1>
                    <p>{post.content}</p>
                </div>
            ) : (
                <div>No Post Found</div>
            )}
        </div>
    );
}