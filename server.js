const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.CONNECTION_URL, {
 
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define MongoDB Schemas and Models
const employeeSchema = new mongoose.Schema({
  employee_id: { type: String, unique: true },
  full_name: String,
  email: String,
  hashed_password: String,
});
const Employee = mongoose.model('Employee', employeeSchema);

const projectSchema = new mongoose.Schema({
  project_code: { type: String, unique: true },
  project_name: String,
  project_description: String,
});
const Project = mongoose.model('Project', projectSchema);

const projectAssignmentSchema = new mongoose.Schema({
  employee_id: String,
  project_code: String,
  start_date: Date,
});
const ProjectAssignment = mongoose.model('ProjectAssignment', projectAssignmentSchema);

app.get('/', (req, res) => {
    res.send('Welcome to the Employee App API');
  });
  app.get('/api/latest_project_assignments', async (req, res) => {
    try {
      const latestProjectAssignments = await ProjectAssignment.find()
        .sort({ start_date: -1 })
        .limit(5);
      res.status(200).json(latestProjectAssignments);
    } catch (error) {
      console.error('Error fetching latest project assignments:', error);
      res.status(500).send('Error fetching latest project assignments');
    }
  });
  
  // POST latest project assignments
  app.post('/api/latest_project_assignments', async (req, res) => {
    try {
      const projectAssignment = new ProjectAssignment(req.body);
      await projectAssignment.save();
      res.status(201).send(projectAssignment);
    } catch (error) {
      res.status(400).send(error);
    }
  });
// Define route to fetch latest project assignments
app.get('/api/project_assignments/latest_project_assignments', async (req, res) => {
  try {
    // Fetch latest project assignments from MongoDB
    const latestProjectAssignments = await ProjectAssignment.find()
      .sort({ start_date: -1 })
      .limit(5);

    res.status(200).json(latestProjectAssignments);
  } catch (error) {
    // Handle error
    console.error('Error fetching latest project assignments:', error);
    res.status(500).send('Error fetching latest project assignments');
  }
});

// Employee endpoints
app.post('/api/employees', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).send(employee);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).send(employees);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Project endpoints
app.post('/api/projects', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).send(project);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).send(projects);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Project Assignment endpoints
app.post('/api/project_assignments', async (req, res) => {
  try {
    const projectAssignment = new ProjectAssignment(req.body);
    await projectAssignment.save();
    res.status(201).send(projectAssignment);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/project_assignments', async (req, res) => {
  try {
    const projectAssignments = await ProjectAssignment.find();
    res.status(200).send(projectAssignments);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
