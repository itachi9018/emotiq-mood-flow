
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-emotiq-lavender-light p-6">
      <div className="text-center max-w-md animate-fade-in">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-emotiq-text-dark/70 mb-8">
          We couldn't find the page you're looking for.
        </p>
        <Link 
          to="/emotiq/dashboard" 
          className="emotiq-btn-primary inline-block"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
