
import { useState } from "react";
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import Layout from "@/components/layout/Layout";
import { useMood } from "@/contexts/MoodContext";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const moodEmojis = ["😢", "😔", "😐", "🙂", "😄"];

const History = () => {
  const { moodEntries } = useMood();
  const [filter, setFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [viewMode, setViewMode] = useState<"chart" | "calendar" | "list">("chart");
  
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
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        return entryDate >= lastWeek;
      }
      
      if (dateRange === "month") {
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);
        return entryDate >= lastMonth;
      }
    }
    
    return true;
  });

  // Get mood trend data for the chart
  const getMoodTrendData = () => {
    const today = new Date();
    const days = dateRange === "week" ? 7 : 30;
    const trendData = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      const entry = moodEntries.find(
        (e) => e.date.split('T')[0] === dateString
      );

      trendData.push({
        date: dateString,
        mood: entry ? entry.mood : null,
        displayDate: format(date, 'MMM d'),
      });
    }

    return trendData.filter(d => d.mood !== null);
  };

  // Get calendar heatmap data
  const getCalendarHeatmapData = () => {
    const today = new Date();
    const start = startOfMonth(today);
    const end = endOfMonth(today);
    const days = eachDayOfInterval({ start, end });

    return days.map(day => {
      const entry = moodEntries.find(e => 
        isSameDay(new Date(e.date), day)
      );
      return {
        date: day,
        mood: entry?.mood || 0,
        entry: entry
      };
    });
  };

  // Get mood color for calendar heatmap
  const getMoodColor = (mood: number) => {
    if (mood === 0) return "bg-gray-100";
    if (mood === 1) return "bg-red-500";
    if (mood === 2) return "bg-orange-400";
    if (mood === 3) return "bg-yellow-400";
    if (mood === 4) return "bg-green-400";
    if (mood === 5) return "bg-green-600";
    return "bg-gray-100";
  };

  // Get entries for selected date
  const getEntriesForDate = (date: Date) => {
    return moodEntries.filter(entry => 
      isSameDay(new Date(entry.date), date)
    );
  };

  // Get unique emotions from all entries
  const allEmotions = Array.from(
    new Set(moodEntries.flatMap(entry => entry.emotions))
  ).sort();

  const trendData = getMoodTrendData();
  const calendarData = getCalendarHeatmapData();
  const selectedDateEntries = selectedDate ? getEntriesForDate(selectedDate) : [];

  const chartConfig = {
    mood: {
      label: "Mood",
      color: "#9c6dfc",
    },
  };
  
  return (
    <Layout>
      <div className="space-y-6 pb-6">
        <h1 className="text-2xl font-semibold">History</h1>
        
        {/* Filters */}
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

        {/* View Mode Tabs */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chart">Trend Chart</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="list">Entry List</TabsTrigger>
          </TabsList>

          {/* Trend Chart View */}
          <TabsContent value="chart" className="space-y-4">
            <div className="emotiq-card">
              <h2 className="text-lg font-medium mb-4">Mood Trend</h2>
              {trendData.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-64">
                  <LineChart data={trendData}>
                    <XAxis 
                      dataKey="displayDate" 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      domain={[1, 5]} 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => moodEmojis[value - 1]}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="var(--color-mood)" 
                      strokeWidth={3}
                      dot={{ fill: "var(--color-mood)", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ChartContainer>
              ) : (
                <div className="text-center py-8 text-emotiq-text-dark/70">
                  No mood data available for the selected period
                </div>
              )}
            </div>
          </TabsContent>

          {/* Calendar Heatmap View */}
          <TabsContent value="calendar" className="space-y-4">
            <div className="emotiq-card">
              <h2 className="text-lg font-medium mb-4">Monthly Mood Calendar</h2>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-xs text-center font-medium text-emotiq-text-dark/70 p-2">
                    {day}
                  </div>
                ))}
                {calendarData.map((day, index) => (
                  <button
                    key={index}
                    className={`aspect-square rounded-lg border-2 transition-all ${
                      getMoodColor(day.mood)
                    } ${
                      selectedDate && isSameDay(day.date, selectedDate)
                        ? "border-emotiq-lavender scale-110"
                        : "border-transparent hover:border-emotiq-lavender/50"
                    }`}
                    onClick={() => setSelectedDate(day.date)}
                  >
                    <div className="text-xs font-medium">
                      {day.date.getDate()}
                    </div>
                    {day.mood > 0 && (
                      <div className="text-xs">
                        {moodEmojis[day.mood - 1]}
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-center gap-2 text-xs">
                <span className="text-emotiq-text-dark/70">Less</span>
                {[1, 2, 3, 4, 5].map(mood => (
                  <div key={mood} className={`w-3 h-3 rounded ${getMoodColor(mood)}`} />
                ))}
                <span className="text-emotiq-text-dark/70">More</span>
              </div>
            </div>

            {/* Selected Date Entries */}
            {selectedDate && selectedDateEntries.length > 0 && (
              <div className="emotiq-card">
                <h3 className="text-lg font-medium mb-4">
                  Entries for {format(selectedDate, "MMMM d, yyyy")}
                </h3>
                <div className="space-y-3">
                  {selectedDateEntries.map(entry => (
                    <div key={entry.id} className="flex items-start p-3 bg-emotiq-lavender-light rounded-lg">
                      <div className="text-2xl mr-3">{moodEmojis[entry.mood - 1]}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="font-medium">
                            {format(new Date(entry.date), "h:mm a")}
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
                        <p className="text-sm text-emotiq-text-dark/80 mt-1">
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
              </div>
            )}
          </TabsContent>

          {/* Entry List View */}
          <TabsContent value="list" className="space-y-4">
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
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default History;
