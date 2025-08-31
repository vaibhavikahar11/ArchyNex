import React, { useState, useEffect } from "react";

const TypingEffect = ({ text, speed = 30, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      // Variable speed based on character type
      let currentSpeed = speed;
      const currentChar = text[currentIndex];

      // Slower for punctuation to feel more natural
      if ([".", "!", "?", ":"].includes(currentChar)) {
        currentSpeed = speed * 3;
      } else if ([",", ";"].includes(currentChar)) {
        currentSpeed = speed * 2;
      } else if (currentChar === " ") {
        currentSpeed = speed * 0.5;
      }

      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, currentSpeed);

      return () => clearTimeout(timer);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, text, speed, onComplete, isComplete]);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  return (
    <div className="relative">
      <div className="whitespace-pre-wrap text-sm leading-relaxed">
        {displayedText}
        {!isComplete && (
          <span className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 animate-pulse" />
        )}
      </div>
      {/* Subtle indicator that AI is typing */}
      {!isComplete && (
        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
          <div className="flex gap-1">
            <div
              className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
          <span>AI is typing</span>
        </div>
      )}
    </div>
  );
};

export default TypingEffect;
