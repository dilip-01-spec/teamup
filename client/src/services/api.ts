
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  skillsRequired: string[];
  lookingFor: string[];
  creatorName: string;
  creatorEmail?: string;
  commitment: "Part-time" | "Full-time" | "Flexible";
  status: "Open" | "In Progress" | "Completed";
  createdAt: string;
}

export interface CreateProjectData {
  title: string;
  description: string;
  category: string;
  skillsRequired: string[];
  lookingFor: string[];
  creatorName: string;
  creatorEmail?: string;
  commitment: "Part-time" | "Full-time" | "Flexible";
}

export const getProjects = async () => {
  const response = await api.get("/projects");
  return response.data.projects as Project[];
};

export const getProject = async (id: string) => {
  const response = await api.get(`/projects/${id}`);
  return response.data.project as Project;
};

export const createProject = async (data: CreateProjectData) => {
  const response = await api.post("/projects", data);
  return response.data.project as Project;
};

export default api;

