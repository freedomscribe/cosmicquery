import { useState } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Card } from '@/components/ui/card.jsx';

export default function QueryInterface() {
  const [query, setQuery] = useState('');
  const [responses, setResponses] = useState([
    {
      id: 1,
      question: "What is a black hole?",
      answer: "A black hole is a region of spacetime where gravity is so strong that nothing, not even light, can escape from it. They form when massive stars collapse at the end of their life cycles. The boundary of a black hole is called the event horizon.",
      image: null
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const newResponse = {
        id: responses.length + 1,
        question: query,
        answer: data.answer,
        image: null // We can add image fetching later
      };

      setResponses([newResponse, ...responses]);
      setQuery('');
    } catch (error) {
      console.error("Failed to fetch AI response:", error);
      alert("Sorry, I couldn't connect to the cosmos. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="glass-card p-6 mb-6 fade-in">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Ask the Cosmos</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What mysteries of the universe would you like to explore?"
            className="flex-1 bg-input border-border text-foreground placeholder:text-muted-foreground"
            disabled={loading}
          />
          <Button 
            type="submit" 
            className="cosmic-button"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setQuery("What is the Andromeda Galaxy?")}
            className="px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Andromeda Galaxy
          </button>
          <button
            onClick={() => setQuery("How do black holes form?")}
            className="px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Black Holes
          </button>
          <button
            onClick={() => setQuery("What is dark matter?")}
            className="px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Dark Matter
          </button>
          <button
            onClick={() => setQuery("When is the next meteor shower?")}
            className="px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Meteor Showers
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {responses.map((response, index) => (
          <Card 
            key={response.id} 
            className="glass-card p-6 glow-on-hover fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-primary mb-2">
                Q: {response.question}
              </h3>
              <p className="text-card-foreground leading-relaxed">
                {response.answer}
              </p>
            </div>
            
            {response.image && (
              <div className="mt-4">
                <img 
                  src={response.image} 
                  alt="NASA Astronomy" 
                  className="w-full rounded-lg"
                />
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
