import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExercises } from '../context/ExerciseContext';

const EditExercisePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getExerciseById, updateExercise } = useExercises();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadExercise = () => {
      const foundExercise = getExerciseById(id);
      if (foundExercise) {
        setExercise(foundExercise);
      } else {
        setError('找不到指定習題');
      }
    };
    
    loadExercise();
  }, [id, getExerciseById]);

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate('/exercises')} className="btn">返回列表</button>
      </div>
    );
  }

  if (!exercise) {
    return <div>載入中...</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExercise(prev => ({ ...prev, [name]: value }));
  };

  const handleHintChange = (index, value) => {
    const updatedHints = [...exercise.hints];
    updatedHints[index] = value;
    setExercise(prev => ({ ...prev, hints: updatedHints }));
  };

  const addHint = () => {
    setExercise(prev => ({ ...prev, hints: [...(prev.hints || []), ''] }));
  };

  const removeHint = (index) => {
    const updatedHints = exercise.hints.filter((_, i) => i !== index);
    setExercise(prev => ({ ...prev, hints: updatedHints }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...exercise.testCases];
    updatedTestCases[index] = { ...updatedTestCases[index], [field]: value };
    setExercise(prev => ({ ...prev, testCases: updatedTestCases }));
  };

  const addTestCase = () => {
    setExercise(prev => ({
      ...prev,
      testCases: [...(prev.testCases || []), { input: '', expected: '' }]
    }));
  };

  const removeTestCase = (index) => {
    const updatedTestCases = exercise.testCases.filter((_, i) => i !== index);
    setExercise(prev => ({ ...prev, testCases: updatedTestCases }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // 過濾掉空的提示和測試案例
    const filteredHints = (exercise.hints || []).filter(hint => hint.trim() !== '');
    const filteredTestCases = (exercise.testCases || []).filter(
      tc => tc.input.trim() !== '' || tc.expected.trim() !== ''
    );
    
    const updatedExercise = {
      ...exercise,
      hints: filteredHints,
      testCases: filteredTestCases
    };
    
    updateExercise(id, updatedExercise);
    navigate(`/exercises/${id}`);
  };

  return (
    <div className="edit-exercise">
      <h1>編輯習題</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">標題</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            value={exercise.title || ''}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">問題描述</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            rows="5"
            value={exercise.description || ''}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="difficulty">難度</label>
            <select
              id="difficulty"
              name="difficulty"
              className="form-control"
              value={exercise.difficulty || 'beginner'}
              onChange={handleChange}
            >
              <option value="beginner">初學者</option>
              <option value="intermediate">中級</option>
              <option value="advanced">高級</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="topic">主題</label>
            <select
              id="topic"
              name="topic"
              className="form-control"
              value={exercise.topic || 'general'}
              onChange={handleChange}
            >
              <option value="general">一般 Python</option>
              <option value="data-structures">資料結構</option>
              <option value="functions">函式</option>
              <option value="oop">物件導向</option>
              <option value="file-io">檔案 I/O</option>
              <option value="algorithms">演算法</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label>提示</label>
          {(exercise.hints || []).map((hint, index) => (
            <div key={index} className="hint-input">
              <input
                type="text"
                className="form-control"
                value={hint}
                onChange={(e) => handleHintChange(index, e.target.value)}
                placeholder={`提示 ${index + 1}`}
              />
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() => removeHint(index)}
              >
                移除
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={addHint}
          >
            新增提示
          </button>
        </div>
        
        <div className="form-group">
          <label htmlFor="starterCode">起始程式碼</label>
          <textarea
            id="starterCode"
            name="starterCode"
            className="form-control code-editor"
            rows="8"
            value={exercise.starterCode || '# 請在此寫下您的 Python 程式碼'}
            onChange={handleChange}
          ></textarea>
        </div>
        
        <div className="form-group">
          <label>測試案例</label>
          {(exercise.testCases || []).map((testCase, index) => (
            <div key={index} className="test-case">
              <div className="test-case-row">
                <div className="test-case-input">
                  <label>輸入</label>
                  <input
                    type="text"
                    className="form-control"
                    value={testCase.input || ''}
                    onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                    placeholder="輸入值"
                  />
                </div>
                <div className="test-case-expected">
                  <label>預期輸出</label>
                  <input
                    type="text"
                    className="form-control"
                    value={testCase.expected || ''}
                    onChange={(e) => handleTestCaseChange(index, 'expected', e.target.value)}
                    placeholder="期望結果"
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => removeTestCase(index)}
                >
                  移除
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={addTestCase}
          >
            新增測試案例
          </button>
        </div>
        
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(`/exercises/${id}`)}
          >
            取消
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? '更新中...' : '更新習題'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditExercisePage;
