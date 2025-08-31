import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUndo,
  FaRedo,
  FaSearch,
  FaFilter,
  FaLayerGroup,
  FaRuler,
  FaExpand,
  FaCompress,
  FaEye,
  FaEyeSlash,
  FaCopy,
  FaPaste,
  FaMousePointer,
  FaSquare,
  FaCircle,
  FaArrowRight,
  FaFont,
  FaImage,
  FaStickyNote,
  FaMagic,
  FaClone,
  FaAlignCenter,
  FaAlignLeft,
  FaAlignRight,
  FaObjectGroup,
  FaObjectUngroup,
  FaBringForward,
  FaSendBackward,
  FaLock,
  FaUnlock,
  FaBookmark,
} from "react-icons/fa";
import useStore from "../store";
import toast from "react-hot-toast";

const AdvancedToolbar = ({
  onZoomIn,
  onZoomOut,
  onFitView,
  onToggleGrid,
  onToggleMinimap,
  showGrid,
  showMinimap,
}) => {
  const {
    currentProject,
    updateCurrentProject,
    selectedNode,
    setSelectedNode,
  } = useStore();

  const [activeMode, setActiveMode] = useState("select");
  const [showFilters, setShowFilters] = useState(false);
  const [copiedNode, setCopiedNode] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Tool modes
  const toolModes = [
    { id: "select", icon: FaMousePointer, label: "Select", shortcut: "V" },
    { id: "pan", icon: FaMousePointer, label: "Pan", shortcut: "H" },
    { id: "rectangle", icon: FaSquare, label: "Rectangle", shortcut: "R" },
    { id: "circle", icon: FaCircle, label: "Circle", shortcut: "C" },
    { id: "arrow", icon: FaArrowRight, label: "Arrow", shortcut: "A" },
    { id: "text", icon: FaFont, label: "Text", shortcut: "T" },
    { id: "note", icon: FaStickyNote, label: "Note", shortcut: "N" },
  ];

  const handleToolSelect = (toolId) => {
    setActiveMode(toolId);
    toast.success(
      `${toolModes.find((t) => t.id === toolId)?.label} tool activated`
    );
  };

  const handleCopy = () => {
    if (selectedNode) {
      setCopiedNode(selectedNode);
      toast.success("Component copied");
    } else {
      toast.error("Select a component to copy");
    }
  };

  const handlePaste = () => {
    if (copiedNode && currentProject) {
      const newNode = {
        ...copiedNode,
        id: `${copiedNode.data.id}-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        position: {
          x: copiedNode.position.x + 50,
          y: copiedNode.position.y + 50,
        },
        data: {
          ...copiedNode.data,
          label: `${copiedNode.data.label} Copy`,
        },
      };

      const updatedNodes = [...currentProject.nodes, newNode];
      updateCurrentProject({ nodes: updatedNodes });
      setSelectedNode(newNode);
      toast.success("Component pasted");
    } else {
      toast.error("Nothing to paste");
    }
  };

  const handleDuplicate = () => {
    if (selectedNode && currentProject) {
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
    } else {
      toast.error("Select a component to duplicate");
    }
  };

  const handleAutoLayout = () => {
    if (!currentProject || currentProject.nodes.length === 0) {
      toast.error("No components to arrange");
      return;
    }

    // Simple auto-layout algorithm
    const layoutNodes = currentProject.nodes.map((node, index) => {
      const col = index % 4;
      const row = Math.floor(index / 4);
      return {
        ...node,
        position: {
          x: 100 + col * 200,
          y: 100 + row * 150,
        },
      };
    });

    updateCurrentProject({ nodes: layoutNodes });
    toast.success("Components auto-arranged");
  };

  const handleAlignNodes = (alignment) => {
    if (!currentProject || currentProject.nodes.length < 2) {
      toast.error("Select multiple components to align");
      return;
    }

    // Simple alignment logic
    const nodes = currentProject.nodes;
    let alignedNodes;

    switch (alignment) {
      case "left":
        const leftX = Math.min(...nodes.map((n) => n.position.x));
        alignedNodes = nodes.map((n) => ({
          ...n,
          position: { ...n.position, x: leftX },
        }));
        break;
      case "center":
        const avgX =
          nodes.reduce((sum, n) => sum + n.position.x, 0) / nodes.length;
        alignedNodes = nodes.map((n) => ({
          ...n,
          position: { ...n.position, x: avgX },
        }));
        break;
      case "right":
        const rightX = Math.max(...nodes.map((n) => n.position.x));
        alignedNodes = nodes.map((n) => ({
          ...n,
          position: { ...n.position, x: rightX },
        }));
        break;
      default:
        return;
    }

    updateCurrentProject({ nodes: alignedNodes });
    toast.success(`Components aligned ${alignment}`);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Left Section - Tools */}
        <div className="flex items-center gap-1">
          {/* Tool Modes */}
          <div className="flex items-center gap-1 mr-4 p-1 bg-gray-100 rounded-lg">
            {toolModes.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => handleToolSelect(tool.id)}
                  className={`p-2 rounded transition-all duration-200 ${
                    activeMode === tool.id
                      ? "bg-blue-500 text-white shadow-md"
                      : "hover:bg-gray-200 text-gray-600"
                  }`}
                  title={`${tool.label} (${tool.shortcut})`}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 mr-4">
            <button
              onClick={handleCopy}
              disabled={!selectedNode}
              className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
              title="Copy (Ctrl+C)"
            >
              <FaCopy size={16} />
            </button>
            <button
              onClick={handlePaste}
              disabled={!copiedNode}
              className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
              title="Paste (Ctrl+V)"
            >
              <FaPaste size={16} />
            </button>
            <button
              onClick={handleDuplicate}
              disabled={!selectedNode}
              className="p-2 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
              title="Duplicate (Ctrl+D)"
            >
              <FaClone size={16} />
            </button>
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-1 mr-4">
            <button
              onClick={() => handleAlignNodes("left")}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Align Left"
            >
              <FaAlignLeft size={16} />
            </button>
            <button
              onClick={() => handleAlignNodes("center")}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Align Center"
            >
              <FaAlignCenter size={16} />
            </button>
            <button
              onClick={() => handleAlignNodes("right")}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Align Right"
            >
              <FaAlignRight size={16} />
            </button>
            <button
              onClick={handleAutoLayout}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Auto Layout"
            >
              <FaMagic size={16} />
            </button>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <FaSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={14}
            />
            <input
              type="text"
              placeholder="Search components..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded transition-colors ${
              showFilters ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
            }`}
            title="Filters"
          >
            <FaFilter size={16} />
          </button>
        </div>

        {/* Right Section - View Controls */}
        <div className="flex items-center gap-1">
          {/* View Options */}
          <button
            onClick={onToggleGrid}
            className={`p-2 rounded transition-colors ${
              showGrid ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
            }`}
            title="Toggle Grid"
          >
            <FaLayerGroup size={16} />
          </button>
          <button
            onClick={onToggleMinimap}
            className={`p-2 rounded transition-colors ${
              showMinimap ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
            }`}
            title="Toggle Minimap"
          >
            {showMinimap ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 ml-2 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={onZoomOut}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Zoom Out (-)"
            >
              <FaCompress size={16} />
            </button>
            <button
              onClick={onFitView}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Fit View (0)"
            >
              <FaExpand size={16} />
            </button>
            <button
              onClick={onZoomIn}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Zoom In (+)"
            >
              <FaRuler size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-2 p-3 bg-gray-50 rounded-lg border"
          >
            <div className="flex items-center gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700">
                  Category:
                </label>
                <select className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm">
                  <option value="">All</option>
                  <option value="compute">Compute</option>
                  <option value="storage">Storage</option>
                  <option value="network">Network</option>
                  <option value="security">Security</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">
                  Type:
                </label>
                <select className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm">
                  <option value="">All</option>
                  <option value="service">Service</option>
                  <option value="database">Database</option>
                  <option value="server">Server</option>
                </select>
              </div>
              <button
                onClick={() => toast.success("Filters applied")}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Apply
              </button>
              <button
                onClick={() => {
                  setShowFilters(false);
                  toast.success("Filters cleared");
                }}
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedToolbar;
