const express = require('express');
const router = express.Router();

// Define route to fetch latest project assignments
router.get('/latest_project_assignments', async (req, res) => {
  try {
    // Fetch latest project assignments from MongoDB
    const ProjectAssignment = mongoose.model('ProjectAssignment'); // Access the ProjectAssignment model from mongoose
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

// Export router
module.exports = router;
