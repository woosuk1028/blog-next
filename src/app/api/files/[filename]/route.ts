// src/app/api/files/[filename]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// 파일 제공 API 핸들러
export async function GET(req: NextRequest, { params }: { params: { filename: string } }) {
    const { filename } = params;
    const filePath = path.join(process.cwd(), 'uploads', filename); // 파일 경로

    try {
        const fileExists = fs.existsSync(filePath);
        if (!fileExists) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        const fileStream = fs.createReadStream(filePath);

        // Node.js ReadStream을 웹 표준 ReadableStream으로 변환
        const readableStream = new ReadableStream({
            start(controller) {
                fileStream.on('data', (chunk) => controller.enqueue(chunk)); // 데이터를 청크 단위로 읽어옴
                fileStream.on('end', () => controller.close()); // 스트림 종료 시 컨트롤러 닫기
                fileStream.on('error', (err) => controller.error(err)); // 오류 발생 시 컨트롤러에 에러 전송
            },
        });

        return new Response(readableStream, {
            headers: {
                'Content-Type': 'application/octet-stream',
            },
        });
    } catch (error) {
        console.error('Error serving file:', error);
        return NextResponse.json({ error: 'Error serving file' }, { status: 500 });
    }
}
