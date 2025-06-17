import React from 'react';
import { useNavigate } from 'react-router-dom';

const SimplePythonLesson = () => {
  const navigate = useNavigate();
  const difficulty = sessionStorage.getItem('difficulty') || 'beginner';

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Python 課程 ({difficulty} 難度)</h2>
      <p>這是一個簡化版的 Python 課程頁面，用於測試路由。</p>
      
      <div style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <h3>課程內容</h3>
        <p>這裡應該顯示課程內容...</p>
      </div>
      
      <button 
        onClick={() => navigate('/')} 
        style={{ padding: '10px 15px', background: '#4f8cf7', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        返回首頁
      </button>
    </div>
  );
};

export default SimplePythonLesson;
