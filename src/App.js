import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LocationSelector from './pages/LocationSelector';
import Analysis from './pages/Analysis';
import Result from './pages/Result';
import AiRecommendation from './pages/AiRecommendation';

// 🎨 트렌디한 파스텔톤 & 뮤트톤
export const moods = {
  joy: { name: '기쁨', sub: 'Joy', color: '#FFE066', color2: '#FDE047', color3: '#FEF08A', query: '신나고 기쁜 노래' },
  peace: { name: '평화', sub: 'Calm', color: '#7DD3FC', color2: '#BAE6FD', color3: '#E0F2FE', query: '마음이 편안해지는 노래' },
  sadness: { name: '슬픔', sub: 'Sad', color: '#A5B4FC', color2: '#C4B5FD', color3: '#DDD6FE', query: '슬프고 잔잔한 위로 노래' },
  // 💡 분노 색상을 기존 파스텔 핑크에서 더 깊고 강렬한 크림슨 레드/로즈 색상으로 변경
  anger: { name: '분노', sub: 'Anger', color: '#E11D48', color2: '#F43F5E', color3: '#FDA4AF', query: '스트레스를 날려버릴 강렬하고 신나는 노래' },
  focus: { name: '집중', sub: 'Focus', color: '#6EE7B7', color2: '#A7F3D0', color3: '#D1FAE5', query: '공부할 때 듣기 좋은 집중 노래' }
};

function App() {
  const [activeMood, setActiveMood] = useState('joy');

  const globalWrapperStyle = {
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#FAFAFA',
    overflow: 'hidden',
    fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  const appStyle = {
    width: '100%',
    maxWidth: '800px',
    minHeight: '100vh',
    margin: '0 auto',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 10,
    overflowX: 'hidden'
  };

  const currentMood = moods[activeMood];

  return (
    <div style={globalWrapperStyle}>
      <style>
        {`
          @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

          * {
            font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;
            letter-spacing: -0.02em;
            box-sizing: border-box;
          }

          @keyframes blob1 {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(40px, -60px) scale(1.15); }
            66% { transform: translate(-30px, 30px) scale(0.85); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          @keyframes blob2 {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(-60px, 40px) scale(0.85); }
            66% { transform: translate(30px, -30px) scale(1.15); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          @keyframes blob3 {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, 50px) scale(1.1); }
            66% { transform: translate(-50px, -30px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }

          ::-webkit-scrollbar {
            width: 0px;
            background: transparent;
          }

          /* Global Trendy Button Hover */
          .trendy-btn {
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            z-index: 20;
          }
          .trendy-btn:hover {
            transform: translateY(-4px) scale(1.02);
            box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1) !important;
          }
          .trendy-btn:active {
            transform: translateY(0px) scale(0.98);
          }
        `}
      </style>

      {/* 배경 애니메이션 극대화 */}
      <div style={{
        position: 'absolute', top: '-15%', left: '-15%', width: '70vw', height: '70vw',
        background: currentMood.color, borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%', filter: 'blur(120px)', opacity: 0.6,
        animation: 'blob1 18s infinite alternate ease-in-out', transition: 'background 1.5s ease', zIndex: 1
      }} />

      <div style={{
        position: 'absolute', top: '25%', right: '-20%', width: '60vw', height: '60vw',
        background: currentMood.color2, borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', filter: 'blur(100px)', opacity: 0.7,
        animation: 'blob2 22s infinite alternate ease-in-out', transition: 'background 1.5s ease', zIndex: 1
      }} />

      <div style={{
        position: 'absolute', bottom: '-15%', left: '15%', width: '80vw', height: '80vw',
        background: currentMood.color3, borderRadius: '50% 50% 40% 60% / 40% 60% 50% 50%', filter: 'blur(140px)', opacity: 0.5,
        animation: 'blob3 25s infinite alternate ease-in-out', transition: 'background 1.5s ease', zIndex: 1
      }} />

      <div style={{
        position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)',
        backdropFilter: 'blur(50px)', WebkitBackdropFilter: 'blur(50px)', zIndex: 0, pointerEvents: 'none'
      }} />

      <div style={appStyle}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home activeMood={activeMood} setActiveMood={setActiveMood} />} />
            <Route path="/nearby" element={<LocationSelector />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/result" element={<Result />} />
            <Route path="/ai-recommendation" element={<AiRecommendation />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;