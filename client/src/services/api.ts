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

export interface JoinRequest {
  _id: string;
  projectId: string;
  projectTitle?: string;
  name: string;
  email: string;
  message: string;
  status: "Pending" | "Accepted" | "Rejected";
  createdAt: string;
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

export const createJoinRequest = async (
  projectId: string,
  data: { name: string; email: string; message: string }
) => {
  const response = await api.post(`/projects/${projectId}/requests`, data);
  return response.data.request as JoinRequest;
};

export const getProjectRequests = async (projectId: string) => {
  const response = await api.get(`/projects/${projectId}/requests`);
  return response.data.requests as JoinRequest[];
};

export const updateRequestStatus = async (
  requestId: string,
  status: "Accepted" | "Rejected" | "Pending"
) => {
  const response = await api.patch(`/requests/${requestId}`, { status });
  return response.data.request as JoinRequest;
};

export const getUserRequests = async (email: string) => {
  const response = await api.get(`/requests?email=${encodeURIComponent(email)}`);
  return response.data.requests as JoinRequest[];
};

export default api;
