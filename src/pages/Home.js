import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { moods } from '../App';

const Home = ({ activeMood, setActiveMood }) => {
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [locationName, setLocationName] = useState("위치 파악 중...");
  const WEATHER_KEY = process.env.REACT_APP_WEATHER_KEY;
  const KAKAO_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY || "bfcf264faab10bcab3edb0f120a72aa4";

  useEffect(() => {
    const fetchContextData = async (lat, lon) => {
      try {
        const addressRes = await axios.get(
          `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lon}&y=${lat}`,
          { headers: { Authorization: `KakaoAK ${KAKAO_KEY}` } }
        );
        if (addressRes.data?.documents?.length > 0) {
          setLocationName(addressRes.data.documents[0].address_name);
        }

        if (WEATHER_KEY) {
          const res = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=kr&appid=${WEATHER_KEY}`
          );
          setWeather({
            icon: res.data.weather[0].icon,
            temp: `${Math.round(res.data.main.temp)}°C`,
            desc: res.data.weather[0].description
          });
        }
      } catch (err) {
        console.error("데이터 로드 실패:", err);
        setLocationName("대한민국 어딘가");
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchContextData(pos.coords.latitude, pos.coords.longitude),
        () => fetchContextData(37.1498, 127.0772)
      );
    } else {
      fetchContextData(37.1498, 127.0772);
    }
  }, [WEATHER_KEY, KAKAO_KEY]);

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '0 24px', maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
      <style>
        {`
          .glass-panel { background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.6); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04); }
          .glass-btn-primary { background: #0F172A; color: #FFFFFF; border: none; box-shadow: 0 10px 20px rgba(15, 23, 42, 0.15); }
          .glass-btn-secondary { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.9); color: #0F172A; }
          .mood-orb { transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1); position: absolute; }
          .mood-orb:hover { filter: brightness(1.1); z-index: 40 !important; box-shadow: 0 15px 30px rgba(0,0,0,0.1), inset 0 0 0 2px rgba(255,255,255,0.9) !important; }
          .center-play { position: relative; z-index: 30; }
          @media (min-width: 768px) {
            .home-layout { flex-direction: row !important; align-items: stretch !important; padding: 40px 0; gap: 60px; height: calc(100vh - 100px); }
            .home-left { flex: 1; display: flex; flexDirection: column; justify-content: center; align-items: flex-start !important; }
            .home-right { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 20px; }
            .hero-text { text-align: left !important; }
          }
        `}
      </style>

      {/* 헤더 영역 */}
      <div style={{ padding: '30px 0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: '#0F172A', letterSpacing: '-1px' }}>oasis.zip</h1>

        {weather && (
          <div className="glass-panel" style={{ padding: '6px 16px', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={`http://openweathermap.org/img/wn/${weather.icon}.png`} alt="weather" style={{ width: '28px', height: '28px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />
            <div style={{ display: 'flex', gap: '6px', alignItems: 'baseline' }}>
              <span style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>{weather.temp}</span>
            </div>
          </div>
        )}
      </div>

      <div className="home-layout" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

        {/* 왼쪽 (모바일은 상단): 감정 색상환 & 타이틀 */}
        <div className="home-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', zIndex: 10 }}>
          <div className="hero-text" style={{ textAlign: 'center', marginBottom: '20px', width: '100%' }}>
            <h2 style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: '800', color: '#0F172A', margin: '0 0 10px 0', letterSpacing: '-1px', lineHeight: '1.2' }}>
              어떤 기분인가요?<br/><span style={{ color: moods[activeMood].color, filter: 'brightness(0.8)' }}>음악</span>으로 채워줄게요.
            </h2>
            <p style={{ fontSize: '15px', color: '#475569', fontWeight: '500', margin: 0 }}>감정 구슬을 탭하여 플레이리스트를 찾아보세요.</p>
          </div>

          <div style={{ position: 'relative', width: '100%', maxWidth: '340px', height: '340px', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div
                className="trendy-btn center-play"
                onClick={() => navigate('/analysis', { state: { type: 'ai', query: moods[activeMood].query } })}
                style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                  width: '120px', height: '120px', borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,1)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                  cursor: 'pointer', zIndex: 50
                }}
            >
              <div style={{ width: '0', height: '0', borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '16px solid #0F172A', marginLeft: '4px', marginBottom: '8px' }}></div>
              <div style={{fontSize:'14px', fontWeight:'800', color:'#0F172A'}}>{moods[activeMood].name}</div>
            </div>

            {Object.entries(moods).map(([key, m], idx) => {
              const angles = [270, 342, 54, 126, 198];
              const radius = 120;
              const x = Math.cos(angles[idx] * Math.PI / 180) * radius;
              const y = Math.sin(angles[idx] * Math.PI / 180) * radius;
              const isActive = activeMood === key;

              return (
                <div
                  key={key}
                  className="mood-orb"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMood(key);
                  }}
                  style={{
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    top: '50%', left: '50%',
                    width: isActive ? '88px' : '76px',
                    height: isActive ? '88px' : '76px',
                    borderRadius: '50%',
                    background: isActive ? m.color : `${m.color}80`,
                    backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                    color: isActive ? '#FFFFFF' : '#0F172A',
                    fontSize: '12px', fontWeight: '800', cursor: 'pointer',
                    boxShadow: isActive ? `0 15px 30px ${m.color}80, inset 0 0 0 2px rgba(255,255,255,0.9)` : '0 5px 15px rgba(0,0,0,0.05), inset 0 0 0 1px rgba(255,255,255,0.4)',
                    zIndex: isActive ? 35 : 20
                  }}
                >
                  <div style={{ textShadow: isActive ? '0 2px 4px rgba(0,0,0,0.2)' : 'none', pointerEvents: 'none' }}>{m.name}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 오른쪽 (모바일은 하단): 2개의 스마트한 액션 버튼 */}
        <div className="home-right" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '40px 0', zIndex: 10, width: '100%' }}>

          {/* 💡 1. 상황 분석 (위치+날씨+시간 통합 추천) */}
          <button
            onClick={() => navigate('/analysis', { state: { type: 'smart_context', locationName: locationName, weatherInfo: weather } })}
            className="trendy-btn glass-btn-secondary"
            style={{ width: '100%', padding: '24px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
          >
            <div style={{ background: 'rgba(255,255,255,0.8)', width: '48px', height: '48px', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
              🧭
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>지금 내 상황에 딱 맞는 음악</div>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '500' }}>
                {locationName}의 {weather ? weather.desc : '분위기'} 감성 추천
              </div>
            </div>
          </button>

          {/* 💡 2. 텍스트 직접 입력 (AI 챗봇 유지) */}
          <button
            onClick={() => navigate('/ai-recommendation')}
            className="trendy-btn glass-btn-primary"
            style={{ width: '100%', padding: '24px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
          >
            <div style={{ background: 'rgba(255,255,255,0.1)', width: '48px', height: '48px', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px' }}>
              ✨
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '17px', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>AI 텍스트 큐레이션</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>상황을 직접 적어주시면 골라드려요</div>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
};

export default Home;