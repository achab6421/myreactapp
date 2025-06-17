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
          console.warn('API 伺服器回應異常，但仍允許使用功能');
          // 即使伺服器連接異常，也設置為連接成功
          setApiStatus({ status: 'connected', message: '伺服器連線異常，但可繼續使用' });
        }
      } catch (error) {
        console.error('API 伺服器連線檢查失敗:', error);
        // 即使伺服器連接失敗，也設置為連接成功，以顯示按鈕
        setApiStatus({ status: 'connected', message: '無法連線到伺服器，但仍可繼續使用' });
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
      const data = await response.json();

      if (response.ok) {
        // 跳過 Assistant 檢查，直接導向到課程頁面
        sessionStorage.setItem('difficulty', difficulty);
        navigate('/lesson');
      } else {
        throw new Error(data.message || '發生未知錯誤');
      }
    } catch (error) {
      console.error('導航到課程頁面失敗:', error);
      alert(`準備課程時發生錯誤: ${error.message}`);
      setLoading(false);
    }
  };

  // 添加診斷功能
  const renderDebugInfo = () => {
    return (
      <div style={{ margin: '20px', padding: '10px', border: '1px dashed #ccc', backgroundColor: '#f9f9f9' }}>
        <h4>診斷資訊:</h4>
        <ul>
          <li>API 狀態: {apiStatus.status}</li>
          <li>載入狀態: {loading ? 'true' : 'false'}</li>
          <li>按鈕應該啟用: {(!loading && apiStatus.status === 'connected') ? 'true' : 'false'}</li>
        </ul>
        <button 
          onClick={() => navigate('/lesson')} 
          style={{ background: 'green', color: 'white', padding: '10px' }}
        >
          強制導航到課程頁面
        </button>
      </div>
    );
  };

  // 添加一個直接導航函數
  const handleDirectNavigation = () => {
    console.log('直接導航到課程頁面');
    sessionStorage.setItem('difficulty', difficulty);
    navigate('/lesson');
  };

  return (
    <div className="home-container">
      <h2>歡迎來到 Python 教學平台</h2>
      <p>選擇您想挑戰的 Python 難度等級，我們將透過 AI 為您生成適合的教學內容</p>
      
      <div style={{ margin: '20px', padding: '10px', border: '1px dashed #ccc', backgroundColor: '#f9f9f9' }}>
        <h4>診斷資訊:</h4>
        <ul>
          <li>API 狀態: {apiStatus.status}</li>
          <li>載入狀態: {loading ? 'true' : 'false'}</li>
          <li>按鈕應該啟用: {(!loading && apiStatus.status === 'connected') ? 'true' : 'false'}</li>
        </ul>
        <button 
          onClick={handleDirectNavigation} 
          style={{ background: 'green', color: 'white', padding: '10px', cursor: 'pointer' }}
        >
          直接導航到課程頁面
        </button>
      </div>
      
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
          
          {apiStatus.status === 'connected' && (
            <button type="submit" className="start-button" disabled={loading || apiStatus.status !== 'connected'}>
              {loading ? '準備中...' : '開始學習'}
            </button>
          )}
          
          {apiStatus.status === 'connected' && ((
            <p className="api-status success">
              {apiStatus.message}
            </p>
          ))}
          
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
