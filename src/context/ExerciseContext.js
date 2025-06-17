import React, { createContext, useState, useEffect, useContext } from 'react';

const ExerciseContext = createContext();

export const useExercises = () => useContext(ExerciseContext);

export const ExerciseProvider = ({ children }) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 從 localStorage 讀取存儲的習題
    const localExercises = localStorage.getItem('pythonExercises');
    if (localExercises) {
      setExercises(JSON.parse(localExercises));
    } else {
      // 如果沒有本地存儲，初始化一些預設習題
      const defaultExercises = [
        {
          id: '1',
          title: '兩數相加',
          description: '請編寫一個函數，接受兩個參數並返回它們的和。',
          difficulty: 'beginner',
          topic: 'general',
          hints: ['使用加號（+）運算符', '記得使用 return 關鍵字返回結果'],
          starterCode: 'def add_numbers(a, b):\n    # 在此處寫下你的程式碼\n    pass',
          testCases: [
            { input: '1, 2', expected: '3' },
            { input: '5, 10', expected: '15' }
          ],
          createdAt: new Date().toISOString()
        }
      ];
      setExercises(defaultExercises);
      localStorage.setItem('pythonExercises', JSON.stringify(defaultExercises));
    }
  }, []);

  const fetchExercises = () => {
    setLoading(true);
    
    try {
      // 在靜態環境中，我們只從 localStorage 讀取數據
      const localExercises = localStorage.getItem('pythonExercises');
      if (localExercises) {
        setExercises(JSON.parse(localExercises));
      }
      setError(null);
    } catch (err) {
      console.error('獲取習題時出錯:', err);
      setError('無法獲取習題列表');
    } finally {
      setLoading(false);
    }
  };

  const generateExercise = async (difficulty, topic) => {
    setLoading(true);
    
    try {
      // 在靜態環境中，我們只能生成一個假的練習
      const newExercise = {
        id: Date.now().toString(),
        title: `${topic === 'general' ? '' : topic + ' - '}${difficulty} 練習`,
        description: `這是一個${difficulty}難度的${topic === 'general' ? 'Python' : topic}練習。請根據要求完成程式碼。`,
        difficulty,
        topic,
        hints: [
          '仔細閱讀題目要求',
          '分步驟思考問題',
          '測試您的解決方案'
        ],
        starterCode: '# 在此處寫下您的 Python 程式碼\n\n',
        testCases: [
          { input: 'sample input', expected: 'expected output' }
        ],
        createdAt: new Date().toISOString()
      };
      
      setExercises(prev => {
        const updated = [...prev, newExercise];
        localStorage.setItem('pythonExercises', JSON.stringify(updated));
        return updated;
      });
      
      return newExercise;
    } catch (err) {
      console.error('生成習題時出錯:', err);
      setError('無法生成習題');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addExercise = (exercise) => {
    const newExercise = {
      ...exercise,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setExercises(prev => {
      const updated = [...prev, newExercise];
      localStorage.setItem('pythonExercises', JSON.stringify(updated));
      return updated;
    });
    
    return newExercise;
  };

  const updateExercise = (id, updatedExercise) => {
    setExercises(prev => {
      const index = prev.findIndex(ex => ex.id === id);
      if (index === -1) return prev;
      
      const updated = [...prev];
      updated[index] = {
        ...updatedExercise,
        id,
        createdAt: prev[index].createdAt,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('pythonExercises', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteExercise = (id) => {
    setExercises(prev => {
      const updated = prev.filter(ex => ex.id !== id);
      localStorage.setItem('pythonExercises', JSON.stringify(updated));
      return updated;
    });
  };

  const getExerciseById = (id) => {
    return exercises.find(ex => ex.id === id);
  };

  const value = {
    exercises,
    loading,
    error,
    fetchExercises,
    generateExercise,
    addExercise,
    updateExercise,
    deleteExercise,
    getExerciseById
  };

  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  );
};
