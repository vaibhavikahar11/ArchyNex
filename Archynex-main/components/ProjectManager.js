import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaDownload,
  FaUpload,
  FaCopy,
  FaCalendarAlt,
  FaProjectDiagram,
  FaTimes,
} from "react-icons/fa";
import useStore from "../store";
import toast from "react-hot-toast";

const ProjectManager = ({ isOpen, onClose }) => {
  const {
    projects,
    currentProject,
    createProject,
    deleteProject,
    setCurrentProject,
    exportProject,
    importProject,
  } = useStore();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) {
      toast.error("Project name is required");
      return;
    }

    const project = createProject(newProjectName, newProjectDescription);
    setCurrentProject(project);
    setNewProjectName("");
    setNewProjectDescription("");
    setShowCreateForm(false);
    toast.success("Project created successfully!");
    onClose();
  };

  const handleDeleteProject = (project) => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      deleteProject(project.id);
      toast.success("Project deleted");
    }
  };

  const handleExportProject = (project) => {
    try {
      const exportData = exportProject();
      if (!exportData) {
        toast.error("No project data to export");
        return;
      }

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const exportFileDefaultName = `${project.name.replace(
        /\s+/g,
        "_"
      )}_system_design.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();

      toast.success("Project exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export project");
    }
  };

  const handleImportProject = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const projectData = JSON.parse(e.target.result);
        const importedProject = importProject(projectData);
        setCurrentProject(importedProject);
        toast.success("Project imported successfully!");
        onClose();
      } catch (error) {
        console.error("Import error:", error);
        toast.error("Failed to import project. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <FaProjectDiagram className="text-2xl text-blue-500" />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Project Manager
                </h2>
                <p className="text-sm text-gray-600">
                  Manage your system design projects
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <FaPlus />
                New Project
              </button>

              <label className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer">
                <FaUpload />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportProject}
                  className="hidden"
                />
              </label>
            </div>

            <div className="text-sm text-gray-600">
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </div>
          </div>

          {/* Projects List */}
          <div className="flex-1 overflow-y-auto p-6">
            {showCreateForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
              >
                <form onSubmit={handleCreateProject}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter project name"
                      autoFocus
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newProjectDescription}
                      onChange={(e) => setNewProjectDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter project description (optional)"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Create Project
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {projects.length === 0 ? (
              <div className="text-center py-12">
                <FaProjectDiagram className="mx-auto text-6xl text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No projects yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Create your first system design project to get started
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
                >
                  <FaPlus />
                  Create First Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`
                      bg-white border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer
                      ${
                        currentProject?.id === project.id
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-gray-300"
                      }
                    `}
                    onClick={() => {
                      setCurrentProject(project);
                      onClose();
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-800 truncate flex-1">
                        {project.name}
                      </h3>
                      {currentProject?.id === project.id && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">
                          Current
                        </span>
                      )}
                    </div>

                    {project.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {project.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <FaProjectDiagram />
                        {project.nodes?.length || 0} components
                      </span>
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt />
                        {formatDate(project.updatedAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportProject(project);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                        title="Export Project"
                      >
                        <FaDownload className="text-gray-500" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(
                            JSON.stringify(project, null, 2)
                          );
                          toast.success("Project copied to clipboard");
                        }}
                        className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                        title="Copy Project"
                      >
                        <FaCopy className="text-gray-500" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project);
                        }}
                        className="p-2 hover:bg-red-100 rounded-md transition-colors ml-auto"
                        title="Delete Project"
                      >
                        <FaTrash className="text-red-500" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectManager;
