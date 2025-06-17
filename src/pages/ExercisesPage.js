import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useExercises } from '../context/ExerciseContext';
import ExerciseCard from '../components/ExerciseCard';
import Spinner from '../components/Spinner';

const ExercisesPage = () => {
  const { exercises, loading, error, generateExercise, fetchExercises } = useExercises();
  const [difficulty, setDifficulty] = useState('beginner');
  const [topic, setTopic] = useState('general');
  const [generating, setGenerating] = useState(false);
  const [filter, setFilter] = useState({ difficulty: '', topic: '' });

  useEffect(() => {
    // 初次載入時若無習題則加載
    if (exercises.length === 0) {
      fetchExercises();
    }
  }, [exercises.length, fetchExercises]);

  const handleGenerateExercise = async () => {
    setGenerating(true);
    try {
      const newExercise = await generateExercise(difficulty, topic);
      if (newExercise && newExercise.id) {
        // 生成成功後導航到新習題
        window.location.href = `/exercises/${newExercise.id}`;
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  // 篩選習題
  const filteredExercises = exercises.filter(ex => {
    if (filter.difficulty && ex.difficulty !== filter.difficulty) return false;
    if (filter.topic && ex.topic !== filter.topic) return false;
    return true;
  });

  // 獲取所有可用主題和難度選項
  const topics = [...new Set(exercises.map(ex => ex.topic))];
  const difficulties = [...new Set(exercises.map(ex => ex.difficulty))];

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Python 習題列表</h1>
        <div className="d-flex gap-2">
          <Link to="/exercises/create" className="btn btn-outline-primary">
            <i className="bi bi-pencil me-1"></i>手動創建
          </Link>
          <button 
            className="btn btn-primary"
            onClick={handleGenerateExercise}
            disabled={generating}
          >
            {generating ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                生成中...
              </>
            ) : (
              <>
                <i className="bi bi-magic me-1"></i>生成新習題
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* 生成習題表單 */}
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">生成新習題</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-5">
              <label className="form-label" htmlFor="difficulty">難度</label>
              <select 
                id="difficulty" 
                className="form-select"
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)}
                disabled={generating}
              >
                <option value="beginner">初學者</option>
                <option value="intermediate">中級</option>
                <option value="advanced">高級</option>
              </select>
            </div>
            
            <div className="col-md-5">
              <label className="form-label" htmlFor="topic">主題</label>
              <select 
                id="topic" 
                className="form-select"
                value={topic} 
                onChange={(e) => setTopic(e.target.value)}
                disabled={generating}
              >
                <option value="general">一般 Python</option>
                <option value="data-structures">資料結構</option>
                <option value="functions">函式</option>
                <option value="oop">物件導向</option>
                <option value="file-io">檔案 I/O</option>
                <option value="algorithms">演算法</option>
              </select>
            </div>
            
            <div className="col-md-2 d-flex align-items-end">
              <button 
                type="button" 
                className="btn btn-primary w-100"
                onClick={handleGenerateExercise}
                disabled={generating}
              >
                {generating ? '生成中...' : '生成習題'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 習題篩選器 */}
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">篩選習題</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-5">
              <label className="form-label" htmlFor="filter-difficulty">難度</label>
              <select 
                id="filter-difficulty" 
                className="form-select"
                name="difficulty"
                value={filter.difficulty} 
                onChange={handleFilterChange}
              >
                <option value="">所有難度</option>
                {difficulties.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            
            <div className="col-md-5">
              <label className="form-label" htmlFor="filter-topic">主題</label>
              <select 
                id="filter-topic" 
                className="form-select"
                name="topic"
                value={filter.topic} 
                onChange={handleFilterChange}
              >
                <option value="">所有主題</option>
                {topics.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            
            <div className="col-md-2 d-flex align-items-end">
              <button 
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={() => setFilter({ difficulty: '', topic: '' })}
              >
                重設篩選
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">載入中...</span>
          </div>
          <p className="mt-2">正在載入習題...</p>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
        </div>
      )}
      
      {!loading && filteredExercises.length === 0 ? (
        <div className="text-center py-5 bg-light rounded">
          <i className="bi bi-inbox text-secondary" style={{ fontSize: "3rem" }}></i>
          <h4 className="mt-3">目前沒有符合條件的習題</h4>
          <p className="text-muted">您可以點擊上方按鈕生成新的習題</p>
          <button onClick={handleGenerateExercise} className="btn btn-primary mt-2" disabled={generating}>
            {generating ? '生成中...' : '生成一個習題'}
          </button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredExercises.map(exercise => (
            <div className="col" key={exercise.id}>
              <ExerciseCard exercise={exercise} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExercisesPage;
