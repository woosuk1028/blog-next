export default function Footer() {
    return (
        <footer className="text-black bg-white mt-8 py-4">
            <div className="max-w-screen-md mx-auto px-4">
                <div className="container mx-auto text-center">
                    <p>&copy; {new Date().getFullYear()} My Blog. All rights reserved.</p>
                    <p>
                        <a
                            href="https://example.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-400"
                        >
                            Visit our website
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
