import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useMood } from "@/contexts/MoodContext";
import { toast } from "sonner";

const moodEmojis = ["😢", "😔", "😐", "🙂", "😄"];

const emotionOptions = [
  "Happy", "Calm", "Excited", "Grateful", "Proud",
  "Sad", "Anxious", "Angry", "Stressed", "Overwhelmed",
  "Content", "Hopeful", "Bored", "Tired", "Confused"
];

const contextOptions = [
  "Work", "Family", "Friends", "Health", "Self-care",
  "Social", "Home", "Nature", "Entertainment", "Learning",
  "Travel", "Finances", "Conflict", "Relationship", "Routine"
];

const Journal = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { addMoodEntry } = useMood();
  
  const initialMood = state?.initialMood || null;
  
  const [mood, setMood] = useState<number>(initialMood || 3);
  const [journalText, setJournalText] = useState("");
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedContexts, setSelectedContexts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentiment, setSentiment] = useState<string | null>(null);
  
  // Simple sentiment analysis based on words and length
  useEffect(() => {
    if (journalText.length > 10) {
      const positiveWords = ['happy', 'great', 'good', 'joy', 'excited', 'love', 'wonderful'];
      const negativeWords = ['sad', 'bad', 'angry', 'upset', 'terrible', 'hurt', 'worried'];
      
      const text = journalText.toLowerCase();
      const positiveCount = positiveWords.filter(word => text.includes(word)).length;
      const negativeCount = negativeWords.filter(word => text.includes(word)).length;
      
      if (positiveCount > negativeCount) {
        setSentiment("You sound positive 😊");
      } else if (negativeCount > positiveCount) {
        setSentiment("You sound concerned 😔");
      } else {
        setSentiment("You sound reflective 🤔");
      }
    } else {
      setSentiment(null);
    }
  }, [journalText]);
  
  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };
  
  const toggleContext = (context: string) => {
    setSelectedContexts(prev =>
      prev.includes(context)
        ? prev.filter(c => c !== context)
        : [...prev, context]
    );
  };
  
  const handleSubmit = async () => {
    if (!journalText.trim()) {
      toast.error("Please write something in your journal");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await addMoodEntry({
        mood,
        journalText,
        emotions: selectedEmotions,
        context: selectedContexts,
      });
      navigate("/emotiq-mood-flow/dashboard");
    } catch (error) {
      console.error("Failed to save journal entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6 pb-6">
        <h1 className="text-2xl font-semibold">Journal Entry</h1>
        
        <div className="emotiq-card">
          <h2 className="text-lg font-medium mb-4">How are you feeling?</h2>
          <div className="flex justify-between mb-6">
            {moodEmojis.map((emoji, index) => (
              <button
                key={index}
                className={`text-3xl p-2 rounded-full transition-transform ${
                  mood === index + 1 
                    ? "bg-emotiq-lavender transform scale-110" 
                    : "hover:scale-105"
                }`}
                onClick={() => setMood(index + 1)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
        
        <div className="emotiq-card">
          <h2 className="text-lg font-medium mb-4">Write about your day</h2>
          <textarea
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="How was your day? What's on your mind?"
            className="emotiq-input min-h-32 resize-none"
            rows={5}
          ></textarea>
          
          {sentiment && (
            <div className="mt-3 text-sm p-3 bg-emotiq-lavender-light rounded-lg">
              {sentiment}
            </div>
          )}
        </div>
        
        <div className="emotiq-card">
          <h2 className="text-lg font-medium mb-4">Emotions you're feeling</h2>
          <div className="flex flex-wrap gap-2">
            {emotionOptions.map(emotion => (
              <button
                key={emotion}
                onClick={() => toggleEmotion(emotion)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedEmotions.includes(emotion)
                    ? "bg-emotiq-lavender text-emotiq-text-dark"
                    : "bg-gray-100 text-emotiq-text-dark/70"
                }`}
              >
                {emotion}
              </button>
            ))}
          </div>
        </div>
        
        <div className="emotiq-card">
          <h2 className="text-lg font-medium mb-4">Context tags</h2>
          <div className="flex flex-wrap gap-2">
            {contextOptions.map(context => (
              <button
                key={context}
                onClick={() => toggleContext(context)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedContexts.includes(context)
                    ? "bg-emotiq-sky text-emotiq-text-dark"
                    : "bg-gray-100 text-emotiq-text-dark/70"
                }`}
              >
                {context}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="flex-1 py-3 rounded-full border border-emotiq-lavender/30 hover:bg-emotiq-lavender/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 emotiq-btn-primary"
          >
            {isSubmitting ? "Saving..." : "Save Entry"}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Journal;
