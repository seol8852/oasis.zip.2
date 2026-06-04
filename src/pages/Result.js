import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const searchQuery = state.searchQuery || "감성 노래";

  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAppending, setIsAppending] = useState(false);
  const [nextPageToken, setNextPageToken] = useState("");

  const YOUTUBE_KEY = process.env.REACT_APP_YOUTUBE_KEY || "AIzaSyBgNkFgT_0yrZCtGGYIMOmrI8e-1HCz88A";

  const fallbackPlaylists = [
    { id: { videoId: "8ZoeOqMuS3w" }, snippet: { title: "기분 좋아지는 청량한 플레이리스트 🍃", channelTitle: "essential;" } },
    { id: { videoId: "V5M2WZiAy6k" }, snippet: { title: "듣기만 해도 위로가 되는 따뜻한 노래 모음", channelTitle: "때껄룩" } },
    { id: { videoId: "9bZkp7q19f0" }, snippet: { title: "기분 전환 신나는 팝송 모음", channelTitle: "Pop Music" } },
    { id: { videoId: "7L_L5w5jE0Y" }, snippet: { title: "잔잔한 새벽 감성 플레이리스트", channelTitle: "오아시스 큐레이터" } }
  ];

  const fetchYoutube = useCallback(async ({ pageToken = "", append = false } = {}) => {
    if (append) {
      setIsAppending(true);
    } else {
      setIsLoading(true);
    }

    try {
      const params = {
        key: YOUTUBE_KEY,
        part: 'snippet',
        q: searchQuery,
        type: 'video',
        videoCategoryId: '10',
        order: 'relevance',
        maxResults: 4,
        videoEmbeddable: 'true'
      };

      if (pageToken) params.pageToken = pageToken;

      const searchRes = await axios.get(`https://www.googleapis.com/youtube/v3/search`, { params });
      const items = searchRes.data.items || [];

      if (items.length === 0 && !append) {
        setSongs(fallbackPlaylists);
        setNextPageToken("");
      } else {
        if (append) {
          setSongs(prev => [...prev, ...items]);
        } else {
          setSongs(items);
        }
        setNextPageToken(searchRes.data.nextPageToken || "");
      }
    } catch (error) {
      console.error("❌ 유튜브 검색 중 에러 발생:", error);
      if (!append) {
        setSongs(fallbackPlaylists);
        setNextPageToken("");
      }
    } finally {
      setIsLoading(false);
      setIsAppending(false);
    }
  }, [searchQuery, YOUTUBE_KEY]);

  useEffect(() => {
    fetchYoutube({ append: false });
  }, [fetchYoutube]);

  const handleLoadMore = () => {
    if (nextPageToken) {
      fetchYoutube({ pageToken: nextPageToken, append: true });
    } else {
      alert("더 이상 추천할 노래가 없습니다. 😢");
    }
  };

  const handleRefresh = () => {
    if (nextPageToken) {
      fetchYoutube({ pageToken: nextPageToken, append: false });
    } else {
      alert("새로운 추천 목록이 없습니다. 😢");
    }
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', padding: '30px 24px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
        <button onClick={() => navigate('/')} className="trendy-btn" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginRight: '16px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <h1 style={{ margin: 0, fontSize: '24px', color: '#0F172A', fontWeight: '800', letterSpacing: '-0.5px' }}>오아시스 플레이리스트</h1>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', padding: '10px 20px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '18px' }}>🎧</span>
          <span style={{ color: '#0F172A', fontSize: '15px', fontWeight: '800' }}>"{searchQuery}"</span>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', margin: 'auto 0', color: '#64748B', fontWeight: '700', fontSize: '18px' }}>
          <div className="pulse-ring" style={{ width: '40px', height: '40px', margin: '0 auto 20px auto', background: '#0F172A', animation: 'pulse 1.5s infinite' }} />
          음악을 선별 중입니다...
        </div>
      ) : songs.length === 0 ? (
        <div style={{ textAlign: 'center', margin: 'auto 0', color: '#EF4444', fontWeight: '800', fontSize: '18px' }}>
          조건에 맞는 플레이리스트를 찾지 못했습니다. 😢
          <br />
          <button onClick={() => navigate('/')} className="trendy-btn" style={{ marginTop: '20px', padding: '12px 24px', background: '#0F172A', color: 'white', borderRadius: '16px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
            다시 시도하기
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', paddingBottom: '20px', flex: 1 }}>
            {songs.map((song, idx) => (
              <div key={song.id.videoId + idx} className="trendy-btn" style={{ backgroundColor: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', borderRadius: '32px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column' }}>
                <iframe width="100%" height="220" src={`https://www.youtube.com/embed/${song.id.videoId}`} title={song.snippet.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.05)' }}></iframe>
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
                  <p style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#0F172A', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4', letterSpacing: '-0.5px' }}>
                    {song.snippet.title}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px' }}>👤</div>
                      <p style={{ margin: 0, fontSize: '14px', color: '#475569', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>
                        {song.snippet.channelTitle}
                      </p>
                    </div>
                    <span style={{ fontSize: '11px', color: '#0F172A', background: 'rgba(255,255,255,0.9)', padding: '6px 12px', borderRadius: '12px', fontWeight: '800', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>YouTube</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 하단 버튼 그룹 */}
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '16px', marginTop: 'auto' }}>
        {!isLoading && songs.length > 0 && (
          <>
            <button
              onClick={handleRefresh}
              className="trendy-btn"
              style={{ flex: '2 1 200px', padding: '24px', backgroundColor: '#0F172A', color: 'white', border: 'none', borderRadius: '24px', cursor: 'pointer', fontWeight: '800', fontSize: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', opacity: isAppending ? 0.7 : 1 }}
              disabled={isAppending}
            >
              새로운 추천 보기 ✨
            </button>

            {nextPageToken && (
              <button
                onClick={handleLoadMore}
                className="trendy-btn"
                style={{ flex: '1 1 100px', padding: '24px', backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', color: '#0F172A', border: '1px solid rgba(255,255,255,0.9)', borderRadius: '24px', cursor: 'pointer', fontWeight: '800', fontSize: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
              >
                {isAppending ? '로딩중...' : '더 보기 🔄'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Result;