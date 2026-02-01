'use client';

import { useState, useEffect, useRef } from 'react';
import { generateStory } from '@/lib/gemini';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Moon, Star, Sparkles, BookOpen, Volume2, Truck, Cat, Rocket, Castle, Music, VolumeX, Pause, Play, User, X } from 'lucide-react';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [childName, setChildName] = useState('Yorgen');
  const [story, setStory] = useState<{ title: string; content: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [speechAudio, setSpeechAudio] = useState<HTMLAudioElement | null>(null);
  
  // Background music
  useEffect(() => {
    audioRef.current = new Audio('/lullaby.mp3'); 
    audioRef.current.loop = true;
    audioRef.current.volume = 0.15;
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isMusicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play failed", e));
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  const handleGenerate = async (selectedTopic: string) => {
    setLoading(true);
    setStory(null);
    setImageUrl(null);
    
    // Stop any playing audio when generating new story
    if (speechAudio) {
        speechAudio.pause();
        setSpeechAudio(null);
        setIsSpeaking(false);
    }
    window.speechSynthesis.cancel();
    
    const safeTopic = encodeURIComponent(selectedTopic);
    const generatedImage = `https://image.pollinations.ai/prompt/cute%20gentle%20${safeTopic}%20children%20book%20illustration?width=800&height=400&nologo=true&seed=${Math.random()}`;

    try {
      const result = await generateStory(selectedTopic, childName);
      setStory(result);
      setImageUrl(generatedImage);
    } catch (error) {
      alert("Oops! The magic wand broke. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = async () => {
    if (!story) return;

    // If currently speaking, pause/stop
    if (isSpeaking) {
      if (speechAudio) {
        speechAudio.pause();
        setIsSpeaking(false);
      }
      return;
    }

    // If we already have the audio object (paused), resume it
    if (speechAudio) {
        speechAudio.play();
        setIsSpeaking(true);
        return;
    }

    // Using a direct TTS API call for 'Aimee' (ElevenLabs via proxy or similar high-quality service)
    // NOTE: Direct ElevenLabs client-side requires an API key in the frontend which is risky.
    // For this demo, we will use a server action or a safer proxy in a real app.
    // However, to use the specific "Aimee" voice ID provided (zA6D7RyKdc2EClouEMkP),
    // we need to call the ElevenLabs API.
    
    // IMPORTANT: In a production app, move this fetch to a server-side API route (pages/api/speak.ts)
    // to hide your ElevenLabs API Key. for local dev/demo, we can do it here if you provide the key.
    
    // Falling back to browser TTS if no ElevenLabs key is present, but configured for the specific request:
    alert("To use the premium 'Aimee' voice, we need to connect an ElevenLabs API Key! For now, I'll use the best available system voice.");
    
    // Fallback to standard browser TTS for now until we add the ElevenLabs logic
    const utterance = new SpeechSynthesisUtterance(`${story.title}. ${story.content}`);
    utterance.rate = 0.9; 
    const voices = window.speechSynthesis.getVoices();
    // Try to match closest to 'Aimee' description (Soft, ASMR-like)
    const preferredVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Samantha"));
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-[#1a1c2e] to-[#050505] text-white p-4 md:p-8 flex flex-col items-center justify-center font-sans relative overflow-hidden transition-all">
      {/* ... (UI code remains the same for brevity, will re-insert if full file rewrite is needed) ... */}
      
      {/* Background FX */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[15%] text-yellow-200/40 animate-bounce duration-[3000ms]"><Star size={32} fill="currentColor" /></div>
          <div className="absolute top-[30%] right-[10%] text-blue-200/30 animate-pulse duration-[5000ms]"><Star size={24} fill="currentColor" /></div>
          <div className="absolute top-[15%] right-[25%] text-white/10 animate-spin-slow"><Sparkles size={48} /></div>
      </div>

      {/* Header */}
      <header className="relative z-10 text-center mb-8 w-full max-w-2xl flex flex-col items-center">
        <div className="flex items-center justify-between w-full mb-4 px-2">
            <div className="w-10"></div>
            <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-pink-300 to-purple-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] flex items-center gap-3">
            <Moon className="text-yellow-100 fill-yellow-100 drop-shadow-lg" size={40} />
            {childName}'s Stories
            </h1>
            <Button onClick={toggleMusic} variant="ghost" size="icon" className="rounded-full bg-white/10 hover:bg-white/20 text-blue-200 backdrop-blur-sm">
                {isMusicPlaying ? <Volume2 className="animate-pulse" /> : <VolumeX />}
            </Button>
        </div>
      </header>

      <div className="w-full max-w-3xl z-10 space-y-8 pb-20">
        
        {/* Name Input */}
        {!story && (
          <div className="flex justify-center mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="relative w-full max-w-xs">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-200/50" size={20} />
                <Input 
                  className="bg-white/5 border-white/10 text-center text-xl h-12 rounded-full pl-10 focus-visible:ring-blue-400 focus-visible:border-blue-400"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Enter child's name..."
                />
             </div>
          </div>
        )}

        {/* Topic Selector */}
        {!story && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Button onClick={() => handleGenerate("Jungle Adventure with friendly animals")} className="h-36 md:h-40 relative group overflow-hidden border-2 border-green-500/50 rounded-3xl bg-gradient-to-br from-green-600 to-emerald-900 hover:from-green-500 hover:to-emerald-800 transition-all hover:scale-105 shadow-lg shadow-green-900/50">
              <div className="relative z-10 flex flex-col items-center gap-3"><Cat size={40} /> <span className="text-xl font-bold">Jungle</span></div>
            </Button>
            <Button onClick={() => handleGenerate("Big Trucks and Construction Sites")} className="h-36 md:h-40 relative group overflow-hidden border-2 border-orange-500/50 rounded-3xl bg-gradient-to-br from-orange-500 to-red-900 hover:from-orange-400 hover:to-red-800 transition-all hover:scale-105 shadow-lg shadow-orange-900/50">
              <div className="relative z-10 flex flex-col items-center gap-3"><Truck size={40} /> <span className="text-xl font-bold">Trucks</span></div>
            </Button>
            <Button onClick={() => handleGenerate("Space Journey to the Moon")} className="h-36 md:h-40 relative group overflow-hidden border-2 border-indigo-500/50 rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-900 hover:from-indigo-500 hover:to-blue-800 transition-all hover:scale-105 shadow-lg shadow-indigo-900/50">
              <div className="relative z-10 flex flex-col items-center gap-3"><Rocket size={40} /> <span className="text-xl font-bold">Space</span></div>
            </Button>
            <Button onClick={() => handleGenerate("Magical Castles and Dragons")} className="h-36 md:h-40 relative group overflow-hidden border-2 border-pink-500/50 rounded-3xl bg-gradient-to-br from-pink-600 to-purple-900 hover:from-pink-500 hover:to-purple-800 transition-all hover:scale-105 shadow-lg shadow-pink-900/50">
              <div className="relative z-10 flex flex-col items-center gap-3"><Castle size={40} /> <span className="text-xl font-bold">Castles</span></div>
            </Button>
          </div>
        )}

        {/* Custom Input */}
        {!story && (
          <div className="flex flex-col md:flex-row gap-3 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-100 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-sm">
            <Input 
              placeholder="✨ Or type a magic idea... (e.g. A brave little toaster)" 
              className="bg-transparent border-none text-white placeholder:text-blue-200/50 h-14 rounded-xl text-lg px-4"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && topic && handleGenerate(topic)}
            />
            <Button onClick={() => topic && handleGenerate(topic)} disabled={!topic || loading} className="h-14 px-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg">
              {loading ? <Sparkles className="animate-spin" /> : "Create"}
            </Button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-20 flex flex-col items-center gap-6 animate-pulse">
            <Sparkles size={64} className="text-yellow-200 animate-spin-slow" />
            <p className="text-2xl font-medium text-blue-200">Writing a story for {childName}... ✨</p>
          </div>
        )}

        {/* Story Display */}
        {story && (
          <Card className="bg-black/60 border-white/10 backdrop-blur-xl shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 rounded-3xl overflow-hidden ring-1 ring-white/20">
            {/* AI Generated Image Header */}
            {imageUrl && (
                <div className="w-full h-64 relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                        src={imageUrl} 
                        alt="Story cover" 
                        className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                </div>
            )}
            
            <CardHeader className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-b border-white/5 p-6 text-center relative -mt-20 z-10">
              <CardTitle className="text-3xl md:text-4xl font-serif text-white drop-shadow-lg flex flex-col items-center justify-center gap-2">
                {story.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-10 pt-4">
              <div className="prose prose-invert prose-lg max-w-none text-lg md:text-xl leading-relaxed text-blue-50/90 font-serif">
                {story.content.split('\n').map((paragraph, i) => (
                  paragraph.trim() && <p key={i} className="mb-6 first-letter:text-3xl first-letter:font-bold first-letter:text-yellow-200">{paragraph}</p>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/10 justify-center mt-4">
                <Button onClick={handleSpeak} variant="outline" className={`h-14 px-8 rounded-full border-2 text-lg font-medium ${isSpeaking ? 'bg-red-500/20 border-red-500/50 text-red-200' : 'border-blue-400/30 text-blue-200'}`}>
                  {isSpeaking ? <Pause className="mr-2" /> : <Play className="mr-2 fill-current" />}
                  {isSpeaking ? "Pause Reading" : "Read to Me"}
                </Button>

                <Button onClick={() => { setStory(null); setTopic(''); window.speechSynthesis.cancel(); setIsSpeaking(false); }} className="h-14 px-8 rounded-full bg-white/10 hover:bg-white/20 text-white text-lg font-medium">
                  ✨ Make Another
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
