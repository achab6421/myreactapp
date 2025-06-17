const API_URL = 'http://localhost:5000/api';

// 處理 API 響應
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || error.error || '請求失敗');
  }
  return response.json();
};

// 健康檢查
export const apiHealthCheck = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    return await handleResponse(response);
  } catch (error) {
    console.error('健康檢查失敗:', error);
    throw error;
  }
};

// 生成習題
export const apiGenerateExercise = async (difficulty, topic) => {
  try {
    const response = await fetch(`${API_URL}/exercises/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ difficulty, topic })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('生成習題失敗:', error);
    throw error;
  }
};

// 獲取所有習題
export const apiGetAllExercises = async () => {
  try {
    const response = await fetch(`${API_URL}/exercises`);
    return await handleResponse(response);
  } catch (error) {
    console.error('獲取習題列表失敗:', error);
    throw error;
  }
};

// 獲取單個習題
export const apiGetExerciseById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/exercises/${id}`);
    return await handleResponse(response);
  } catch (error) {
    console.error('獲取習題詳情失敗:', error);
    throw error;
  }
};

// 創建習題
export const apiCreateExercise = async (exercise) => {
  try {
    const response = await fetch(`${API_URL}/exercises`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exercise)
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('創建習題失敗:', error);
    throw error;
  }
};

// 更新習題
export const apiUpdateExercise = async (id, exercise) => {
  try {
    const response = await fetch(`${API_URL}/exercises/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exercise)
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('更新習題失敗:', error);
    throw error;
  }
};

// 刪除習題
export const apiDeleteExercise = async (id) => {
  try {
    const response = await fetch(`${API_URL}/exercises/${id}`, {
      method: 'DELETE'
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('刪除習題失敗:', error);
    throw error;
  }
};

// 檢查答案
export const apiCheckAnswer = async (exerciseId, userCode) => {
  try {
    const response = await fetch(`${API_URL}/exercises/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exerciseId, userCode })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('檢查答案失敗:', error);
    throw error;
  }
};
