import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ExerciseProvider } from './context/ExerciseContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ExercisesPage from './pages/ExercisesPage';
import ExerciseDetailPage from './pages/ExerciseDetailPage';
import CreateExercisePage from './pages/CreateExercisePage';
import EditExercisePage from './pages/EditExercisePage';
import TestEditorPage from './pages/TestEditorPage';

function App() {
  return (
    <ExerciseProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="pb-5">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/exercises" element={<ExercisesPage />} />
              <Route path="/exercises/create" element={<CreateExercisePage />} />
              <Route path="/exercises/:id" element={<ExerciseDetailPage />} />
              <Route path="/exercises/edit/:id" element={<EditExercisePage />} />
              <Route path="/test-editor" element={<TestEditorPage />} />
            </Routes>
          </main>
          <footer className="bg-dark text-white py-4 mt-auto">
            <div className="container text-center">
              <p className="mb-0">© {new Date().getFullYear()} Python 個人教學平台</p>
            </div>
          </footer>
        </div>
      </Router>
    </ExerciseProvider>
  );
}

export default App;
