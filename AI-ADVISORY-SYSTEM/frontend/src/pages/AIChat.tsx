import React, { useState, useEffect, useRef, useContext } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Card from '../components/ui/Card';
import GlassCard from '../components/ui/GlassCard';
import {
  MessageSquare,
  Send,
  Plus,
  Trash2,
  Copy,
  Share2,
  Search,
  Sparkles,
  Check,
  User
} from 'lucide-react';

interface ChatMessageType {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  _id?: string;
}

interface ChatSessionType {
  _id: string;
  title: string;
  language: string;
  updatedAt: string;
}

export const AIChat: React.FC = () => {
  const { t, language } = useTranslation();
  const authContext = useContext(AuthContext);

  const [chats, setChats] = useState<ChatSessionType[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const preferredLanguage = authContext?.profile?.preferredLanguage || 'en';

  // Load chat session list
  const fetchChats = async () => {
    try {
      const res = await api.get('/ai/chats');
      if (res.data.success) {
        setChats(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to load chat history');
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Load active chat messages
  const loadChat = async (id: string) => {
    try {
      setLoading(true);
      const res = await api.get(`/ai/chats/${id}`);
      if (res.data.success) {
        setMessages(res.data.data.messages);
        setActiveChatId(id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Start a new chat session
  const startNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setQuery('');
  };

  // Delete chat session
  const handleDeleteChat = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await api.delete(`/ai/chats/${id}`);
      if (res.data.success) {
        if (activeChatId === id) {
          startNewChat();
        }
        fetchChats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userMessage = query.trim();
    setQuery('');
    
    // Add user message immediately to the UI
    setMessages((prev) => [...prev, { role: 'user', content: userMessage, timestamp: new Date().toISOString() }]);
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        query: userMessage,
        chatId: activeChatId,
      });

      if (res.data.success) {
        setMessages(res.data.chat.messages);
        setActiveChatId(res.data.chatId);
        fetchChats();
      }
    } catch (err) {
      console.error(err);
      // Append offline failure warning
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: 'I encountered a connection issue. Please check your internet connection or verify your Gemini API key in configuration settings.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Copy reply to clipboard
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(id);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  // Share response
  const handleShareText = (text: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'HarvestIQ Farming Advisory',
        text: text,
      }).catch((err) => console.log('Error sharing', err));
    } else {
      navigator.clipboard.writeText(text);
      alert('Content copied to clipboard for sharing!');
    }
  };

  const filteredChats = chats.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Suggestions depending on preferred language
  const quickPrompts: Record<string, string[]> = {
    en: [
      'Which crop should I grow in alluvial soil?',
      'How to organically control whitefly pests?',
      'What is the ideal NPK ratio for tomato?',
      'Best practice for drip irrigation in clayey soil'
    ],
    hi: [
      'जलोढ़ मिट्टी में मुझे कौन सी फसल उगानी चाहिए?',
      'सफेद मक्खी कीट को जैविक रूप से कैसे नियंत्रित करें?',
      'टमाटर के लिए आदर्श एनपीके अनुपात क्या है?',
      'चिकनी मिट्टी में ड्रिप सिंचाई की सर्वोत्तम विधि'
    ],
    ta: [
      'வண்டல் மண்ணில் நான் எந்தப் பயிரை வளர்க்க வேண்டும்?',
      'வெள்ளை ஈ பூச்சிகளை இயற்கையாக கட்டுப்படுத்துவது எப்படி?',
      'தக்காளிக்கு உகந்த NPK விகிதம் என்ன?',
      'களிமண்ணில் சொட்டு நீர் பாசனம் செய்வதற்கான சிறந்த முறை'
    ]
  };

  const activeQuickPrompts = quickPrompts[language] || quickPrompts['en'];

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm transition-all duration-300">
      {/* Sidebar Chat Sessions list */}
      <div className="w-full lg:w-72 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-950/20">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-500" />
            Inquiries History
          </span>
          <button
            onClick={startNewChat}
            className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shadow-sm shadow-emerald-600/10"
            title="Start new chat"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Search Chats */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800">
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chat topics..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-xs transition-all duration-200"
            />
          </div>
        </div>

        {/* List of chat titles */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredChats.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">No conversations found</div>
          ) : (
            filteredChats.map((c) => (
              <div
                key={c._id}
                onClick={() => loadChat(c._id)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors text-left ${activeChatId === c._id ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'}`}
              >
                <div className="truncate flex-1 pr-2 text-xs">
                  <span className="block truncate">{c.title}</span>
                  <span className="block text-[9px] text-slate-400 font-medium">
                    {new Date(c.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <button
                  onClick={(e) => handleDeleteChat(c._id, e)}
                  className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-all"
                  title="Delete chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
        {/* Active conversation message list */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center max-w-md mx-auto text-center space-y-6">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-full text-emerald-600 dark:text-emerald-400 animate-bounce">
                <Sparkles className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white font-outfit">
                  AI Farmer Assistant
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
                  Ask me anything about crops, organic pest control, fertilizers, or rainwater harvesting. I will reply in your preferred farming language!
                </p>
              </div>

              {/* Suggestions quick triggers */}
              <div className="grid grid-cols-1 gap-2 w-full pt-4">
                {activeQuickPrompts.map((promptText) => (
                  <button
                    key={promptText}
                    onClick={() => setQuery(promptText)}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800/40 dark:hover:bg-slate-800 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all cursor-pointer"
                  >
                    {promptText}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, idx) => (
              <div
                key={m._id || idx}
                className={`flex gap-3 max-w-3xl ${m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Profile bubble */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-sm ${m.role === 'user' ? 'bg-emerald-600' : 'bg-slate-800'}`}>
                  {m.role === 'user' ? <User className="w-4.5 h-4.5" /> : <Sparkles className="w-4.5 h-4.5 text-emerald-400" />}
                </div>

                {/* Message bubble */}
                <div className="space-y-1">
                  <div
                    className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm prose prose-sm dark:prose-invert ${m.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-800/50'}`}
                  >
                    <div dangerouslySetInnerHTML={{ __html: m.content.replace(/\n/g, '<br />') }} />
                  </div>

                  {/* Actions for Model message */}
                  {m.role === 'model' && (
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 pl-1">
                      <button
                        onClick={() => handleCopyText(m.content, m._id || idx.toString())}
                        className="hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
                      >
                        {copySuccess === (m._id || idx.toString()) ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            Copy
                          </>
                        )}
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => handleShareText(m.content)}
                        className="hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
                      >
                        <Share2 className="w-3 h-3" />
                        Share
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex gap-3 mr-auto max-w-sm">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white">
                <Sparkles className="w-4.5 h-4.5 text-emerald-400" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 rounded-tl-none border border-slate-100 dark:border-slate-800/50 flex items-center gap-1 shadow-sm">
                <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce delay-150"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.askAI}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all"
            />
            <button
              type="submit"
              disabled={!query.trim() || loading}
              className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shadow-md shadow-emerald-600/10 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default AIChat;
