import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from 'axios';
import { moods } from '../App';

const Analysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  const [analysisText, setAnalysisText] = useState("당신만의 오아시스를 찾는 중...");

  const KAKAO_REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY || "bfcf264faab10bcab3edb0f120a72aa4";
  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "AIzaSyBamIPisG9Bdlg3x7nlns6rs_8c0QwvLZA";

  const getEmotionalKeywordFromWeather = (desc) => {
    if (!desc) return "기분 전환하기 좋은 일상";
    if (desc.includes("맑")) return "화창한 날씨 기분 좋아지는 산뜻한";
    if (desc.includes("구름 조금") || desc.includes("튼구름") || desc.includes("약간의 구름")) return "선선한 날씨 산책하며 듣기 좋은 포근한";
    if (desc.includes("구름") || desc.includes("흐림")) return "흐린 날 차분하게 듣기 좋은 카페 감성";
    if (desc.includes("비") || desc.includes("소나기")) return "비 오는 날 창밖을 보며 듣는 감성";
    if (desc.includes("눈")) return "눈 오는 날 따뜻한 겨울";
    return "기분 전환하기 좋은 일상";
  };

  const getEmotionalKeywordFromLocation = (categoryCode, categoryName) => {
    if (!categoryCode) return `${categoryName || '현재 장소'}에 어울리는 분위기 있는 감성 플레이리스트`;
    if (categoryCode === 'HOME') return "편안한 집에서 휴식할 때 듣는 감성 팝송";

    switch (categoryCode) {
      case 'CE7': return "잔잔한 카페 재즈 커피와 어울리는 로파이(Lo-fi)";
      case 'SW8':
      case 'BK9':
      case 'PO3': return "지루한 대기시간을 달래주는 트렌디한 팝송 퇴근길 지옥철 노동요";
      case 'AT4':
      case 'CT1': return "고궁 산책에 어울리는 퓨전 국악 전시회 감성의 앰비언트 뮤직";
      case 'PK6':
      case 'CS2': return "드라이브 출발 전 신나는 비트 야식 사러 가는 가벼운 발걸음 시티팝";
      case 'FD6': return "맛있는 식사와 함께하는 기분 좋은 팝송";
      case 'SC4':
      case 'AC5': return "도서관 집중할 때 듣기 좋은 백색소음 공부할 때 듣는 피아노";
      case 'MT1':
      case 'PM9':
      case 'HP8': return "마음을 편안하게 해주는 힐링 뉴에이지";
      case 'PS3': return "동심으로 돌아가는 맑은 기분의 인디 음악";
      case 'OL7': return "신나는 드라이브 팝송";
      case 'AD5': return "호캉스 휴식을 위한 칠아웃(Chill-out) 라운지 음악";
      default: return `${categoryName || '현재 장소'}에 어울리는 분위기 있는 감성 플레이리스트`;
    }
  };

  const askGeminiForPlaylist = async (prompt) => {
    try {
      let targetModel = "gemini-1.5-flash";
      try {
        const modelsRes = await axiosInstance.get(`https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`);
        if (modelsRes.data && modelsRes.data.models) {
          const availableModels = modelsRes.data.models.map(m => m.name);
          if (availableModels.includes("models/gemini-2.5-flash")) targetModel = "gemini-2.5-flash";
          else if (availableModels.includes("models/gemini-2.0-flash")) targetModel = "gemini-2.0-flash";
          else if (availableModels.includes("models/gemini-1.5-flash-latest")) targetModel = "gemini-1.5-flash-latest";
          else if (availableModels.includes("models/gemini-1.5-flash")) targetModel = "gemini-1.5-flash";
        }
      } catch (err) {
        console.warn("모델 목록 로드 실패, 기본 모델 사용");
      }

      const response = await axiosInstance.post(
        `https://generativelanguage.googleapis.com/v1/models/${targetModel}:generateContent?key=${GEMINI_API_KEY}`,
        { contents: [{ parts: [{ text: prompt }] }] },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data && response.data.candidates && response.data.candidates.length > 0) {
        let aiKeyword = response.data.candidates[0].content.parts[0].text.trim();
        return aiKeyword.replace(/^["']|["']$/g, '').replace(/\n/g, ' ');
      }
      return null;
    } catch (error) {
      console.error("Gemini API 호출 에러:", error);
      return null; 
    }
  };

  useEffect(() => {
    const analyzeContext = async () => {
      try {
        if (!state || Object.keys(state).length === 0) {
          navigate('/');
          return;
        }

        // 💡 1. 스마트 컨텍스트 융합 분석 (AI가 검색어 하나만 추천하는 기존 방식)
        if (state.type === 'smart_context') {
          const locName = state.locationName || "현재 위치";
          const weatherDesc = state.weatherInfo?.desc || "맑음";
          
          const hour = new Date().getHours();
          let timeOfDay = "낮";
          if (hour >= 5 && hour < 10) timeOfDay = "아침";
          else if (hour >= 10 && hour < 17) timeOfDay = "오후";
          else if (hour >= 17 && hour < 20) timeOfDay = "해질녘";
          else if (hour >= 20 || hour < 2) timeOfDay = "밤";
          else timeOfDay = "새벽";

          setAnalysisText(`'${locName}'의 ${timeOfDay} 분위기 스캔 중...`);

          const prompt = `사용자는 지금 '${locName}'에 있고, 시간은 '${timeOfDay}', 날씨는 '${weatherDesc}' 상태야.
          이 공간적, 환경적, 시간적 분위기 3가지를 모두 종합적으로 고려했을 때 가장 감성적이고 완벽하게 어울리는 유튜브 음악 플레이리스트 검색 키워드를 딱 1개만 추천해줘.
          예를들어 '비오는 밤 연남동 골목길 로파이', '맑은 오후 한강공원 산책 팝송' 같은 식이야.
          다른 말은 절대 하지 말고 딱 검색어만 대답해줘. 마지막에 '플레이리스트'라는 단어를 꼭 붙여줘.`;

          const aiRecommendation = await askGeminiForPlaylist(prompt);
          const searchQuery = aiRecommendation || `${locName} ${timeOfDay} ${weatherDesc} 감성 플레이리스트`;

          setTimeout(() => navigate('/result', { state: { searchQuery } }), 2000);
        }

        // 💡 2. 기존 단순 AI 감성 텍스트
        else if (state.type === 'ai' || state.query) {
          setAnalysisText("AI가 감성을 텍스트에서 읽고 있어요...");
          const queryText = state.query || "기분 좋은 날";
          
          const prompt = `사용자의 현재 기분이나 상황은 '${queryText}'야. 이 감정에 완벽하게 위로나 공감이 될 수 있는 유튜브 음악 플레이리스트 검색 키워드를 딱 1개만 추천해줘. 다른 말 없이 키워드만 대답하고, 마지막에 '플레이리스트'라는 단어를 꼭 붙여줘.`;
          const aiRecommendation = await askGeminiForPlaylist(prompt);
          
          const searchQuery = aiRecommendation || "기분 전환 감성 플레이리스트";
          setTimeout(() => navigate('/result', { state: { searchQuery } }), 2000);
        } 
        
        // 💡 3. 기존 주변 장소 단순 선택 유지
        else if (state.type === 'selected_location' && state.selectedPlace) {
          const placeName = state.selectedPlace.place_name || "선택한 장소";
          setAnalysisText(`'${placeName}' 공간 무드 분석 중...`);

          const prompt = `사용자가 방금 '${placeName}'이라는 장소(카테고리: ${state.selectedPlace.category_name})를 선택했어.
          이 공간의 분위기(예: 힙한 카페, 차분한 전시회, 활기찬 식당 등)와 가장 잘 어울리는 유튜브 음악 플레이리스트 검색 키워드를 딱 1개만 창의적으로 추천해줘.
          다른 말 없이 키워드만 대답하고, 마지막에 '플레이리스트'라는 단어를 꼭 붙여줘.`;

          const aiRecommendation = await askGeminiForPlaylist(prompt);
          const searchQuery = aiRecommendation || `${placeName} 분위기 있는 플레이리스트`;

          setTimeout(() => navigate('/result', { state: { searchQuery } }), 2000);
        }
        else {
          setTimeout(() => navigate('/', { replace: true }), 1000);
        }

      } catch (globalError) {
        console.error("분석 페이지 오류 발생:", globalError);
        setTimeout(() => navigate('/result', { state: { searchQuery: "기분 좋은 감성 팝송 플레이리스트" } }), 1500);
      }
    };

    analyzeContext();
  }, [navigate, state, KAKAO_REST_API_KEY]);

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '30px 24px', boxSizing: 'border-box' }}>
      <style>{`
        .pulse-ring {
          width: 80px; height: 80px;
          border-radius: 50%;
          background: #0F172A;
          animation: pulse 1.5s cubic-bezier(0.24, 0, 0.38, 1) infinite;
          display: flex; justify-content: center; align-items: center;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(15, 23, 42, 0.4); }
          70% { box-shadow: 0 0 0 30px rgba(15, 23, 42, 0); }
          100% { box-shadow: 0 0 0 0 rgba(15, 23, 42, 0); }
        }
        .text-shimmer {
          background: linear-gradient(90deg, #0F172A 0%, #64748B 50%, #0F172A 100%);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shimmer 2s linear infinite;
        }
        @keyframes shimmer { to { background-position: 200% center; } }
      `}</style>

      <div style={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: '100%', maxWidth: '380px', height: '380px',
          background: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
          borderRadius: '40px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(255,255,255,0.8)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          padding: '40px', boxSizing: 'border-box'
        }}>
          <div className="pulse-ring" style={{ marginBottom: '40px', boxShadow: '0 10px 20px rgba(15, 23, 42, 0.2)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <h2 className="text-shimmer" style={{ fontSize: '24px', fontWeight: '900', textAlign: 'center', margin: '0 0 12px 0', letterSpacing: '-0.5px' }}>
            AI 큐레이션 중
          </h2>
          <p style={{ fontSize: '15px', color: '#475569', fontWeight: '600', textAlign: 'center', margin: 0, lineHeight: '1.5' }}>
            {analysisText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analysis;