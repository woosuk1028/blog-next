import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-gray-800 text-white">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                <h1 className="text-2xl font-bold">
                    <Link href="/">Seok2Log</Link>
                </h1>
                <nav>
                    <ul className="flex space-x-6">
                        <li>
                            <Link href="/" className="hover:text-gray-400">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/about" className="hover:text-gray-400">
                                About
                            </Link>
                        </li>
                        <li>
                            <Link href="/blog" className="hover:text-gray-400">
                                Blog
                            </Link>
                        </li>
                        <li>
                            <Link href="/login" className="hover:text-gray-400">
                                Login
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}
