import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { DEFAULT_URL, DEFAULT_API_URL } from '@/lib/constants';

// 파일 업로드 경로 및 설정
const uploadDir = path.join(process.cwd(), '/uploads'); // 'uploads' 폴더를 사용
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // 폴더가 없으면 생성
}

// Next.js의 파일 구성 업데이트
export const runtime = 'nodejs'; // Node.js 런타임 설정

// Custom type to add headers property to Readable
interface ReadableWithHeaders extends Readable {
    headers: {
        [key: string]: string;
    };
}

// 파일 업로드 API 핸들러
export async function POST(req: Request): Promise<Response> {
    // Request의 Body를 Buffer로 읽어들이고, content-length를 계산하여 헤더에 추가
    const body = await req.arrayBuffer();
    const contentLength = body.byteLength;

    // 새로운 Readable 스트림 생성 및 헤더 추가
    const reqReadable = new Readable() as ReadableWithHeaders;
    reqReadable.push(Buffer.from(body));
    reqReadable.push(null);

    // 헤더 설정
    reqReadable.headers = {
        'content-length': contentLength.toString(), // content-length 헤더 추가
        'content-type': req.headers.get('content-type') || '', // content-type 헤더 추가
    };

    const form = formidable({
        uploadDir, // 파일 저장 경로
        keepExtensions: true, // 파일 확장자 유지
    });

    return new Promise((resolve, reject) => {
        form.parse(reqReadable as any, (err, fields, files) => {
            if (err) {
                console.error('Error parsing the files', err);
                reject(NextResponse.json({ error: 'Error uploading the file' }, { status: 500 }));
                return;
            }

            const uploadedFiles = Object.values(files).flatMap((file) => {
                if (!file) return [];
                const singleFile = Array.isArray(file) ? file[0] : file;
                return {
                    url: `${DEFAULT_URL}/api/files/${singleFile.newFilename}`, // API 경로로 파일을 제공
                    originalFilename: singleFile.originalFilename,
                };
            });

            // 명확한 Response 반환
            resolve(NextResponse.json({ files: uploadedFiles }));
        });
    });
}
