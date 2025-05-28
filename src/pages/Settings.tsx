
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import ComingSoon from "@/components/common/ComingSoon";
import { toast } from "sonner";
import { Moon, Sun } from "lucide-react";

const Settings = () => {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSaveProfile = () => {
    setIsSaving(true);
    
    // Mock API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Profile saved successfully!");
    }, 1000);
  };
  
  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    
    // This would normally update a theme context
    // or localStorage setting
    toast.info(darkMode ? "Light mode enabled" : "Dark mode enabled");
  };
  
  const handleExportData = () => {
    toast.info("This feature is not available in the MVP");
  };

  return (
    <Layout>
      <div className="space-y-6 pb-8">
        <h1 className="text-2xl font-semibold">Settings</h1>
        
        <div className="emotiq-card">
          <h2 className="text-lg font-medium mb-4">Profile</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1 text-emotiq-text-dark/80">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="emotiq-input"
              />
            </div>
            
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
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1 text-emotiq-text-dark/80">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="emotiq-input"
                placeholder="••••••••"
                disabled
              />
              <p className="text-xs text-emotiq-text-dark/50 mt-1">
                Password change not available in MVP
              </p>
            </div>
            
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="emotiq-btn-primary w-full"
            >
              {isSaving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
        
        <div className="emotiq-card">
          <h2 className="text-lg font-medium mb-4">Appearance</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-emotiq-text-dark/70">
                Switch between light and dark themes
              </p>
            </div>
            <button
              onClick={handleToggleDarkMode}
              className={`p-2 rounded-full ${
                darkMode ? "bg-emotiq-lavender" : "bg-gray-200"
              }`}
            >
              {darkMode ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>
        
        <div className="emotiq-card">
          <h2 className="text-lg font-medium mb-4">Notifications</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Daily Reminders</p>
              <p className="text-sm text-emotiq-text-dark/70">
                Remind me to track my mood
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-checked:bg-emotiq-lavender rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
        </div>

        {/* Integrations Section - Coming Soon */}
        <div className="emotiq-card bg-gray-50 opacity-75">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-600">Integrations</h2>
            <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded-full">Coming Soon</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-600">Apple Health</p>
                <p className="text-sm text-gray-500">
                  Sync mood data with Health app
                </p>
              </div>
              <div className="w-11 h-6 bg-gray-200 rounded-full relative opacity-50">
                <div className="absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-600">Google Calendar</p>
                <p className="text-sm text-gray-500">
                  Set mood tracking reminders
                </p>
              </div>
              <div className="w-11 h-6 bg-gray-200 rounded-full relative opacity-50">
                <div className="absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="emotiq-card">
          <h2 className="text-lg font-medium mb-4">Data</h2>
          
          <button
            onClick={handleExportData}
            className="emotiq-btn-secondary w-full"
          >
            Export Your Data
          </button>
          
          <p className="text-xs text-emotiq-text-dark/50 mt-2 text-center">
            Export functionality will be available in future updates
          </p>
        </div>
        
        <div className="pt-4">
          <button
            onClick={logout}
            className="w-full py-3 border border-emotiq-lavender/30 rounded-full hover:bg-emotiq-lavender/10 transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
