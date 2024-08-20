export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white mt-8 py-4">
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
        </footer>
    );
}
