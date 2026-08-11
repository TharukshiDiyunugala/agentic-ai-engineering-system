'use client';

import { useState, useEffect } from 'react';

// Steps configuration with names, roles, and descriptions
const STEPS = [
  { id: 'planning', label: 'Planner Agent', role: 'Project Manager', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { id: 'development', label: 'Developer Agent', role: 'Software Engineer', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  { id: 'database', label: 'Database Agent', role: 'Database Engineer', icon: 'M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21-3.58 4-8 4s-8-1.79-8-4' },
  { id: 'testing', label: 'Tester Agent', role: 'QA Engineer', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'review', label: 'Reviewer Agent', role: 'Security & QA Auditor', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
  { id: 'security', label: 'Security Agent', role: 'Security Specialist', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { id: 'performance', label: 'Performance Agent', role: 'Performance Engineer', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { id: 'documentation', label: 'Documentation Agent', role: 'Technical Writer', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { id: 'deployment', label: 'Deployment Agent', role: 'DevOps Engineer', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { id: 'notification', label: 'Notification Agent', role: 'Communication Bot', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
];

export default function Dashboard() {
  const [requirement, setRequirement] = useState('Create a task management app with SQLite database');
  const [status, setStatus] = useState('idle'); // idle | calling_api | simulating | completed | failed
  const [errorMsg, setErrorMsg] = useState('');
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [selectedAgent, setSelectedAgent] = useState('planning');
  const [workflowState, setWorkflowState] = useState(null);
  
  // Custom code file viewer selection
  const [selectedSourceFile, setSelectedSourceFile] = useState('');
  const [selectedDbFile, setSelectedDbFile] = useState('');
  const [selectedDeployFile, setSelectedDeployFile] = useState('');

  // Handle triggering the multi-agent builder
  const handleStartWorkflow = async () => {
    if (!requirement.trim()) {
      alert('Please enter your project requirements!');
      return;
    }
    
    setStatus('calling_api');
    setErrorMsg('');
    setWorkflowState(null);
    setCurrentStepIndex(-1);
    
    try {
      // Call local backend endpoint
      const response = await fetch('http://localhost:8000/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requirement }),
      });
      
      if (!response.ok) {
        throw new Error(`Server returned error status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transition to simulating progress step-by-step
      setStatus('simulating');
      let step = 0;
      
      const interval = setInterval(() => {
        if (step < STEPS.length) {
          setCurrentStepIndex(step);
          setSelectedAgent(STEPS[step].id);
          step++;
        } else {
          clearInterval(interval);
          setWorkflowState(data);
          // Set initial sub-files if present
          if (data.source_code && Object.keys(data.source_code).length > 0) {
            setSelectedSourceFile(Object.keys(data.source_code)[0]);
          }
          if (data.database_files && Object.keys(data.database_files).length > 0) {
            setSelectedDbFile(Object.keys(data.database_files)[0]);
          }
          if (data.deployment_files && Object.keys(data.deployment_files).length > 0) {
            setSelectedDeployFile(Object.keys(data.deployment_files)[0]);
          }
          setStatus('completed');
        }
      }, 700); // 700ms simulation time per agent phase
      
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to communicate with the agentic backend server.');
      setStatus('failed');
    }
  };

  const getStepStatus = (index) => {
    if (status === 'idle' || status === 'calling_api') return 'pending';
    if (status === 'failed') return 'failed';
    
    if (status === 'simulating') {
      if (index === currentStepIndex) return 'running';
      if (index < currentStepIndex) return 'success';
      return 'pending';
    }
    
    if (status === 'completed') return 'success';
    return 'pending';
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navbar header */}
      <header style={{
        borderBottom: '1px solid var(--border-color)',
        padding: '16px 40px',
        background: 'rgba(18, 20, 32, 0.7)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            width: 36,
            height: 36,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.2rem',
            color: '#fff'
          }}>
            A
          </div>
          <div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.5px' }}>
              Antigravity <span className="gradient-text">Orchestrator</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Multi-Agent SDLC Console v1.0.0</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Backend Connection:</span>
          {status === 'failed' ? (
            <span className="badge badge-error">Offline</span>
          ) : (
            <span className="badge badge-success" style={{ textTransform: 'none' }}>Active (8000)</span>
          )}
        </div>
      </header>

      {/* Main Layout Grid */}
      <main style={{ flex: 1, padding: '40px', maxWidth: '1400px', width: '100%', margin: '0 auto', display: 'grid', gridTemplateColumns: '380px 1fr', gap: '30px' }}>
        
        {/* Left column: Setup & Progress */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Input Panel */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Create New Project</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Enter instructions and see the Multi-Agent team collaborate in real time to plan, build, test, and package your software.
            </p>
            
            <textarea
              className="custom-input"
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder="Describe your app..."
              rows={4}
              style={{ resize: 'none', width: '100%' }}
              disabled={status === 'calling_api' || status === 'simulating'}
            />
            
            <button
              className="btn-primary"
              onClick={handleStartWorkflow}
              disabled={status === 'calling_api' || status === 'simulating'}
              style={{ justifyContent: 'center' }}
            >
              {status === 'calling_api' ? (
                <>
                  <svg className="animate-pulse-slow" style={{ width: 20, height: 20, fill: 'none', stroke: 'currentColor', strokeWidth: 2 }} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeDasharray="30 10" />
                  </svg>
                  Contacting Server...
                </>
              ) : status === 'simulating' ? (
                <>
                  <span className="badge-running" style={{ width: 8, height: 8 }} />
                  Running SDLC Flow...
                </>
              ) : (
                <>
                  <svg style={{ width: 20, height: 20 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Build Software
                </>
              )}
            </button>
            
            {errorMsg && (
              <div style={{
                background: 'var(--danger-glow)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: 'var(--danger)',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                lineHeight: 1.4
              }}>
                <strong>Error:</strong> {errorMsg}
                <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Make sure your FastAPI server is running with `python main.py` or `uvicorn main:app --reload` on port 8000.
                </div>
              </div>
            )}
          </div>

          {/* Workflow Agents Pipeline */}
          <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Workflow Pipeline</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
              {STEPS.map((step, idx) => {
                const stepStatus = getStepStatus(idx);
                const isActive = selectedAgent === step.id;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => {
                      if (status === 'completed' || (status === 'simulating' && idx <= currentStepIndex)) {
                        setSelectedAgent(step.id);
                      }
                    }}
                    style={{
                      width: '100%',
                      background: isActive ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                      border: `1px solid ${isActive ? 'var(--primary)' : 'transparent'}`,
                      borderRadius: '12px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      cursor: (status === 'completed' || (status === 'simulating' && idx <= currentStepIndex)) ? 'pointer' : 'default',
                      transition: 'all var(--transition-fast)',
                      outline: 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        background: isActive ? 'var(--primary)' : 'var(--bg-surface)',
                        color: isActive ? '#fff' : 'var(--text-secondary)',
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--border-color)'
                      }}>
                        <svg style={{ width: 18, height: 18 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                        </svg>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                          {step.label}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {step.role}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      {stepStatus === 'pending' && <span className="badge badge-pending">Pending</span>}
                      {stepStatus === 'running' && <span className="badge badge-running">Active</span>}
                      {stepStatus === 'success' && <span className="badge badge-success">Done</span>}
                      {stepStatus === 'failed' && <span className="badge badge-error">Failed</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Right column: Details Viewer */}
        <section style={{ display: 'flex', flexDirection: 'column', minHeight: '600px' }}>
          
          {!workflowState ? (
            <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '16px', padding: '40px' }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.05)',
                border: '1px dashed var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                fontSize: '2rem'
              }}>
                💻
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Console Ready</h3>
              <p style={{ maxWidth: '460px', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                {status === 'calling_api' || status === 'simulating' 
                  ? 'The agentic workflow has started. Wait a moment while output files are compiled.' 
                  : 'Submit a build request on the left. The specialized agent results will be compiled and displayed here in real time.'}
              </p>
              {(status === 'calling_api' || status === 'simulating') && (
                <div style={{
                  display: 'flex',
                  gap: 8,
                  marginTop: 16
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--primary)', animation: 'pulse 1s infinite alternate' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--secondary)', animation: 'pulse 1s infinite alternate', animationDelay: '0.2s' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-cyan)', animation: 'pulse 1s infinite alternate', animationDelay: '0.4s' }} />
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Header Info of selected agent */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                    {STEPS.find(s => s.id === selectedAgent)?.label} Output
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Discipline: {STEPS.find(s => s.id === selectedAgent)?.role}
                  </p>
                </div>
                <span className="badge badge-success">Audit Complete</span>
              </div>

              {/* Render Agent Specific Contents */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                
                {/* 1. Planner Agent */}
                {selectedAgent === 'planning' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 8, color: 'var(--primary)' }}>Development Plan</h4>
                      <div className="code-panel" style={{ whiteSpace: 'pre-wrap', maxHeight: '250px' }}>
                        {workflowState.development_plan}
                      </div>
                    </div>
                    
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 12, color: 'var(--primary)' }}>Sprint Backlog Tasks</h4>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>Task ID</th>
                            <th style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>Title</th>
                            <th style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>Assignee</th>
                            <th style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {workflowState.tasks.map((task) => (
                            <tr key={task.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                              <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{task.id}</td>
                              <td style={{ padding: '12px 8px' }}>{task.title}</td>
                              <td style={{ padding: '12px 8px' }}>
                                <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', textTransform: 'none' }}>
                                  {task.assignee}
                                </span>
                              </td>
                              <td style={{ padding: '12px 8px' }}>
                                <span className="badge badge-success">Completed</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 2. Developer Agent */}
                {selectedAgent === 'development' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px', height: '100%' }}>
                    {/* Left: Files listing */}
                    <div style={{ borderRight: '1px solid var(--border-color)', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Generated Files</h4>
                      {Object.keys(workflowState.source_code).map(fileName => (
                        <button
                          key={fileName}
                          onClick={() => setSelectedSourceFile(fileName)}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            background: selectedSourceFile === fileName ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                            border: `1px solid ${selectedSourceFile === fileName ? 'var(--primary)' : 'transparent'}`,
                            borderRadius: '8px',
                            padding: '8px 12px',
                            color: selectedSourceFile === fileName ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)'
                          }}
                        >
                          📄 {fileName}
                        </button>
                      ))}
                    </div>
                    {/* Right: Code Viewer */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Viewing: <strong style={{ fontFamily: 'var(--font-mono)' }}>{selectedSourceFile}</strong>
                      </div>
                      <pre className="code-panel" style={{ flex: 1, overflowY: 'auto', maxHeight: '420px' }}>
                        <code>{workflowState.source_code[selectedSourceFile]}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {/* 3. Database Agent */}
                {selectedAgent === 'database' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px', height: '100%' }}>
                    {/* Left: Files listing */}
                    <div style={{ borderRight: '1px solid var(--border-color)', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Schema & Migrations</h4>
                      {Object.keys(workflowState.database_files).map(fileName => (
                        <button
                          key={fileName}
                          onClick={() => setSelectedDbFile(fileName)}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            background: selectedDbFile === fileName ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                            border: `1px solid ${selectedDbFile === fileName ? 'var(--primary)' : 'transparent'}`,
                            borderRadius: '8px',
                            padding: '8px 12px',
                            color: selectedDbFile === fileName ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)'
                          }}
                        >
                          🗄️ {fileName}
                        </button>
                      ))}
                    </div>
                    {/* Right: Code Viewer */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Viewing: <strong style={{ fontFamily: 'var(--font-mono)' }}>{selectedDbFile}</strong>
                      </div>
                      <pre className="code-panel" style={{ flex: 1, overflowY: 'auto', maxHeight: '420px' }}>
                        <code>{workflowState.database_files[selectedDbFile]}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {/* 4. Tester Agent */}
                {selectedAgent === 'testing' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 8, color: 'var(--primary)' }}>QA Test Suites</h4>
                      {Object.keys(workflowState.test_files).map(fName => (
                        <div key={fName} style={{ marginBottom: 12 }}>
                          <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: 6 }}>🧪 {fName}</div>
                          <pre className="code-panel" style={{ maxHeight: '180px', fontSize: '0.8rem' }}>{workflowState.test_files[fName]}</pre>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 8, color: 'var(--primary)' }}>QA Execution Logs</h4>
                      <div className="code-panel" style={{ maxHeight: '150px', fontSize: '0.85rem', background: '#07080a', borderLeft: '3px solid var(--success)' }}>
                        {workflowState.test_results.log}
                        <div style={{ marginTop: 8, color: 'var(--success)' }}>
                          <strong>Tests Passed:</strong> {workflowState.test_results.passed_count} | <strong>Coverage:</strong> {workflowState.test_results.coverage}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Reviewer Agent */}
                {selectedAgent === 'review' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.06)',
                      border: '1px solid rgba(16, 185, 129, 0.15)',
                      padding: 20,
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16
                    }}>
                      <div style={{ fontSize: '2.5rem' }}>✅</div>
                      <div>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--success)' }}>
                          Review Status: {workflowState.review_summary.status}
                        </h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                          Code meets style guidelines, architectural constraints, and test benchmarks.
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 8 }}>Senior Review Notes</h4>
                      <ul style={{ paddingLeft: 20, fontSize: '0.925rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {workflowState.review_summary.comments.map((comment, index) => (
                          <li key={index}>{comment}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* 6. Security Agent */}
                {selectedAgent === 'security' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <div style={{ flex: 1, background: 'rgba(255, 255, 255, 0.02)', padding: 16, borderRadius: 8, border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>VULNERABILITIES FOUND</div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)', marginTop: 4 }}>
                          {workflowState.security_report.vulnerabilities_found}
                        </div>
                      </div>
                      <div style={{ flex: 1, background: 'rgba(255, 255, 255, 0.02)', padding: 16, borderRadius: 8, border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SECURITY SCORE</div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: 4 }}>
                          {workflowState.security_report.score}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 8 }}>Audited Components</h4>
                      <ul style={{ paddingLeft: 20, fontSize: '0.925rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {workflowState.security_report.checks_run.map((check, index) => (
                          <li key={index}>🛡️ {check}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* 7. Performance Agent */}
                {selectedAgent === 'performance' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ background: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.2)', padding: 16, borderRadius: 10 }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>OPTIMIZATION RATING</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: 4 }}>
                        {workflowState.performance_report.efficiency_rating}
                      </div>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 8 }}>Optimization Recommendations</h4>
                      <ul style={{ paddingLeft: 20, fontSize: '0.925rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {workflowState.performance_report.optimizations.map((opt, index) => (
                          <li key={index}>⚡ {opt}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* 8. Documentation Agent */}
                {selectedAgent === 'documentation' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary)' }}>Generated project documentation:</div>
                    <pre className="code-panel" style={{ flex: 1, overflowY: 'auto', whiteSpace: 'pre-wrap', maxHeight: '420px' }}>
                      <code>{workflowState.documentation}</code>
                    </pre>
                  </div>
                )}

                {/* 9. Deployment Agent */}
                {selectedAgent === 'deployment' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px', height: '100%' }}>
                    {/* Left: Files listing */}
                    <div style={{ borderRight: '1px solid var(--border-color)', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>DevOps Artifacts</h4>
                      {Object.keys(workflowState.deployment_files).map(fileName => (
                        <button
                          key={fileName}
                          onClick={() => setSelectedDeployFile(fileName)}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            background: selectedDeployFile === fileName ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                            border: `1px solid ${selectedDeployFile === fileName ? 'var(--primary)' : 'transparent'}`,
                            borderRadius: '8px',
                            padding: '8px 12px',
                            color: selectedDeployFile === fileName ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)'
                          }}
                        >
                          🚀 {fileName}
                        </button>
                      ))}
                    </div>
                    {/* Right: Code Viewer */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Viewing: <strong style={{ fontFamily: 'var(--font-mono)' }}>{selectedDeployFile}</strong>
                      </div>
                      <pre className="code-panel" style={{ flex: 1, overflowY: 'auto', maxHeight: '420px' }}>
                        <code>{workflowState.deployment_files[selectedDeployFile]}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {/* 10. Notification Agent */}
                {selectedAgent === 'notification' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', padding: 20, borderRadius: 12 }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary)' }}>Broadcast Dispatch Details</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px', marginTop: 16, fontSize: '0.925rem' }}>
                        <div style={{ color: 'var(--text-muted)' }}>Status:</div>
                        <div style={{ color: 'var(--success)', fontWeight: 'bold' }}>{workflowState.notification_report.status}</div>
                        
                        <div style={{ color: 'var(--text-muted)' }}>Channel:</div>
                        <div>{workflowState.notification_report.channel}</div>
                        
                        <div style={{ color: 'var(--text-muted)' }}>Dispatched At:</div>
                        <div style={{ fontFamily: 'var(--font-mono)' }}>{workflowState.notification_report.timestamp}</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <h5 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>Message Body</h5>
                      <div className="code-panel" style={{ background: '#0a0a0f', fontStyle: 'italic' }}>
                        "{workflowState.notification_report.message}"
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

        </section>

      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '24px 40px',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        background: 'rgba(9, 10, 15, 0.5)'
      }}>
        © 2026 Antigravity Multi-Agent Engineering Workspace. Built with Next.js, LangGraph and FastAPI.
      </footer>

    </div>
  );
}
