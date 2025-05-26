
import { useState } from "react";
import { format } from "date-fns";
import Layout from "@/components/layout/Layout";
import { useMood } from "@/contexts/MoodContext";

const moodEmojis = ["😢", "😔", "😐", "🙂", "😄"];

const History = () => {
  const { moodEntries } = useMood();
  const [filter, setFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  
  // Filter entries by emotion and date
  const filteredEntries = moodEntries.filter(entry => {
    // Filter by emotion
    if (filter !== "all") {
      if (!entry.emotions.includes(filter)) {
        return false;
      }
    }
    
    // Filter by date range
    if (dateRange !== "all") {
      const entryDate = new Date(entry.date);
      const today = new Date();
      
      if (dateRange === "week") {
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);
        return entryDate >= lastWeek;
      }
      
      if (dateRange === "month") {
        const lastMonth = new Date();
        lastMonth.setMonth(today.getMonth() - 1);
        return entryDate >= lastMonth;
      }
    }
    
    return true;
  });
  
  // Get unique emotions from all entries
  const allEmotions = Array.from(
    new Set(moodEntries.flatMap(entry => entry.emotions))
  ).sort();
  
  return (
    <Layout>
      <div className="space-y-6 pb-6">
        <h1 className="text-2xl font-semibold">History</h1>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            className={`whitespace-nowrap px-3 py-1 rounded-full text-sm ${
              filter === "all" 
                ? "bg-emotiq-lavender text-emotiq-text-dark" 
                : "bg-gray-100 text-emotiq-text-dark/70"
            }`}
            onClick={() => setFilter("all")}
          >
            All Emotions
          </button>
          
          {allEmotions.map(emotion => (
            <button
              key={emotion}
              className={`whitespace-nowrap px-3 py-1 rounded-full text-sm ${
                filter === emotion
                  ? "bg-emotiq-lavender text-emotiq-text-dark"
                  : "bg-gray-100 text-emotiq-text-dark/70"
              }`}
              onClick={() => setFilter(emotion)}
            >
              {emotion}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2 mb-4">
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              dateRange === "all"
                ? "bg-emotiq-sky text-emotiq-text-dark"
                : "bg-gray-100 text-emotiq-text-dark/70"
            }`}
            onClick={() => setDateRange("all")}
          >
            All Time
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              dateRange === "week"
                ? "bg-emotiq-sky text-emotiq-text-dark"
                : "bg-gray-100 text-emotiq-text-dark/70"
            }`}
            onClick={() => setDateRange("week")}
          >
            Last Week
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              dateRange === "month"
                ? "bg-emotiq-sky text-emotiq-text-dark"
                : "bg-gray-100 text-emotiq-text-dark/70"
            }`}
            onClick={() => setDateRange("month")}
          >
            Last Month
          </button>
        </div>
        
        <div className="space-y-4">
          {filteredEntries.length > 0 ? (
            filteredEntries.map(entry => (
              <div key={entry.id} className="emotiq-card">
                <div className="flex items-start">
                  <div className="text-3xl mr-3">{moodEmojis[entry.mood - 1]}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-medium">
                        {format(new Date(entry.date), "MMM d, yyyy • h:mm a")}
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
                    <p className="text-emotiq-text-dark/90 my-3">
                      {entry.journalText}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {entry.emotions.map(emotion => (
                        <span
                          key={emotion}
                          className="bg-emotiq-lavender/30 px-2 py-0.5 rounded-full text-xs"
                        >
                          {emotion}
                        </span>
                      ))}
                      
                      {entry.context.map(context => (
                        <span
                          key={context}
                          className="bg-emotiq-sky/30 px-2 py-0.5 rounded-full text-xs"
                        >
                          {context}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="emotiq-card text-center py-8 text-emotiq-text-dark/70">
              <p>No entries match your filters</p>
              <button
                className="mt-2 text-sm underline"
                onClick={() => {
                  setFilter("all");
                  setDateRange("all");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default History;
