
import { ReactNode } from 'react';

interface ComingSoonProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const ComingSoon = ({ title, description, icon, className = "", size = "medium" }: ComingSoonProps) => {
  const sizeClasses = {
    small: "p-3 text-sm",
    medium: "p-4",
    large: "p-6"
  };

  return (
    <div className={`emotiq-card bg-gradient-to-br from-gray-50 to-gray-100/50 border-dashed border-2 border-gray-200 opacity-75 ${sizeClasses[size]} ${className}`}>
      <div className="flex items-center gap-3 mb-2">
        {icon && <div className="text-gray-400">{icon}</div>}
        <h3 className={`font-medium text-gray-600 ${size === 'small' ? 'text-sm' : 'text-base'}`}>
          {title}
        </h3>
      </div>
      
      {description && (
        <p className={`text-gray-500 ${size === 'small' ? 'text-xs' : 'text-sm'}`}>
          {description}
        </p>
      )}
      
      <div className="mt-3">
        <span className="inline-block px-3 py-1 bg-gray-200/50 text-gray-500 rounded-full text-xs font-medium">
          Coming Soon
        </span>
      </div>
    </div>
  );
};

export default ComingSoon;
