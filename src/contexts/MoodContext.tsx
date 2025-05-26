
import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1-5 scale
  journalText: string;
  emotions: string[];
  context: string[];
  sentiment?: "Positive" | "Neutral" | "Negative";
}

interface MoodContextType {
  moodEntries: MoodEntry[];
  addMoodEntry: (entry: Omit<MoodEntry, "id" | "date" | "sentiment">) => void;
  getRecentEntries: (count: number) => MoodEntry[];
  getWeeklyMoodData: () => { date: string; mood: number }[];
  isLoading: boolean;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const useMood = () => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error("useMood must be used within a MoodProvider");
  }
  return context;
};

// Mock data
const mockMoodEntries: MoodEntry[] = [
  {
    id: "entry-1",
    date: new Date(Date.now() - 86400000 * 1).toISOString(),
    mood: 4,
    journalText: "Had a productive day at work. Completed a major project.",
    emotions: ["Satisfied", "Proud"],
    context: ["Work"],
    sentiment: "Positive",
  },
  {
    id: "entry-2",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    mood: 2,
    journalText: "Feeling overwhelmed with my workload today.",
    emotions: ["Stressed", "Anxious"],
    context: ["Work"],
    sentiment: "Negative",
  },
  {
    id: "entry-3",
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    mood: 5,
    journalText: "Went hiking with friends. Perfect weather and views!",
    emotions: ["Happy", "Energetic"],
    context: ["Social", "Nature"],
    sentiment: "Positive",
  },
  {
    id: "entry-4",
    date: new Date(Date.now() - 86400000 * 4).toISOString(),
    mood: 3,
    journalText: "Just an ordinary day. Nothing special happened.",
    emotions: ["Neutral"],
    context: ["Routine"],
    sentiment: "Neutral",
  },
  {
    id: "entry-5",
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    mood: 1,
    journalText: "Got into an argument with my roommate. Feeling upset.",
    emotions: ["Angry", "Sad"],
    context: ["Home", "Conflict"],
    sentiment: "Negative",
  },
  {
    id: "entry-6",
    date: new Date(Date.now() - 86400000 * 6).toISOString(),
    mood: 3,
    journalText: "Watched a new movie that was just okay.",
    emotions: ["Content"],
    context: ["Entertainment"],
    sentiment: "Neutral",
  },
  {
    id: "entry-7",
    date: new Date(Date.now() - 86400000 * 7).toISOString(),
    mood: 4,
    journalText: "Had dinner with family. Nice to catch up with everyone.",
    emotions: ["Happy", "Grateful"],
    context: ["Family", "Social"],
    sentiment: "Positive",
  },
];

export const MoodProvider = ({ children }: { children: ReactNode }) => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMoodData = async () => {
      try {
        // In a real app, this would fetch from an API
        const storedEntries = localStorage.getItem("emotiq-mood-entries");
        if (storedEntries) {
          setMoodEntries(JSON.parse(storedEntries));
        } else {
          // Use mock data for demo
          setMoodEntries(mockMoodEntries);
          localStorage.setItem("emotiq-mood-entries", JSON.stringify(mockMoodEntries));
        }
      } catch (error) {
        console.error("Failed to load mood entries:", error);
        toast.error("Failed to load your mood data");
      } finally {
        setIsLoading(false);
      }
    };

    loadMoodData();
  }, []);

  const addMoodEntry = (entry: Omit<MoodEntry, "id" | "date" | "sentiment">) => {
    try {
      // Simple sentiment analysis based on mood rating
      let sentiment: "Positive" | "Neutral" | "Negative";
      if (entry.mood >= 4) sentiment = "Positive";
      else if (entry.mood <= 2) sentiment = "Negative";
      else sentiment = "Neutral";

      const newEntry: MoodEntry = {
        id: `entry-${Date.now()}`,
        date: new Date().toISOString(),
        mood: entry.mood,
        journalText: entry.journalText,
        emotions: entry.emotions,
        context: entry.context,
        sentiment,
      };

      const updatedEntries = [newEntry, ...moodEntries];
      setMoodEntries(updatedEntries);
      localStorage.setItem("emotiq-mood-entries", JSON.stringify(updatedEntries));
      toast.success("Entry added successfully!");
      return newEntry;
    } catch (error) {
      console.error("Failed to add mood entry:", error);
      toast.error("Failed to save your entry");
      throw error;
    }
  };

  const getRecentEntries = (count: number) => {
    return moodEntries.slice(0, count);
  };

  const getWeeklyMoodData = () => {
    const today = new Date();
    const weeklyData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      // Find entry for this day or use default
      const entry = moodEntries.find(
        (e) => e.date.split('T')[0] === dateString
      );

      weeklyData.push({
        date: dateString,
        mood: entry ? entry.mood : 0,
      });
    }

    return weeklyData;
  };

  const value = {
    moodEntries,
    addMoodEntry,
    getRecentEntries,
    getWeeklyMoodData,
    isLoading,
  };

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
};
