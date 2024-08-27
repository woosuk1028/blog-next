import { NextApiRequest, NextApiResponse } from 'next';
import client from '@/lib/apolloClient';
import { gql } from '@apollo/client';


const CREATE_POST = gql`
    mutation CreatePost($title: String!, $category: String!, $content: String!, $tag: String!) {
        createPost(title: $title, category: $category, content: $content, tag: $tag)
    }
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('Request received:', req.method, req.url);
    if (req.method === 'POST') {
        const { title, category, content, tag } = req.body;

        try {
            const { data } = await client.mutate({
                mutation: CREATE_POST,
                variables: {
                    title,
                    category,
                    content,
                    tag
                },
            });

            res.status(200).json(data.createPost);
        } catch (error) {
            console.error("GraphQL mutation error:", error);
            res.status(500).json({ error: 'Failed to create post' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}