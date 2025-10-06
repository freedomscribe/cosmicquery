import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card.jsx';
import { Loader2, AlertTriangle } from 'lucide-react';

export default function APODViewer() {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApod = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/nasa/apod');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setApod(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApod();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8 flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="ml-4 text-lg">Fetching the cosmos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <Card className="glass-card p-6 border-red-500/50 flex items-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mr-4" />
          <div>
            <h3 className="text-lg font-semibold text-red-400">Failed to load Picture of the Day</h3>
            <p className="text-red-300/80">Could not connect to the NASA API. Please try again later.</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!apod) return null;

  return (
    <section id="apod" className="py-12">
      <div className="w-full max-w-4xl mx-auto px-4">
        <Card className="glass-card p-6 glow-on-hover">
          <h2 className="text-3xl font-bold text-primary mb-4">Astronomy Picture of the Day</h2>
          {apod.media_type === 'image' ? (
            <img src={apod.url} alt={apod.title} className="w-full rounded-lg mb-4" />
          ) : (
            <p className="text-center mb-4">Today's APOD is a video, which can be viewed <a href={apod.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">here</a>.</p>
          )}
          <h3 className="text-2xl font-semibold text-foreground mb-2">{apod.title}</h3>
          <p className="text-card-foreground leading-relaxed">{apod.explanation}</p>
          {apod.copyright && <p className="text-sm text-muted-foreground mt-4">Image Credit & Copyright: {apod.copyright}</p>}
        </Card>
      </div>
    </section>
  );
}
