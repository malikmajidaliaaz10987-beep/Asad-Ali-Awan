import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Sparkles,
  X,
  Send,
  Trash2,
  AlertCircle,
  ExternalLink,
  Bot,
  User,
  ArrowRight,
  RefreshCw,
  Phone,
  Mail,
  Minimize2,
  Maximize2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Volume1,
  Pause,
  Play,
  Square,
  Languages
} from 'lucide-react';
import { ASAD_WHATSAPP_INTL, ASAD_WHATSAPP_NUMBER, ASAD_EMAIL } from '../utils/whatsapp';

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

const CHAT_STORAGE_KEY = 'asad_ai_assistant_chat_history_v1';
const AUTO_SPEAK_STORAGE_KEY = 'asad_ai_auto_speak_enabled_v1';
const VOICE_LANG_STORAGE_KEY = 'asad_ai_voice_lang_v1';

const WELCOME_MESSAGE: ChatMessageItem = {
  id: 'welcome-msg',
  role: 'model',
  text: `Hello! I am **Asad AI Assistant**, the official voice & text advisor for Asad Ali Awan.

I can assist you with:
• **Business & E-commerce Websites** (modern React/TypeScript, fast Core Web Vitals)
• **Custom AI Chatbots** (Google Gemini integration, 24/7 client support & voice)
• **AI Video & Image Creation** (cinematic brand reels, social ads & 8K visuals)
• **AI Workflow Automation** (lead routing & pipeline integrations)
• **Instant Project Quotations & Delivery Estimates**

You can type your question or **tap the microphone icon** to speak directly. How can I help your project today?`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

const SUGGESTION_PROMPTS = [
  'What web & e-commerce services do you build?',
  'Can you build an AI chatbot for my business?',
  'Tell me about cinematic AI video generation',
  'How do I request a project quotation?',
];

/**
 * Strips markdown and special characters so SpeechSynthesis sounds natural.
 */
function cleanMarkdownForSpeech(text: string): string {
  return text
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // [text](url) -> text
    .replace(/\*\*(.*?)\*\*/g, '$1')   // **bold** -> bold
    .replace(/\*(.*?)\*/g, '$1')       // *italic* -> italic
    .replace(/#{1,6}\s+/g, '')         // # headings -> empty
    .replace(/•/g, '')                 // bullet point -> empty
    .replace(/`{1,3}.*?`{1,3}/g, '')   // code snippets -> empty
    .replace(/https?:\/\/\S+/g, '')    // naked urls -> empty
    .trim();
}

export const AsadChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageItem[]>(() => {
    try {
      const stored = sessionStorage.getItem(CHAT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return [WELCOME_MESSAGE];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  // Voice Interaction State
  const [selectedLang, setSelectedLang] = useState<'en-US' | 'ur-PK'>(() => {
    try {
      const stored = sessionStorage.getItem(VOICE_LANG_STORAGE_KEY);
      if (stored === 'ur-PK' || stored === 'en-US') return stored;
    } catch {
      // ignore
    }
    return 'en-US';
  });

  const [autoSpeak, setAutoSpeak] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(AUTO_SPEAK_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);

  // SpeechSynthesis Playback State
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Check browser SpeechRecognition support
  const isSpeechRecognitionSupported = typeof window !== 'undefined' &&
    Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  // Check browser SpeechSynthesis support
  const isSpeechSynthesisSupported = typeof window !== 'undefined' &&
    'speechSynthesis' in window;

  // Persist messages in sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Persist language setting
  useEffect(() => {
    try {
      sessionStorage.setItem(VOICE_LANG_STORAGE_KEY, selectedLang);
    } catch {
      // ignore
    }
  }, [selectedLang]);

  // Persist auto-speak setting
  useEffect(() => {
    try {
      sessionStorage.setItem(AUTO_SPEAK_STORAGE_KEY, String(autoSpeak));
    } catch {
      // ignore
    }
  }, [autoSpeak]);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen, isMinimized, interimTranscript]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized]);

  // Clean up audio & speech on unmount or close
  useEffect(() => {
    return () => {
      stopListening();
      stopSpeaking();
    };
  }, []);

  // Stop playback when chat window closes
  useEffect(() => {
    if (!isOpen) {
      stopSpeaking();
      stopListening();
    }
  }, [isOpen]);

  // -------------------------------------------------------------
  // Speech Recognition (Voice-to-Text)
  // -------------------------------------------------------------
  const startListening = () => {
    setSpeechNotice(null);
    setErrorMessage(null);

    if (!isSpeechRecognitionSupported) {
      setSpeechNotice('Voice input is not supported in this browser. Please type your message.');
      return;
    }

    // Stop speaking if currently playing audio
    stopSpeaking();

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedLang;

      recognition.onstart = () => {
        setIsListening(true);
        setInterimTranscript('');
      };

      recognition.onresult = (event: any) => {
        let finalTrans = '';
        let interimTrans = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript;
          } else {
            interimTrans += event.results[i][0].transcript;
          }
        }

        if (interimTrans) {
          setInterimTranscript(interimTrans);
        }

        if (finalTrans) {
          setInput((prev) => {
            const trimmed = prev.trim();
            return trimmed ? `${trimmed} ${finalTrans}` : finalTrans;
          });
          setInterimTranscript('');
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event notice:', event?.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setSpeechNotice('Microphone permission was denied. Please allow microphone access in your browser settings.');
        } else if (event.error === 'no-speech') {
          setSpeechNotice('No speech was detected. Please click the mic and speak clearly.');
        } else if (event.error === 'network') {
          setSpeechNotice('Speech recognition network error. Please verify your connection.');
        } else {
          setSpeechNotice(`Speech input error (${event.error}). Please type your message.`);
        }
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
        inputRef.current?.focus();
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
      setSpeechNotice('Could not access microphone. Please check your browser permissions.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimTranscript('');
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // -------------------------------------------------------------
  // Speech Synthesis (Text-to-Speech)
  // -------------------------------------------------------------
  const stopSpeaking = () => {
    if (isSpeechSynthesisSupported) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);
    setIsPaused(false);
  };

  const pauseSpeaking = () => {
    if (isSpeechSynthesisSupported && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resumeSpeaking = () => {
    if (isSpeechSynthesisSupported && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const speakText = (messageId: string, textToSpeak: string) => {
    if (!isSpeechSynthesisSupported) {
      setSpeechNotice('Speech synthesis audio output is not supported in this browser.');
      return;
    }

    // If currently speaking this message, toggle pause/play
    if (speakingMessageId === messageId) {
      if (isPaused) {
        resumeSpeaking();
      } else {
        pauseSpeaking();
      }
      return;
    }

    // Stop any existing speech so answers don't talk over each other
    stopSpeaking();

    const clean = cleanMarkdownForSpeech(textToSpeak);
    if (!clean) return;

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = selectedLang;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick suitable voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      if (selectedLang === 'ur-PK') {
        const urduVoice = voices.find(
          (v) => v.lang.toLowerCase().includes('ur') || v.name.toLowerCase().includes('urdu')
        );
        if (urduVoice) {
          utterance.voice = urduVoice;
        } else {
          // Notify visitor that browser may not have an Urdu voice installed
          setSpeechNotice('Note: An Urdu voice is not installed on this device. Reading with default voice.');
        }
      } else {
        const englishVoice = voices.find(
          (v) =>
            (v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha'))) ||
            v.lang === 'en-US'
        );
        if (englishVoice) {
          utterance.voice = englishVoice;
        }
      }
    }

    utterance.onstart = () => {
      setSpeakingMessageId(messageId);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setSpeakingMessageId(null);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error event:', e);
      setSpeakingMessageId(null);
      setIsPaused(false);
    };

    utterance.onpause = () => setIsPaused(true);
    utterance.onresume = () => setIsPaused(false);

    window.speechSynthesis.speak(utterance);
  };

  // -------------------------------------------------------------
  // Message Submission
  // -------------------------------------------------------------
  const handleSendMessage = async (userText: string) => {
    // If voice recognition is active, stop it before sending
    if (isListening) {
      stopListening();
    }
    // Stop any active audio speech
    stopSpeaking();

    const textToSend = userText.trim();
    if (!textToSend || isLoading) return;

    setErrorMessage(null);
    setSpeechNotice(null);

    const userMessage: ChatMessageItem = {
      id: 'msg_' + Date.now(),
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Filter out client-side welcome message so history starts with a real user turn
      const apiPayload = newMessages
        .filter((m) => m.id !== 'welcome-msg')
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      // Call our secure server-side API (works in local dev, Node server, Vercel, and Netlify Functions)
      let res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiPayload }),
      });

      // Netlify function fallback if /api/chat is not mapped
      if (!res.ok && res.status === 404) {
        res = await fetch('/.netlify/functions/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: apiPayload }),
        });
      }

      if (!res.ok) {
        let errDetail = 'The AI Assistant is momentarily unavailable. Please click Retry, or contact Asad directly.';
        try {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const errData = await res.json();
            errDetail = errData.error || errDetail;
          } else {
            if (res.status === 404) {
              errDetail = 'Chat service endpoint not found (404). Please ensure the backend function is deployed.';
            } else if (res.status === 504 || res.status === 502) {
              errDetail = 'Chat service gateway timeout. Please retry in a few moments.';
            }
          }
        } catch {
          // ignore
        }
        throw new Error(errDetail);
      }

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        throw new Error('Received unexpected response format from server. Please retry.');
      }

      if (!data || !data.reply) {
        throw new Error(data?.error || 'The AI Assistant did not return a response. Please click Retry.');
      }

      const modelMessageId = 'msg_' + Date.now() + '_res';
      const modelMessage: ChatMessageItem = {
        id: modelMessageId,
        role: 'model',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelMessage]);

      // If Auto-Speak Mode is enabled, automatically read out the answer
      if (autoSpeak) {
        // Small delay to allow the message to mount in DOM
        setTimeout(() => {
          speakText(modelMessageId, data.reply);
        }, 300);
      }
    } catch (err: any) {
      console.info('Chat interaction notice:', err?.message || err);
      setErrorMessage(
        err?.message || 'Connection issue. Please retry or reach out to Asad directly on WhatsApp.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    stopSpeaking();
    stopListening();
    setMessages([WELCOME_MESSAGE]);
    setErrorMessage(null);
    setSpeechNotice(null);
    try {
      sessionStorage.removeItem(CHAT_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  // Helper to format text with bolding and simple line breaks
  const formatMessageText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      // Parse markdown bold **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={idx} className="block leading-relaxed min-h-[1.25rem]">
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-semibold text-white">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            // Parse links like [WhatsApp](https://wa.me/...)
            const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
            if (linkMatch) {
              const [, label, url] = linkMatch;
              return (
                <a
                  key={pIdx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline font-medium"
                >
                  {label}
                </a>
              );
            }
            return part;
          })}
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating Chat Trigger Button (Bottom-Right, stacked above WhatsApp button) */}
      <div className="fixed bottom-24 right-6 z-40 flex items-center gap-3">
        {/* Tooltip on Desktop */}
        {!isOpen && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/95 text-slate-200 text-xs font-medium border border-purple-500/30 shadow-xl pointer-events-none animate-in fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Chat with Voice AI Assistant</span>
          </div>
        )}

        <button
          onClick={() => {
            setIsOpen((prev) => !prev);
            setIsMinimized(false);
          }}
          aria-label={isOpen ? 'Close Asad AI Assistant' : 'Open Asad AI Assistant'}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 text-white shadow-xl hover:shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          {/* Breathing ambient ring */}
          <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 blur-md opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" />

          {/* Active online dot */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#090A0F] rounded-full z-20" />

          {isOpen ? (
            <X className="w-6 h-6 relative z-10 transition-transform duration-200" />
          ) : (
            <div className="relative z-10 flex items-center justify-center">
              <Bot className="w-6 h-6" />
              <Sparkles className="w-3.5 h-3.5 absolute -top-1 -right-1 text-purple-200" />
            </div>
          )}
        </button>
      </div>

      {/* Modern Chat Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Asad AI Assistant"
          className={`fixed z-50 transition-all duration-300 ${
            isMinimized
              ? 'bottom-24 right-6 w-72 sm:w-84 h-14 overflow-hidden rounded-2xl shadow-2xl'
              : 'bottom-4 right-4 sm:bottom-24 sm:right-6 w-[calc(100vw-2rem)] sm:w-[430px] max-w-[450px] h-[calc(100vh-6rem)] sm:h-[620px] max-h-[660px] rounded-2xl shadow-2xl'
          } bg-[#0C0F1A]/95 backdrop-blur-xl border border-slate-700/80 flex flex-col`}
        >
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-[#111627] border-b border-slate-800 flex items-center justify-between gap-2.5 shrink-0 rounded-t-2xl">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <Bot className="w-5 h-5" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border border-slate-900 rounded-full" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white tracking-tight truncate">
                    Asad AI Assistant
                  </h3>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-purple-950/80 text-purple-300 border border-purple-800/60">
                    Voice AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  Web & AI Specialist Support
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              {/* Language Selector: English (en-US) / Urdu (ur-PK) */}
              <div className="relative inline-flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setSelectedLang('en-US')}
                  title="Voice language: English"
                  className={`px-1.5 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                    selectedLang === 'en-US'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLang('ur-PK')}
                  title="Voice language: Urdu (اردو)"
                  className={`px-1.5 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                    selectedLang === 'ur-PK'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  UR
                </button>
              </div>

              {/* Auto-Speak Toggle */}
              <button
                type="button"
                onClick={() => {
                  const nextState = !autoSpeak;
                  setAutoSpeak(nextState);
                  if (!nextState) stopSpeaking();
                }}
                title={autoSpeak ? 'Auto-speak responses: ON (Click to disable)' : 'Auto-speak responses: OFF (Click to enable)'}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  autoSpeak
                    ? 'text-purple-300 bg-purple-950/80 border border-purple-800/60'
                    : 'hover:text-white hover:bg-slate-800'
                }`}
              >
                {autoSpeak ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Clear chat button */}
              <button
                type="button"
                onClick={handleClearChat}
                title="Clear chat history"
                className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Minimize / Expand */}
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand chat' : 'Minimize chat'}
                className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors cursor-pointer hidden sm:block"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>

              {/* Close button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Optional Voice Status Bar */}
              {autoSpeak && (
                <div className="px-3.5 py-1 bg-purple-950/30 border-b border-purple-900/30 flex items-center justify-between text-[10px] text-purple-300">
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="w-3 h-3 text-purple-400" />
                    <span>Auto-speak enabled ({selectedLang === 'ur-PK' ? 'Urdu' : 'English'})</span>
                  </span>
                  <button
                    onClick={() => {
                      setAutoSpeak(false);
                      stopSpeaking();
                    }}
                    className="hover:underline text-slate-400"
                  >
                    Turn off
                  </button>
                </div>
              )}

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  const isThisMessageSpeaking = speakingMessageId === msg.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-7 h-7 rounded-lg bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs ${
                          isUser
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-xs shadow-md'
                            : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-xs leading-relaxed shadow-sm'
                        }`}
                      >
                        <div className="space-y-1">{formatMessageText(msg.text)}</div>

                        {/* Bottom Message Metadata & Speaker Controls for Model Messages */}
                        <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-slate-800/60">
                          {!isUser ? (
                            <div className="flex items-center gap-2">
                              {/* Audio Speak / Pause / Stop controls */}
                              {isThisMessageSpeaking ? (
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-950/90 border border-purple-600/50 text-[10px] text-purple-300">
                                  {/* Animated sound wave bars */}
                                  <div className="flex items-center gap-0.5 h-3">
                                    <span className="w-0.5 h-2 bg-purple-400 rounded-full animate-pulse" />
                                    <span className="w-0.5 h-3 bg-indigo-400 rounded-full animate-pulse [animation-delay:0.15s]" />
                                    <span className="w-0.5 h-1.5 bg-blue-400 rounded-full animate-pulse [animation-delay:0.3s]" />
                                    <span className="w-0.5 h-2.5 bg-purple-400 rounded-full animate-pulse [animation-delay:0.45s]" />
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => speakText(msg.id, msg.text)}
                                    title={isPaused ? 'Resume speaking' : 'Pause speaking'}
                                    className="hover:text-white p-0.5"
                                  >
                                    {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={stopSpeaking}
                                    title="Stop speaking"
                                    className="hover:text-white p-0.5 text-rose-300"
                                  >
                                    <Square className="w-2.5 h-2.5 fill-current" />
                                  </button>
                                  <span className="text-[9px] font-mono text-purple-300">
                                    {isPaused ? 'Paused' : 'Playing'}
                                  </span>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => speakText(msg.id, msg.text)}
                                  title="Read answer aloud"
                                  className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-purple-300 px-1.5 py-0.5 rounded hover:bg-slate-800/80 transition-colors cursor-pointer"
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                  <span>Listen</span>
                                </button>
                              )}
                            </div>
                          ) : (
                            <span />
                          )}

                          <span
                            className={`text-[9px] ${
                              isUser ? 'text-purple-200' : 'text-slate-500'
                            }`}
                          >
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>

                      {isUser && (
                        <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Loading typing indicator */}
                {isLoading && (
                  <div className="flex gap-2.5 items-center text-xs text-slate-400">
                    <div className="w-7 h-7 rounded-lg bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-purple-300 shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="px-3.5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[11px] text-slate-400 ml-1">Thinking...</span>
                    </div>
                  </div>
                )}

                {/* Speech notification notice */}
                {speechNotice && (
                  <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/50 text-xs text-purple-200 flex items-start justify-between gap-2">
                    <p className="flex-1">{speechNotice}</p>
                    <button
                      onClick={() => setSpeechNotice(null)}
                      className="text-slate-400 hover:text-white"
                      title="Dismiss notice"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-xs text-rose-300 space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <p className="flex-1">{errorMessage}</p>
                    </div>
                    <div className="flex items-center gap-2 pt-1 border-t border-rose-900/50">
                      <button
                        onClick={() => {
                          const lastUser = [...messages].reverse().find((m) => m.role === 'user');
                          if (lastUser) {
                            handleSendMessage(lastUser.text);
                          }
                        }}
                        className="px-2.5 py-1 bg-rose-900/60 hover:bg-rose-900 text-white rounded text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Retry</span>
                      </button>
                      <a
                        href={`https://wa.me/${ASAD_WHATSAPP_INTL}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-emerald-400 hover:underline"
                      >
                        Contact on WhatsApp
                      </a>
                    </div>
                  </div>
                )}

                {/* Quick suggestion chips (shown when conversation is new) */}
                {messages.length <= 2 && !isLoading && !isListening && (
                  <div className="pt-2 space-y-2">
                    <span className="text-[10px] uppercase font-mono text-slate-500 block">
                      Suggested questions:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTION_PROMPTS.map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(prompt)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 hover:bg-purple-950/50 border border-slate-800 hover:border-purple-600/40 text-[11px] text-slate-300 hover:text-white transition-colors text-left cursor-pointer"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Active Listening Animated Indicator Banner */}
              {isListening && (
                <div className="px-4 py-2 bg-gradient-to-r from-purple-950/80 via-indigo-950/80 to-blue-950/80 border-t border-purple-500/40 flex items-center justify-between text-xs text-purple-200 animate-in fade-in">
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Animated Microphone Pulsing Waves */}
                    <div className="relative flex items-center justify-center w-6 h-6">
                      <span className="absolute inset-0 rounded-full bg-rose-500/40 animate-ping" />
                      <span className="relative w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center text-white">
                        <Mic className="w-2.5 h-2.5" />
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate text-[11px]">
                        Listening in {selectedLang === 'ur-PK' ? 'Urdu (اردو)' : 'English'}...
                      </p>
                      <p className="text-[10px] text-purple-300 truncate">
                        {interimTranscript || 'Speak your question into microphone...'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={stopListening}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-[11px] flex items-center gap-1 shadow-sm shrink-0 cursor-pointer"
                  >
                    <Square className="w-2.5 h-2.5 fill-current" />
                    <span>Done</span>
                  </button>
                </div>
              )}

              {/* Quick direct contact strip */}
              <div className="px-3 py-1.5 bg-[#090B13] border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Want to speak directly to Asad?</span>
                <div className="flex items-center gap-3">
                  <a
                    href={`https://wa.me/${ASAD_WHATSAPP_INTL}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`mailto:${ASAD_EMAIL}`}
                    className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Email</span>
                  </a>
                </div>
              </div>

              {/* Input Form with Microphone Button */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(input);
                }}
                className="p-3 bg-[#0F1322] border-t border-slate-800 rounded-b-2xl"
              >
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={
                        isListening
                          ? 'Listening... speak clearly now'
                          : selectedLang === 'ur-PK'
                          ? 'اردو یا انگلش میں سوال پوچھیں یا بولیں...'
                          : 'Ask about website, AI video, pricing, or tap mic...'
                      }
                      disabled={isLoading}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl pl-3.5 pr-2 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Microphone Button */}
                  <button
                    type="button"
                    onClick={toggleListening}
                    disabled={isLoading}
                    title={
                      isListening
                        ? 'Stop listening'
                        : isSpeechRecognitionSupported
                        ? 'Speak to your AI assistant'
                        : 'Voice recognition not supported in this browser'
                    }
                    className={`relative p-2 rounded-xl transition-all cursor-pointer ${
                      isListening
                        ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40 animate-pulse'
                        : 'bg-slate-800/90 hover:bg-slate-700 text-purple-300 hover:text-white border border-slate-700/80 hover:border-purple-500/50'
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </button>

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-purple-500 hover:to-blue-500 transition-all cursor-pointer shadow-md"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};
