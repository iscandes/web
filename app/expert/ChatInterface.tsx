'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  images?: string[];
}

interface ChatInterfaceProps {
  onClose: () => void;
}

export default function ChatInterface({ onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Real Estate Expert. How can I help you find your perfect property in Dubai today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to parse images from AI response
  const parseImagesFromText = (text: string): { cleanText: string; images: string[] } => {
    const imageRegex = /\[IMAGE:(.*?)\]/g;
    const images: string[] = [];
    let match;
    
    while ((match = imageRegex.exec(text)) !== null) {
      const imageData = match[1].trim();
      // Only add valid images (URLs or base64 data)
      if (imageData && (
        imageData.startsWith('http') || 
        imageData.startsWith('/') || 
        imageData.startsWith('data:image/')
      )) {
        images.push(imageData);
      }
    }
    
    const cleanText = text.replace(imageRegex, '').trim();
    return { cleanText, images };
  };

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Call the expert API
      const response = await fetch('/api/expert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          userRole: 'buyer',
          context: 'User is using the floating chat interface for quick real estate inquiries.'
        }),
      });

      const data = await response.json();

      if (data.success && data.response) {
        const { cleanText, images } = parseImagesFromText(data.response);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: cleanText,
          sender: 'bot',
          timestamp: new Date(),
          images: images.length > 0 ? images : undefined
        };

        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(data.error || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('Error calling expert API:', error);
      
      // Fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize for the technical difficulty. I'm here to help you with Dubai real estate. Our portfolio includes luxury properties from top developers in prime locations. What type of property are you looking for?",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-dark rounded-2xl w-full max-w-2xl h-[600px] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-ocean/20 rounded-full flex items-center justify-center">
          <i className="ri-robot-line text-green-ocean text-xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Real Estate Expert</h3>
                <p className="text-sm text-white/60">AI Assistant</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-green-ocean text-white'
                      : 'chat-bubble'
                  }`}
                >
                  {/* Display images if present */}
                  {message.images && message.images.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {message.images.map((imageUrl, index) => (
                        <div key={index} className="relative">
                          <img
                            src={imageUrl}
                            alt="Property"
                            className="w-full h-32 object-cover rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-2 ${
                    message.sender === 'user' ? 'text-luxury-black/60' : 'text-white/40'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="chat-bubble">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-ocean rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-ocean rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-green-ocean rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-white/60">Typing...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 border-t border-white/10">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about properties, developers, or market trends..."
                  className="chat-input w-full pr-12"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-ocean hover:text-green-ocean-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="ri-send-plane-fill text-xl"></i>
                </button>
              </div>
            </div>
            
            <div className="mt-3 text-xs text-white/40 text-center">
              Press Enter to send • Shift+Enter for new line
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}