import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { aiService, ChatMessage } from '@/lib/ai-service';

interface AIChatBotProps {
  className?: string;
}

const AIChatBot: React.FC<AIChatBotProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "👋 Hi there! I'm Mumin's AI assistant. I know everything about his cybersecurity expertise, projects, and experience. What would you like to know about him?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await aiService.sendMessage([...messages, userMessage]);
      
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response.content
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I apologize, but I'm having trouble responding right now. Please feel free to explore Mumin's portfolio sections to learn about his cybersecurity expertise and projects!"
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuestionClick = async (question: string) => {
    if (isLoading) return;
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: question
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await aiService.sendMessage([...messages, userMessage]);
      
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: response.content
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I apologize, but I'm having trouble responding right now. Please feel free to explore Mumin's portfolio sections to learn about his cybersecurity expertise and projects!"
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "Tell me about Mumin's projects",
    "What are his technical skills?",
    "What's his educational background?",
    "How can I contact Mumin?"
  ];

  const formatMessage = (content: string) => {
    // Simple formatting for better readability
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  if (!isOpen) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-primary hover:bg-gradient-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
          <span className="sr-only">Open AI Assistant</span>
        </Button>
        
        {/* Floating indicator */}
        <div className="absolute -top-2 -right-2 h-4 w-4 bg-secondary rounded-full animate-pulse flex items-center justify-center">
          <Sparkles className="h-2 w-2 text-secondary-foreground" />
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-16 right-0 bg-popover text-popover-foreground px-3 py-2 rounded-lg shadow-md text-sm font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Ask me about Mumin! 🤖
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <Card className={`bg-card/95 backdrop-blur-sm border-primary/20 shadow-2xl transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-80 sm:w-96 h-96 sm:h-[500px]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-card animate-pulse"></div>
            </div>
            <div>
              <h3 className="font-cyber text-sm font-bold">Mumin's AI Assistant</h3>
              <p className="text-xs text-muted-foreground font-mono">Always here to help!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-60 sm:h-80">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="h-6 w-6 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[75%] rounded-lg px-3 py-2 text-sm font-mono ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: formatMessage(message.content) 
                      }} 
                    />
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="h-3 w-3 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="h-6 w-6 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm font-mono">
                    <div className="flex items-center gap-1">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="ml-2">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-mono">Quick questions:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs font-mono h-7"
                      onClick={() => handleQuestionClick(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-border/50">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about Mumin..."
                  className="font-mono text-sm"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  size="icon"
                  className="bg-gradient-primary hover:bg-gradient-primary/90 flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default AIChatBot;