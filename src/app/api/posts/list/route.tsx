import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/apolloClient';
import { gql } from '@apollo/client';

const LIST = gql`
    query List {
        list {
            seq
            title
            category
            contents
            tag
            views
            create_date
        }
    }
`;

export const runtime = 'edge';

export async function POST(req: NextRequest) {

    try {
        const { data } = await client.query({
            query: LIST,
            fetchPolicy: 'no-cache',
        });

        return NextResponse.json(data);
    } catch (error) {
        console.error('GraphQL 요청 오류:', error);
        return NextResponse.json({ error: 'Failed to fetch list' }, { status: 500 });
    }
}