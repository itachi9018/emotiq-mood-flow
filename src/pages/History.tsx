
import { useState } from "react";
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import Layout from "@/components/layout/Layout";
import { useMood } from "@/contexts/MoodContext";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccessibleButton } from "@/components/ui/accessible-button";

const moodEmojis = ["😢", "😔", "😐", "🙂", "😄"];
const moodLabels = ["Very Sad", "Sad", "Neutral", "Happy", "Very Happy"];

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
        <header>
          <h1 className="text-2xl font-semibold">Mood History</h1>
          <p className="text-sm text-emotiq-text-dark/70 mt-1">Track your emotional journey over time</p>
        </header>
        
        {/* Emotion Filters */}
        <section aria-labelledby="emotion-filters-heading">
          <h2 id="emotion-filters-heading" className="sr-only">Filter by emotions</h2>
          <div className="flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Emotion filters">
            <AccessibleButton
              variant={filter === "all" ? "filter-active" : "filter-inactive"}
              onClick={() => setFilter("all")}
              ariaLabel="Show all emotions"
            >
              All Emotions
            </AccessibleButton>
            
            {allEmotions.map(emotion => (
              <AccessibleButton
                key={emotion}
                variant={filter === emotion ? "filter-active" : "filter-inactive"}
                onClick={() => setFilter(emotion)}
                ariaLabel={`Filter by ${emotion} emotion`}
              >
                {emotion}
              </AccessibleButton>
            ))}
          </div>
        </section>
        
        {/* Date Range Filters */}
        <section aria-labelledby="date-filters-heading">
          <h2 id="date-filters-heading" className="sr-only">Filter by date range</h2>
          <div className="flex gap-2 mb-4" role="group" aria-label="Date range filters">
            <AccessibleButton
              variant={dateRange === "all" ? "filter-active" : "filter-inactive"}
              onClick={() => setDateRange("all")}
              ariaLabel="Show all time periods"
            >
              All Time
            </AccessibleButton>
            <AccessibleButton
              variant={dateRange === "week" ? "filter-active" : "filter-inactive"}
              onClick={() => setDateRange("week")}
              ariaLabel="Show last week only"
            >
              Last Week
            </AccessibleButton>
            <AccessibleButton
              variant={dateRange === "month" ? "filter-active" : "filter-inactive"}
              onClick={() => setDateRange("month")}
              ariaLabel="Show last month only"
            >
              Last Month
            </AccessibleButton>
          </div>
        </section>

        {/* View Mode Tabs */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3" aria-label="View mode selection">
            <TabsTrigger value="chart" aria-label="View mood trend chart">Trend Chart</TabsTrigger>
            <TabsTrigger value="calendar" aria-label="View calendar heatmap">Calendar View</TabsTrigger>
            <TabsTrigger value="list" aria-label="View entry list">Entry List</TabsTrigger>
          </TabsList>

          {/* Trend Chart View */}
          <TabsContent value="chart" className="space-y-4">
            <div className="emotiq-card">
              <h2 className="text-lg font-medium mb-4">Mood Trend Over Time</h2>
              {trendData.length > 0 ? (
                <div role="img" aria-label="Mood trend chart showing daily mood scores">
                  <ChartContainer config={chartConfig} className="h-64">
                    <LineChart data={trendData}>
                      <XAxis 
                        dataKey="displayDate" 
                        tick={{ fontSize: 12 }}
                        aria-label="Date"
                      />
                      <YAxis 
                        domain={[1, 5]} 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => moodEmojis[value - 1]}
                        aria-label="Mood level"
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value) => [`${moodEmojis[value - 1]} ${moodLabels[value - 1]}`, "Mood"]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="mood" 
                        stroke="var(--color-mood)" 
                        strokeWidth={3}
                        dot={{ fill: "var(--color-mood)", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              ) : (
                <div className="text-center py-8 text-emotiq-text-dark/70">
                  <p>No mood data available for the selected period</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Calendar Heatmap View */}
          <TabsContent value="calendar" className="space-y-4">
            <div className="emotiq-card">
              <h2 className="text-lg font-medium mb-4">Monthly Mood Calendar</h2>
              <div className="grid grid-cols-7 gap-2 mb-4" role="grid" aria-label="Mood calendar">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-xs text-center font-medium text-emotiq-text-dark/70 p-2" role="columnheader">
                    {day}
                  </div>
                ))}
                {calendarData.map((day, index) => (
                  <button
                    key={index}
                    className={`emotiq-calendar-day ${getMoodColor(day.mood)} ${
                      selectedDate && isSameDay(day.date, selectedDate)
                        ? "emotiq-calendar-day-selected"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedDate(day.date)}
                    aria-label={
                      day.mood > 0 
                        ? `${format(day.date, 'MMMM d')}, mood: ${moodLabels[day.mood - 1]}`
                        : `${format(day.date, 'MMMM d')}, no mood entry`
                    }
                    role="gridcell"
                  >
                    <div className="text-xs font-medium">
                      {format(day.date, 'd')}
                    </div>
                    {day.mood > 0 && (
                      <div className="text-xs" aria-hidden="true">
                        {moodEmojis[day.mood - 1]}
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-center gap-2 text-xs" role="group" aria-label="Mood intensity legend">
                <span className="text-emotiq-text-dark/70">Less intense</span>
                {[1, 2, 3, 4, 5].map(mood => (
                  <div 
                    key={mood} 
                    className={`w-3 h-3 rounded ${getMoodColor(mood)}`}
                    aria-label={moodLabels[mood - 1]}
                  />
                ))}
                <span className="text-emotiq-text-dark/70">More intense</span>
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
                    <article key={entry.id} className="flex items-start p-3 bg-emotiq-lavender-light rounded-lg">
                      <div className="text-2xl mr-3" aria-hidden="true">{moodEmojis[entry.mood - 1]}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="font-medium">
                            <time dateTime={entry.date}>
                              {format(new Date(entry.date), "h:mm a")}
                            </time>
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
                          <div className="flex gap-1 mt-2 flex-wrap" role="list" aria-label="Emotions">
                            {entry.emotions.map(emotion => (
                              <span key={emotion} className="text-xs bg-emotiq-lavender/40 px-2 py-0.5 rounded-full">
                                {emotion}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Entry List View */}
          <TabsContent value="list" className="space-y-4">
            <div className="space-y-4">
              {filteredEntries.length > 0 ? (
                <div role="feed" aria-label="Mood entries">
                  {filteredEntries.map(entry => (
                    <article key={entry.id} className="emotiq-card">
                      <div className="flex items-start">
                        <div className="text-3xl mr-3" aria-hidden="true">{moodEmojis[entry.mood - 1]}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="font-medium">
                              <time dateTime={entry.date}>
                                {format(new Date(entry.date), "MMM d, yyyy • h:mm a")}
                              </time>
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
                    </article>
                  ))}
                </div>
              ) : (
                <div className="emotiq-card text-center py-8 text-emotiq-text-dark/70">
                  <p>No entries match your current filters</p>
                  <AccessibleButton
                    variant="accent"
                    className="mt-2 text-sm underline"
                    onClick={() => {
                      setFilter("all");
                      setDateRange("all");
                    }}
                    ariaLabel="Clear all filters and show all entries"
                  >
                    Clear filters
                  </AccessibleButton>
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
