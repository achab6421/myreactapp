import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CodeEditor from './CodeEditor';

const PythonLessonFixed = () => {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      try {
        const difficulty = sessionStorage.getItem('difficulty') || 'beginner';
        console.log('正在獲取課程，難度:', difficulty);
        
        // 使用更詳細的錯誤處理和日誌記錄
        const response = await fetch('http://localhost:5000/api/generateLesson', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ difficulty }),
        });
        
        console.log('響應狀態:', response.status);
        
        if (!response.ok) {
          throw new Error(`無法獲取課程: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('成功獲取課程:', data);
        setLesson(data);
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setError(`無法載入課程：${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, []);

  const handleCodeChange = (code) => {
    setUserCode(code);
  };

  const handleSubmit = async () => {
    if (!lesson?.exercise) {
      setFeedback({ status: 'error', message: '無法提交答案：課程習題不存在' });
      return;
    }

    setFeedback({ status: 'loading', message: '正在檢查你的答案...' });
    
    try {
      const response = await fetch('http://localhost:5000/api/checkAnswer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exercise: lesson.exercise,
          userCode,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`無法檢查答案: ${response.status}`);
      }
      
      const result = await response.json();
      setFeedback(result);
    } catch (err) {
      console.error('Error checking answer:', err);
      setFeedback({
        status: 'error',
        message: `檢查答案時發生錯誤: ${err.message}`
      });
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  // 處理加載狀態
  if (loading) {
    return (
      <div className="loading">
        正在準備課程內容...<span className="loading-dots"></span>
      </div>
    );
  }

  // 處理錯誤狀態
  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={handleBack}>返回主頁</button>
      </div>
    );
  }

  // 處理數據加載成功但內容為空的情況
  if (!lesson) {
    return (
      <div className="error-container">
        <p className="error-message">課程內容為空</p>
        <button onClick={handleBack}>返回主頁</button>
      </div>
    );
  }

  return (
    <div className="lesson-container">
      <div className="lesson-nav">
        <button onClick={handleBack} className="back-button">返回選擇頁面</button>
      </div>
      
      <div className="lesson-content">
        <h2>{lesson?.title || '未命名課程'}</h2>
        
        <div className="lesson-theory">
          <h3>課程內容</h3>
          <div dangerouslySetInnerHTML={{ __html: lesson?.content || '無課程內容' }} />
        </div>
        
        <div className="lesson-exercise">
          <h3>練習題</h3>
          <p>{lesson?.exercise?.question || '無練習題'}</p>
          
          {lesson?.exercise?.hints && (
            <div className="exercise-hints">
              <h4>提示：</h4>
              <ul>
                {lesson.exercise.hints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="code-editor-container">
            <CodeEditor 
              initialCode={lesson?.exercise?.starter_code || '# 在此處寫下你的程式碼'} 
              onChange={handleCodeChange} 
            />
          </div>
          
          <button className="submit-button" onClick={handleSubmit}>
            提交答案
          </button>
          
          {feedback && (
            <div className={`feedback ${feedback.status}`}>
              <h4>{feedback.status === 'success' ? '太棒了！' : '請再試一次'}</h4>
              <p>{feedback.message}</p>
              {feedback.explanation && (
                <div className="feedback-explanation">
                  <h5>解釋：</h5>
                  <p>{feedback.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PythonLessonFixed;
