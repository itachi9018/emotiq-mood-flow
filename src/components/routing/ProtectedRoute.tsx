
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-emotiq-lavender">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/emotiq/signin" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
