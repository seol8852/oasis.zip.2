import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AiRecommendation = () => {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState('');

  const examples = [
    "오늘 시험 망쳐서 너무 우울해... 위로가 필요해",
    "새벽 3시, 혼자 창밖을 보고 있는데 이상하게 몽글해",
    "친구랑 오랜만에 만나서 술 마시는 중, 행복해",
    "비 오는 날 집에서 코코아 마시며 책 읽는 기분"
  ];

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '30px 24px', boxSizing: 'border-box', position: 'relative', zIndex: 10 }}>
      <style>
        {`
          .glass-input-area {
            transition: all 0.3s ease;
          }
          .glass-input-area:focus-within {
            background: rgba(255, 255, 255, 0.8) !important;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08) !important;
            border-color: rgba(255, 255, 255, 1) !important;
          }
          .ai-content-wrapper { display: flex; flex-direction: column; flex: 1; }
          .ai-left-section { display: flex; flex-direction: column; width: 100%; }
          .ai-right-section { display: flex; flex-direction: column; width: 100%; margin-top: 40px; }
          @media (min-width: 768px) {
            .ai-content-wrapper { flex-direction: row; gap: 60px; align-items: stretch; margin-top: 30px; }
            .ai-left-section { flex: 1; }
            .ai-right-section { flex: 1; margin-top: 0; }
          }
        `}
      </style>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
        <button onClick={() => navigate('/')} className="trendy-btn" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginRight: '16px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <h1 style={{ margin: 0, fontSize: '24px', color: '#0F172A', fontWeight: '800', letterSpacing: '-0.5px' }}>AI 음악 큐레이터</h1>
      </div>

      <div>
        <h2 style={{ fontSize: '32px', color: '#0F172A', margin: '0 0 12px 0', fontWeight: '900', letterSpacing: '-1px', lineHeight: '1.2' }}>어떤 음악이<br/>필요한가요?</h2>
        <p style={{ fontSize: '15px', color: '#475569', margin: 0, fontWeight: '500', lineHeight: '1.5' }}>감정이나 상황을 묘사해주시면<br/>AI가 가장 잘 어울리는 음악을 골라드려요.</p>
      </div>

      <div className="ai-content-wrapper">
        <div className="ai-left-section">
          <div className="glass-input-area" style={{
            background: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderRadius: '32px', padding: '24px',
            border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)', marginBottom: '24px'
          }}>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="예: 비오는 날 창밖을 보며 따뜻한 커피 한 잔..."
              style={{ width: '100%', height: '160px', border: 'none', background: 'transparent', outline: 'none', fontSize: '17px', color: '#0F172A', resize: 'none', fontFamily: 'inherit', fontWeight: '500', lineHeight: '1.6' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '16px' }}>
              <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>{userInput.length}/500</span>
              <button onClick={()=>setUserInput('')} className="trendy-btn" style={{ background: 'transparent', border: 'none', color: '#64748B', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>내용 지우기</button>
            </div>
          </div>

          <button
            onClick={() => navigate('/analysis', { state: { type: 'ai', query: userInput } })}
            className="trendy-btn"
            style={{
              width: '100%', padding: '24px', borderRadius: '24px', border: 'none', color: 'white',
              fontWeight: '800', fontSize: '17px', background: '#0F172A', cursor: 'pointer',
              boxShadow: '0 15px 30px rgba(15, 23, 42, 0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
            }}
          >
            <span>✨</span> 맞춤 음악 추천받기
          </button>
        </div>

        <div className="ai-right-section">
          <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ background: 'rgba(255,255,255,0.7)', padding: '6px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>💡</span> 추천 프롬프트
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {examples.map((ex, i) => (
              <div key={i} className="trendy-btn" onClick={() => setUserInput(ex)} style={{
                background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', padding: '20px', borderRadius: '20px', fontSize: '14px',
                color: '#334155', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.7)', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', fontWeight: '600', lineHeight: '1.5'
              }}>
                "{ex}"
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiRecommendation;