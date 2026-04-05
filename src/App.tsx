import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  User, 
  Heart, 
  Zap, 
  ChevronRight, 
  Copy, 
  Check,
  RefreshCw,
  Info,
  ShieldCheck,
  Crown
} from 'lucide-react';
import { generateReplies, DatingReplyResponse } from './services/gemini';
import Markdown from 'react-markdown';

const TONES = [
  { id: 'stoic', label: 'Stoic', icon: ShieldCheck },
  { id: 'charming', label: 'Charming', icon: Crown },
  { id: 'playful', label: 'Playful', icon: Sparkles },
  { id: 'flirty', label: 'Flirty', icon: Heart },
  { id: 'direct', label: 'Direct', icon: Zap },
  { id: 'elegant', label: 'Elegant', icon: User },
];

export default function App() {
  const [appName, setAppName] = useState('');
  const [matchMessage, setMatchMessage] = useState('');
  const [relationshipGoal, setRelationshipGoal] = useState('');
  const [selectedTone, setSelectedTone] = useState('stoic');
  const [isShorter, setIsShorter] = useState(false);
  const [isBolder, setIsBolder] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DatingReplyResponse | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!matchMessage.trim()) return;
    
    setIsLoading(true);
    try {
      const data = await generateReplies({
        appName,
        matchMessage,
        relationshipGoal,
        tone: selectedTone,
        isShorter,
        isBolder
      });
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-dark-slate selection:bg-gold/30">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
              <Crown className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold gold-gradient tracking-tight">The Stoic Suitor</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-mono">Polished Dating Assistant</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-gold/50" /> Respectful</span>
            <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-gold/50" /> Charming</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-8">
            <section className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-gold" />
                  The Match's Message
                </label>
                <textarea 
                  value={matchMessage}
                  onChange={(e) => setMatchMessage(e.target.value)}
                  placeholder="Paste their message or a profile prompt here..."
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all resize-none placeholder:text-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-500 uppercase tracking-wider">App Name</label>
                  <input 
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="Hinge, Bumble..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-gold outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-500 uppercase tracking-wider">Your Goal</label>
                  <input 
                    type="text"
                    value={relationshipGoal}
                    onChange={(e) => setRelationshipGoal(e.target.value)}
                    placeholder="A date, casual..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-gold outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-mono text-slate-500 uppercase tracking-wider">Desired Vibe</label>
                <div className="grid grid-cols-3 gap-2">
                  {TONES.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => setSelectedTone(tone.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                        selectedTone === tone.id 
                        ? 'bg-gold/10 border-gold text-gold shadow-[0_0_15px_rgba(197,160,89,0.1)]' 
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <tone.icon className="w-5 h-5 mb-1.5" />
                      <span className="text-[10px] font-medium uppercase tracking-tighter">{tone.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button 
                  onClick={() => setIsShorter(!isShorter)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                    isShorter ? 'bg-white/10 border-white/30 text-white' : 'bg-transparent border-white/10 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {isShorter && <Check className="w-3 h-3" />}
                  Make it shorter
                </button>
                <button 
                  onClick={() => setIsBolder(!isBolder)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                    isBolder ? 'bg-gold/10 border-gold/30 text-gold' : 'bg-transparent border-white/10 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {isBolder && <Check className="w-3 h-3" />}
                  Make it bolder
                </button>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isLoading || !matchMessage.trim()}
                className="w-full gold-button flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Craft Response</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </section>
          </div>

          {/* Output Section */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!result && !isLoading ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 glass-panel border-dashed border-white/5"
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <Send className="w-8 h-8 text-slate-600" />
                  </div>
                  <h3 className="text-xl font-display text-slate-300 mb-2">Awaiting your command</h3>
                  <p className="text-sm text-slate-500 max-w-xs">
                    Provide the match's message and I shall craft a response worthy of a gentleman.
                  </p>
                </motion.div>
              ) : isLoading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center p-12 glass-panel"
                >
                  <div className="relative">
                    <RefreshCw className="w-12 h-12 text-gold animate-spin" />
                    <Sparkles className="w-6 h-6 text-gold absolute -top-2 -right-2 animate-pulse" />
                  </div>
                  <p className="mt-6 text-sm font-mono text-gold/70 animate-pulse tracking-widest uppercase">
                    Refining the wit...
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  {/* Best Reply */}
                  <div className="glass-panel p-6 border-gold/30 bg-gold/[0.02]">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-bold flex items-center gap-2">
                        <Crown className="w-3 h-3" /> The Best Reply
                      </span>
                      <button 
                        onClick={() => copyToClipboard(result!.bestReply, 'best')}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-gold"
                      >
                        {copiedId === 'best' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-lg font-display italic text-white leading-relaxed">
                      "{result!.bestReply}"
                    </p>
                    
                    <div className="mt-6 pt-6 border-t border-white/5 flex gap-3">
                      <Info className="w-4 h-4 text-gold/50 shrink-0 mt-0.5" />
                      <div className="text-xs text-slate-400 leading-relaxed italic">
                        {result!.explanation}
                      </div>
                    </div>
                  </div>

                  {/* Alternates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="glass-panel p-5 hover:border-white/20 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Playful</span>
                        <button 
                          onClick={() => copyToClipboard(result!.playfulReply, 'playful')}
                          className="p-1.5 hover:bg-white/5 rounded-md transition-colors text-slate-500 hover:text-white"
                        >
                          {copiedId === 'playful' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        "{result!.playfulReply}"
                      </p>
                    </div>

                    <div className="glass-panel p-5 hover:border-white/20 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Direct</span>
                        <button 
                          onClick={() => copyToClipboard(result!.directReply, 'direct')}
                          className="p-1.5 hover:bg-white/5 rounded-md transition-colors text-slate-500 hover:text-white"
                        >
                          {copiedId === 'direct' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        "{result!.directReply}"
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center pt-4">
                    <button 
                      onClick={handleGenerate}
                      className="text-xs font-mono text-slate-500 hover:text-gold transition-colors flex items-center gap-2"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Try another variation
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-12 border-t border-white/5 text-center">
        <p className="text-xs font-mono text-slate-600 uppercase tracking-widest">
          The Stoic Suitor &copy; 2026 — Composure is the ultimate attraction.
        </p>
      </footer>
    </div>
  );
}
