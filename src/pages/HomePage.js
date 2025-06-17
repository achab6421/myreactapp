import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="container py-5">
      {/* Hero Section */}
      <div className="bg-primary text-white rounded-3 p-5 mb-5">
        <div className="row align-items-center">
          <div className="col-lg-8 col-md-12">
            <h1 className="display-4 fw-bold mb-3">Python 個人教學平台</h1>
            <p className="lead mb-4">透過實踐與互動式學習掌握 Python 程式設計，讓 AI 助您提升編程技能。</p>
            <div className="d-flex flex-wrap gap-2">
              <Link to="/exercises" className="btn btn-light btn-lg px-4">瀏覽習題</Link>
              <Link to="/exercises/create" className="btn btn-outline-light btn-lg px-4">創建習題</Link>
            </div>
          </div>
          <div className="col-lg-4 d-none d-lg-block">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python Logo" className="img-fluid" style={{ maxHeight: '200px' }} />
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <h2 className="text-center mb-4">平台特色</h2>
      <div className="row g-4 mb-5">
        <div className="col-lg-3 col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <div className="mb-3">
                <i className="bi bi-robot text-primary" style={{ fontSize: '2.5rem' }}></i>
              </div>
              <h5 className="card-title">AI 生成習題</h5>
              <p className="card-text">利用 AI 技術生成各種難度的 Python 練習題，提供多樣化學習體驗</p>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <div className="mb-3">
                <i className="bi bi-check2-circle text-primary" style={{ fontSize: '2.5rem' }}></i>
              </div>
              <h5 className="card-title">即時代碼評估</h5>
              <p className="card-text">提交解答後獲得即時反饋和改進建議，加速學習進度</p>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <div className="mb-3">
                <i className="bi bi-graph-up text-primary" style={{ fontSize: '2.5rem' }}></i>
              </div>
              <h5 className="card-title">個人化學習進度</h5>
              <p className="card-text">追蹤您的學習進度，掌握學習效果和技能成長</p>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <div className="mb-3">
                <i className="bi bi-book text-primary" style={{ fontSize: '2.5rem' }}></i>
              </div>
              <h5 className="card-title">主題式學習</h5>
              <p className="card-text">按照不同主題和難度進行系統性學習，全方位提升技能</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Topics Section */}
      <h2 className="text-center mb-4">熱門主題</h2>
      <div className="row g-3 mb-5">
        <div className="col-md-4 col-sm-6">
          <Link to="/exercises?topic=basic" className="card bg-light text-center py-4 text-decoration-none h-100">
            <div className="card-body">
              <h5 className="card-title text-primary">基礎語法</h5>
              <p className="card-text text-muted">變數、數據類型和基本運算</p>
            </div>
          </Link>
        </div>
        
        <div className="col-md-4 col-sm-6">
          <Link to="/exercises?topic=data-structures" className="card bg-light text-center py-4 text-decoration-none h-100">
            <div className="card-body">
              <h5 className="card-title text-primary">資料結構</h5>
              <p className="card-text text-muted">列表、字典、集合和元組</p>
            </div>
          </Link>
        </div>
        
        <div className="col-md-4 col-sm-6">
          <Link to="/exercises?topic=functions" className="card bg-light text-center py-4 text-decoration-none h-100">
            <div className="card-body">
              <h5 className="card-title text-primary">函式與模組</h5>
              <p className="card-text text-muted">函式定義、參數和返回值</p>
            </div>
          </Link>
        </div>
        
        <div className="col-md-4 col-sm-6">
          <Link to="/exercises?topic=oop" className="card bg-light text-center py-4 text-decoration-none h-100">
            <div className="card-body">
              <h5 className="card-title text-primary">物件導向程式設計</h5>
              <p className="card-text text-muted">類別、物件、繼承和多型</p>
            </div>
          </Link>
        </div>
        
        <div className="col-md-4 col-sm-6">
          <Link to="/exercises?topic=algorithms" className="card bg-light text-center py-4 text-decoration-none h-100">
            <div className="card-body">
              <h5 className="card-title text-primary">演算法</h5>
              <p className="card-text text-muted">排序、搜尋和圖形演算法</p>
            </div>
          </Link>
        </div>
        
        <div className="col-md-4 col-sm-6">
          <Link to="/exercises?topic=file-io" className="card bg-light text-center py-4 text-decoration-none h-100">
            <div className="card-body">
              <h5 className="card-title text-primary">檔案處理</h5>
              <p className="card-text text-muted">讀取、寫入和處理不同格式檔案</p>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Getting Started */}
      <div className="bg-light rounded-3 p-5 text-center">
        <h2 className="mb-4">開始學習</h2>
        <div className="row justify-content-center mb-4">
          <div className="col-lg-8">
            <ol className="list-group list-group-numbered mb-4">
              <li className="list-group-item">瀏覽或生成符合您程度的習題</li>
              <li className="list-group-item">在線編輯器中撰寫您的解答</li>
              <li className="list-group-item">提交答案獲得即時反饋</li>
              <li className="list-group-item">根據建議改進您的代碼</li>
              <li className="list-group-item">持續練習，精通 Python!</li>
            </ol>
          </div>
        </div>
        <Link to="/exercises" className="btn btn-primary btn-lg px-5">立即開始</Link>
      </div>
    </div>
  );
};

export default HomePage;
