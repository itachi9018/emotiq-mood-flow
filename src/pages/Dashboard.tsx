
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMood } from "@/contexts/MoodContext";
import Layout from "@/components/layout/Layout";
import ComingSoon from "@/components/common/ComingSoon";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { format, parseISO } from "date-fns";

const moodEmojis = ["😢", "😔", "😐", "🙂", "😄"];

const Dashboard = () => {
  const { user } = useAuth();
  const { getRecentEntries, getWeeklyMoodData, addMoodEntry } = useMood();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [showDailyPrompt, setShowDailyPrompt] = useState(true);
  const navigate = useNavigate();
  
  const recentEntries = getRecentEntries(3);
  const weeklyData = getWeeklyMoodData();
  
  const handleMoodSelection = (mood: number) => {
    setSelectedMood(mood);
    
    // If user just wants to record mood without journaling
    if (mood) {
      const quickEntry = {
        mood: mood,
        journalText: "Quick mood check-in",
        emotions: [],
        context: ["Quick Check"]
      };
      
      addMoodEntry(quickEntry);
      setTimeout(() => setSelectedMood(null), 1500);
    }
  };
  
  const handleJournalClick = () => {
    if (selectedMood) {
      navigate("/emotiq-mood-flow/journal", { state: { initialMood: selectedMood } });
      setSelectedMood(null);
    } else {
      navigate("/emotiq-mood-flow/journal");
    }
  };

  const dismissDailyPrompt = () => {
    setShowDailyPrompt(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">
            Hi {user?.name.split(' ')[0]}
          </h1>
        </div>

        {/* Daily Check-In Prompt */}
        {showDailyPrompt && (
          <div className="emotiq-card bg-emotiq-mint-light border-l-4 border-emotiq-mint">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-emotiq-text-dark mb-1">
                  Daily Check-In 🌱
                </h3>
                <p className="text-sm text-emotiq-text-dark/80 mb-3">
                  Take a moment to reflect on how you're feeling today
                </p>
                <button 
                  onClick={handleJournalClick}
                  className="emotiq-btn-secondary text-sm px-4 py-2"
                >
                  Start Journal
                </button>
              </div>
              <button 
                onClick={dismissDailyPrompt}
                className="text-emotiq-text-dark/50 hover:text-emotiq-text-dark p-1"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        
        <div className="emotiq-card bg-emotiq-lavender-light">
          <h2 className="text-lg font-medium mb-4">How are you feeling today?</h2>
          <div className="flex justify-between mb-6">
            {moodEmojis.map((emoji, index) => (
              <button
                key={index}
                className={`text-3xl p-2 rounded-full transition-transform ${
                  selectedMood === index + 1 
                    ? "bg-emotiq-lavender transform scale-125" 
                    : "hover:scale-110"
                }`}
                onClick={() => handleMoodSelection(index + 1)}
              >
                {emoji}
              </button>
            ))}
          </div>
          
          <button 
            onClick={handleJournalClick}
            className="emotiq-btn-primary w-full"
          >
            Journal Your Feelings
          </button>
        </div>

        {/* AI Insights Card - Coming Soon */}
        <ComingSoon
          title="AI Mood Coach"
          description="Get personalized insights and gentle guidance based on your mood patterns"
          icon={<span className="text-2xl">🤖</span>}
          className="bg-gradient-to-br from-emotiq-lavender/10 to-emotiq-sky/10"
        />

        {/* Progress Tracker Widget - Coming Soon */}
        <ComingSoon
          title="Progress Tracker"
          description="Track your mood streaks and celebrate your emotional wellness journey"
          icon={<span className="text-2xl">📈</span>}
          size="small"
          className="bg-gradient-to-br from-emotiq-mint/10 to-emotiq-sky/10"
        />
        
        <div className="emotiq-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Your Week</h2>
            <Link to="/emotiq-mood-flow/history" className="text-sm text-emotiq-text-dark/70 hover:underline">
              View History
            </Link>
          </div>
          
          <div className="h-32 mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E8D5FF" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#E8D5FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }}
                  tickFormatter={(date) => format(parseISO(date), 'EEE')}
                />
                <YAxis domain={[0, 5]} hide />
                <Area 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#9c6dfc" 
                  fillOpacity={1}
                  fill="url(#colorMood)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="emotiq-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Recent Entries</h2>
            <Link to="/emotiq-mood-flow/history" className="text-sm text-emotiq-text-dark/70 hover:underline">
              View All
            </Link>
          </div>
          
          {recentEntries.length > 0 ? (
            <div className="space-y-4">
              {recentEntries.map((entry) => (
                <div key={entry.id} className="flex items-start p-3 bg-emotiq-lavender-light rounded-lg">
                  <div className="text-2xl mr-3">{moodEmojis[entry.mood - 1]}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-medium">
                        {format(new Date(entry.date), "MMM d, h:mm a")}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        entry.sentiment === "Positive" 
                          ? "bg-emotiq-mint/30 text-green-700" 
                          : entry.sentiment === "Negative"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {entry.sentiment}
                      </span>
                    </div>
                    <p className="text-sm text-emotiq-text-dark/80 line-clamp-2 mt-1">
                      {entry.journalText}
                    </p>
                    {entry.emotions.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {entry.emotions.map(emotion => (
                          <span key={emotion} className="text-xs bg-emotiq-lavender/40 px-2 py-0.5 rounded-full">
                            {emotion}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-emotiq-text-dark/70">
              No entries yet. Start journaling today!
            </div>
          )}
        </div>

        {/* Community Card - Coming Soon */}
        <ComingSoon
          title="Community Support"
          description="Find support anonymously and connect with others on similar journeys"
          icon={<span className="text-2xl">👥</span>}
          className="bg-gradient-to-br from-emotiq-sky/10 to-emotiq-mint/10"
        />
        
        <div className="emotiq-card bg-emotiq-mint-light">
          <h2 className="text-lg font-medium mb-2">Insight</h2>
          <p className="text-emotiq-text-dark/80">Try deep breathing today 🧘</p>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
