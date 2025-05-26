
import { ReactNode } from "react";
import BottomNav from "./BottomNav";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="emotiq-layout">
      <main className="flex-1 animate-fade-in">{children}</main>
      <BottomNav />
    </div>
  );
};

export default Layout;
