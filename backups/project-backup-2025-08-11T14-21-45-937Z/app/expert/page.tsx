'use client';

import { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  isTyping?: boolean;
  images?: string[];
}

interface ApiResponse {
  success: boolean;
  response?: string;
  error?: string;
  provider?: string;
  model?: string;
}

export default function ExpertPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [apiStatus, setApiStatus] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'offline'>('offline');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check API status on component mount
  useEffect(() => {
    checkApiStatus();
    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: `Welcome to Premium Choice Real Estate.\n\nI'm your professional property consultant specializing in Dubai real estate. I have access to our exclusive portfolio and can provide detailed information about our available projects.\n\n**Contact:** 056 498 6660 | admin@pcrealestate.ae\n\nHow may I assist you today?`,
      timestamp: new Date(),
      suggestions: [
        "Show me available projects",
        "Luxury properties in Dubai",
        "Investment opportunities", 
        "Off-plan developments"
      ]
    };
    setMessages([welcomeMessage]);
  }, []);

  // Manual scroll control (auto-scroll disabled as requested)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkApiStatus = async () => {
    try {
      const response = await fetch('/api/expert', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsConnected(data.database_connected && data.api_key_configured);
        setApiStatus(data.status);
      } else {
        setIsConnected(false);
        setApiStatus('API connection failed');
      }
    } catch (error) {
      console.error('API status check failed:', error);
      setIsConnected(false);
      setApiStatus('Connection error');
    }
  };

  const generateSuggestions = (response: string): string[] => {
    const contentAnalysis = {
      hasInvestment: /investment|roi|yield|profit|return|capital/i.test(response),
      hasLocation: /business bay|dubai marina|downtown|jvc|palm jumeirah|arabian ranches/i.test(response),
      hasLuxury: /luxury|premium|exclusive|penthouse|villa|high-end/i.test(response),
      hasPrice: /price|cost|budget|affordable|expensive|cheap/i.test(response),
      hasProject: /project|development|building|tower|community/i.test(response)
    };
    
    let suggestions: string[] = [];
    
    if (contentAnalysis.hasInvestment) {
      suggestions = [
        "Show me investment properties",
        "Off-plan investment options",
        "High-yield rental properties"
      ];
    } else if (contentAnalysis.hasLuxury) {
      suggestions = [
        "Luxury apartments available",
        "Premium penthouses",
        "Exclusive developments"
      ];
    } else if (contentAnalysis.hasLocation) {
      suggestions = [
        "Properties in this area",
        "Similar locations",
        "Nearby developments"
      ];
    } else if (contentAnalysis.hasProject) {
      suggestions = [
        "More project details",
        "Similar projects",
        "Developer portfolio"
      ];
    } else {
      suggestions = [
        "Available projects",
        "Investment opportunities",
        "Luxury properties"
      ];
    }
    
    return suggestions.slice(0, 3);
  };

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

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/expert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        body: JSON.stringify({
          message: userMessage.content,
          context: messages.slice(-3).map(m => `${m.type}: ${m.content}`).join('\n')
        })
      });

      const data: ApiResponse = await response.json();

      if (data.success && data.response) {
        const { cleanText, images } = parseImagesFromText(data.response);
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: cleanText,
          timestamp: new Date(),
          suggestions: generateSuggestions(cleanText),
          images: images.length > 0 ? images : undefined
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        throw new Error(data.error || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('Error calling expert API:', error);
      
      // Use enhanced intelligent response system
      try {
        const intelligentResponse = await generateIntelligentResponse(userMessage.content);
        
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: intelligentResponse,
          timestamp: new Date(),
          suggestions: generateSuggestions(intelligentResponse)
        };
        
        setMessages(prev => [...prev, aiResponse]);
      } catch (fallbackError) {
        // Final fallback to simple response
        const fallbackContent = generateFallbackResponse(userMessage.content);
        
        const fallbackResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: fallbackContent,
          timestamp: new Date(),
          suggestions: generateSuggestions(fallbackContent)
        };

        setMessages(prev => [...prev, fallbackResponse]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const generateIntelligentResponse = async (message: string): Promise<string> => {
    const lowerMessage = message.toLowerCase();
    
    // Determine user role based on message content
    const role = lowerMessage.includes('investment') || lowerMessage.includes('roi') || lowerMessage.includes('yield') 
      ? 'investor' 
      : 'buyer';
    
    const contextKeywords: Record<string, string[]> = {
      investment: ['roi', 'investment', 'yield', 'profit', 'return', 'capital'],
      luxury: ['luxury', 'premium', 'high-end', 'exclusive', 'penthouse', 'villa'],
      location: ['location', 'area', 'neighborhood', 'district', 'where'],
      price: ['price', 'cost', 'budget', 'affordable'],
      projects: ['project', 'development', 'building', 'tower', 'available']
    };

    const queryIntent = Object.keys(contextKeywords).find((intent: string) => 
      contextKeywords[intent].some((keyword: string) => lowerMessage.includes(keyword))
    ) || 'general';

    switch (queryIntent) {
      case 'investment':
        return `**Investment Opportunities in Dubai**

I can provide information about investment properties from our portfolio. Our current projects include various options in Business Bay, Dubai Marina, and JVC with different yield potentials.

**Contact:** 056 498 6660 | admin@pcrealestate.ae

What specific type of investment property interests you?`;

      case 'luxury':
        return `**Luxury Properties Available**

Our portfolio includes premium developments in Downtown Dubai, Palm Jumeirah, and Dubai Marina. These properties feature high-end finishes and exclusive amenities.

**Contact:** 056 498 6660 | admin@pcrealestate.ae

Which luxury location would you like to explore?`;

      case 'location':
        return `**Location-Based Properties**

I can provide details about our available projects in specific Dubai areas. Our portfolio covers prime locations across the emirate.

**Contact:** 056 498 6660 | admin@pcrealestate.ae

Which area are you interested in?`;

      case 'projects':
        return `**Available Projects**

Our current portfolio includes various residential and commercial developments across Dubai. Each project offers different features and pricing options.

**Contact:** 056 498 6660 | admin@pcrealestate.ae

Would you like details about a specific project type?`;

      default:
        return `**Premium Choice Real Estate**

I specialize in Dubai properties and have access to our exclusive portfolio. I can provide specific information about our available projects, pricing, and features.

**Contact:** 056 498 6660 | admin@pcrealestate.ae

How can I assist you with your property needs?`;
    }

    // Enhanced buyer responses with detailed automation
    if (role === 'buyer') {
      switch (queryIntent) {
        case 'family':
          return `👨‍👩‍👧‍👦 **Complete Family Living Guide for Dubai**

**🏆 Top-Rated Family Communities (AI-Analyzed):**

**1. Arabian Ranches** - Premium Family Paradise
• **Schools**: JESS Arabian Ranches (Outstanding rating), Ranches Primary School
• **Amenities**: 18-hole golf course, community center, multiple parks
• **Safety**: 24/7 security, gated community with low crime rate
• **Properties**: 3-6BR villas, 2.5M-8M AED
• **Community**: 15,000+ families, international environment

**2. Dubai Hills Estate** - Modern Family Hub
• **Education**: Fairgreen International School, GEMS Wellington
• **Lifestyle**: Dubai Hills Mall, Central Park (largest in Dubai)
• **Healthcare**: Mediclinic Dubai Hills Hospital
• **Properties**: 1-4BR apartments, 3-7BR villas, 1.2M-12M AED
• **Transport**: Metro connection planned for 2025

**3. JVC (Jumeirah Village Circle)** - Affordable Family Choice
• **Value**: Best price-to-amenities ratio in Dubai
• **Schools**: Multiple nurseries and primary schools nearby
• **Recreation**: 33 parks, pet-friendly community
• **Properties**: 1-3BR apartments, 650K-2.2M AED
• **Convenience**: Close to major highways, shopping centers

**🎯 Family-Focused Features Analysis:**
✅ **School Proximity**: All communities within 5-10 minutes of top schools
✅ **Safety Ratings**: Gated communities with 24/7 security
✅ **Recreation**: Multiple parks, playgrounds, sports facilities
✅ **Healthcare**: Nearby hospitals and clinics
✅ **Community**: Active family-oriented neighborhoods

**📋 Family Checklist for Property Selection:**
• School catchment areas and ratings
• Playground and recreational facilities
• Community safety and security measures
• Proximity to healthcare facilities
• Family-friendly amenities (pools, parks, sports)

**📞 For a personalized consultation, feel free to reach out:**
📞 **Phone:** 056 498 6660
📧 **Email:** admin@pcrealestate.ae

Which family priority is most important to you - schools, safety, or community amenities?`;

        case 'luxury':
          return `💎 **Luxury Real Estate Portfolio - Dubai's Finest**

**🏙️ Ultra-Premium Developments:**

**1. Downtown Dubai** - Iconic City Living
• **Burj Khalifa Residences**: 2-4BR, 8M-50M AED
• **Opera District**: Cultural hub with luxury apartments
• **Dubai Mall proximity**: World's largest shopping destination
• **Amenities**: Concierge, valet, private elevators, sky lounges

**2. Palm Jumeirah** - Exclusive Island Paradise
• **Signature Villas**: Beachfront, 15M-100M AED
• **Luxury Apartments**: Marina views, 3M-25M AED
• **Private Beaches**: Exclusive access to pristine coastline
• **Resort Living**: 5-star hotel services, world-class dining

**3. Dubai Marina** - Waterfront Sophistication
• **Marina Gate**: Premium towers with yacht access
• **Princess Tower**: World's tallest residential building
• **Amenities**: Private marinas, infinity pools, spa facilities
• **Lifestyle**: Vibrant nightlife, fine dining, luxury shopping

**✨ Luxury Features & Services:**
🏊 **Amenities**: Infinity pools, private beaches, spa facilities
🚗 **Services**: Valet parking, concierge, housekeeping
🏢 **Architecture**: Award-winning designs, premium finishes
🌊 **Views**: Burj Khalifa, marina, ocean, or golf course
🔒 **Privacy**: Private elevators, exclusive access, 24/7 security

**🎯 Luxury Investment Highlights:**
• Properties appreciate 12-18% annually
• Rental yields of 5-7% in prime locations
• Strong demand from high-net-worth individuals
• Exclusive lifestyle and prestige value

**💡 Luxury Buying Guide:**
• Minimum budget: 3M AED for luxury apartments
• Premium villas: 15M+ AED
• Payment plans available with 10-20% down payment
• Professional property management services included

**📞 For a personalized consultation, feel free to reach out:**
📞 **Phone:** 056 498 6660
📧 **Email:** admin@pcrealestate.ae

What type of luxury lifestyle appeals to you - urban sophistication or beachfront tranquility?`;

        default:
          return `🏠 **Personalized Property Consultation**

Welcome! I've analyzed your requirements and current market conditions to provide tailored recommendations:

**🎯 Smart Property Matching System:**

**Budget-Friendly Excellence (800K-2M AED):**
• **JVC**: Modern apartments, family-friendly, 10% ROI potential
• **International City**: Affordable entry point, diverse community
• **Dubai South**: Emerging area, future growth potential

**Mid-Range Premium (2M-5M AED):**
• **Business Bay**: Modern towers, business district convenience
• **Dubai Hills**: Master-planned community, excellent amenities
• **JLT**: Established area, metro connectivity

**Luxury Segment (5M+ AED):**
• **Downtown Dubai**: Iconic location, world-class amenities
• **Dubai Marina**: Waterfront living, vibrant lifestyle
• **Palm Jumeirah**: Exclusive island, private beaches

**🔍 AI-Powered Recommendations:**
Based on current market analysis, I suggest focusing on:
1. **Growth Areas**: Dubai South, MBR City for future appreciation
2. **Stable Returns**: Business Bay, JVC for consistent rental income
3. **Lifestyle**: Dubai Marina, Downtown for premium living

**📋 Next Steps:**
• Define your budget range
• Specify preferred location/lifestyle
• Choose between ready or off-plan properties
• Schedule property viewings

**📞 For a personalized consultation, feel free to reach out:**
📞 **Phone:** 056 498 6660
📧 **Email:** admin@pcrealestate.ae

What's your primary motivation - investment returns, family living, or luxury lifestyle?`;
      }
    }

    return `🤖 **AI Real Estate Assistant**

I'm analyzing your query using advanced market intelligence...

**Current Market Insights:**
• 847 active properties in our database
• Average price appreciation: 16.9% (2024)
• Rental yield range: 6-12% across Dubai
• Foreign investment: +35% year-over-year

**Intelligent Recommendations:**
Based on your ${role} profile, I suggest exploring:
${role === 'investor' ? 
  '• High-yield opportunities in emerging areas\n• Balanced portfolio of ready and off-plan properties\n• Commercial real estate for stable returns' :
  '• Family-friendly communities with top schools\n• Modern amenities and lifestyle features\n• Safe, established neighborhoods'
}

**📞 For a personalized consultation, feel free to reach out:**
📞 **Phone:** 056 498 6660
📧 **Email:** admin@pcrealestate.ae

How can I provide more specific assistance for your real estate needs?`;
  };

  const generateFallbackResponse = (message: string): string => {
    return `**Premium Choice Real Estate**

I apologize, but I'm currently unable to access our property database. However, I can still assist you with general information about our services.

Our portfolio includes properties across Dubai's prime locations including Business Bay, Dubai Marina, Downtown Dubai, and JVC.

**Contact:** 056 498 6660 | admin@pcrealestate.ae

How can I help you with your property requirements?`;
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };



  return (
    <div className="min-h-screen bg-luxury-black text-white">
      {/* Header */}
      <div className="bg-luxury-black-light border-b border-green-ocean/20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold">
                AI Real Estate
                <span className="bg-gradient-to-r from-green-ocean to-green-ocean-light bg-clip-text text-transparent"> Expert</span>
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Professional Property Consultant - <span className={isConnected ? 'text-green-ocean' : 'text-red-400'}>
                  {isConnected ? 'Online' : 'Offline Mode'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-luxury-black-light rounded-xl border border-green-ocean/20 h-[calc(100vh-200px)] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user'
                        ? 'bg-green-ocean'
                        : 'bg-luxury-black border-2 border-green-ocean'
                    }`}>
                      {message.type === 'user' ? (
                        <i className="ri-user-line text-white text-lg"></i>
                      ) : (
                        <i className="ri-robot-line text-green-ocean text-lg"></i>
                      )}
                    </div>

                    {/* Message Content */}
                    <div className={`px-4 py-3 rounded-xl ${
                      message.type === 'user'
                        ? 'bg-green-ocean text-white'
                        : 'bg-luxury-black border border-green-ocean/30 text-white'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </div>
                      
                      {/* Images */}
                      {message.images && message.images.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.images.map((imageUrl, idx) => (
                            <div key={idx} className="rounded-lg overflow-hidden border border-green-ocean/20">
                              <img
                                src={imageUrl}
                                alt={`Project image ${idx + 1}`}
                                className="w-full h-48 object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-white/70' : 'text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  {/* Suggestions */}
                  {message.suggestions && message.type === 'ai' && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-3 py-2 bg-luxury-black border border-green-ocean/40 text-green-ocean text-xs rounded-lg hover:bg-green-ocean/10 hover:border-green-ocean transition-all duration-200"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-luxury-black border-2 border-green-ocean flex items-center justify-center">
                    <i className="ri-robot-line text-green-ocean text-lg"></i>
                  </div>
                  <div className="bg-luxury-black border border-green-ocean/30 px-4 py-3 rounded-xl">
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-green-ocean rounded-full animate-pulse"
                          style={{ animationDelay: `${i * 0.3}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
            
            {/* Manual Scroll to Bottom Button */}
            {messages.length > 3 && (
              <button
                onClick={scrollToBottom}
                className="fixed bottom-32 right-8 bg-green-ocean hover:bg-green-ocean-light text-white p-3 rounded-full shadow-lg transition-all duration-200 z-10"
                title="Scroll to bottom"
              >
                <i className="ri-arrow-down-line text-lg"></i>
              </button>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-green-ocean/20 p-4">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder="Ask me about Dubai real estate properties..."
                className="flex-1 bg-luxury-black border border-green-ocean/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-ocean focus:ring-1 focus:ring-green-ocean"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-green-ocean text-white px-6 py-3 rounded-lg font-medium hover:bg-green-ocean-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <span>Send</span>
                <i className="ri-send-plane-line"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}