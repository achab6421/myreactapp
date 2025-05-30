import React, { useState, useEffect } from 'react';
import '../styles/CodeEditor.css';

// 簡易的程式碼編輯器
const CodeEditor = ({ initialCode = '', onChange }) => {
  const [code, setCode] = useState(initialCode);
  
  useEffect(() => {
    if (initialCode !== code) {
      setCode(initialCode);
    }
  }, [initialCode]);

  const handleChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    onChange?.(newCode);
  };

  return (
    <div className="code-editor">
      <textarea
        value={code}
        onChange={handleChange}
        className="code-textarea"
        spellCheck="false"
        placeholder="在這裡輸入你的 Python 程式碼"
      ></textarea>
    </div>
  );
};

export default CodeEditor;
