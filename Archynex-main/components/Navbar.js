import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaFolder,
  FaSave,
  FaRobot,
  FaUser,
  FaCog,
  FaBars,
  FaTimes,
  FaShare,
  FaEye,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import useStore from "../store";
import toast from "react-hot-toast";

const Navbar = ({ onOpenProjectManager, onOpenTemplates, onOpenExport }) => {
  const {
    currentProject,
    updateCurrentProject,
    setAiAssistantOpen,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    }
  }, []);

  // Apply theme to html tag and save to localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleSaveProject = () => {
    if (!currentProject) {
      toast.error("No project to save");
      return;
    }
    updateCurrentProject({ updatedAt: new Date().toISOString() });
    toast.success("Project saved!");
  };

  const navItems = [
    {
      id: "projects",
      label: "Projects",
      icon: FaFolder,
      onClick: onOpenProjectManager,
    },
    {
      id: "templates",
      label: "Templates",
      icon: FaEye,
      onClick: onOpenTemplates,
    },
    {
      id: "save",
      label: "Save",
      icon: FaSave,
      onClick: handleSaveProject,
      disabled: !currentProject,
      shortcut: "Ctrl+S",
    },
    {
      id: "export",
      label: "Export & Share",
      icon: FaShare,
      onClick: onOpenExport,
      disabled: !currentProject,
    },
    {
      id: "ai",
      label: "AI Assistant",
      icon: FaRobot,
      onClick: () => setAiAssistantOpen(true),
      className:
        "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600",
      shortcut: "Ctrl+K",
    },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              ArchyNex
            </h1>
            {currentProject && (
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[200px] md:max-w-none">
                {currentProject.name}
              </p>
            )}
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={item.onClick}
                disabled={item.disabled}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${item.className || "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"}
                  ${item.disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}
                `}
                title={item.shortcut ? `${item.label} (${item.shortcut})` : item.label}
              >
                <Icon className="text-sm" />
                <span className="hidden lg:inline">{item.label}</span>
              </motion.button>
            );
          })}

          {/* Dark Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Toggle Dark Mode"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </motion.button>

          {/* User Profile */}
          <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
            <button className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <FaUser className="text-gray-600 dark:text-gray-300 text-sm" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <FaCog className="text-gray-600 dark:text-gray-300 text-sm" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.onClick();
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={item.disabled}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-left
                    ${item.className || "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"}
                    ${item.disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}
                  `}
                >
                  <Icon className="text-sm" />
                  {item.label}
                  {item.shortcut && (
                    <span className="ml-auto text-xs text-gray-400">
                      {item.shortcut}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Dark Mode Toggle Mobile */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-left"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>

            {/* Mobile User Actions */}
            <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-700">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-left">
                <FaUser className="text-sm" />
                Profile
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-left">
                <FaCog className="text-sm" />
                Settings
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
