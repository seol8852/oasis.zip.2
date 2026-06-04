import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const LocationSelector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lat = location.state?.lat || 37.1498; 
  const lon = location.state?.lon || 127.0772;
  const mapContainer = useRef(null);
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let retryCount = 0;
    const initMap = () => {
      const { kakao } = window;
      if (!kakao || !kakao.maps || !kakao.maps.services) {
        if (retryCount++ < 10) setTimeout(initMap, 500);
        else setIsLoading(false);
        return;
      }
      const locPosition = new kakao.maps.LatLng(lat, lon);
      
      const map = new kakao.maps.Map(mapContainer.current, { center: locPosition, level: 3 });
      new kakao.maps.Marker({ position: locPosition }).setMap(map);

      const ps = new kakao.maps.services.Places();

      const searchCategory = (categoryCode) => {
        return new Promise((resolve) => {
          ps.categorySearch(categoryCode, (data, status) => {
            if (status === kakao.maps.services.Status.OK && data) {
              resolve(data);
            } else {
              resolve([]); 
            }
          }, { location: locPosition, radius: 5000 });
        });
      };

      Promise.all([
        searchCategory('AT4'), 
        searchCategory('CT1'),
        searchCategory('CE7')
      ]).then((results) => {
        const mergedPlaces = results.flat();

        if (mergedPlaces.length === 0) {
          ps.keywordSearch('맛집', (data, status) => {
            if (status === kakao.maps.services.Status.OK) {
              setPlaces(data.slice(0, 5));
            }
            setIsLoading(false);
          }, { location: locPosition, radius: 3000 });
          return;
        }

        mergedPlaces.sort((a, b) => Number(a.distance) - Number(b.distance));
        
        const uniquePlaces = mergedPlaces.filter((place, index, self) =>
          self.findIndex((p) => p.id === place.id) === index
        );

        setPlaces(uniquePlaces.slice(0, 5));
        setIsLoading(false);
      }).catch((err) => {
        console.error("장소 검색 중 오류 발생:", err);
        setIsLoading(false);
      });
    };
    initMap();
  }, [lat, lon]);

  return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '30px 24px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', position: 'relative', zIndex: 10 }}>
        <button onClick={() => navigate('/')} className="trendy-btn" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginRight: '16px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <h1 style={{ margin: 0, fontSize: '24px', color: '#0F172A', fontWeight: '800', letterSpacing: '-0.5px' }}>주변 핫플 탐색</h1>
      </div>

      <div className="trendy-btn" ref={mapContainer} style={{ width: '100%', height: '280px', borderRadius: '32px', marginBottom: '30px', backgroundColor: 'rgba(255,255,255,0.6)', border: '2px solid rgba(255,255,255,0.8)', boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1)', flexShrink: 0, overflow: 'hidden', position: 'relative', zIndex: 10 }} />

      {isLoading ? (
        <div style={{ textAlign: 'center', color: '#64748B', fontWeight: '600', padding: '40px 0', fontSize: '16px', position: 'relative', zIndex: 10 }}>
          <div style={{ marginBottom: '10px', fontSize: '24px' }}>🧭</div>
          가장 핫한 장소를 찾고 있어요...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', paddingBottom: '40px', position: 'relative', zIndex: 10 }}>
          {places.map((place, idx) => (
            <div key={idx} className="trendy-btn" onClick={() => navigate('/analysis', { state: { type: 'selected_location', selectedPlace: place } })} style={{
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderRadius: '24px',
              padding: '24px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid rgba(255,255,255,0.8)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: '#0F172A', color: '#FFF', width: '40px', height: '40px', borderRadius: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '800', fontSize: '14px' }}>
                  {idx + 1}
                </div>
                <div>
                  <div style={{ fontWeight: '800', color: '#0F172A', fontSize: '17px', marginBottom: '4px' }}>{place.place_name}</div>
                  <div style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>나와 {place.distance}m 거리</div>
                </div>
              </div>
              <div style={{ color: '#0F172A', background: 'rgba(255,255,255,0.9)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default LocationSelector;