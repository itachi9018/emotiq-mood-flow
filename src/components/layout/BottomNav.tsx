
import { Link, useLocation } from "react-router-dom";
import { Home, PenSquare, BarChart2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

const NavItem = ({ to, icon: Icon, label, isActive }: NavItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex flex-1 flex-col items-center pt-2 pb-1 text-xs",
      isActive 
        ? "text-emotiq-text-dark font-medium" 
        : "text-emotiq-text-dark/60"
    )}
  >
    <Icon 
      size={20} 
      className={cn(
        "mb-1",
        isActive ? "stroke-emotiq-lavender" : "stroke-emotiq-text-dark/60"
      )} 
    />
    {label}
  </Link>
);

const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Hide navigation on auth pages
  if (
    currentPath === "/emotiq/" || 
    currentPath === "/emotiq/signin" || 
    currentPath === "/emotiq/signup"
  ) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-emotiq-lavender/20 shadow-sm flex justify-around z-10">
      <NavItem
        to="/emotiq/dashboard"
        icon={Home}
        label="Home"
        isActive={currentPath === "/emotiq/dashboard"}
      />
      <NavItem
        to="/emotiq/journal"
        icon={PenSquare}
        label="Journal"
        isActive={currentPath === "/emotiq/journal"}
      />
      <NavItem
        to="/emotiq/history"
        icon={BarChart2}
        label="History"
        isActive={currentPath === "/emotiq/history"}
      />
      <NavItem
        to="/emotiq/settings"
        icon={Settings}
        label="Settings"
        isActive={currentPath === "/emotiq/settings"}
      />
    </nav>
  );
};

export default BottomNav;
