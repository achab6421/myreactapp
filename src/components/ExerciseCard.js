import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ExerciseCard.css';

const ExerciseCard = ({ exercise }) => {
  // 格式化創建日期
  const formattedDate = new Date(exercise.createdAt).toLocaleDateString();
  
  // 如果有提交記錄，計算最高分數
  const highestScore = exercise.submissions 
    ? Math.max(...exercise.submissions.map(s => s.assessment.score), 0) 
    : 0;

  // 獲取提交次數
  const submissionCount = exercise.submissions ? exercise.submissions.length : 0;
  
  // 難度對應的 Bootstrap 類別
  const difficultyBadgeClass = {
    'beginner': 'bg-info',
    'intermediate': 'bg-warning',
    'advanced': 'bg-danger'
  }[exercise.difficulty] || 'bg-secondary';

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-header">
        <div className="d-flex flex-wrap gap-1 mb-2">
          <span className={`badge ${difficultyBadgeClass}`}>{exercise.difficulty}</span>
          <span className="badge bg-secondary">{exercise.topic}</span>
        </div>
        <h5 className="card-title mb-0">{exercise.title}</h5>
      </div>
      
      <div className="card-body">
        <p className="card-text">
          {exercise.description.length > 100 
            ? `${exercise.description.substring(0, 100)}...` 
            : exercise.description}
        </p>
      </div>
      
      <div className="card-footer bg-white">
        <div className="d-flex justify-content-between align-items-center">
          <div className="small text-muted">
            <span title={exercise.createdAt}>{formattedDate}</span>
            {submissionCount > 0 && (
              <span className="ms-2">
                <i className="bi bi-check-circle-fill me-1 text-success"></i>
                {highestScore}/100
              </span>
            )}
          </div>
          <Link to={`/exercises/${exercise.id}`} className="btn btn-sm btn-outline-primary">
            <i className="bi bi-arrow-right me-1"></i>查看詳情
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;
