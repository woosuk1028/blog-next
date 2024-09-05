// import type { Metadata } from "next";
import "../styles/globals.css";
import Header from '../components/Header';
import Footer from '../components/Footer';
import Head from 'next/head';

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
    children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="ko">
      <head>
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com"/>
          <link
              href="https://fonts.googleapis.com/css2?family=Dongle:wght@300;400;700&family=Poor+Story&family=Single+Day&display=swap"
              rel="stylesheet"/>

          <link rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"/>
      </head>
      <body className="text-gray-800">
      <Header/>
      <main className="container mx-auto min-h-screen max-w-3xl">{children}</main>
      <Footer/>
          </body>
      </html>
  );
}