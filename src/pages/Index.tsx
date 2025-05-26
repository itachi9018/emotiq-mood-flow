
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate("/emotiq/");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-emotiq-lavender-light">
      <div className="animate-pulse text-emotiq-lavender">Loading Emotiq...</div>
    </div>
  );
};

export default Index;
