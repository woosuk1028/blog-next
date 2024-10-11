import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/apolloClient';
import { gql } from '@apollo/client';

const UPDATE = gql`
    mutation update($seq: Int!, $title: String!, $category: String!, $contents: String!, $tag: String!, $description: String!) {
        update(seq: $seq, title: $title, category: $category, contents: $contents, tag: $tag, description: $description)
    }
`;

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    console.log('Request received:', req.method, req.url);

    try {
        const { seq, title, category, contents, tag, description } = await req.json();

        const { data } = await client.mutate({
            mutation: UPDATE,
            variables: {
                seq,
                title,
                category,
                contents,
                tag,
                description
            },
        });

        return NextResponse.json(data.update);
    } catch (error) {
        console.error('GraphQL mutation error:', error);
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}