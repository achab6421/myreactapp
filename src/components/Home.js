import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const [difficulty, setDifficulty] = useState('beginner');
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState({ status: 'checking', message: '正在檢查伺服器連線...' });
  const navigate = useNavigate();

  useEffect(() => {
    // 檢查 API 伺服器是否正常運作
    const checkApiServer = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/health');
        if (response.ok) {
          setApiStatus({ status: 'connected', message: '伺服器連線正常' });
        } else {
          setApiStatus({ status: 'error', message: '伺服器連線異常' });
        }
      } catch (error) {
        console.error('API 伺服器連線檢查失敗:', error);
        setApiStatus({ status: 'error', message: '無法連線到伺服器，請確認伺服器是否啟動' });
      }
    };
    
    checkApiServer();
  }, []);

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // 檢查 Assistant 是否正常
      const response = await fetch('http://localhost:5000/api/debug/assistant');
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || '無法使用 AI 助手');
      }
      
      // 儲存選擇的難度到 sessionStorage
      sessionStorage.setItem('difficulty', difficulty);
      
      // 導向到課程頁面
      navigate('/lesson');
    } catch (error) {
      console.error('檢查 Assistant 失敗:', error);
      alert(`準備課程時發生錯誤: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <h2>歡迎來到 Python 教學平台</h2>
      <p>選擇您想挑戰的 Python 難度等級，我們將透過 AI 為您生成適合的教學內容</p>
      
      {apiStatus.status === 'error' ? (
        <div className="api-error">
          <p>{apiStatus.message}</p>
          <p>請確保後端伺服器已啟動並運行於 <code>http://localhost:5000</code></p>
          <button onClick={() => window.location.reload()}>重新檢查</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="difficulty-form">
          <div className="difficulty-options">
            <div className="difficulty-option">
              <input 
                type="radio" 
                id="beginner" 
                value="beginner" 
                name="difficulty" 
                checked={difficulty === 'beginner'} 
                onChange={handleDifficultyChange}
              />
              <label htmlFor="beginner">初學者：基本語法與概念</label>
            </div>

            <div className="difficulty-option">
              <input 
                type="radio" 
                id="intermediate" 
                value="intermediate" 
                name="difficulty" 
                checked={difficulty === 'intermediate'} 
                onChange={handleDifficultyChange}
              />
              <label htmlFor="intermediate">中級：進階語法與應用</label>
            </div>

            <div className="difficulty-option">
              <input 
                type="radio" 
                id="advanced" 
                value="advanced" 
                name="difficulty" 
                checked={difficulty === 'advanced'} 
                onChange={handleDifficultyChange}
              />
              <label htmlFor="advanced">高級：進階概念與實戰</label>
            </div>
          </div>

          <button type="submit" className="start-button" disabled={loading || apiStatus.status !== 'connected'}>
            {loading ? '準備中...' : '開始學習'}
          </button>
          
          {apiStatus.status === 'connected' && (
            <p className="api-status success">
              {apiStatus.message}
            </p>
          )}
          
          {apiStatus.status === 'checking' && (
            <p className="api-status checking">
              {apiStatus.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
};

export default Home;
