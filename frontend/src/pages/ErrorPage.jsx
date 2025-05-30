import { useRouteError, Link } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Oops!</h1>
        <p className="text-gray-600 text-lg mb-4">
          {error.status === 404
            ? "Sorry, the page you're looking for doesn't exist."
            : "Sorry, an unexpected error has occurred."}
        </p>
        <p className="text-gray-500 mb-6">
          <i>{error.statusText || error.message}</i>
        </p>
        <Link
          to="/"
          className="inline-block bg-sky px-6 py-3 rounded-lg text-white font-medium hover:bg-sky-600 transition-colors"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage; 