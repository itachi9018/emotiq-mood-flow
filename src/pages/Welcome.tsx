
import { Link } from "react-router-dom";
import Logo from "@/components/common/Logo";

const Welcome = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-emotiq-lavender-light to-emotiq-sky-light">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-12">
          <Logo showTagline className="mb-12" />
          
          <div className="flex flex-col gap-4 mt-12">
            <Link 
              to="/emotiq/signin" 
              className="emotiq-btn-primary w-full flex justify-center"
            >
              Sign In
            </Link>
            <Link 
              to="/emotiq/signup" 
              className="emotiq-btn-secondary w-full flex justify-center"
            >
              Sign Up
            </Link>
          </div>
          
          <div className="mt-8 text-emotiq-text-dark/70">
            <p>Track your moods, journal your feelings,</p>
            <p>and gain emotional insights.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
