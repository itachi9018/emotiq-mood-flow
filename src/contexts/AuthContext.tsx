import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on load
  useEffect(() => {
    console.log("AuthProvider: Checking for existing session");
    const storedUser = localStorage.getItem("emotiq-user");
    if (storedUser) {
      console.log("AuthProvider: Found stored user", storedUser);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    console.log("AuthProvider: Login attempt", { email, password });
    setIsLoading(true);
    try {
      // This is a mock authentication
      // In a real app, this would call an auth API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("AuthProvider: Checking credentials", { email, password });
      
      // Check for default admin user
      if (email === "admin" && password === "admin") {
        console.log("AuthProvider: Admin login successful");
        const adminUser: User = {
          id: "admin-1",
          name: "Admin User",
          email: "admin@emotiq.com",
        };
        
        localStorage.setItem("emotiq-user", JSON.stringify(adminUser));
        setUser(adminUser);
        toast.success("Welcome back, Admin!");
        console.log("AuthProvider: Navigating to dashboard");
        navigate("/emotiq/dashboard");
      } else if (email && password) {
        console.log("AuthProvider: Regular user login successful");
        const mockUser: User = {
          id: "user-1",
          name: "Demo User",
          email: email,
        };
        
        localStorage.setItem("emotiq-user", JSON.stringify(mockUser));
        setUser(mockUser);
        toast.success("Welcome back!");
        console.log("AuthProvider: Navigating to dashboard");
        navigate("/emotiq/dashboard");
      } else {
        console.log("AuthProvider: Invalid credentials provided");
        toast.error("Invalid credentials");
      }
    } catch (error) {
      console.error("AuthProvider: Login error", error);
      toast.error("Failed to log in");
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock signup - would call an API in production
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: "user-" + Date.now(),
        name: name,
        email: email,
      };
      
      localStorage.setItem("emotiq-user", JSON.stringify(mockUser));
      setUser(mockUser);
      toast.success("Account created successfully!");
      navigate("/emotiq/dashboard");
    } catch (error) {
      toast.error("Failed to create account");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("emotiq-user");
    setUser(null);
    navigate("/emotiq/");
    toast.info("You've been logged out");
  };

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
