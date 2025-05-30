const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();

// 明確設定 CORS 選項
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

// 初始化 OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 使用環境變數中的 Assistant ID
const assistantId = process.env.ASSISTANT_ID;
console.log('使用 Assistant ID:', assistantId);

// 添加基本健康檢查端點
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// API 路由生成課程
app.post('/api/generateLesson', async (req, res) => {
  const { difficulty } = req.body;
  
  console.log(`收到難度為 ${difficulty} 的課程請求`);
  
  try {
    // 確認 assistantId 是否存在
    if (!assistantId) {
      throw new Error('未設定 Assistant ID');
    }
    
    // 建立 Thread
    const thread = await openai.beta.threads.create();
    console.log('已創建 Thread:', thread.id);
    
    // 添加訊息到 Thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: `生成一個${difficulty}難度的 Python 教學內容和練習題。請以 JSON 格式回應，包含以下欄位：
      {
        "title": "課程標題",
        "content": "課程內容的 HTML 格式",
        "exercise": {
          "question": "練習題目敘述",
          "hints": ["提示1", "提示2"],
          "starter_code": "初始程式碼",
          "solution": "解答程式碼",
          "validation_criteria": ["評判標準1", "評判標準2"]
        }
      }
      回應必須是可解析的 JSON 格式。`
    });
    
    console.log('開始執行 Assistant...');
    // 執行 Assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    });
    
    // 等待 Run 完成並獲取結果
    let runStatus;
    do {
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      console.log(`Run 狀態: ${runStatus.status}`);
      
      if (runStatus.status === 'failed') {
        console.error('Run 失敗:', runStatus.last_error);
        throw new Error(`Assistant run failed: ${runStatus.last_error?.message || '未知錯誤'}`);
      }
      
      if (runStatus.status !== 'completed') {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 等待一秒
      }
    } while (['queued', 'in_progress', 'cancelling'].includes(runStatus.status));
    
    if (runStatus.status !== 'completed') {
      throw new Error(`Run 未完成，狀態: ${runStatus.status}`);
    }
    
    // 獲取回應
    console.log('獲取回應...');
    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantMessage = messages.data.find(msg => msg.role === 'assistant');
    
    if (!assistantMessage) {
      throw new Error('No response from assistant');
    }
    
    // 解析回應內容
    const content = assistantMessage.content[0].text.value;
    console.log('接收到 Assistant 回應');
    
    // 嘗試從回應中提取 JSON
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
    
    let parsedContent;
    if (jsonMatch) {
      try {
        parsedContent = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        console.log('成功解析 JSON 回應');
      } catch (e) {
        console.error('Error parsing JSON:', e);
        throw new Error('Invalid JSON in assistant response');
      }
    } else {
      console.error('回應內容不包含 JSON:', content);
      throw new Error('No JSON found in assistant response');
    }
    
    res.json(parsedContent);
  } catch (error) {
    console.error('Error generating lesson:', error);
    res.status(500).json({ error: error.message || '未知錯誤' });
  }
});

// API 檢查答案
app.post('/api/checkAnswer', async (req, res) => {
  const { exercise, userCode } = req.body;
  
  try {
    // 確認 assistantId 是否存在
    if (!assistantId) {
      throw new Error('未設定 Assistant ID');
    }
    
    // 建立 Thread
    const thread = await openai.beta.threads.create();
    
    // 添加訊息到 Thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: `請評估以下程式碼是否正確完成了練習題目。
      
      練習題目: ${exercise.question}
      
      評判標準:
      ${exercise.validation_criteria.join('\n')}
      
      參考解答:
      \`\`\`python
      ${exercise.solution}
      \`\`\`
      
      用戶提交的程式碼:
      \`\`\`python
      ${userCode}
      \`\`\`
      
      請以 JSON 格式回應:
      {
        "status": "success 或 error",
        "message": "簡短評語",
        "explanation": "詳細解釋為什麼答案正確或錯誤",
        "suggestions": ["如果有錯誤，提供改進建議"]
      }
      回應必須是可解析的 JSON 格式。`
    });
    
    // 執行 Assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    });
    
    // 等待 Run 完成並獲取結果
    let runStatus;
    do {
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      if (runStatus.status === 'failed') {
        throw new Error(`Assistant run failed: ${runStatus.last_error?.message || '未知錯誤'}`);
      }
      if (runStatus.status !== 'completed') {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } while (['queued', 'in_progress', 'cancelling'].includes(runStatus.status));
    
    if (runStatus.status !== 'completed') {
      throw new Error(`Run 未完成，狀態: ${runStatus.status}`);
    }
    
    // 獲取回應
    const messages = await openai.beta.threads.messages.list(thread.id);
    const assistantMessage = messages.data.find(msg => msg.role === 'assistant');
    
    if (!assistantMessage) {
      throw new Error('No response from assistant');
    }
    
    // 解析回應內容
    const content = assistantMessage.content[0].text.value;
    
    // 嘗試從回應中提取 JSON
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
    
    let parsedContent;
    if (jsonMatch) {
      try {
        parsedContent = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } catch (e) {
        console.error('Error parsing JSON:', e);
        throw new Error('Invalid JSON in assistant response');
      }
    } else {
      throw new Error('No JSON found in assistant response');
    }
    
    res.json(parsedContent);
  } catch (error) {
    console.error('Error checking answer:', error);
    res.status(500).json({ error: error.message || '未知錯誤' });
  }
});

// 添加 debug 路由，測試 Assistant 連線
app.get('/api/debug/assistant', async (req, res) => {
  try {
    if (!assistantId) {
      throw new Error('未設定 Assistant ID');
    }
    
    const assistant = await openai.beta.assistants.retrieve(assistantId);
    res.json({ 
      status: 'success', 
      message: '成功連線到 Assistant',
      assistant: {
        id: assistant.id,
        name: assistant.name,
        model: assistant.model
      }
    });
  } catch (error) {
    console.error('Error retrieving assistant:', error);
    res.status(500).json({ 
      status: 'error',
      message: '無法連線到 Assistant', 
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`伺服器運行於 http://localhost:${PORT}`);
  console.log(`健康檢查: http://localhost:${PORT}/api/health`);
  console.log(`Assistant 測試: http://localhost:${PORT}/api/debug/assistant`);
});
