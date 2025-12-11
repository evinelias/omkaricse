import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface Suggestion {
  label: string;
  path: string;
}

interface Message {
  sender: 'user' | 'bot';
  text: string;
  html?: string;
  suggestions?: Suggestion[];
}

interface ChatSession {
    sendMessage: (params: { message: string }) => Promise<{ text: string }>;
}

interface ProactiveMessage {
    display: string;
    prompt: string;
}

const PROACTIVE_MESSAGES: ProactiveMessage[] = [
    { display: "Ask me about our admission process!", prompt: "Tell me about your admission process." },
    { display: "Curious about our ISC programme?", prompt: "What is the ISC programme?" },
    { display: "I can tell you about our campus facilities!", prompt: "What are your campus facilities?" },
    { display: "What are our school's core values?", prompt: "Tell me about your school's core values." },
    { display: "Wondering about our academic streams?", prompt: "What academic streams do you offer?" },
    { display: "Hi there! How can I help you today?", prompt: "Tell me about Omkar International School." }
];

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'bot', text: "Hello! I'm the OIS virtual assistant. How can I help you today?", html: "<p>Hello! I'm the OIS virtual assistant. How can I help you today?</p>" }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatRef = useRef<ChatSession | null>(null);
    const markedRef = useRef<any>(null);
    const dompurifyRef = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [bubbleMessage, setBubbleMessage] = useState<ProactiveMessage>({ display: "Hi there! Ask me anything about our school.", prompt: "Tell me about Omkar International School." });
    const [isBubbleVisible, setIsBubbleVisible] = useState(false);
    const [isBubbleDismissed, setIsBubbleDismissed] = useState(false);
    const bubbleIntervalRef = useRef<number | null>(null);

    const { theme } = useTheme();

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);
    
    useEffect(() => {
        if (isBubbleDismissed) {
            setIsBubbleVisible(false);
            if (bubbleIntervalRef.current) clearInterval(bubbleIntervalRef.current);
            return;
        }

        if (!isOpen) {
            const initialTimeout = setTimeout(() => {
                 setIsBubbleVisible(true);
                 bubbleIntervalRef.current = window.setInterval(() => {
                    setIsBubbleVisible(false);
                    setTimeout(() => {
                        const randomIndex = Math.floor(Math.random() * PROACTIVE_MESSAGES.length);
                        setBubbleMessage(PROACTIVE_MESSAGES[randomIndex]);
                        setIsBubbleVisible(true);
                    }, 400);
                }, 7000);
            }, 2000);

            return () => {
                clearTimeout(initialTimeout);
                if (bubbleIntervalRef.current) clearInterval(bubbleIntervalRef.current);
            }
        } else {
            if (bubbleIntervalRef.current) clearInterval(bubbleIntervalRef.current);
            setIsBubbleVisible(false);
        }
    }, [isOpen, isBubbleDismissed]);

    const initializeChat = async () => {
        if (chatRef.current) return;
        try {
            const { GoogleGenAI } = await import('@google/genai');
            const { marked } = await import('marked');
            const DOMPurify = (await import('dompurify')).default;
            markedRef.current = marked;
            dompurifyRef.current = DOMPurify;

            const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;
            
            if (!apiKey) {
                setError("Sorry, the AI assistant is currently unavailable. Please contact the school directly for assistance.");
                return;
            }
            
            const ai = new GoogleGenAI({ apiKey });
            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: "You are a friendly and helpful assistant for Omkar International School. Your goal is to answer questions from prospective parents and students. When relevant, provide links to pages on the website by formatting them as [Page Name](/path). YOU MUST USE one of the following exact paths: /about/founder-trustee, /about/principal, /about/mission-vision, /academics/foundational-years, /academics/primary, /academics/middle-school, /academics/secondary, /academics/isc, /infrastructure, /awards, /admission, /testimonials, /contact. For example: [Learn about admissions](/admission). Use markdown for formatting (like bolding and lists). Place links at the end of your response. Be concise, polite, and informative. If you don't know an answer, suggest contacting the school directly through the [Contact Us](/contact) page. Do not make up information.",
                },
            });
            setError(null);
        } catch (e) {
            console.error("Failed to initialize Gemini:", e);
            setError("Could not connect to the AI assistant.");
        }
    };
    
    const submitMessage = async (prompt: string) => {
        const trimmedInput = prompt.trim();
        if (!trimmedInput || isLoading) return;

        const newUserMessage: Message = { sender: 'user', text: trimmedInput };
        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsLoading(true);
        setError(null);

        if (!chatRef.current) {
            await initializeChat();
            if (!chatRef.current) {
                 setError("Chat session not initialized. Please try again.");
                 setIsLoading(false);
                 return;
            }
        }

        try {
            const response = await chatRef.current.sendMessage({ message: trimmedInput });
            const rawText = response.text;
            const suggestions: Suggestion[] = [];
            const linkRegex = /\[([^\]]+)\]\(\/([^)]+)\)/g;

            const cleanText = rawText.replace(linkRegex, (match, label, path) => {
                suggestions.push({ label, path: `/${path}` });
                return '';
            }).trim();

            const dirtyHtml = markedRef.current.parse(cleanText);
            const cleanHtml = dompurifyRef.current.sanitize(dirtyHtml);

            const botMessage: Message = { 
                sender: 'bot', 
                text: rawText,
                html: cleanHtml, 
                suggestions 
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (err) {
            console.error("Gemini API error:", err);
            setError("Sorry, I couldn't process that. Please try again.");
            // Revert optimistic user message on error
            setMessages(prev => prev.slice(0, -1));
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        submitMessage(userInput);
    };
    
    const handleBubbleClick = () => {
        setIsBubbleDismissed(true);
        setIsOpen(true);
        const prompt = bubbleMessage.prompt;
        initializeChat().then(() => {
            setTimeout(() => submitMessage(prompt), 100);
        });
    };

    const handleDismissBubble = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsBubbleDismissed(true);
    };

    const isLight = theme === 'light';
    const fabBgColor = isLight ? 'bg-gradient-to-br from-blue-500 to-blue-700' : 'bg-gradient-to-br from-amber-400 to-amber-600';
    const fabTextColor = isLight ? 'text-white' : 'text-slate-900';
    const pulseColor = isLight ? '59, 130, 246' : '251, 191, 36';

    const suggestionButtonClasses = isLight 
        ? 'bg-blue-600 text-white hover:bg-blue-700' 
        : 'bg-amber-500 text-slate-900 hover:bg-amber-400';

    return (
        <div className="relative">
            <div className={`flex flex-col bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'} fixed inset-0 sm:absolute sm:inset-auto sm:bottom-0 sm:right-0 sm:w-96 sm:h-[32rem] sm:rounded-2xl sm:shadow-2xl sm:origin-bottom-right`}>
                <div className={`flex items-center justify-between p-4 border-b ${isLight ? 'border-white/30' : 'border-slate-700/50'}`}>
                    <div className="flex items-center space-x-3">
                         <Bot className={`w-7 h-7 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
                         <h3 className="font-bold text-lg text-slate-800 dark:text-white">OIS AI Assistant</h3>
                    </div>
                    <button onClick={() => setIsOpen(false)} className={`p-1 rounded-full ${isLight ? 'text-slate-500 hover:bg-white/30' : 'text-slate-400 hover:bg-slate-600/50'}`}>
                         <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                         <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] px-4 py-2 rounded-xl ${msg.sender === 'user' ? (isLight ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white') : (isLight ? 'bg-white/70 text-slate-800' : 'bg-slate-700/70 text-slate-200')}`}>
                                    {msg.sender === 'user' ? (
                                        <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                                    ) : (
                                        <div className="prose prose-sm dark:prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{ __html: msg.html || msg.text }} />
                                    )}
                                </div>
                            </div>
                            {msg.suggestions && msg.suggestions.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3 max-w-[85%]">
                                    {msg.suggestions.map((suggestion, sIndex) => (
                                        <Link
                                            key={sIndex}
                                            to={suggestion.path}
                                            onClick={() => setIsOpen(false)}
                                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 transform hover:scale-105 shadow-md ${suggestionButtonClasses}`}
                                        >
                                            {suggestion.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-end gap-2 justify-start">
                             <div className={`max-w-[80%] px-4 py-2 rounded-xl ${isLight ? 'bg-white/70 text-slate-800' : 'bg-slate-700/70 text-slate-200'}`}>
                                <div className="flex items-center space-x-1">
                                     <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                                     <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                                     <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                                </div>
                            </div>
                        </div>
                    )}
                    {error && (
                         <div className="flex items-end gap-2 justify-start">
                            <div className="max-w-[80%] px-4 py-2 rounded-xl bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300">
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleFormSubmit} className={`p-4 border-t ${isLight ? 'border-white/30' : 'border-slate-700/50'} flex items-center gap-2`}>
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Ask a question..."
                        disabled={isLoading}
                        className={`w-full px-4 py-2 bg-white/50 dark:bg-slate-700/50 border ${isLight ? 'border-slate-300/50' : 'border-slate-600/50'} rounded-full focus:outline-none focus:ring-2 ${isLight ? 'focus:ring-blue-500' : 'focus:ring-blue-400'} text-slate-800 dark:text-white dark:placeholder-slate-400 transition`}
                    />
                    <button type="submit" disabled={isLoading || !userInput.trim()} className={`p-3 rounded-full ${isLight ? 'bg-blue-600' : 'bg-blue-500'} text-white transition-all transform hover:scale-110 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:scale-100`}>
                         <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>

            <div className={`absolute bottom-0 right-0 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
                <button
                    onClick={handleBubbleClick}
                    aria-label={`Chat prompt: ${bubbleMessage.display}`}
                    className={`absolute bottom-full right-8 mb-4 w-max max-w-[250px] p-3 rounded-xl shadow-lg transition-all duration-300 text-left cursor-pointer bg-white/50 dark:bg-slate-700/50 backdrop-blur-md border border-white/20 dark:border-slate-600/50 text-slate-800 dark:text-slate-200 ${isBubbleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'} hover:scale-105 hover:shadow-xl`}
                >
                    <p className="text-sm font-medium pr-6">{bubbleMessage.display}</p>
                    <button 
                        onClick={handleDismissBubble} 
                        className="absolute top-1.5 right-1.5 p-0.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors z-10"
                        aria-label="Dismiss message"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className={`absolute right-4 -bottom-2 w-4 h-4 transform rotate-45 bg-white/50 dark:bg-slate-700/50`}></div>
                </button>
                <button
                    onClick={() => {
                        setIsOpen(true);
                        initializeChat();
                    }}
                    aria-label="Open chatbot"
                    className={`p-5 rounded-full shadow-2xl transition-transform duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 ${fabBgColor} ${fabTextColor} ${isLight ? 'focus:ring-blue-300' : 'focus:ring-amber-300'} animate-subtle-pulse`}
                    style={{ '--pulse-color': pulseColor } as React.CSSProperties}
                >
                    <MessageSquare className="w-8 h-8" />
                </button>
            </div>
        </div>
    );
};

export default Chatbot;