import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import PythonLesson from './components/PythonLesson';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Python 教學平台</h1>
        </header>
        <main>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/lesson" element={<PythonLesson />} />
            </Routes>
          </ErrorBoundary>
        </main>
        <footer>
          <p>© {new Date().getFullYear()} Python 教學平台</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
