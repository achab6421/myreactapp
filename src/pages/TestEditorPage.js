import React, { useState } from 'react';
import CodeEditor from '../components/CodeEditor';

const TestEditorPage = () => {
  const [code, setCode] = useState(
`# Python 編輯器測試
def hello_world():
    print("Hello, World!")
    
    # 測試縮排
    if True:
        print("縮排正常運作")
        for i in range(3):
            print(f"計數: {i}")
    
    return "完成"

# 呼叫函數
result = hello_world()
print(result)
`);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  return (
    <div className="editor-test-page">
      <h1>Python 編輯器測試</h1>
      <p>請試著在下方編輯器中輸入 Python 程式碼，測試縮排和語法功能。</p>
      
      <div className="editor-container">
        <h2>程式碼編輯器</h2>
        <CodeEditor 
          value={code} 
          onChange={handleCodeChange} 
          language="python" 
        />
      </div>
      
      <div className="editor-features">
        <h3>編輯器功能：</h3>
        <ul>
          <li>支援 Tab 鍵縮排 (按下 Tab 鍵插入 4 個空格)</li>
          <li>自動調整高度</li>
          <li>程式碼區域自訂樣式</li>
        </ul>
      </div>
    </div>
  );
};

export default TestEditorPage;
