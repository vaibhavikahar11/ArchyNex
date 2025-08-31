import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY =
  process.env.NEXT_PUBLIC_STORAGE_KEY || "system_design_projects";

// Load data from localStorage
const loadFromStorage = () => {
  if (typeof window === "undefined")
    return { projects: [], currentProject: null };

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { projects: [], currentProject: null };
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return { projects: [], currentProject: null };
  }
};

// Save data to localStorage
const saveToStorage = (data) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

const useStore = create((set, get) => ({
  // State
  projects: [],
  currentProject: null,
  selectedNode: null,
  isAiAssistantOpen: false,
  isLoading: false,

  // Initialize store
  initialize: () => {
    const data = loadFromStorage();
    set({ projects: data.projects, currentProject: data.currentProject });
  },

  // Project actions
  createProject: (name, description = "") => {
    const newProject = {
      id: uuidv4(),
      name,
      description,
      nodes: [],
      edges: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const state = get();
    const updatedProjects = [...state.projects, newProject];
    const newState = { projects: updatedProjects, currentProject: newProject };

    set(newState);
    saveToStorage(newState);

    return newProject;
  },

  deleteProject: (projectId) => {
    const state = get();
    const updatedProjects = state.projects.filter((p) => p.id !== projectId);
    const newCurrentProject =
      state.currentProject?.id === projectId ? null : state.currentProject;
    const newState = {
      projects: updatedProjects,
      currentProject: newCurrentProject,
    };

    set(newState);
    saveToStorage(newState);
  },

  setCurrentProject: (project) => {
    const state = get();
    const newState = { ...state, currentProject: project };
    set(newState);
    saveToStorage(newState);
  },

  updateCurrentProject: (updates) => {
    const state = get();
    if (!state.currentProject) return;

    const updatedProject = {
      ...state.currentProject,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updatedProjects = state.projects.map((p) =>
      p.id === updatedProject.id ? updatedProject : p
    );

    const newState = {
      projects: updatedProjects,
      currentProject: updatedProject,
    };
    set(newState);
    saveToStorage(newState);
  },

  // Node and Edge actions
  updateNodes: (nodes) => {
    get().updateCurrentProject({ nodes });
  },

  updateEdges: (edges) => {
    get().updateCurrentProject({ edges });
  },

  // UI actions
  setSelectedNode: (node) => set({ selectedNode: node }),
  setAiAssistantOpen: (isOpen) => set({ isAiAssistantOpen: isOpen }),
  setLoading: (isLoading) => set({ isLoading }),

  // Export project
  exportProject: (format = "json") => {
    const state = get();
    if (!state.currentProject) return null;

    const exportData = {
      ...state.currentProject,
      exportedAt: new Date().toISOString(),
      format,
    };

    return exportData;
  },

  // Import project
  importProject: (projectData) => {
    const importedProject = {
      ...projectData,
      id: uuidv4(), // Generate new ID to avoid conflicts
      importedAt: new Date().toISOString(),
    };

    const state = get();
    const updatedProjects = [...state.projects, importedProject];
    const newState = {
      projects: updatedProjects,
      currentProject: importedProject,
    };

    set(newState);
    saveToStorage(newState);

    return importedProject;
  },
}));

export default useStore;
