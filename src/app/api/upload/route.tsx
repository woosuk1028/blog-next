import { NextRequest, NextResponse } from 'next/server';
import { createReadStream } from 'fs';
import path from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch';

// CommonJS 방식으로 가져오기
const formidable = require('formidable');  // 올바르게 require로 가져오기
import type { Files, File, Fields } from 'formidable';  // 타입 명확히 정의

export const runtime = 'nodejs'; // Node.js Runtime 사용 설정

export async function POST(req: NextRequest) {
    try {
        // 올바른 방법으로 formidable 사용
        const form = new formidable.IncomingForm({
            uploadDir: path.join(process.cwd(), '/uploads'), // 파일 저장 경로 설정
            keepExtensions: true, // 파일 확장자 유지
        });

        // req 객체를 IncomingMessage로 변환하여 사용
        const files = await new Promise<Record<string, File>>((resolve, reject) => {
            form.parse(req as any, (err: Error | null, fields: Fields, files: Files) => {  // 타입 명시적으로 정의
                if (err) {
                    reject(err);
                } else {
                    // files 객체를 올바른 타입으로 변환
                    const fileEntries: Record<string, File> = {};
                    for (const [key, fileOrFiles] of Object.entries(files)) {
                        if (Array.isArray(fileOrFiles)) {
                            // 파일 배열인 경우, 첫 번째 파일을 가져옴
                            fileEntries[key] = fileOrFiles[0];
                        } else if (fileOrFiles) {
                            // 파일이 단일 객체인 경우
                            fileEntries[key] = fileOrFiles;
                        }
                    }
                    resolve(fileEntries);
                }
            });
        });

        const file = files.file; // 업로드된 파일 객체

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // originalFilename이 null일 수 있으므로 기본값으로 처리
        const originalFilename = file.originalFilename ?? 'unknown_filename';

        // 파일을 GraphQL 서버로 업로드하는 함수 호출
        const uploadedFileData = await uploadFileToGraphQLServer(file.filepath, originalFilename);

        return NextResponse.json(uploadedFileData);
    } catch (error) {
        console.error('File upload error:', error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}

// 파일을 GraphQL 서버로 업로드하는 함수
const uploadFileToGraphQLServer = async (filePath: string, fileName: string): Promise<any> => {
    const form = new FormData();
    form.append(
        'operations',
        JSON.stringify({
            query: `
        mutation ($file: Upload!) {
          uploadFile(file: $file) {
            filename
            mimetype
            encoding
            url
          }
        }
      `,
            variables: { file: null },
        })
    );
    form.append('map', JSON.stringify({ '0': ['variables.file'] }));
    form.append('0', createReadStream(filePath), fileName);

    // GraphQL 서버로 파일 업로드 요청
    const response = await fetch('https://seok2.duckdns.org/graphql', {
        method: 'POST',
        body: form as any,
    });

    if (!response.ok) {
        throw new Error('Failed to upload file to GraphQL server');
    }

    const result = await response.json();
    return result.data.uploadFile; // 업로드된 파일의 URL 반환
};
