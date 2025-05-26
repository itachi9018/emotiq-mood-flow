
import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/common/Logo";
import { useAuth } from "@/contexts/AuthContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("SignIn: Form submit triggered");
    e.preventDefault();
    console.log("SignIn: Calling login with", { email, password });
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-emotiq-lavender-light to-emotiq-sky-light">
      <div className="w-full max-w-md animate-fade-in">
        <Logo className="mb-8" />
        
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-6 text-center">Welcome Back</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-emotiq-text-dark/80">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="emotiq-input"
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1 text-emotiq-text-dark/80">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="emotiq-input"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button
              type="submit"
              className="emotiq-btn-primary w-full mt-6"
              disabled={isLoading}
              onClick={() => console.log("SignIn: Button clicked")}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-emotiq-text-dark/70">
              Don't have an account?{" "}
              <Link to="/emotiq/signup" className="text-emotiq-text-dark underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
