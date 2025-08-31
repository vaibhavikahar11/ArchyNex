import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaDownload,
  FaEye,
  FaPlus,
  FaStar,
  FaFilter,
  FaCloud,
  FaShoppingCart,
  FaGamepad,
  FaCog,
  FaUsers,
  FaChartLine,
  FaShieldAlt,
  FaDatabase,
  FaMobile,
} from "react-icons/fa";
import useStore from "../store";
import toast from "react-hot-toast";

const TemplateManager = ({ isOpen, onClose }) => {
  const { createProject, setCurrentProject, importProject } = useStore();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Predefined templates
  const templates = [
    {
      id: "microservices-ecommerce",
      name: "E-commerce Microservices",
      description:
        "Complete e-commerce platform with microservices architecture",
      category: "ecommerce",
      icon: FaShoppingCart,
      difficulty: "Advanced",
      components: 15,
      rating: 4.8,
      featured: true,
      preview: "/templates/ecommerce-preview.png",
      data: {
        nodes: [
          {
            id: "api-gateway-1",
            type: "custom",
            position: { x: 400, y: 100 },
            data: {
              id: "gateway",
              label: "API Gateway",
              icon: "FaKey",
              color: "#f97316",
              category: "network",
              description: "Main entry point for all requests",
            },
          },
          {
            id: "user-service-1",
            type: "custom",
            position: { x: 200, y: 250 },
            data: {
              id: "microservice",
              label: "User Service",
              icon: "FaCogs",
              color: "#10b981",
              category: "compute",
              description: "Handles user authentication and profiles",
            },
          },
          {
            id: "product-service-1",
            type: "custom",
            position: { x: 400, y: 250 },
            data: {
              id: "microservice",
              label: "Product Service",
              icon: "FaCogs",
              color: "#10b981",
              category: "compute",
              description: "Manages product catalog and inventory",
            },
          },
          {
            id: "order-service-1",
            type: "custom",
            position: { x: 600, y: 250 },
            data: {
              id: "microservice",
              label: "Order Service",
              icon: "FaCogs",
              color: "#10b981",
              category: "compute",
              description: "Processes orders and payments",
            },
          },
          {
            id: "database-1",
            type: "custom",
            position: { x: 400, y: 400 },
            data: {
              id: "database",
              label: "PostgreSQL",
              icon: "FaDatabase",
              color: "#8b5cf6",
              category: "storage",
              description: "Primary database",
            },
          },
        ],
        edges: [
          {
            id: "edge-1",
            source: "api-gateway-1",
            target: "user-service-1",
            animated: true,
            style: { stroke: "#3b82f6", strokeWidth: 2 },
          },
          {
            id: "edge-2",
            source: "api-gateway-1",
            target: "product-service-1",
            animated: true,
            style: { stroke: "#3b82f6", strokeWidth: 2 },
          },
          {
            id: "edge-3",
            source: "api-gateway-1",
            target: "order-service-1",
            animated: true,
            style: { stroke: "#3b82f6", strokeWidth: 2 },
          },
          {
            id: "edge-4",
            source: "user-service-1",
            target: "database-1",
            animated: true,
            style: { stroke: "#8b5cf6", strokeWidth: 2 },
          },
          {
            id: "edge-5",
            source: "product-service-1",
            target: "database-1",
            animated: true,
            style: { stroke: "#8b5cf6", strokeWidth: 2 },
          },
          {
            id: "edge-6",
            source: "order-service-1",
            target: "database-1",
            animated: true,
            style: { stroke: "#8b5cf6", strokeWidth: 2 },
          },
        ],
      },
    },
    {
      id: "social-media-platform",
      name: "Social Media Platform",
      description: "Scalable social media platform with real-time features",
      category: "social",
      icon: FaUsers,
      difficulty: "Advanced",
      components: 18,
      rating: 4.9,
      featured: true,
      data: {
        nodes: [
          {
            id: "load-balancer-1",
            type: "custom",
            position: { x: 400, y: 50 },
            data: {
              id: "loadBalancer",
              label: "Load Balancer",
              icon: "FaBalanceScale",
              color: "#06b6d4",
              category: "network",
              description: "Distributes incoming traffic",
            },
          },
          {
            id: "web-app-1",
            type: "custom",
            position: { x: 200, y: 150 },
            data: {
              id: "webApp",
              label: "Web Frontend",
              icon: "FaDesktop",
              color: "#0ea5e9",
              category: "client",
              description: "React web application",
            },
          },
          {
            id: "mobile-app-1",
            type: "custom",
            position: { x: 600, y: 150 },
            data: {
              id: "mobileApp",
              label: "Mobile App",
              icon: "FaMobile",
              color: "#ec4899",
              category: "client",
              description: "React Native mobile app",
            },
          },
        ],
        edges: [
          {
            id: "edge-1",
            source: "load-balancer-1",
            target: "web-app-1",
            animated: true,
            style: { stroke: "#3b82f6", strokeWidth: 2 },
          },
          {
            id: "edge-2",
            source: "load-balancer-1",
            target: "mobile-app-1",
            animated: true,
            style: { stroke: "#3b82f6", strokeWidth: 2 },
          },
        ],
      },
    },
    {
      id: "iot-platform",
      name: "IoT Data Platform",
      description: "Real-time IoT data processing and analytics platform",
      category: "iot",
      icon: FaCog,
      difficulty: "Expert",
      components: 12,
      rating: 4.7,
      featured: false,
      data: {
        nodes: [
          {
            id: "iot-gateway-1",
            type: "custom",
            position: { x: 100, y: 100 },
            data: {
              id: "gateway",
              label: "IoT Gateway",
              icon: "FaKey",
              color: "#f97316",
              category: "network",
              description: "Collects data from IoT devices",
            },
          },
        ],
        edges: [],
      },
    },
    {
      "id": "gaming-backend-advanced",
      "name": "Gaming Backend (Advanced)",
      "description": "Scalable multiplayer gaming backend with real-time matchmaking, chat, analytics, and microservices architecture",
      "category": "gaming",
      icon: FaGamepad,
      "difficulty": "Advanced",
      "components": 12,
      "rating": 4.9,
      "featured": true,
      "data": {
        "nodes": [
          {
            "id": "game-client",
            "type": "custom",
            "position": { "x": 100, "y": 200 },
            "data": {
              "id": "client",
              "label": "Game Client",
              "icon": "FaGamepad",
              "color": "#f59e0b",
              "category": "client",
              "description": "Player device running the game"
            }
          },
          {
            "id": "api-gateway",
            "type": "custom",
            "position": { "x": 300, "y": 200 },
            "data": {
              "id": "gateway",
              "label": "API Gateway",
              "icon": "FaKey",
              "color": "#f97316",
              "category": "network",
              "description": "Authentication, routing, rate limiting"
            }
          },
          {
            "id": "load-balancer",
            "type": "custom",
            "position": { "x": 500, "y": 200 },
            "data": {
              "id": "loadBalancer",
              "label": "Load Balancer",
              "icon": "FaBalanceScale",
              "color": "#06b6d4",
              "category": "network",
              "description": "Distributes traffic to game servers"
            }
          },
          {
            "id": "game-server",
            "type": "custom",
            "position": { "x": 700, "y": 150 },
            "data": {
              "id": "server",
              "label": "Game Server",
              "icon": "FaServer",
              "color": "#3b82f6",
              "category": "compute",
              "description": "Handles real-time game logic and state"
            }
          },
          {
            "id": "matchmaking-service",
            "type": "custom",
            "position": { "x": 700, "y": 300 },
            "data": {
              "id": "service",
              "label": "Matchmaking Service",
              "icon": "FaUsers",
              "color": "#10b981",
              "category": "service",
              "description": "Matches players into games"
            }
          },
          {
            "id": "chat-service",
            "type": "custom",
            "position": { "x": 900, "y": 100 },
            "data": {
              "id": "chatService",
              "label": "Chat Service",
              "icon": "FaComments",
              "color": "#ec4899",
              "category": "service",
              "description": "Real-time player chat"
            }
          },
          {
            "id": "leaderboard-service",
            "type": "custom",
            "position": { "x": 900, "y": 200 },
            "data": {
              "id": "leaderboardService",
              "label": "Leaderboard Service",
              "icon": "FaTrophy",
              "color": "#eab308",
              "category": "service",
              "description": "Tracks and displays player rankings"
            }
          },
          {
            "id": "analytics-service",
            "type": "custom",
            "position": { "x": 900, "y": 300 },
            "data": {
              "id": "analyticsService",
              "label": "Analytics Service",
              "icon": "FaChartLine",
              "color": "#059669",
              "category": "service",
              "description": "Game analytics and events processing"
            }
          },
          {
            "id": "database",
            "type": "custom",
            "position": { "x": 1100, "y": 200 },
            "data": {
              "id": "database",
              "label": "Game Database",
              "icon": "FaDatabase",
              "color": "#8b5cf6",
              "category": "storage",
              "description": "Stores player profiles, inventory, and game state"
            }
          },
          {
            "id": "cache",
            "type": "custom",
            "position": { "x": 1300, "y": 200 },
            "data": {
              "id": "cache",
              "label": "Cache",
              "icon": "FaBolt",
              "color": "#ef4444",
              "category": "storage",
              "description": "Low-latency data access for leaderboards and sessions"
            }
          },
          {
            "id": "message-queue",
            "type": "custom",
            "position": { "x": 1500, "y": 200 },
            "data": {
              "id": "queue",
              "label": "Message Queue",
              "icon": "FaCloud",
              "color": "#1e40af",
              "category": "cloud",
              "description": "Async communication between services (e.g., RabbitMQ)"
            }
          },
          {
            "id": "monitoring",
            "type": "custom",
            "position": { "x": 1700, "y": 200 },
            "data": {
              "id": "monitoring",
              "label": "Monitoring & Logging",
              "icon": "FaEye",
              "color": "#0f766e",
              "category": "ops",
              "description": "System health, metrics, and logs"
            }
          }
        ],
        "edges": [
          { "id": "edge-1", "source": "game-client", "target": "api-gateway", "animated": true, "style": { "stroke": "#f97316", "strokeWidth": 2 } },
          { "id": "edge-2", "source": "api-gateway", "target": "load-balancer", "animated": true, "style": { "stroke": "#06b6d4", "strokeWidth": 2 } },
          { "id": "edge-3", "source": "load-balancer", "target": "game-server", "animated": true, "style": { "stroke": "#3b82f6", "strokeWidth": 2 } },
          { "id": "edge-4", "source": "game-server", "target": "matchmaking-service", "animated": true, "style": { "stroke": "#10b981", "strokeWidth": 2 } },
          { "id": "edge-5", "source": "game-server", "target": "chat-service", "animated": true, "style": { "stroke": "#ec4899", "strokeWidth": 2 } },
          { "id": "edge-6", "source": "game-server", "target": "leaderboard-service", "animated": true, "style": { "stroke": "#eab308", "strokeWidth": 2 } },
          { "id": "edge-7", "source": "game-server", "target": "analytics-service", "animated": true, "style": { "stroke": "#059669", "strokeWidth": 2 } },
          { "id": "edge-8", "source": "matchmaking-service", "target": "database", "animated": true, "style": { "stroke": "#8b5cf6", "strokeWidth": 2 } },
          { "id": "edge-9", "source": "leaderboard-service", "target": "cache", "animated": true, "style": { "stroke": "#ef4444", "strokeWidth": 2 } },
          { "id": "edge-10", "source": "analytics-service", "target": "message-queue", "animated": true, "style": { "stroke": "#1e40af", "strokeWidth": 2 } },
          { "id": "edge-11", "source": "message-queue", "target": "monitoring", "animated": true, "style": { "stroke": "#0f766e", "strokeWidth": 2 } }
        ]
      },
    },
    {
      id: "analytics-platform",
      name: "Analytics Platform",
      description: "Big data analytics and reporting platform",
      category: "analytics",
      icon: FaChartLine,
      difficulty: "Expert",
      components: 14,
      rating: 4.8,
      featured: true,
      data: {
        nodes: [
          {
            id: "data-pipeline-1",
            type: "custom",
            position: { x: 300, y: 150 },
            data: {
              id: "microservice",
              label: "Data Pipeline",
              icon: "FaCogs",
              color: "#10b981",
              category: "compute",
              description: "Processes and transforms data",
            },
          },
        ],
        edges: [],
      },
    },
  ];

  const categories = [
    { id: "all", label: "All Templates", icon: FaPlus },
    { id: "ecommerce", label: "E-commerce", icon: FaShoppingCart },
    { id: "social", label: "Social Media", icon: FaUsers },
    { id: "iot", label: "IoT", icon: FaCog },
    { id: "gaming", label: "Gaming", icon: FaGamepad },
    { id: "analytics", label: "Analytics", icon: FaChartLine },
    { id: "security", label: "Security", icon: FaShieldAlt },
    { id: "cloud", label: "Cloud Native", icon: FaCloud },
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUseTemplate = (template) => {
    const projectName = `${template.name} - ${new Date().toLocaleDateString()}`;
    const newProject = createProject(projectName, template.description);

    // Import the template data
    const updatedProject = {
      ...newProject,
      nodes: template.data.nodes || [],
      edges: template.data.edges || [],
    };

    setCurrentProject(updatedProject);
    toast.success(`Template "${template.name}" loaded successfully!`);
    onClose();
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "text-green-600 bg-green-100";
      case "Intermediate":
        return "text-yellow-600 bg-yellow-100";
      case "Advanced":
        return "text-orange-600 bg-orange-100";
      case "Expert":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (!isOpen) return null;

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
          className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[80vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Template Gallery
              </h2>
              <p className="text-gray-600">
                Choose from pre-built system design templates
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 p-4 border-r border-gray-200">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="space-y-1">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        selectedCategory === category.id
                          ? "bg-blue-100 text-blue-700"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <Icon size={16} />
                      <span className="text-sm font-medium">
                        {category.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Featured Templates */}
              {selectedCategory === "all" && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaStar className="text-yellow-500" />
                    Featured Templates
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {templates
                      .filter((t) => t.featured)
                      .map((template) => {
                        const Icon = template.icon;
                        return (
                          <motion.div
                            key={template.id}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white border-2 border-blue-200 rounded-xl p-4 shadow-lg"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <Icon className="text-blue-600" size={20} />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-800">
                                    {template.name}
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                                        template.difficulty
                                      )}`}
                                    >
                                      {template.difficulty}
                                    </span>
                                    <div className="flex items-center gap-1">
                                      <FaStar
                                        className="text-yellow-500"
                                        size={12}
                                      />
                                      <span className="text-xs text-gray-600">
                                        {template.rating}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <FaStar className="text-yellow-500" size={16} />
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              {template.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {template.components} components
                              </span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleUseTemplate(template)}
                                  className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                                >
                                  Use Template
                                </button>
                                <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                  <FaEye size={12} />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* All Templates */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {selectedCategory === "all"
                    ? "All Templates"
                    : categories.find((c) => c.id === selectedCategory)?.label}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({filteredTemplates.length} templates)
                  </span>
                </h3>

                {filteredTemplates.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <FaFilter className="text-gray-400 text-2xl" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-700 mb-2">
                      No templates found
                    </h4>
                    <p className="text-gray-500">
                      Try adjusting your search or category filter
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTemplates.map((template) => {
                      const Icon = template.icon;
                      return (
                        <motion.div
                          key={template.id}
                          whileHover={{ scale: 1.02 }}
                          className="bg-white border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Icon className="text-gray-600" size={20} />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-800">
                                  {template.name}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                                      template.difficulty
                                    )}`}
                                  >
                                    {template.difficulty}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <FaStar
                                      className="text-yellow-500"
                                      size={12}
                                    />
                                    <span className="text-xs text-gray-600">
                                      {template.rating}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {template.featured && (
                              <FaStar className="text-yellow-500" size={16} />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {template.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {template.components} components
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUseTemplate(template)}
                                className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                              >
                                Use Template
                              </button>
                              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                <FaEye size={12} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TemplateManager;
