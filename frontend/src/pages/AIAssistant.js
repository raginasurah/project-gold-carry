import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, SparklesIcon, LightBulbIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const AIAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    setMessages([
      {
        id: 1,
        type: 'ai',
        content: `Hello ${user?.first_name || 'there'}! I'm your AI financial coach. I can help you with budgeting, saving, investing, and financial planning. What would you like to discuss today?`,
        timestamp: new Date()
      }
    ]);
  }, [user]);

  const quickPrompts = [
    "How can I save more money?",
    "Should I invest in stocks?",
    "Help me create a budget",
    "What's my spending pattern?",
    "How to pay off debt faster?",
    "Investment advice for beginners"
  ];

  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/ai/chat`, {
        message: messageText
      });

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg">
          <SparklesIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Financial Coach</h1>
          <p className="text-gray-600">Get personalized financial advice and insights</p>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <LightBulbIcon className="w-5 h-5 mr-2 text-warning-600" />
          Quick Questions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => sendMessage(prompt)}
              className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors duration-200"
            >
              <p className="text-sm font-medium text-gray-900">{prompt}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="card h-96 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything about your finances..."
            className="flex-1 input-field"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="p-3 bg-primary-100 rounded-lg w-fit mx-auto mb-3">
            <ChartBarIcon className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Smart Analysis</h3>
          <p className="text-sm text-gray-600">
            Get insights into your spending patterns and personalized recommendations
          </p>
        </div>

        <div className="card text-center">
          <div className="p-3 bg-success-100 rounded-lg w-fit mx-auto mb-3">
            <LightBulbIcon className="w-6 h-6 text-success-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Financial Tips</h3>
          <p className="text-sm text-gray-600">
            Receive actionable advice on budgeting, saving, and investing
          </p>
        </div>

        <div className="card text-center">
          <div className="p-3 bg-warning-100 rounded-lg w-fit mx-auto mb-3">
            <SparklesIcon className="w-6 h-6 text-warning-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
          <p className="text-sm text-gray-600">
            Get instant answers to your financial questions anytime
          </p>
        </div>
      </div>

      {/* Tips */}
      <div className="card bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
        <h3 className="font-semibold text-primary-900 mb-2">💡 Pro Tips</h3>
        <ul className="text-sm text-primary-800 space-y-1">
          <li>• Ask specific questions for better advice</li>
          <li>• Share your financial goals for personalized guidance</li>
          <li>• Use the quick prompts above to get started</li>
          <li>• I can help analyze your spending patterns and suggest improvements</li>
        </ul>
      </div>
    </div>
  );
};

export default AIAssistant;