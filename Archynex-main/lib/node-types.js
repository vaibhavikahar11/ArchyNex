import React from "react";
import {
  FaServer,
  FaDatabase,
  FaCloud,
  FaNetworkWired,
  FaShieldAlt,
  FaMobile,
  FaDesktop,
  FaCogs,
  FaChartLine,
  FaKey,
  FaFileAlt,
  FaUsers,
  FaRocket,
  FaBolt,
  FaHdd,
  FaBalanceScale,
  FaSearch,
  FaEnvelope,
  FaBell,
  FaLock,
} from "react-icons/fa";

// Default fallback icon component
const DefaultIcon = ({ size = 24, style }) => (
  <div
    className="flex items-center justify-center bg-gray-400 rounded text-white font-bold"
    style={{
      width: size,
      height: size,
      fontSize: size * 0.5,
      ...style,
    }}
  >
    ?
  </div>
);

export const nodeTypes = {
  // Compute & Servers
  server: {
    id: "server",
    label: "Server",
    icon: FaServer,
    color: "#3b82f6",
    category: "compute",
    description: "Application server or web server",
  },
  microservice: {
    id: "microservice",
    label: "Microservice",
    icon: FaCogs,
    color: "#10b981",
    category: "compute",
    description: "Individual microservice component",
  },
  container: {
    id: "container",
    label: "Container",
    icon: FaRocket,
    color: "#f59e0b",
    category: "compute",
    description: "Docker container or pod",
  },

  // Databases
  database: {
    id: "database",
    label: "Database",
    icon: FaDatabase,
    color: "#8b5cf6",
    category: "storage",
    description: "Relational or NoSQL database",
  },
  cache: {
    id: "cache",
    label: "Cache",
    icon: FaBolt,
    color: "#ef4444",
    category: "storage",
    description: "Redis, Memcached, or in-memory cache",
  },
  storage: {
    id: "storage",
    label: "Storage",
    icon: FaHdd,
    color: "#6b7280",
    category: "storage",
    description: "File storage or object storage",
  },

  // Network & Infrastructure
  loadBalancer: {
    id: "loadBalancer",
    label: "Load Balancer",
    icon: FaBalanceScale,
    color: "#06b6d4",
    category: "network",
    description: "Load balancer or reverse proxy",
  },
  cdn: {
    id: "cdn",
    label: "CDN",
    icon: FaNetworkWired,
    color: "#84cc16",
    category: "network",
    description: "Content Delivery Network",
  },
  gateway: {
    id: "gateway",
    label: "API Gateway",
    icon: FaKey,
    color: "#f97316",
    category: "network",
    description: "API Gateway or service mesh",
  },

  // Security
  firewall: {
    id: "firewall",
    label: "Firewall",
    icon: FaShieldAlt,
    color: "#dc2626",
    category: "security",
    description: "Firewall or security layer",
  },
  auth: {
    id: "auth",
    label: "Authentication",
    icon: FaLock,
    color: "#7c3aed",
    category: "security",
    description: "Authentication service",
  },

  // Client Applications
  webApp: {
    id: "webApp",
    label: "Web App",
    icon: FaDesktop,
    color: "#0ea5e9",
    category: "client",
    description: "Web application frontend",
  },
  mobileApp: {
    id: "mobileApp",
    label: "Mobile App",
    icon: FaMobile,
    color: "#ec4899",
    category: "client",
    description: "Mobile application",
  },
  users: {
    id: "users",
    label: "Users",
    icon: FaUsers,
    color: "#64748b",
    category: "client",
    description: "End users or clients",
  },

  // Services
  searchService: {
    id: "searchService",
    label: "Search Service",
    icon: FaSearch,
    color: "#059669",
    category: "service",
    description: "Elasticsearch or search engine",
  },
  emailService: {
    id: "emailService",
    label: "Email Service",
    icon: FaEnvelope,
    color: "#d97706",
    category: "service",
    description: "Email service or SMTP",
  },
  notification: {
    id: "notification",
    label: "Notification",
    icon: FaBell,
    color: "#7c2d12",
    category: "service",
    description: "Push notification service",
  },

  // Monitoring & Analytics
  monitoring: {
    id: "monitoring",
    label: "Monitoring",
    icon: FaChartLine,
    color: "#0f766e",
    category: "ops",
    description: "Monitoring and observability",
  },
  logs: {
    id: "logs",
    label: "Logs",
    icon: FaFileAlt,
    color: "#92400e",
    category: "ops",
    description: "Log aggregation service",
  },

  // Cloud Services
  cloudService: {
    id: "cloudService",
    label: "Cloud Service",
    icon: FaCloud,
    color: "#1e40af",
    category: "cloud",
    description: "Third-party cloud service",
  },
};

export const categories = {
  compute: { label: "Compute", color: "#3b82f6" },
  storage: { label: "Storage", color: "#8b5cf6" },
  network: { label: "Network", color: "#06b6d4" },
  security: { label: "Security", color: "#dc2626" },
  client: { label: "Client", color: "#0ea5e9" },
  service: { label: "Services", color: "#059669" },
  ops: { label: "Operations", color: "#0f766e" },
  cloud: { label: "Cloud", color: "#1e40af" },
};

export const getNodesByCategory = () => {
  const grouped = {};
  Object.values(nodeTypes).forEach((node) => {
    if (!grouped[node.category]) {
      grouped[node.category] = [];
    }
    grouped[node.category].push(node);
  });
  return grouped;
};

export const createNode = (type, position, customData = {}) => {
  const nodeType = nodeTypes[type];
  if (!nodeType) {
    throw new Error(`Unknown node type: ${type}`);
  }

  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: "custom",
    position,
    data: {
      ...nodeType,
      ...customData,
      label: customData.label || nodeType.label,
      icon: nodeType.icon || DefaultIcon, // Ensure icon is always defined
    },
  };
};
