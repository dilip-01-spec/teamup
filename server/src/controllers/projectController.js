
import Project from "../models/Project.js";

// CREATE PROJECT
export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      skillsRequired,
      lookingFor,
      creatorName,
      creatorEmail,
      commitment
    } = req.body;

    if (!title || !description || !category || !creatorName) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    const project = await Project.create({
      title,
      description,
      category,
      skillsRequired: skillsRequired || [],
      lookingFor: lookingFor || [],
      creatorName,
      creatorEmail: creatorEmail || "",
      commitment: commitment || "Flexible"
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create project"
    });
  }
};

// GET ALL PROJECTS
export const getProjects = async (req, res) => {
  try {
    const { search, category, skill, status } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (status) {
      filter.status = status;
    }

    if (skill) {
      filter.skillsRequired = {
        $regex: skill,
        $options: "i"
      };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } }
      ];
    }

    const projects = await Project.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects"
    });
  }
};

// GET SINGLE PROJECT
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.status(200).json({
      success: true,
      project
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid project ID"
    });
  }
};

// UPDATE PROJECT
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update project"
    });
  }
};

// DELETE PROJECT
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully"
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete project"
    });
  }
};

