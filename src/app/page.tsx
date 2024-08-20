export default function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to My Blog</h1>
            <p className="text-lg text-gray-700 mb-8">This is the home page of the blog. Explore our content and learn
                more.</p>
            <button className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition">
                Get Started
            </button>
        </div>
    );
}