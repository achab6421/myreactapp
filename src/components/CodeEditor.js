import React, { useRef, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/CodeEditor.css';

// 簡易的程式碼編輯器
const CodeEditor = ({ value, onChange, language = 'python' }) => {
  const textareaRef = useRef(null);

  // 處理 Tab 鍵以支援程式碼縮排
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      
      // 在游標位置插入 4 個空格
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      onChange(newValue);
      
      // 將游標位置移動到插入空格之後
      setTimeout(() => {
        textareaRef.current.selectionStart = start + 4;
        textareaRef.current.selectionEnd = start + 4;
      }, 0);
    }
  };

  // 自動調整高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="card">
      <div className="card-header bg-dark text-light d-flex justify-content-between align-items-center">
        <span className="badge bg-secondary">{language}</span>
        <div>
          <button type="button" className="btn btn-sm btn-outline-light me-2" title="自動排版" disabled>
            <i className="bi bi-text-indent-left"></i>
          </button>
          <button type="button" className="btn btn-sm btn-outline-light" title="複製" onClick={() => navigator.clipboard.writeText(value)}>
            <i className="bi bi-clipboard"></i>
          </button>
        </div>
      </div>
      <div className="card-body p-0">
        <textarea
          ref={textareaRef}
          className="form-control border-0 rounded-0"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          spellCheck="false"
          placeholder="# 在此處撰寫 Python 程式碼"
          style={{ 
            minHeight: '300px',
            fontFamily: 'Consolas, "Courier New", monospace',
            fontSize: '15px',
            lineHeight: '1.6',
            backgroundColor: '#282c34',
            color: '#d7dae0',
            resize: 'vertical',
            padding: '1rem'
          }}
        />
      </div>
      <div className="card-footer bg-dark text-light small">
        <div className="d-flex justify-content-between">
          <span>按 Tab 鍵插入縮排 (4 空格)</span>
          <span>{value.split('\n').length} 行</span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
