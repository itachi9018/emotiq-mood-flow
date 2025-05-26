
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
}

const Logo = ({ className, showTagline = false }: LogoProps) => {
  return (
    <div className={cn("text-center", className)}>
      <div className="inline-flex items-center">
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emotiq-lavender to-emotiq-sky mr-2"></div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emotiq-lavender via-emotiq-mint to-emotiq-sky inline-block text-transparent bg-clip-text">
          Emotiq
        </h1>
      </div>
      {showTagline && (
        <p className="text-emotiq-text-dark/70 mt-2">
          Understand your emotions. Own your story.
        </p>
      )}
    </div>
  );
};

export default Logo;
