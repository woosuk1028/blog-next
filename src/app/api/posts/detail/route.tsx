import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/apolloClient';
import { gql } from '@apollo/client';

const DETAIL = gql`
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

export const runtime = 'edge';

export async function POST(req: NextRequest) {

    try {
        const { seq } = await req.json();

        const { data } = await client.query({
            query: DETAIL,
            variables: {
                seq
            }
        });

        return NextResponse.json(data);
    } catch (error) {
        console.error('GraphQL 요청 오류:', error);
        return NextResponse.json({ error: 'Failed to fetch list' }, { status: 500 });
    }
}