import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CodeEditor from './CodeEditor';
import '../styles/PythonLesson.css';

const PythonLesson = () => {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const difficulty = sessionStorage.getItem('difficulty') || 'beginner';
        console.log('正在獲取課程，難度:', difficulty);
        
        // 呼叫後端 API 來獲取課程內容
        const response = await fetch('http://localhost:5000/api/generateLesson', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ difficulty }),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('獲取課程失敗:', response.status, errorData);
          throw new Error(`無法獲取課程: ${response.status} ${errorData.error || ''}`);
        }
        
        const data = await response.json();
        console.log('成功獲取課程:', data.title);
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`無法檢查答案: ${response.status} ${errorData.error || ''}`);
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

  if (loading) {
    return <div className="loading">正在準備課程內容...<span className="loading-dots"></span></div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
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
        <h2>{lesson?.title}</h2>
        <div className="lesson-theory">
          <h3>課程內容</h3>
          <div dangerouslySetInnerHTML={{ __html: lesson?.content }} />
        </div>
        
        <div className="lesson-exercise">
          <h3>練習題</h3>
          <p>{lesson?.exercise?.question}</p>
          
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

export default PythonLesson;
