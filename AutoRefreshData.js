import React, { useState, useEffect } from 'react';
import './AutoRefreshData.css'; // Import CSS file

const AutoRefreshData = () => {
  const [projectAssignments, setProjectAssignments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch project assignments from the /api/project_assignments endpoint
        const assignmentsResponse = await fetch('http://localhost:3001/api/project_assignments');
        if (!assignmentsResponse.ok) {
          throw new Error('Error fetching project assignments');
        }
        const assignmentsData = await assignmentsResponse.json();

        // Fetch employees from the /api/employees endpoint
        const employeesResponse = await fetch('http://localhost:3001/api/employees');
        if (!employeesResponse.ok) {
          throw new Error('Error fetching employees');
        }
        const employeesData = await employeesResponse.json();

        // Fetch projects from the /api/projects endpoint
        const projectsResponse = await fetch('http://localhost:3001/api/projects');
        if (!projectsResponse.ok) {
          throw new Error('Error fetching projects');
        }
        const projectsData = await projectsResponse.json();

        // Combine project assignments with employee and project data
        const assignmentsWithNames = assignmentsData.map(assignment => {
          const employee = employeesData.find(emp => emp.employee_id === assignment.employee_id);
          const project = projectsData.find(proj => proj.project_code === assignment.project_code);
          return {
            ...assignment,
            employee_name: employee ? employee.full_name : 'Unknown',
            project_name: project ? project.project_name : 'Unknown'
          };
        });

        // Sort the assignments by start date in descending order and limit to 5
        const latestAssignments = assignmentsWithNames.sort((a, b) => new Date(b.start_date) - new Date(a.start_date)).slice(0, 5);

        setProjectAssignments(latestAssignments);
        setError(null); // Clear any previous error
      } catch (error) {
        console.error('Error fetching latest project assignments:', error);
        setError('Error fetching latest project assignments');
      }
    };

    // Fetch data initially
    fetchData();

    // Set up interval to fetch data every 5 minutes
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="auto-refresh-data">
      {error ? (
        <p className="error">Error: {error}</p>
      ) : (
        <div>
          <h2>Latest Project Assignments</h2>
          <ul>
            {projectAssignments.map((assignment) => (
              <li key={assignment._id}>
                <strong>Employee ID:</strong> {assignment.employee_id}, 
                <strong> Employee Name:</strong> {assignment.employee_name}, 
                <strong> Project Name:</strong> {assignment.project_name}, 
                <strong> Start Date:</strong> {assignment.start_date}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AutoRefreshData;
