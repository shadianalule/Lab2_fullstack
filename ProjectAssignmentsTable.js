import React, { useState, useEffect } from 'react';

const ProjectAssignmentsTable = () => {
  const [projectAssignments, setProjectAssignments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const assignmentsResponse = await fetch('http://localhost:3001/api/project_assignments');
        const employeesResponse = await fetch('http://localhost:3001/api/employees');
        const projectsResponse = await fetch('http://localhost:3001/api/projects');

        if (!assignmentsResponse.ok || !employeesResponse.ok || !projectsResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const assignmentsData = await assignmentsResponse.json();
        const employeesData = await employeesResponse.json();
        const projectsData = await projectsResponse.json();

        // Update projectAssignments with employee names and project names
        const updatedAssignments = assignmentsData.map(assignment => {
          const employee = employeesData.find(employee => employee.employee_id === assignment.employee_id);
          const project = projectsData.find(project => project.project_code === assignment.project_code);
          return {
            ...assignment,
            employee_name: employee ? employee.full_name : 'Unknown',
            project_name: project ? project.project_name : 'Unknown'
          };
        });

        setProjectAssignments(updatedAssignments);
      } catch (error) {
        console.error('Error fetching project assignments:', error);
      }
    };
    
    // Fetch data initially
    fetchData();
  }, []);
  
  return (
    <div>
     
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Project Name</th>
            <th>Start Date</th>
          </tr>
        </thead>
        <tbody>
          {projectAssignments.map((assignment, index) => (
            <tr key={index}>
              <td>{assignment.employee_id}</td>
              <td>{assignment.employee_name}</td>
              <td>{assignment.project_name}</td>
              <td>{new Date(assignment.start_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectAssignmentsTable;
