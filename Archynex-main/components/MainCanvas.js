import React, { useCallback, useRef } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ConnectionLineType,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion } from "framer-motion";
import CustomNode from "./CustomNode";
import NodePropertiesPanel from "./NodePropertiesPanel";
import { createNode } from "../lib/node-types";
import useStore from "../store";
import toast from "react-hot-toast";

// Properly define node types
const nodeTypes = {
  custom: CustomNode,
};

const defaultEdgeOptions = {
  animated: true,
  type: "smoothstep",
};

const connectionLineStyle = {
  strokeWidth: 2,
  stroke: "#3b82f6",
};

const MainCanvas = () => {
  const reactFlowWrapper = useRef(null);
  const {
    currentProject,
    updateNodes,
    updateEdges,
    selectedNode,
    setSelectedNode,
  } = useStore();

  const [nodes, setNodes, onNodesChange] = useNodesState(
    currentProject?.nodes || []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    currentProject?.edges || []
  );

  // Update store when nodes or edges change
  React.useEffect(() => {
    updateNodes(nodes);
  }, [nodes, updateNodes]);

  React.useEffect(() => {
    updateEdges(edges);
  }, [edges, updateEdges]);

  // Update local state when project changes
  React.useEffect(() => {
    if (currentProject) {
      setNodes(currentProject.nodes || []);
      setEdges(currentProject.edges || []);
    }
  }, [currentProject, setNodes, setEdges]);

  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        id: `edge-${Date.now()}`,
        animated: true,
        style: { stroke: "#3b82f6", strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const nodeType = event.dataTransfer.getData("application/reactflow");

      if (typeof nodeType === "undefined" || !nodeType) {
        return;
      }

      const position = {
        x: event.clientX - reactFlowBounds.left - 60,
        y: event.clientY - reactFlowBounds.top - 60,
      };

      try {
        const newNode = createNode(nodeType, position);
        setNodes((nds) => nds.concat(newNode));
        toast.success("Component added to canvas");
      } catch (error) {
        console.error("Error creating node:", error);
        toast.error("Failed to add component");
      }
    },
    [setNodes]
  );

  const onNodeClick = useCallback(
    (event, node) => {
      setSelectedNode(node);
    },
    [setSelectedNode]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  const handleDeleteSelected = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) =>
        eds.filter(
          (e) => e.source !== selectedNode.id && e.target !== selectedNode.id
        )
      );
      setSelectedNode(null);
      toast.success("Component deleted");
    }
  }, [selectedNode, setNodes, setEdges, setSelectedNode]);

  const handleClearCanvas = useCallback(() => {
    if (nodes.length === 0) return;

    if (window.confirm("Are you sure you want to clear the entire canvas?")) {
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
      toast.success("Canvas cleared");
    }
  }, [nodes.length, setNodes, setEdges, setSelectedNode]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        if (
          selectedNode &&
          document.activeElement.tagName !== "INPUT" &&
          document.activeElement.tagName !== "TEXTAREA"
        ) {
          handleDeleteSelected();
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [selectedNode, handleDeleteSelected]);

  if (!currentProject) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Welcome to ArchyNex
          </h3>
          <p className="text-gray-600 mb-6 max-w-md">
            Create a new project or select an existing one to start building
            your system architecture
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>• Drag components from the sidebar to the canvas</p>
            <p>• Connect components to show data flow</p>
            <p>• Use AI assistant for design suggestions</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionLineStyle={connectionLineStyle}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#f1f5f9" gap={20} />

        <Controls
          position="bottom-right"
          className="bg-white shadow-lg border border-gray-200 rounded-lg"
        />

        <MiniMap
          position="bottom-left"
          className="bg-white shadow-lg border border-gray-200 rounded-lg"
          nodeColor={(node) => node.data.color}
          maskColor="rgba(0, 0, 0, 0.1)"
        />

        {/* Canvas Controls Panel */}
        <Panel position="top-right" className="space-y-2">
          {/* Show canvas stats */}
          {nodes.length > 0 && (
            <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-3">
              <div className="text-sm text-gray-600 mb-2">
                {nodes.length} components • {edges.length} connections
              </div>
              <button
                onClick={handleClearCanvas}
                className="w-full px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
              >
                Clear Canvas
              </button>
            </div>
          )}
        </Panel>

        {/* Instructions Overlay */}
        {nodes.length === 0 && (
          <Panel position="top-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md"
            >
              <div className="text-center">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  Get Started
                </h4>
                <p className="text-xs text-blue-600 mb-2">
                  Drag components from the sidebar to start building your system
                  design
                </p>
                <p className="text-xs text-blue-500">
                  💡 Click on components to edit their names and descriptions
                </p>
              </div>
            </motion.div>
          </Panel>
        )}
      </ReactFlow>

      {/* Node Properties Panel */}
      <NodePropertiesPanel />
    </div>
  );
};

export default MainCanvas;
