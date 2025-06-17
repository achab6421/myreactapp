import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExercises } from '../context/ExerciseContext';
import CodeEditor from '../components/CodeEditor';

const ExerciseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getExerciseById, deleteExercise } = useExercises();
  const [exercise, setExercise] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    const loadExercise = () => {
      const foundExercise = getExerciseById(id);
      if (foundExercise) {
        setExercise(foundExercise);
        setUserCode(foundExercise.starterCode || '# 在此處撰寫您的程式碼');
      } else {
        setError('找不到指定習題');
      }
    };
    
    loadExercise();
  }, [id, getExerciseById]);

  const handleCodeChange = (code) => {
    setUserCode(code);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    try {
      // 在靜態環境中模擬評估
      setTimeout(() => {
        const hasOutput = userCode.includes('print');
        const hasFunction = userCode.includes('def');
        const hasReturn = userCode.includes('return');
        
        let score = 0;
        if (hasOutput) score += 30;
        if (hasFunction) score += 30;
        if (hasReturn) score += 40;
        
        const isCorrect = score >= 70;
        
        const simulatedResult = {
          isCorrect,
          score,
          feedback: isCorrect 
            ? '您的代碼能夠產生正確的輸出，並使用了適當的函數結構。' 
            : '您的代碼尚未完全符合要求，請檢查是否實現了所有功能。',
          suggestions: isCorrect
            ? '可以考慮添加更多的錯誤處理和邊界情況檢查。'
            : '確保您定義了函數並使用了 return 語句返回結果。'
        };
        
        setResult(simulatedResult);
        
        // 儲存提交紀錄
        const submission = {
          id: Date.now().toString(),
          code: userCode,
          submittedAt: new Date().toISOString(),
          assessment: simulatedResult
        };
        
        const localExercises = JSON.parse(localStorage.getItem('pythonExercises') || '[]');
        const exerciseIndex = localExercises.findIndex(ex => ex.id === id);
        
        if (exerciseIndex >= 0) {
          if (!localExercises[exerciseIndex].submissions) {
            localExercises[exerciseIndex].submissions = [];
          }
          
          localExercises[exerciseIndex].submissions.push(submission);
          localStorage.setItem('pythonExercises', JSON.stringify(localExercises));
          
          // 更新當前習題狀態
          setExercise(localExercises[exerciseIndex]);
        }
        
        setLoading(false);
      }, 2000);
    } catch (error) {
      setError('提交答案時發生錯誤');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('確定要刪除此習題嗎？')) {
      deleteExercise(id);
      navigate('/exercises');
    }
  };

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
        </div>
        <button onClick={() => navigate('/exercises')} className="btn btn-primary">返回列表</button>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">載入中...</span>
        </div>
        <p className="mt-3">正在載入習題...</p>
      </div>
    );
  }

  // 難度對應的 Bootstrap 類別
  const difficultyBadgeClass = {
    'beginner': 'bg-info',
    'intermediate': 'bg-warning',
    'advanced': 'bg-danger'
  }[exercise.difficulty] || 'bg-secondary';

  return (
    <div className="container py-4">
      {/* 習題標題區塊 */}
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap">
        <div>
          <h1 className="mb-2">{exercise.title}</h1>
          <div className="mb-3">
            <span className={`badge ${difficultyBadgeClass} me-2`}>{exercise.difficulty}</span>
            <span className="badge bg-secondary">{exercise.topic}</span>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button 
            onClick={() => navigate(`/exercises/edit/${id}`)} 
            className="btn btn-outline-primary"
          >
            <i className="bi bi-pencil me-1"></i>編輯
          </button>
          <button 
            onClick={handleDelete} 
            className="btn btn-outline-danger"
          >
            <i className="bi bi-trash me-1"></i>刪除
          </button>
        </div>
      </div>
      
      {/* 習題卡片與程式碼編輯區 */}
      <div className="row">
        <div className="col-lg-5 mb-4">
          {/* 問題描述卡片 */}
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">問題描述</h5>
            </div>
            <div className="card-body">
              <div className="mb-0">
                {exercise.description}
              </div>
            </div>
          </div>
          
          {/* 提示卡片 */}
          {exercise.hints && exercise.hints.length > 0 && (
            <div className="card mb-4">
              <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
                <h5 className="mb-0">提示</h5>
                <button 
                  onClick={() => setShowHints(!showHints)}
                  className="btn btn-sm btn-outline-dark"
                >
                  <i className={`bi ${showHints ? 'bi-eye-slash' : 'bi-eye'} me-1`}></i>
                  {showHints ? '隱藏提示' : '顯示提示'}
                </button>
              </div>
              {showHints && (
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    {exercise.hints.map((hint, index) => (
                      <li key={index} className="list-group-item">
                        <i className="bi bi-lightbulb me-2 text-warning"></i>
                        {hint}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {/* 測試案例卡片 */}
          <div className="card">
            <div className="card-header bg-info text-dark">
              <h5 className="mb-0">測試案例</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>輸入</th>
                      <th>預期輸出</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercise.testCases && exercise.testCases.map((testCase, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td><code>{testCase.input}</code></td>
                        <td><code>{testCase.expected}</code></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-7">
          {/* 程式碼編輯器 */}
          <div className="card mb-4">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">程式碼編輯器</h5>
            </div>
            <div className="card-body p-0">
              <CodeEditor 
                value={userCode} 
                onChange={handleCodeChange} 
              />
            </div>
            <div className="card-footer">
              <button
                className="btn btn-primary float-end"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                    檢查中...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-1"></i>提交答案
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* 評估結果 */}
          {result && (
            <div className={`card border-${result.isCorrect ? 'success' : 'danger'}`}>
              <div className={`card-header bg-${result.isCorrect ? 'success' : 'danger'} text-white d-flex justify-content-between align-items-center`}>
                <h5 className="mb-0">
                  <i className={`bi ${result.isCorrect ? 'bi-check-circle' : 'bi-x-circle'} me-2`}></i>
                  評估結果
                </h5>
                <span className="badge bg-light text-dark">得分: {result.score}/100</span>
              </div>
              <div className="card-body">
                <h6 className="card-subtitle mb-3">反饋</h6>
                <p>{result.feedback}</p>
                
                {result.suggestions && (
                  <>
                    <h6 className="card-subtitle mb-2 mt-4">改進建議</h6>
                    <p className="mb-0">{result.suggestions}</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 提交歷史 */}
      {exercise.submissions && exercise.submissions.length > 0 && (
        <div className="mt-5">
          <h3>提交歷史</h3>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>時間</th>
                  <th>狀態</th>
                  <th>分數</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {exercise.submissions.slice().reverse().map(submission => (
                  <tr key={submission.id}>
                    <td>{new Date(submission.submittedAt).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${submission.assessment.isCorrect ? 'bg-success' : 'bg-danger'}`}>
                        {submission.assessment.isCorrect ? '正確' : '不正確'}
                      </span>
                    </td>
                    <td>{submission.assessment.score}/100</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setUserCode(submission.code)}
                        title="載入此提交的代碼"
                      >
                        <i className="bi bi-arrow-clockwise"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="text-center mt-4">
        <button 
          onClick={() => navigate('/exercises')} 
          className="btn btn-outline-secondary"
        >
          <i className="bi bi-arrow-left me-1"></i>
          返回習題列表
        </button>
      </div>
    </div>
  );
};

export default ExerciseDetailPage;
