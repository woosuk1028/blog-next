import Link from 'next/link';

export default function Header() {
    return (
        <header className="sticky top-0 z-40 text-black bg-white shadow-md">
            <div className="max-w-screen-md mx-auto">
                <div className="container mx-auto flex justify-between items-center py-4 px-6">
                    <h1 className="text-2xl font-bold">
                        <Link href="/">Blog</Link>
                    </h1>
                    <nav>
                        <ul className="flex space-x-6">
                            <li>
                                <Link href="/" className="hover:text-gray-400">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/posts" className="hover:text-gray-400">
                                    Posts
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
}
