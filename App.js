// App.js
import React from 'react';
import './App.css';
import ProjectAssignmentsTable from './components/ProjectAssignmentsTable';
import AutoRefreshData from './components/AutoRefreshData';

function App() {
  return (
    <div className="App">
      <h1>Welcome to Employee App</h1>
      <main className="App-main">
        <ProjectAssignmentsTable />
        <AutoRefreshData />
      </main>
    </div>
  );
}

export default App;
