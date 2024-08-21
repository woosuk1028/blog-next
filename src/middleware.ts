import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 허용할 전화번호
const allowedPhoneNumber = '01041668219';

export function middleware(req: NextRequest) {
    const url = new URL(req.url);
    const phoneNumber = url.searchParams.get('acs');

    if (phoneNumber === allowedPhoneNumber) {
        return NextResponse.next();
    } else {
        return new NextResponse('Not Found', { status: 404 });
    }
}

export const config = {
    matcher: '/posts/create',
};