export function BrandArtwork({ square = false }: { square?: boolean }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: square ? '64px' : '46px 60px', background: 'linear-gradient(130deg, #a8cdef 0%, #dceaf0 65%, #edf2e7 100%)', color: '#082f57', fontFamily: 'sans-serif', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 34, fontWeight: 700, letterSpacing: -2 }}>pixellayerr.</span><span style={{ fontSize: 12, letterSpacing: 2 }}>A PIXELCLIQ MEDIA STUDIO</span></div>
      <div style={{ display: 'flex', flexDirection: square ? 'column' : 'row', alignItems: square ? 'flex-start' : 'center', flex: 1, gap: square ? 40 : 24, paddingTop: square ? 55 : 25 }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: square ? 900 : 570 }}>
          <span style={{ fontSize: 12, letterSpacing: 2, marginBottom: 22 }}>WEBSITES / DIGITAL PRODUCTS / AI</span>
          <div style={{ display: 'flex', flexDirection: 'column', fontSize: square ? 90 : 72, fontWeight: 700, letterSpacing: -4, lineHeight: 1.04 }}><span>Good ideas.</span><span>Built into</span><span>great websites.</span></div>
          <span style={{ fontSize: 18, marginTop: 25 }}>Designed to stand out. Built for the next step.</span>
        </div>
        <div style={{ display: 'flex', width: square ? 790 : 480, height: square ? 320 : 340, position: 'relative', marginLeft: square ? 50 : 0 }}>
          <div style={{ display: 'flex', position: 'absolute', top: 18, left: 8, width: square ? 710 : 430, height: 285, border: '1px dashed #5b7e9b', borderRadius: 8, transform: 'rotate(-8deg)' }} />
          <div style={{ display: 'flex', position: 'absolute', top: 22, left: 15, width: square ? 710 : 440, height: 285, background: '#fafbf7', borderRadius: 8, flexDirection: 'column', transform: 'rotate(-3deg)', boxShadow: '0 15px 30px #082f571a', overflow: 'hidden' }}>
            <div style={{ display: 'flex', background: '#e5edf1', padding: '10px 15px', fontSize: 8, justifyContent: 'space-between' }}><span>● ● ●</span><span>YOUR NEXT CHAPTER</span><span>↗</span></div>
            <div style={{ display: 'flex', padding: '18px 23px 8px', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: 18, fontWeight: 700, letterSpacing: -1 }}>your brand®</span><span style={{ fontSize: 8 }}>Discover / Our story / Let’s talk ↗</span></div>
            <div style={{ display: 'flex', padding: '15px 23px', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: 7, letterSpacing: 1 }}>BUILT TO BE REMEMBERED</span><div style={{ display: 'flex', flexDirection: 'column', fontSize: square ? 48 : 36, letterSpacing: -2, lineHeight: 1, marginTop: 12 }}><span>Anything</span><span style={{ fontFamily: 'serif', fontStyle: 'italic' }}>but ordinary.</span></div><span style={{ background: '#082f57', color: '#fafbf7', fontSize: 7, padding: '9px 14px', borderRadius: 18, marginTop: 16, width: 133 }}>Find your next chapter ↗</span></div>
              <div style={{ display: 'flex', background: '#d6f06e', borderRadius: '100px 100px 4px 4px', width: square ? 225 : 150, height: 164, alignItems: 'center', justifyContent: 'center' }}><svg width="150" height="160" viewBox="0 0 240 260" fill="none">{Array.from({ length: 18 }, (_, i) => <ellipse key={i} cx="120" cy="130" rx={34 + i * 3.8} ry="105" stroke="#082f57" strokeWidth="1.2" transform={`rotate(${i * 10} 120 130)`} />)}</svg></div>
            </div>
          </div>
          <div style={{ display: 'flex', position: 'absolute', top: -8, left: 0, background: '#082f57', color: '#fafbf7', padding: '12px 17px', borderRadius: 4, transform: 'rotate(-8deg)', flexDirection: 'column' }}><span style={{ fontSize: 6, letterSpacing: 1 }}>VISUAL LANGUAGE</span><span style={{ fontSize: 43, fontFamily: 'serif' }}>Aa ↗</span><div style={{ display: 'flex', gap: 4 }}>{['#a5caeb', '#d6f06e', '#fafbf7'].map(color => <span key={color} style={{ background: color, width: 26, height: 8 }} />)}</div></div>
          <div style={{ display: 'flex', position: 'absolute', right: 0, bottom: 5, padding: '17px 22px', gap: 15, alignItems: 'center', borderRadius: 8, background: '#fff', boxShadow: '0 10px 25px #082f571a' }}><span style={{ background: '#d6f06e', borderRadius: 30, padding: '9px 12px', fontSize: 20 }}>↗</span><div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={{ fontSize: 7, letterSpacing: 1 }}>THE NEXT STEP</span><span style={{ fontSize: 15 }}>Visitor → Conversation</span></div></div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #082f5730', paddingTop: 20, marginTop: 20, fontSize: 12 }}><span>STRATEGY. DESIGN. DEVELOPMENT.</span><span>One studio. Every layer.</span></div>
    </div>
  );
}
