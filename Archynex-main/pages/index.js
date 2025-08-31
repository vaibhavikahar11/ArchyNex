import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MainCanvas from "../components/MainCanvas";
import ProjectManager from "../components/ProjectManager";
import AIAssistant from "../components/AIAssistant";
import TemplateManager from "../components/TemplateManager";
import ExportManager from "../components/ExportManager";
import AdvancedToolbar from "../components/AdvancedToolbar";
import useStore from "../store";

export default function Home() {
  const { initialize } = useStore();
  const [isProjectManagerOpen, setIsProjectManagerOpen] = useState(false);
  const [isTemplateManagerOpen, setIsTemplateManagerOpen] = useState(false);
  const [isExportManagerOpen, setIsExportManagerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Canvas view state
  const [showGrid, setShowGrid] = useState(true);
  const [showMinimap, setShowMinimap] = useState(true);
  const [canvasRef, setCanvasRef] = useState(null);

  // Initialize store on component mount
  useEffect(() => {
    initialize();
    // Simulate loading for smooth animation
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [initialize]);

  // Canvas control functions
  const handleZoomIn = () => {
    if (canvasRef?.zoomIn) {
      canvasRef.zoomIn();
    } else {
      toast("Canvas zoom controls will be available when a project is loaded", {
        icon: "🔍",
      });
    }
  };

  const handleZoomOut = () => {
    if (canvasRef?.zoomOut) {
      canvasRef.zoomOut();
    } else {
      toast("Canvas zoom controls will be available when a project is loaded", {
        icon: "🔍",
      });
    }
  };

  const handleFitView = () => {
    if (canvasRef?.fitView) {
      canvasRef.fitView();
    } else {
      toast("Canvas fit view will be available when a project is loaded", {
        icon: "📐",
      });
    }
  };

  const handleToggleGrid = () => {
    setShowGrid(!showGrid);
    toast.success(`Grid ${!showGrid ? "enabled" : "disabled"}`);
  };

  const handleToggleMinimap = () => {
    setShowMinimap(!showMinimap);
    toast.success(`Minimap ${!showMinimap ? "enabled" : "disabled"}`);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Check if user is typing in an input field
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "k":
            event.preventDefault();
            // Open AI Assistant - handled by store
            break;
          case "s":
            event.preventDefault();
            // Save project - handled by navbar
            break;
          case "n":
            event.preventDefault();
            setIsProjectManagerOpen(true);
            break;
          case "e":
            event.preventDefault();
            setIsExportManagerOpen(true);
            break;
          case "t":
            event.preventDefault();
            setIsTemplateManagerOpen(true);
            break;
        }
      }

      // Canvas shortcuts
      switch (event.key) {
        case "+":
        case "=":
          event.preventDefault();
          handleZoomIn();
          break;
        case "-":
          event.preventDefault();
          handleZoomOut();
          break;
        case "0":
          event.preventDefault();
          handleFitView();
          break;
        case "g":
          event.preventDefault();
          handleToggleGrid();
          break;
        case "m":
          event.preventDefault();
          handleToggleMinimap();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [canvasRef, showGrid, showMinimap]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            ArchyNex
          </h2>
          <p className="text-gray-600">Loading your workspace...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>
          {"ArchyNex"}
        </title>
        <meta
          name="description"
          content="Build and visualize system architecture diagrams with AI assistance"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph */}
        <meta property="og:title" content="ArchyNex" />
        <meta
          property="og:description"
          content="Professional system architecture diagramming tool with AI assistance"
        />
        <meta property="og:type" content="website" />

        {/* Additional Meta Tags */}
        <meta
          name="keywords"
          content="system design, architecture, diagrams, microservices, cloud, AI"
        />
        <meta name="author" content="ArchyNex" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col h-screen"
      >
        {/* Navigation Bar */}
        <Navbar
          onOpenProjectManager={() => setIsProjectManagerOpen(true)}
          onOpenTemplates={() => setIsTemplateManagerOpen(true)}
          onOpenExport={() => setIsExportManagerOpen(true)}
        />

        {/* Advanced Toolbar */}
        <AdvancedToolbar
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitView={handleFitView}
          onToggleGrid={handleToggleGrid}
          onToggleMinimap={handleToggleMinimap}
          showGrid={showGrid}
          showMinimap={showMinimap}
        />

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="hidden lg:block"
          >
            <Sidebar />
          </motion.div>

          {/* Mobile Sidebar Toggle */}
          <div className="lg:hidden">
            {/* This could be implemented as a slide-out drawer for mobile */}
          </div>

          {/* Canvas Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex-1 flex flex-col"
          >
            <MainCanvas
              ref={setCanvasRef}
              showGrid={showGrid}
              showMinimap={showMinimap}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Modals and Overlays */}
      <ProjectManager
        isOpen={isProjectManagerOpen}
        onClose={() => setIsProjectManagerOpen(false)}
      />

      <TemplateManager
        isOpen={isTemplateManagerOpen}
        onClose={() => setIsTemplateManagerOpen(false)}
      />

      <ExportManager
        isOpen={isExportManagerOpen}
        onClose={() => setIsExportManagerOpen(false)}
      />

      <AIAssistant />

      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#374151",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            border: "1px solid #e5e7eb",
            borderRadius: "0.75rem",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      {/* Keyboard Shortcuts Help */}
     

      {/* Version Info */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-400">
        v{process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0"}
      </div>
    </div>
  );
}
