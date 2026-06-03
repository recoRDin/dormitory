'use client';

import { useState } from "react";
import { Input,Button,Spin } from "antd";
import { SendOutlined } from "@ant-design/icons";

interface Message{
    role: 'user' | 'assistant';
    content: string;
}

export default function AgentPage() {
    const[messages,setMessages] = useState<Message[]>([]);
    const[input,setInput] = useState('');
    const[loading,setLoading] = useState(false);


    const sendMessage = async () =>{

        if(!input.trim()) return;//判断文本是否为空

        const question = input;
        setInput('');//清空输入框
        

        //把用户问题加到界面
        setMessages(prev => [...prev,{role:'user',content:question}]);
        setLoading(true);

        try{
            const res = await fetch('/agent-api/chat',{
                method:'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({question}),
            });

            const data = await res.json();

            //把AI回复加到界面
            setMessages(prev =>[...prev,{role:'assistant',content: data.answer}]);
        }catch{

        }finally{
            setLoading(false);
        }
    };

    return(
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
        {/* 对话区域 */}
        <div style={{
          height: 500, overflow: 'auto', border: '1px solid #f0f0f0',
          borderRadius: 8, padding: 16, marginBottom: 16,
        }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                textAlign: msg.role === 'user' ? 'right' : 'left',
                marginBottom: 12,
              }}
            >
              <div style={{
                display: 'inline-block',
                maxWidth: '80%',
                padding: '8px 14px',
                borderRadius: 12,
                background: msg.role === 'user' ? '#1677ff' : '#f5f5f5',
                color: msg.role === 'user' ? '#fff' : '#000',
                whiteSpace: 'pre-wrap',
                textAlign: 'left',
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && <Spin tip="思考中..." />}
        </div>

        {/* 输入区 */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Input.TextArea
            value={input}
            onChange={e => setInput(e.target.value)}
            onPressEnter={e => {
              if (!e.shiftKey) { e.preventDefault(); sendMessage(); }
            }}
            placeholder="输入问题，如：有哪些宿舍楼？"
            rows={2}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={sendMessage}
            loading={loading}
          >
            发送
          </Button>
        </div>
      </div>

    )
}