import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaRobot,
  FaPaperPlane,
  FaSpinner,
  FaLightbulb,
  FaCog,
  FaRocket,
  FaShieldAlt,
} from "react-icons/fa";
import useStore from "../store";
import aiService from "../lib/ai-service";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import TypingEffect from "./TypingEffect";

const AIAssistant = () => {
  const { isAiAssistantOpen, setAiAssistantOpen, currentProject } = useStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isAiAssistantOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAiAssistantOpen]);

  const quickActions = [
    {
      id: "generate",
      label: "Generate Design",
      icon: FaLightbulb,
      color: "bg-yellow-500",
      prompt: "Help me design a system for ",
    },
    {
      id: "optimize",
      label: "Optimize Current",
      icon: FaCog,
      color: "bg-blue-500",
      prompt: "How can I optimize my current system design?",
    },
    {
      id: "scale",
      label: "Scaling Strategy",
      icon: FaRocket,
      color: "bg-green-500",
      prompt: "What scaling strategies should I consider for ",
    },
    {
      id: "security",
      label: "Security Review",
      icon: FaShieldAlt,
      color: "bg-red-500",
      prompt: "Review the security aspects of my system design",
    },
  ];

  const handleQuickAction = (action) => {
    setInput(action.prompt);
    inputRef.current?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isTyping) return;

    if (!aiService.isAvailable()) {
      toast.error("AI service is not available. Please check your API key.");
      return;
    }

    const userMessage = { id: Date.now(), type: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      let response;
      const lowerInput = input.toLowerCase();

      if (lowerInput.includes("optimize") && currentProject) {
        response = await aiService.optimizeSystemDesign({
          nodes: currentProject.nodes,
          edges: currentProject.edges,
          name: currentProject.name,
        });
      } else if (
        lowerInput.includes("explain") ||
        lowerInput.includes("what is")
      ) {
        const componentMatch = lowerInput.match(/explain|what is\s+(\w+)/);
        const component = componentMatch ? componentMatch[1] : "";
        response = await aiService.explainComponent(component, input);
      } else if (
        lowerInput.includes("load test") ||
        lowerInput.includes("performance")
      ) {
        response = await aiService.generateLoadTestingStrategy(currentProject);
      } else {
        response = await aiService.generateSystemDesign(input);
      }

      setIsLoading(false);
      setIsTyping(true);

      // Add AI message with typing effect
      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: response,
        isTyping: true,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Assistant error:", error);
      setIsLoading(false);
      const errorMessage = {
        id: Date.now() + 1,
        type: "ai",
        content:
          "Sorry, I encountered an error while processing your request. Please try again or check your API configuration.",
        isTyping: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error("Failed to get AI response");
    }
  };

  const handleTypingComplete = (messageId) => {
    setIsTyping(false);
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isTyping: false } : msg
      )
    );
  };

  if (!isAiAssistantOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <FaRobot className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  AI Assistant
                </h3>
                <p className="text-sm text-gray-600">
                  Get help with your system design
                </p>
              </div>
            </div>
            <button
              onClick={() => setAiAssistantOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>

          {/* Quick Actions */}
          {messages.length === 0 && (
            <div className="p-4 border-b border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Quick Actions
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <div
                        className={`w-8 h-8 ${action.color} rounded-md flex items-center justify-center`}
                      >
                        <Icon className="text-white text-sm" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {action.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <FaRobot className="mx-auto text-4xl text-gray-300 mb-4" />
                <p className="text-gray-500">
                  How can I help you with your system design today?
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg prose prose-sm ${
                      message.type === "user"
                        ? "bg-blue-500 text-white prose-invert"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg flex items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isLoading
                    ? "AI is thinking..."
                    : isTyping
                    ? "AI is typing..."
                    : "Ask me about system design, optimization, scaling..."
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                disabled={isLoading || isTyping}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaPaperPlane />
                )}
                Send
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIAssistant;
