"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';

export default function HomePage() {

    return (
        <>
            <Head>
                <title>Seok2</title>
            </Head>
            <div className="flex flex-col items-center justify-center min-h-screen text-center">
                {/*<h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to My Blog</h1>*/}
                <div className="text-lg text-gray-700 mb-8">
                    <Image className="main-img" src="/api/files/42d9533cee868849486480402.jpeg" alt="Main Image"/>
                </div>
            </div>
        </>
    );
}