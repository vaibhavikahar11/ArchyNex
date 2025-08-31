import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaPalette,
  FaTag,
  FaFileAlt,
  FaTrash,
  FaCopy,
} from "react-icons/fa";
import useStore from "../store";
import toast from "react-hot-toast";

const NodePropertiesPanel = () => {
  const {
    selectedNode,
    setSelectedNode,
    currentProject,
    updateCurrentProject,
  } = useStore();
  const [nodeData, setNodeData] = useState(null);

  // Color options for nodes
  const colorOptions = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#ec4899",
    "#6b7280",
  ];

  useEffect(() => {
    if (selectedNode) {
      setNodeData(selectedNode.data);
    }
  }, [selectedNode]);

  if (!selectedNode || !nodeData) return null;

  const handleDataChange = (field, value) => {
    const updatedData = { ...nodeData, [field]: value };
    setNodeData(updatedData);

    // Update in real-time
    updateNodeInProject(updatedData);
  };

  const updateNodeInProject = (newData) => {
    if (!currentProject) return;

    const updatedNodes = currentProject.nodes.map((node) =>
      node.id === selectedNode.id
        ? { ...node, data: { ...node.data, ...newData } }
        : node
    );

    updateCurrentProject({ nodes: updatedNodes });
  };

  const handleDeleteNode = () => {
    if (!currentProject) return;

    const updatedNodes = currentProject.nodes.filter(
      (node) => node.id !== selectedNode.id
    );
    const updatedEdges = currentProject.edges.filter(
      (edge) =>
        edge.source !== selectedNode.id && edge.target !== selectedNode.id
    );

    updateCurrentProject({
      nodes: updatedNodes,
      edges: updatedEdges,
    });

    setSelectedNode(null);
    toast.success("Component deleted");
  };

  const handleDuplicateNode = () => {
    if (!currentProject) return;

    const newNode = {
      ...selectedNode,
      id: `${selectedNode.data.id}-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      position: {
        x: selectedNode.position.x + 50,
        y: selectedNode.position.y + 50,
      },
      data: {
        ...selectedNode.data,
        label: `${selectedNode.data.label} Copy`,
      },
    };

    const updatedNodes = [...currentProject.nodes, newNode];
    updateCurrentProject({ nodes: updatedNodes });
    setSelectedNode(newNode);
    toast.success("Component duplicated");
  };

  const Icon = nodeData.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl border-l border-gray-200 z-40 overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            {Icon && (
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${nodeData.color}20` }}
              >
                <Icon size={16} style={{ color: nodeData.color }} />
              </div>
            )}
            <h3 className="font-semibold text-gray-800">Properties</h3>
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FaTag />
              Basic Information
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Component Name
                </label>
                <input
                  type="text"
                  value={nodeData.label}
                  onChange={(e) => handleDataChange("label", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter component name"
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  value={nodeData.description}
                  onChange={(e) =>
                    handleDataChange("description", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  placeholder="Enter component description"
                  rows={3}
                  maxLength={200}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Category
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 capitalize">
                  {nodeData.category}
                </div>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FaPalette />
              Appearance
            </h4>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Color Theme
              </label>
              <div className="grid grid-cols-5 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleDataChange("color", color)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      nodeData.color === color
                        ? "border-gray-800 scale-110"
                        : "border-gray-300 hover:border-gray-500"
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Custom Properties */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <FaFileAlt />
              Additional Details
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Technology Stack
                </label>
                <input
                  type="text"
                  value={nodeData.technology || ""}
                  onChange={(e) =>
                    handleDataChange("technology", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g., Node.js, PostgreSQL, Redis"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Notes
                </label>
                <textarea
                  value={nodeData.notes || ""}
                  onChange={(e) => handleDataChange("notes", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  placeholder="Additional notes or specifications"
                  rows={2}
                  maxLength={300}
                />
              </div>
            </div>
          </div>

          {/* Node Information */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Node Info
            </h4>
            <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-1">
              <div>
                ID: <span className="font-mono">{selectedNode.id}</span>
              </div>
              <div>
                Type: <span className="capitalize">{selectedNode.type}</span>
              </div>
              <div>
                Position: ({Math.round(selectedNode.position.x)},{" "}
                {Math.round(selectedNode.position.y)})
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleDuplicateNode}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              <FaCopy />
              Duplicate Component
            </button>

            <button
              onClick={handleDeleteNode}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
            >
              <FaTrash />
              Delete Component
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NodePropertiesPanel;
