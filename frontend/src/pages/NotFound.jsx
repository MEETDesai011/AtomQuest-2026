import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#171f33] flex flex-col justify-center py-12 sm:px-6 lg:px-8 w-full items-center">
      <div className="text-6xl mb-4">🧭</div>
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-[#dae2fd] mb-2">Page Not Found</h2>
      <p className="text-gray-500 dark:text-[#c7c4d7] mb-8">We couldn't find the page you're looking for.</p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-indigo-600 dark:bg-[#c0c1ff] text-white font-medium rounded-lg hover:brightness-110 transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
