import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaDownload,
  FaFileImage,
  FaFilePdf,
  FaFileCode,
  FaFileAlt,
  FaCopy,
  FaShare,
  FaCloud,
  FaGithub,
  FaSlack,
  FaEnvelope,
  FaTwitter,
  FaLinkedin,
  FaCog,
  FaEye,
} from "react-icons/fa";
import useStore from "../store";
import toast from "react-hot-toast";

const ExportManager = ({ isOpen, onClose }) => {
  const { currentProject, exportProject } = useStore();
  const [selectedFormat, setSelectedFormat] = useState("png");
  const [exportSettings, setExportSettings] = useState({
    includeBackground: true,
    quality: 1.0,
    scale: 2,
    watermark: false,
    theme: "light",
  });
  const [isExporting, setIsExporting] = useState(false);

  const exportFormats = [
    {
      id: "png",
      name: "PNG Image",
      description: "High-quality raster image with transparency",
      icon: FaFileImage,
      extension: ".png",
      type: "image",
    },
    {
      id: "jpg",
      name: "JPEG Image",
      description: "Compressed raster image, smaller file size",
      icon: FaFileImage,
      extension: ".jpg",
      type: "image",
    },
    {
      id: "svg",
      name: "SVG Vector",
      description: "Scalable vector graphics, perfect for print",
      icon: FaFileImage,
      extension: ".svg",
      type: "image",
    },
    {
      id: "pdf",
      name: "PDF Document",
      description: "Professional document format",
      icon: FaFilePdf,
      extension: ".pdf",
      type: "document",
    },
    {
      id: "json",
      name: "JSON Data",
      description: "Raw project data for import/backup",
      icon: FaFileCode,
      extension: ".json",
      type: "data",
    },
    {
      id: "markdown",
      name: "Markdown Documentation",
      description: "Technical documentation with diagrams",
      icon: FaFileAlt,
      extension: ".md",
      type: "document",
    },
    {
      id: "mermaid",
      name: "Mermaid Diagram",
      description: "Code-based diagram format",
      icon: FaFileCode,
      extension: ".mmd",
      type: "code",
    },
    {
      id: "drawio",
      name: "Draw.io XML",
      description: "Compatible with Draw.io/Lucidchart",
      icon: FaFileCode,
      extension: ".drawio",
      type: "data",
    },
  ];

  const shareOptions = [
    {
      id: "link",
      name: "Share Link",
      icon: FaShare,
      description: "Generate shareable link",
    },
    {
      id: "github",
      name: "GitHub Gist",
      icon: FaGithub,
      description: "Save as GitHub Gist",
    },
    {
      id: "slack",
      name: "Slack",
      icon: FaSlack,
      description: "Share to Slack workspace",
    },
    {
      id: "email",
      name: "Email",
      icon: FaEnvelope,
      description: "Send via email",
    },
    {
      id: "twitter",
      name: "Twitter",
      icon: FaTwitter,
      description: "Share on Twitter",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: FaLinkedin,
      description: "Share on LinkedIn",
    },
  ];

  const handleExport = async () => {
    if (!currentProject) {
      toast.error("No project to export");
      return;
    }

    setIsExporting(true);

    try {
      // switch (selectedFormat) {
      //   case "png":
      //   case "jpg":
      //   case "svg":
      //     await exportAsSVG();
      //     break;
      //   case "pdf":
      //     await exportAsPDF();
      //     break;
      //   case "json":
      //     exportAsJSON();
      //     break;
      //   case "markdown":
      //     exportAsMarkdown();
      //     break;
      //   case "mermaid":
      //     exportAsMermaid();
      //     break;
      //   case "drawio":
      //     exportAsDrawIO();
      //     break;
      //   default:
      //     throw new Error("Unsupported export format");
      // }
      switch (selectedFormat) {
        case "png":
        case "jpg":
          await exportAsImage();
          break;
        case "svg":
          await exportAsSVG();
          break;
        case "pdf":
          await exportAsPDF();
          break;
        case "json":
          exportAsJSON();
          break;
        case "markdown":
          exportAsMarkdown();
          break;
        case "mermaid":
          exportAsMermaid();
          break;
        case "drawio":
          exportAsDrawIO();
          break;
        default:
          throw new Error("Unsupported export format");
      }

      toast.success(`Project exported as ${selectedFormat.toUpperCase()}`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsImage = async () => {
    // Alternative method using canvas API
    try {
      const canvasElement = document.querySelector(".react-flow__viewport");
      if (!canvasElement) {
        throw new Error("Canvas not found");
      }

      // Create a canvas to capture the diagram
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set canvas size based on viewport
      const rect = canvasElement.getBoundingClientRect();
      canvas.width = rect.width * exportSettings.scale;
      canvas.height = rect.height * exportSettings.scale;

      // Set background if enabled
      if (exportSettings.includeBackground) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // For now, we'll create a simple representation
      // In a real implementation, you'd use html2canvas or similar
      ctx.fillStyle = "#3b82f6";
      ctx.font = "16px Inter";
      ctx.fillText(`${currentProject.name} - System Design`, 20, 40);
      ctx.fillText(`${currentProject.nodes?.length || 0} Components`, 20, 70);
      ctx.fillText(`${currentProject.edges?.length || 0} Connections`, 20, 100);
      ctx.fillText(
        "Export feature - Install html2canvas for full functionality",
        20,
        130
      );

      // Convert to desired format
      let mimeType;
      switch (selectedFormat) {
        case "png":
          mimeType = "image/png";
          break;
        case "jpg":
          mimeType = "image/jpeg";
          break;
        default:
          mimeType = "image/png";
      }

      const dataUrl = canvas.toDataURL(mimeType, exportSettings.quality);
      downloadFile(dataUrl, `${currentProject.name}.${selectedFormat}`);

      toast(
        "Basic export completed. Install html2canvas package for full canvas capture.",
        {
          icon: "📷",
          duration: 5000,
        }
      );
    } catch (error) {
      throw new Error("Canvas export failed");
    }
  };

  const exportAsSVG = async () => {
    try {
      if (!currentProject || !currentProject.nodes) {
        throw new Error("No project data to export");
      }

      // Generate SVG representation
      const svgContent = generateSVGFromProject();
      const dataUri =
        "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgContent);
      downloadFile(dataUri, `${currentProject.name}.svg`);
    } catch (error) {
      throw new Error("SVG export failed");
    }
  };

  const exportAsPDF = async () => {
    // This would require additional PDF generation library
    toast("PDF export coming soon! Use PNG export for now.", {
      icon: "📄",
      duration: 4000,
    });
  };

  const exportAsJSON = () => {
    const exportData = exportProject();
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    downloadFile(dataUri, `${currentProject.name}.json`);
  };

  const exportAsMarkdown = () => {
    const markdown = generateMarkdownDoc();
    const dataUri =
      "data:text/markdown;charset=utf-8," + encodeURIComponent(markdown);
    downloadFile(dataUri, `${currentProject.name}.md`);
  };

  const exportAsMermaid = () => {
    const mermaidCode = generateMermaidDiagram();
    const dataUri =
      "data:text/plain;charset=utf-8," + encodeURIComponent(mermaidCode);
    downloadFile(dataUri, `${currentProject.name}.mmd`);
  };

  const exportAsDrawIO = () => {
    toast("Draw.io export coming soon!", {
      icon: "📊",
      duration: 3000,
    });
  };

  const downloadFile = (dataUri, filename) => {
    const link = document.createElement("a");
    link.href = dataUri;
    link.download = filename;
    link.click();
  };

  const generateMarkdownDoc = () => {
    const { nodes, edges } = currentProject;

    return `# ${currentProject.name}

${currentProject.description || "System Design Documentation"}

## Overview
This system design contains ${nodes.length} components and ${
      edges.length
    } connections.

## Components

${nodes
  .map(
    (node) => `### ${node.data.label}
- **Type**: ${node.data.category}
- **Description**: ${node.data.description}
- **Technology**: ${node.data.technology || "Not specified"}
- **Notes**: ${node.data.notes || "None"}
`
  )
  .join("\n")}

## Architecture Connections

${edges
  .map((edge, index) => {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);
    return `${index + 1}. ${sourceNode?.data.label} → ${
      targetNode?.data.label
    }`;
  })
  .join("\n")}

---
*Generated by ArchyNex on ${new Date().toLocaleDateString()}*
`;
  };

  const generateMermaidDiagram = () => {
    const { nodes, edges } = currentProject;

    let mermaid = "graph TD\n";

    // Add nodes
    nodes.forEach((node) => {
      const id = node.id.replace(/[^a-zA-Z0-9]/g, "_");
      mermaid += `    ${id}["${node.data.label}"]\n`;
    });

    // Add edges
    edges.forEach((edge) => {
      const sourceId = edge.source.replace(/[^a-zA-Z0-9]/g, "_");
      const targetId = edge.target.replace(/[^a-zA-Z0-9]/g, "_");
      mermaid += `    ${sourceId} --> ${targetId}\n`;
    });

    return mermaid;
  };

  const handleShare = (option) => {
    switch (option.id) {
      case "link":
        const shareableLink = generateShareableLink();
        navigator.clipboard.writeText(shareableLink);
        toast.success("Shareable link copied to clipboard!");
        break;
      case "github":
        toast("GitHub integration coming soon!", {
          icon: "🐙",
          duration: 3000,
        });
        break;
      case "slack":
        toast("Slack integration coming soon!", {
          icon: "💬",
          duration: 3000,
        });
        break;
      case "email":
        openEmailShare();
        break;
      case "twitter":
        openTwitterShare();
        break;
      case "linkedin":
        openLinkedInShare();
        break;
    }
  };

  const generateShareableLink = () => {
    // In a real app, this would upload to a sharing service
    const encodedProject = btoa(JSON.stringify(currentProject));
    return `${window.location.origin}/shared?data=${encodedProject}`;
  };

  const openEmailShare = () => {
    const subject = `System Design: ${currentProject.name}`;
    const body = `Check out this system design:\n\n${
      currentProject.description
    }\n\nComponents: ${currentProject.nodes?.length || 0}\nConnections: ${
      currentProject.edges?.length || 0
    }`;
    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        body
      )}`
    );
  };

  const openTwitterShare = () => {
    const text = `Check out my system design: ${currentProject.name} - Built with ArchyNex`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    );
  };

  const openLinkedInShare = () => {
    const text = `I just created a system design: ${currentProject.name}`;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        window.location.href
      )}&title=${encodeURIComponent(text)}`
    );
  };

  if (!isOpen) return null;

  // Add this function to your ExportManager component, right before the existing functions

  const generateSVGFromProject = () => {
    const { nodes, edges } = currentProject;

    if (!nodes || nodes.length === 0) {
      throw new Error("No nodes to export");
    }

    // Calculate SVG dimensions based on node positions
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    nodes.forEach((node) => {
      const x = node.position?.x || 0;
      const y = node.position?.y || 0;
      const width = node.width || 150;
      const height = node.height || 80;

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + width);
      maxY = Math.max(maxY, y + height);
    });

    // Add padding
    const padding = 50;
    const svgWidth = maxX - minX + padding * 2;
    const svgHeight = maxY - minY + padding * 2;
    const offsetX = -minX + padding;
    const offsetY = -minY + padding;

    // Start building SVG
    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .node-rect { fill: #3b82f6; stroke: #1e40af; stroke-width: 2; rx: 8; }
      .node-text { fill: white; font-family: Inter, Arial, sans-serif; font-size: 14px; font-weight: 500; text-anchor: middle; dominant-baseline: middle; }
      .edge-line { stroke: #6b7280; stroke-width: 2; fill: none; }
      .edge-arrow { fill: #6b7280; }
    </style>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" class="edge-arrow" />
    </marker>
  </defs>`;

    // Add background if enabled
    if (exportSettings.includeBackground) {
      svg += `\n  <rect width="100%" height="100%" fill="#f9fafb"/>`;
    }

    // Add edges first (so they appear behind nodes)
    if (edges && edges.length > 0) {
      edges.forEach((edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        const targetNode = nodes.find((n) => n.id === edge.target);

        if (sourceNode && targetNode) {
          const sourceX =
            (sourceNode.position?.x || 0) +
            offsetX +
            (sourceNode.width || 150) / 2;
          const sourceY =
            (sourceNode.position?.y || 0) +
            offsetY +
            (sourceNode.height || 80) / 2;
          const targetX =
            (targetNode.position?.x || 0) +
            offsetX +
            (targetNode.width || 150) / 2;
          const targetY =
            (targetNode.position?.y || 0) +
            offsetY +
            (targetNode.height || 80) / 2;

          svg += `\n  <line x1="${sourceX}" y1="${sourceY}" x2="${targetX}" y2="${targetY}" class="edge-line" marker-end="url(#arrowhead)"/>`;
        }
      });
    }

    // Add nodes
    nodes.forEach((node) => {
      const x = (node.position?.x || 0) + offsetX;
      const y = (node.position?.y || 0) + offsetY;
      const width = node.width || 150;
      const height = node.height || 80;
      const label = node.data?.label || "Node";

      svg += `\n  <rect x="${x}" y="${y}" width="${width}" height="${height}" class="node-rect"/>`;
      svg += `\n  <text x="${x + width / 2}" y="${
        y + height / 2
      }" class="node-text">${escapeXml(label)}</text>`;
    });

    svg += "\n</svg>";

    return svg;
  };

  // Helper function to escape XML special characters
  const escapeXml = (text) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

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
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[70vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Export & Share
              </h2>
              <p className="text-sm text-gray-600">
                Export your design in various formats or share with others
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
            {/* Export Formats */}
            <div className="flex-1 p-6 overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Export Formats
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {exportFormats.map((format) => {
                  const Icon = format.icon;
                  return (
                    <button
                      key={format.id}
                      onClick={() => setSelectedFormat(format.id)}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        selectedFormat === format.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon
                          className={
                            selectedFormat === format.id
                              ? "text-blue-600"
                              : "text-gray-600"
                          }
                        />
                        <span className="font-medium text-gray-800">
                          {format.name}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {format.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Export Settings */}
              {["png", "jpg", "svg"].includes(selectedFormat) && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <FaCog />
                    Export Settings
                  </h4>
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Include Background
                      </label>
                      <input
                        type="checkbox"
                        checked={exportSettings.includeBackground}
                        onChange={(e) =>
                          setExportSettings((prev) => ({
                            ...prev,
                            includeBackground: e.target.checked,
                          }))
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Quality
                      </label>
                      <select
                        value={exportSettings.quality}
                        onChange={(e) =>
                          setExportSettings((prev) => ({
                            ...prev,
                            quality: parseFloat(e.target.value),
                          }))
                        }
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        <option value={0.8}>Low (80%)</option>
                        <option value={1.0}>High (100%)</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Scale
                      </label>
                      <select
                        value={exportSettings.scale}
                        onChange={(e) =>
                          setExportSettings((prev) => ({
                            ...prev,
                            scale: parseInt(e.target.value),
                          }))
                        }
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        <option value={1}>1x</option>
                        <option value={2}>2x (Recommended)</option>
                        <option value={4}>4x (High DPI)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={isExporting || !currentProject}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <FaDownload />
                    Export as {selectedFormat.toUpperCase()}
                  </>
                )}
              </button>
            </div>

            {/* Share Options */}
            <div className="w-80 bg-gray-50 p-6 border-l border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Share Options
              </h3>
              <div className="space-y-2">
                {shareOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleShare(option)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-white rounded-lg transition-colors text-left"
                    >
                      <Icon className="text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-800">
                          {option.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {option.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Preview */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-800 mb-2">Preview</h4>
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>{currentProject?.name || "No Project"}</strong>
                  </div>
                  <div className="text-xs text-gray-500">
                    {currentProject?.nodes?.length || 0} components •{" "}
                    {currentProject?.edges?.length || 0} connections
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExportManager;
