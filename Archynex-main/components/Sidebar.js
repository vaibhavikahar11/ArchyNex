import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronRight, FaRobot } from "react-icons/fa";
import { getNodesByCategory, categories } from "../lib/node-types";
import useStore from "../store";

const Sidebar = ({ onDragStart }) => {
  const [expandedCategories, setExpandedCategories] = useState(
    Object.keys(categories).reduce(
      (acc, category) => ({ ...acc, [category]: true }),
      {}
    )
  );
  const { setAiAssistantOpen } = useStore();

  const nodesByCategory = getNodesByCategory();

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
    onDragStart?.(event, nodeType);
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Component Library
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Drag components to the canvas to build your system design
        </p>
      </div>

      {/* AI Assistant Button */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setAiAssistantOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium"
        >
          <FaRobot />
          AI Assistant
        </button>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(nodesByCategory).map(([category, nodes]) => (
          <div key={category} className="border-b border-gray-100 dark:border-gray-700">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: categories[category].color }}
                />
                <span className="font-medium text-gray-700 dark:text-gray-200 capitalize">
                  {categories[category].label}
                </span>
                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                  {nodes.length}
                </span>
              </div>
              {expandedCategories[category] ? (
                <FaChevronDown className="text-gray-400 dark:text-gray-300" />
              ) : (
                <FaChevronRight className="text-gray-400 dark:text-gray-300" />
              )}
            </button>

            {/* Category Nodes */}
            <AnimatePresence>
              {expandedCategories[category] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-gray-50 dark:bg-gray-800"
                >
                  <div className="p-2 space-y-1">
                    {nodes.map((node) => {
                      const Icon = node.icon;
                      return (
                        <div
                          key={node.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, node.id)}
                          className="flex items-center gap-3 p-2 rounded-lg cursor-move hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm transition-all duration-150 group"
                        >
                          <div
                            className="flex items-center justify-center w-8 h-8 rounded-md"
                            style={{ backgroundColor: `${node.color}20` }}
                          >
                            {Icon ? (
                              <Icon size={16} style={{ color: node.color }} />
                            ) : (
                              <div className="w-4 h-4 bg-gray-400 rounded flex items-center justify-center text-white text-xs font-bold">
                                ?
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white truncate">
                              {node.label}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {node.description}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Drag & drop components to create your system design
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
