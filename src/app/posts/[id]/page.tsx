import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Post {
    seq: number;
    title: string;
    contents?: string;
    category: string;
    tag: string;
    description: string;
    views: number;
    create_date: string;
}

const GRAPHQL_API_URL = 'https://seok2.duckdns.org/graphql';

// GraphQL 쿼리 정의
const POST_DETAIL_QUERY = `
  query Detail($seq: Int!) {
    detail(seq: $seq) {
      seq
      title
      category
      contents
      tag
      description
      views
      create_date
    }
  }
`;

// Node.js 런타임 설정
export const runtime = 'nodejs';

// SEO 메타데이터 설정
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    try {
        // GraphQL API로부터 특정 게시물 정보 가져오기
        const response = await fetch(GRAPHQL_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: POST_DETAIL_QUERY,
                variables: { seq: parseInt(params.id) },
            }),
        });

        // 응답 상태 코드 확인
        if (!response.ok) {
            console.error('Failed to fetch metadata. Status:', response.status);
            return { title: 'No Title', description: 'No Description' };
        }

        // 응답 데이터를 JSON 형식으로 변환
        const data = await response.json();
        // console.log('Metadata Response:', data);

        // 응답 데이터 확인
        if (!data || !data.data || !data.data.detail) {
            console.error('Invalid metadata response structure:', data);
            return { title: 'No Title', description: 'No Description' };
        }

        const post = data.data.detail;

        return {
            title: post?.title || 'No Title',
            description: post?.description || 'No Description',
            openGraph: {
                title: post?.title || 'No Title',
                description: post?.description || 'No Description',
                url: `https://seok2.duckdns.org/posts/${post?.seq}`,
                type: 'article',
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return { title: 'No Title', description: 'No Description' };
    }
}

export default async function DetailPage({params}: {params: {id: string}}) {
    try {
        const seq = parseInt(params.id);
        if (isNaN(seq)) {
            console.error('Invalid seq parameter:', params.id);
            return notFound(); // seq 값이 잘못되었을 경우 404 반환
        }

        // GraphQL API 요청
        const response = await fetch(GRAPHQL_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            },
            body: JSON.stringify({
                query: POST_DETAIL_QUERY,
                variables: { seq },
            }),
        });

        // 응답 상태 코드 확인
        if (!response.ok) {
            console.error('Failed to fetch post details. Status:', response.status);
            return notFound(); // 페이지를 찾을 수 없을 때
        }

        // 응답 데이터를 JSON 형식으로 변환
        const data = await response.json();

        // 응답 데이터 확인
        if (!data || !data.data || !data.data.detail) {
            console.error('No post data found for ID:', params.id);
            return notFound(); // 데이터가 없을 때 404 반환
        }

        const post = data.data.detail;

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
    } catch (error) {
        console.error('Error fetching post details:', error);
        return notFound(); // 오류가 발생한 경우 404 페이지 반환
    }
}