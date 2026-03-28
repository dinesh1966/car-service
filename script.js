function useHeroOdometer(target, duration, isFloat, started){
  const [val, setVal] = React.useState(0);
  React.useEffect(()=>{
    if(!started) return;
    let start = null;
    const step = ts => {
      if(!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const cur = isFloat ? Math.round(target * ease * 10) / 10 : Math.round(target * ease);
      setVal(cur);
      if(p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started]);
  return val;
}

function HeroStatItem({num, suffix, label, isFloat, started, delay}){
  const [go, setGo] = React.useState(false);
  React.useEffect(()=>{ if(started){ const t = setTimeout(()=>setGo(true), delay); return ()=>clearTimeout(t); } }, [started]);
  const val = useHeroOdometer(num, 1400, isFloat, go);
  return(
    <div className="hero-stat-item">
      <span className="hero-stat-num">{isFloat ? val.toFixed(1) : val.toLocaleString('en-IN')}{suffix}</span>
      <span className="hero-stat-label">{label}</span>
    </div>
  );
}

function HeroStats(){
  const [started, setStarted] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(()=>{
    const obs = new IntersectionObserver(([e])=>{ if(e.isIntersecting){ setStarted(true); obs.disconnect(); } }, {threshold:0.3});
    if(ref.current) obs.observe(ref.current);
    return ()=>obs.disconnect();
  },[]);
  const stats = [
    {num:5000, suffix:'+', label:'Cars Serviced'},
    {num:4.9, suffix:'★', label:'Average Rating', isFloat:true},
    {num:98, suffix:'%', label:'Satisfaction'},
    {num:3, suffix:' Yrs', label:'In Business'},
  ];
  return(
    <div className="hero-stats-bar" ref={ref}>
      {stats.map((s,i)=>(
        <React.Fragment key={i}>
          <HeroStatItem {...s} started={started} delay={i*120}/>
          {i < stats.length-1 && <div className="hero-stat-divider"/>}
        </React.Fragment>
      ))}
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('react-hero-stats-root')).render(<HeroStats/>);

function StatsSection(){
  const stats=[
    {icon:'🚗', num:5000, suffix:'+', label:'Cars Serviced', sub:'and counting…'},
    {icon:'⭐', num:4.9, suffix:'★', label:'Average Rating', sub:'from 5,000+ reviews', isFloat:true},
    {icon:'✅', num:98, suffix:'%', label:'Satisfaction Rate', sub:'happy customers'},
    {icon:'🏆', num:3, suffix:' Yrs', label:'In Business', sub:'trusted since 2023'},
  ];
  const[counts,setCounts]=React.useState(stats.map(()=>0));
  const[visible,setVisible]=React.useState(false);
  const ref=React.useRef(null);

  React.useEffect(()=>{
    const obs=new IntersectionObserver(([entry])=>{
      if(entry.isIntersecting){
        setVisible(true);
      } else {
        setVisible(false);
      }
    },{threshold:0.2});
    if(ref.current)obs.observe(ref.current);
    return()=>obs.disconnect();
  },[]);

  React.useEffect(()=>{
    if(!visible) {
      setCounts(stats.map(()=>0));
      return;
    }
    const duration=1800;
    const startTime=performance.now();
    function tick(now){
      const p=Math.min((now-startTime)/duration,1);
      const ease=p===1?1:1-Math.pow(2,-10*p);
      setCounts(stats.map(s=>s.isFloat?parseFloat((s.num*ease).toFixed(1)):Math.round(s.num*ease)));
      if(p<1)requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  },[visible]);

  return(
    <section className="stats-section" ref={ref}>
      <div className="stats-grid">
        {stats.map((s,i)=>(
          <div
            className={`stat-box${visible?' visible':''}`}
            key={i}
            style={{
              transition:`opacity 0.6s ease ${i*130}ms, transform 0.6s cubic-bezier(0.23,1,0.32,1) ${i*130}ms, border-color 0.3s ease, box-shadow 0.35s ease`
            }}
          >
            <div className="stat-arc-l"/>
            <div className="stat-arc-r"/>
            <div className="stat-box-glow"/>
            <div className="stat-spark"/>
            <div className="stat-corner stat-corner-tl"/>
            <div className="stat-corner stat-corner-tr"/>
            <div className="stat-corner stat-corner-bl"/>
            <div className="stat-corner stat-corner-br"/>
            <div className="stat-icon-wrap">{s.icon}</div>
            <div className="stat-number">
              <span className="stat-val">{s.isFloat?counts[i].toFixed(1):counts[i].toLocaleString('en-IN')}</span>
              <span className="stat-sfx">{s.suffix}</span>
            </div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-subtext">{s.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
ReactDOM.createRoot(document.getElementById('react-stats-root')).render(<StatsSection/>);



function ServicesSection(){const services=[{tag:"Maintenance",title:"Oil Change",desc:"Premium engine oil with OEM-grade filters. Keeps your engine protected.",img:"https://res.cloudinary.com/drkgkgiat/image/upload/v1773387407/oil_change_hnai0y.jpg"},{tag:"Cleaning",title:"Car Wash",desc:"Full interior vacuum, exterior foam wash & streak-free finish.",img:"https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&q=80"},{tag:"Electrical",title:"Battery Replacement",desc:"Fast battery health test & genuine battery swap in under 30 mins.",img:"https://res.cloudinary.com/drkgkgiat/image/upload/v1773387776/Gemini_Generated_Image_d4e15qd4e15qd4e1_lmfpci.png"},{tag:"Climate",title:"AC Repair",desc:"AC gas refill, compressor check & full cooling system service.",img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"},{tag:"Tyres",title:"Tyre Service",desc:"Rotation, balancing, alignment & new tyre fitment at your doorstep.",img:"https://res.cloudinary.com/drkgkgiat/image/upload/v1773387937/Gemini_Generated_Image_cde8uucde8uucde8_cajy7k.png"},{tag:"Full Package",title:"Complete Service",desc:"End-to-end car inspection, detailing & all fluids replaced.",img:"https://res.cloudinary.com/drkgkgiat/image/upload/v1773388328/Gemini_Generated_Image_36arvd36arvd36ar_clxevj.png"},{tag:"Detailing",title:"Mirror Shine Interior",desc:"Deep steam cleaning, leather conditioning & UV protection. Cabin feels factory-fresh from the first breath.",img:"https://res.cloudinary.com/drkgkgiat/image/upload/v1773388156/Gemini_Generated_Image_82altq82altq82al_cjwje4.png"},{tag:"Engine Care",title:"Engine Bay Like New",desc:"High-pressure degreasing, bay dressing & protective coating. Show-grade engine bay finish guaranteed.",img:"https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80"}];return(<section className="react-services-section"><p className="react-title">What We Offer</p><h2 className="react-title-main">Our <span>Services</span></h2><div className="services-container">{services.map((s,i)=>(<div className="service-card" key={i}><img className="service-card-img" src={s.img} alt={s.title}/><div className="service-card-overlay"/><div className="service-card-content"><span className="service-tag">{s.tag}</span><h3>{s.title}</h3><p>{s.desc}</p><button className="service-btn" onClick={e=>{e.stopPropagation();window.dispatchEvent(new CustomEvent('open-booking-modal',{detail:{service:s.title}}))}}>Book Now →</button></div></div>))}</div></section>);}
ReactDOM.createRoot(document.getElementById('react-services-root')).render(<ServicesSection/>);



const ShieldIcon=()=>(<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>);
const ClockIcon=()=>(<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);
const WrenchIcon2=()=>(<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>);
const ThumbIcon=()=>(<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>);
const TeamIcon=()=>(<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>);
function WhyChooseUs(){const features=[{icon:<ShieldIcon/>,title:"Trusted Service",desc:"Certified mechanics with years of hands-on experience you can count on.",stat:"10+ Years Experience",img:"https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80"},{icon:<ClockIcon/>,title:"Fast Turnaround",desc:"Most services completed in under 2 hours. Back on the road, fast.",stat:"Avg. 90 Min Service",img:"https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=600&q=80"},{icon:<WrenchIcon2/>,title:"Genuine Parts Only",desc:"We use 100% OEM-grade spare parts — no shortcuts, no compromises.",stat:"OEM Certified Parts",img:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80"},{icon:<ThumbIcon/>,title:"5000+ Happy Customers",desc:"Thousands trust us every month. Your satisfaction is our guarantee.",stat:"4.9★ Average Rating",img:"https://images.unsplash.com/photo-1517026575980-3e1e2dedeab4?w=600&q=80"},{icon:<TeamIcon/>,title:"Expert Mechanics",desc:"Meet the certified professionals who treat your car like their own.",stat:"Meet Our Team",action:true,img:"https://images.unsplash.com/photo-1513530534585-c7b1394c6d51?w=600&q=80"}];return(<section className="why-section"><div className="why-header"><span className="why-label">Our Commitment</span><h2 className="why-heading">Why Choose <span>CarCare?</span></h2></div><div className="why-grid">{features.map((item,i)=>(<div className={`why-card${item.action?' tm-trigger':''}`} key={i} onClick={()=>{if(item.action) document.getElementById('team-mechanic')?.scrollIntoView({behavior:'smooth'})}}><div className="why-card-img-wrap"><img src={item.img} className="why-card-img" alt={item.title}/><div className="why-card-overlay"/></div><div className="why-card-line"/><div className="why-icon-wrap">{item.icon}</div><div className="why-card-text"><h3>{item.title}</h3><p>{item.desc}</p><div className="why-stat">{item.action?item.stat+' →':'→ '+item.stat}</div></div></div>))}</div></section>);}
ReactDOM.createRoot(document.getElementById('react-why-root')).render(<WhyChooseUs/>);



function useCountdown(t){const c=()=>{const d=new Date(t)-new Date();if(d<=0)return{d:0,h:0,m:0,s:0};return{d:Math.floor(d/86400000),h:Math.floor((d%86400000)/3600000),m:Math.floor((d%3600000)/60000),s:Math.floor((d%60000)/1000)};};const[time,setTime]=React.useState(c);React.useEffect(()=>{const id=setInterval(()=>setTime(c()),1000);return()=>clearInterval(id);},[]);return time;}
function OfferCard({offer}){const[copied,setCopied]=React.useState(false);const time=useCountdown(offer.expires||new Date());const pad=n=>String(n).padStart(2,'0');const copy=()=>{navigator.clipboard.writeText(offer.code).catch(()=>{});setCopied(true);setTimeout(()=>setCopied(false),2000);};return(<div className="offer-card"><div className="offer-badge">{offer.icon} {offer.badge}</div><div className="offer-discount">{offer.discount}<span>%</span></div><div className="offer-title">{offer.title}</div><div className="offer-desc">{offer.desc}</div>{offer.showTimer&&(<><div className="offer-validity">⏳ Offer expires in:</div><div className="offer-timer">{[['d','Days'],['h','Hrs'],['m','Min'],['s','Sec']].map(([k,l])=>(<div className="offer-timer-box" key={k}><span className="offer-timer-num">{pad(time[k])}</span><span className="offer-timer-lbl">{l}</span></div>))}</div></>)}{!offer.showTimer&&<div className="offer-validity">📅 {offer.validityText}</div>}<div className="offer-code-wrap"><div className="offer-code">{offer.code}</div><button className={`offer-copy-btn${copied?' copied':''}`} onClick={copy}>{copied?'✓ Copied!':'Copy'}</button></div><button className="offer-btn" onClick={()=>window.dispatchEvent(new CustomEvent('open-booking-modal',{detail:{service:offer.title}}))}>Claim Offer →</button></div>);}
function OffersSection(){const now=new Date();const flash=new Date(now.getTime()+2*24*3600000+5*3600000+23*60000);const offers=[{icon:'🔥',badge:'Flash Deal',discount:'30',title:'First Service Free Wash',desc:'Book any service & get a complimentary exterior foam wash worth ₹299 — absolutely free for first-timers.',code:'FIRST30',showTimer:true,expires:flash},{icon:'🎉',badge:'Seasonal Offer',discount:'20',title:'Summer AC Service Deal',desc:'Beat the heat! Get 20% off on full AC service, gas refill & cooling check. Valid for all vehicle types.',code:'SUMMER20',showTimer:false,validityText:'Valid till 30 June 2026'},{icon:'⭐',badge:'Loyalty Reward',discount:'15',title:'Repeat Customer Discount',desc:'Visited us before? Use this exclusive code to get 15% off on your next booking. Our way of saying thank you!',code:'LOYAL15',showTimer:false,validityText:'No expiry — always valid'},{icon:'🚘',badge:'New Member',discount:'25',title:'Refer a Friend & Save',desc:'Refer a friend and both of you get 25% off on next service. Share the love, share the savings.',code:'REFER25',showTimer:false,validityText:'Valid for 90 days after referral'}];const items=['🎁 Use code <b>FIRST30</b> for 30% off your first service','🚗 Free Wash on every Premium booking','⚡ Flash Sales every week — don\'t miss out','🏆 5000+ happy customers across Coimbatore'];const doubled=[...items,...items];return(<section className="offer-section"><div className="offer-strip"><div className="offer-strip-inner">{doubled.map((t,i)=><React.Fragment key={i}><span dangerouslySetInnerHTML={{__html:t}}/><span className="strip-dot">◆</span></React.Fragment>)}</div></div><div className="offer-header"><span className="offer-label">Exclusive Deals</span><h2 className="offer-heading">Special <span>Offers</span></h2></div><div className="offer-grid">{offers.map((o,i)=><OfferCard key={i} offer={o}/>)}</div></section>);}
ReactDOM.createRoot(document.getElementById('react-offers-root')).render(<OffersSection/>);



function GallerySection(){
  const images = [
    {url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80", title: "Premium Detailing", desc: "Mirror-finish paint correction and ceramic coating for a showroom glow."},
    {url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80", title: "Engine Diagnostics", desc: "Advanced performance tuning and electronic checks by certified experts."},
    {url: "https://res.cloudinary.com/drkgkgiat/image/upload/v1773388156/Gemini_Generated_Image_82altq82altq82al_cjwje4.png", title: "Luxury Interiors", desc: "Deep steam cleaning and leather restoration for ultimate cabin comfort."},
    {url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80", title: "Showroom Shine", desc: "Complete exterior protection and high-gloss finish for every vehicle."},
    {url: "https://res.cloudinary.com/drkgkgiat/image/upload/v1773388328/Gemini_Generated_Image_36arvd36arvd36ar_clxevj.png", title: "Full Inspection", desc: "Comprehensive 150-point safety and health check for complete peace of mind."}
  ];

  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  const next = React.useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  React.useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, paused]);

  return (
    <section className="gallery-section" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="gallery-header">
        <span className="gallery-label">Visual Excellence</span>
        <h2 className="gallery-heading">Our <span>Gallery</span></h2>
        <p className="gallery-subtext">Take a look at the premium care we provide for every vehicle that enters our workshop.</p>
      </div>
      
      <div className="gallery-container">
        <div className="gallery-3d-wrap">
          {images.map((img, i) => {
            let offset = i - index;
            // handle wrapping for smooth infinite feel
            if (offset > images.length / 2) offset -= images.length;
            if (offset < -images.length / 2) offset += images.length;

            const absOffset = Math.abs(offset);
            const isActive = offset === 0;
            
            return (
              <div 
                key={i}
                className={`gallery-card ${isActive ? 'active' : ''}`}
                style={{
                  '--offset': offset,
                  '--abs-offset': absOffset,
                  pointerEvents: absOffset > 1 ? 'none' : 'auto',
                  opacity: absOffset > 2.5 ? 0 : 1,
                  zIndex: 10 - absOffset
                }}
                onClick={() => setIndex(i)}
              >
                <div className="gallery-card-inner">
                  <div className="gallery-img-wrap">
                    <img src={img.url} alt={img.title} />
                    <div className="gallery-card-overlay" />
                  </div>
                  <div className="gallery-card-content">
                    <h3>{img.title}</h3>
                    <p>{img.desc}</p>
                    <div className="gallery-card-line" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="gallery-footer">
          <div className="gallery-controls">
            <button onClick={prev} className="gallery-nav-btn" aria-label="Previous">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <div className="gallery-dots">
              {images.map((_, i) => (
                <button 
                  key={i} 
                  className={`gallery-dot ${i === index ? 'active' : ''}`} 
                  onClick={() => setIndex(i)} 
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button onClick={next} className="gallery-nav-btn" aria-label="Next">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
ReactDOM.createRoot(document.getElementById('react-ba-root')).render(<GallerySection/>);



function ReviewSlider(){
  const reviews=[{name:"Rahul M.",service:"Complete Service",text:"Best car service in town! Engine performance ippo vera level-la iruku. Genuine parts use pannanga — zero compromise on quality!",stars:5},{name:"Priya S.",service:"Car Wash & Detailing",text:"Water wash romba neat-a pannanga. Interior also super clean achu. Polish panna pinbu showroom look-la iruku. Highly recommended!",stars:5},{name:"Suresh K.",service:"Oil Change",text:"Affordable price, quick response and no waiting. Happy with the oil change and tyre rotation. Mechanic explained everything clearly.",stars:4},{name:"Anitha R.",service:"Doorstep Pickup",text:"Doorstep pickup and drop facility was very helpful. Saved so much time. No need to go anywhere — they came home and returned the car spotless!",stars:5},{name:"Karthik V.",service:"AC Repair",text:"AC repair was done perfectly within 1 hour. Cool air immediately. The technician was professional and transparent about every step.",stars:5},{name:"Deepa N.",service:"Premium Plan",text:"Transparent pricing, no hidden charges — exactly what they quoted. Will definitely choose the annual plan next time. Fantastic experience!",stars:4}];
  const CARD_W=380,GAP=24,STEP=404,AUTO_INTERVAL=3000;
  const N=reviews.length;
  const[current,setCurrent]=React.useState(0);
  const[offset,setOffset]=React.useState(0);
  const[paused,setPaused]=React.useState(false);
  const[dragging,setDragging]=React.useState(false);
  const[dragStart,setDragStart]=React.useState(0);
  const[dragDelta,setDragDelta]=React.useState(0);
  const velRef=React.useRef(0),lastXRef=React.useRef(0),lastTRef=React.useRef(0);
  const lerpRef=React.useRef({cur:0,target:0}),frameRef=React.useRef(null);

  const goTo=React.useCallback(idx=>{
    const wrapped=((idx%N)+N)%N;
    setCurrent(wrapped);
  },[N]);

  React.useEffect(()=>{
    lerpRef.current.target=current*STEP;
    const diff=Math.abs(lerpRef.current.target - lerpRef.current.cur);
    if(diff > STEP*(N-1.5)) lerpRef.current.cur=lerpRef.current.target;
    const run=()=>{
      const l=lerpRef.current;
      l.cur+=(l.target-l.cur)*0.1;
      if(Math.abs(l.target-l.cur)<0.3) l.cur=l.target;
      setOffset(l.cur);
      frameRef.current=requestAnimationFrame(run);
    };
    frameRef.current=requestAnimationFrame(run);
    return()=>cancelAnimationFrame(frameRef.current);
  },[current]);

  React.useEffect(()=>{
    if(paused) return;
    const id=setInterval(()=>goTo(current+1), AUTO_INTERVAL);
    return()=>clearInterval(id);
  },[paused,current,goTo]);

  const onPointerDown=e=>{setPaused(true);setDragging(true);setDragStart(e.clientX);setDragDelta(0);velRef.current=0;lastXRef.current=e.clientX;lastTRef.current=Date.now();e.currentTarget.setPointerCapture(e.pointerId);};
  const onPointerMove=e=>{if(!dragging)return;const dx=e.clientX-dragStart;setDragDelta(dx);const now=Date.now(),dt=now-lastTRef.current;if(dt>0)velRef.current=(e.clientX-lastXRef.current)/dt;lastXRef.current=e.clientX;lastTRef.current=now;};
  const onPointerUp=()=>{if(!dragging)return;setDragging(false);const t=CARD_W*0.2;if(dragDelta<-t||velRef.current<-0.4)goTo(current+1);else if(dragDelta>t||velRef.current>0.4)goTo(current-1);setDragDelta(0);setTimeout(()=>setPaused(false),4000);};

  const visualOffset=offset-(dragging?-dragDelta:0);
  const progress=((current+1)/N)*100;
  const starIcons=n=>Array.from({length:5},(_,i)=><span key={i} className={`rv-card-star${i>=n?' empty':''}`}>★</span>);

  return(
    <section className="rv-section">
      <div className="rv-header">
        <div className="rv-header-left">
          <span className="rv-label">What Customers Say</span>
          <h2 className="rv-heading">Customer <span>Reviews</span></h2>
          <p className="rv-subtext">Real stories from real customers. 5,000+ happy cars serviced.</p>
          <div className="rv-rating-summary">
            <div className="rv-big-score">4.9</div>
            <div className="rv-score-details">
              <div className="rv-stars-row">{[1,2,3,4,5].map(i=><svg key={i} className="rv-star" viewBox="0 0 24 24" fill="#356DFF"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>)}</div>
              <div className="rv-total-reviews">Based on 5,000+ reviews</div>
            </div>
          </div>
          <div className="rv-auto-badge"><div className="rv-auto-dot"/>Auto Sliding</div>
        </div>
      </div>
      <div className="rv-track-wrap">
        <div className="rv-track" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}
          style={{transform:`translateX(calc(50% - ${CARD_W/2}px - ${visualOffset}px))`,cursor:dragging?'grabbing':'grab'}}>
          {reviews.map((rev,i)=>{
            let dist=Math.abs(i-current);
            if(dist>N/2) dist=N-dist;
            const isCenter=i===current;
            const sc=isCenter?1.05:Math.max(0.88,1-dist*0.05);
            const op=isCenter?1:Math.max(0.4,1-dist*0.25);
            return(
              <div key={i} className={`rv-card${isCenter?' is-center':''}`} onClick={()=>!dragging&&goTo(i)}
                onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>{if(!dragging)setPaused(false);}}
                style={{transform:`scale(${sc})${isCenter?' translateY(-8px)':''}`,opacity:op,
                  transition:dragging?'opacity 0.2s':'transform 0.5s cubic-bezier(0.23,1,0.32,1), opacity 0.5s ease',
                  flexShrink:0,width:CARD_W,marginRight:GAP}}>
                <div className="rv-card-top"><div className="rv-card-stars">{starIcons(rev.stars)}</div><div className="rv-card-badge">✓ Verified</div></div>
                <div className="rv-card-quote">"</div>
                <p className="rv-card-text">{rev.text}</p>
                <div className="rv-card-service-chip">{rev.service}</div>
                <div className="rv-card-footer"><div className="rv-avatar">{rev.name[0]}</div><div className="rv-card-meta"><div className="rv-card-name">{rev.name}</div><div className="rv-card-sub">Verified Customer</div></div></div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="rv-dots">{reviews.map((_,i)=><button key={i} className={`rv-dot${i===current?' active':''}`} onClick={()=>{goTo(i);setPaused(true);setTimeout(()=>setPaused(false),4000);}}/>)}</div>
      <div className="rv-progress-wrap"><div className="rv-progress-bar-bg"><div className="rv-progress-bar-fill" style={{width:`${progress}%`}}/></div><div className="rv-progress-text">{current+1} / {N} REVIEWS</div></div>
    </section>
  );
}
ReactDOM.createRoot(document.getElementById('react-reviews-root')).render(<ReviewSlider/>);



function useOdometer(target,duration=1200){const[display,setDisplay]=React.useState(0);const raf=React.useRef(null);React.useEffect(()=>{let start=null;const step=ts=>{if(!start)start=ts;const p=Math.min((ts-start)/duration,1);const ease=p===1?1:1-Math.pow(2,-10*p);setDisplay(Math.round(target*ease));if(p<1)raf.current=requestAnimationFrame(step);};raf.current=requestAnimationFrame(step);return()=>cancelAnimationFrame(raf.current);},[target,duration]);return display;}
function PricingSection(){const plans=[{name:'Hatchback',price:749,original:899},{name:'Sedan / Compact SUV',price:849,original:1049},{name:'SUV',price:949,original:1198},{name:'Luxury Cars',price:999,original:1299}];return(<section className="pricing-section"><div className="pricing-split-wrapper"><div className="pricing-content-side"><span className="pricing-label">Monthly Subscription</span><h2 className="pricing-heading" style={{textAlign:'left',marginBottom:'15px'}}>Daily Waterless <span>Car Cleaning</span></h2><p style={{color:'var(--text-muted)',marginBottom:'30px'}}>Professional daily cleaning at your doorstep. Eco-friendly waterless technology.</p><div className="pricing-list">{plans.map((plan,i)=><PlanRowItem key={i} plan={plan}/>)}</div></div><div className="pricing-image-side"><img src="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1000&q=80" alt="Professional Car Wash"/><div className="pricing-image-overlay"/></div></div></section>);}function PlanRowItem({plan}){const displayPrice=useOdometer(plan.price,1000);return(<div className="plan-row-item" onClick={()=>window.dispatchEvent(new CustomEvent('open-booking-modal',{detail:{service:plan.name+' Subscription'}}))}><div className="plan-info-main"><div className="plan-type-name">{plan.name}</div><div className="plan-price-group"><span className="plan-curr-price">₹{displayPrice.toLocaleString('en-IN')}</span>{plan.original&&<span className="plan-orig-price">₹{plan.original}</span>}<span style={{fontSize:'12px',color:'var(--text-muted)'}}>/ month</span></div></div><button className="plan-row-btn">Subscribe →</button></div>);}
function FAQSection(){const[open,setOpen]=React.useState(null);const faqs=[{q:'How long does a car service take?',a:'Most services are completed in 1–2 hours. Full detailing packages may take up to 4 hours. We always give you a time estimate before starting.'},{q:'Do you provide doorstep pickup & drop?',a:'Yes! We offer free doorstep pickup and drop for Premium and Complete plan customers. Basic plan customers can opt-in for ₹99 extra.'},{q:'Do you use genuine OEM parts?',a:'Absolutely. We only source certified OEM-grade spare parts from authorised distributors. You receive a parts invoice for every replacement.'},{q:'Can I customise my service package?',a:'Yes — each plan has add-on options in the pricing section above. You can also call us for fully custom packages for fleet or luxury vehicles.'},{q:'How do I track my car during service?',a:'After booking, you receive a live WhatsApp status update at each stage: Pickup → In Service → Quality Check → Delivered.'},{q:'What payment methods do you accept?',a:'We accept UPI, cards, net banking and cash. Full payment is collected only after service delivery — no advance required.'}];return(<section className="faq-section"><div className="faq-inner"><div className="faq-left"><div className="faq-header"><span className="faq-label">Got Questions?</span><h2 className="faq-heading">Frequently <span>Asked</span></h2><p className="faq-subtext">Everything you need to know about our services, pricing and process. Can't find your answer? Call us anytime.</p></div><div className="faq-list">{faqs.map((f,i)=>(<div className={`faq-item-new${open===i?' open':''}`} key={i}><button className="faq-q" onClick={()=>setOpen(open===i?null:i)}>{f.q}<span className="faq-icon">+</span></button><div className={`faq-a${open===i?' open':''}`}><p>{f.a}</p></div></div>))}</div></div><div className="faq-right"><div className="faq-img-wrap"><img src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=85" alt="Professional car service"/><div className="faq-img-overlay"/><div className="faq-img-badge">🏆 Certified Workshop</div><div className="faq-img-content"><div className="faq-img-title">Professional Care,<br/>Every Single Time.</div><div className="faq-img-desc">Our certified mechanics use OEM parts and follow manufacturer-grade service standards — your car is in safe hands.</div><div className="faq-img-stats"><div className="faq-img-stat"><div className="faq-img-stat-num">5000+</div><div className="faq-img-stat-label">Cars Serviced</div></div><div className="faq-img-stat"><div className="faq-img-stat-num">4.9★</div><div className="faq-img-stat-label">Rating</div></div><div className="faq-img-stat"><div className="faq-img-stat-num">3 Yrs</div><div className="faq-img-stat-label">Experience</div></div></div><button className="faq-img-cta" onClick={()=>window.dispatchEvent(new CustomEvent('open-booking-modal',{detail:{service:'General Service'}}))} >Book a Service →</button></div></div></div></div></section>);}
function BookingSection(){const contactItems=[{icon:'\ud83d\udcde',title:'Call Us',value:'+91 99999 99999',sub:'Mon\u2013Sat, 9 AM \u2013 6 PM'},{icon:'\ud83d\udce7',title:'Email Us',value:'hello@carcare.in',sub:'We reply within 2 hours'},{icon:'\ud83d\udccd',title:'Visit Us',value:'Anna Nagar, Chennai',sub:'Opposite Metro Station'},{icon:'\ud83d\udd50',title:'Working Hours',value:'9:00 AM \u2013 6:00 PM',sub:'Sunday: Closed'}];return(<section className="booking-section"><div className="cta-wrapper"><div className="cta-left"><span className="booking-label">Get In Touch</span><h2 className="booking-heading">Ready to Give Your Car the <span>Best Care?</span></h2><p className="cta-desc">Book your appointment in seconds. Our certified mechanics are ready to serve you with premium quality service.</p><div className="cta-buttons"><button className="cta-book-btn" onClick={()=>window.dispatchEvent(new CustomEvent('open-booking-modal',{detail:{service:'General Service'}}))}>📅 Book Appointment</button><a href="https://wa.me/919999999999" className="cta-wa-btn" target="_blank" rel="noreferrer">💬 WhatsApp Us</a></div><div className="cta-trust"><span>✅ Free Pickup & Drop</span><span>✅ Genuine Parts</span><span>✅ 90 Min Avg Service</span></div></div><div className="cta-right"><div className="cta-contact-grid">{contactItems.map((c,i)=>(<div className="cta-contact-card" key={i}><div className="cta-contact-icon">{c.icon}</div><div className="cta-contact-info"><div className="cta-contact-title">{c.title}</div><div className="cta-contact-value">{c.value}</div><div className="cta-contact-sub">{c.sub}</div></div></div>))}</div></div></div></section>);}
ReactDOM.createRoot(document.getElementById('react-pricing-root')).render(<PricingSection/>);
ReactDOM.createRoot(document.getElementById('react-faq-root')).render(<FAQSection/>);
ReactDOM.createRoot(document.getElementById('react-booking-root')).render(<BookingSection/>);

function MechanicFeature(){
  const m = {
    name: "Rajesh Kumar",
    role: "Lead Diagnostic Specialist",
    exp: "15+ Years Experience",
    qual: "Bosch Certified Expert",
    img: "main_mechanic.png",
    bio: "Our lead expert specializing in complex electronic diagnostics and performance tuning. Rajesh treats every car with the precision and care it deserves."
  };

  return(
    <section className="mechanic-feature-section" id="team-mechanic">
      <div className="mf-container">
        <div className="mf-content">
          <div className="mf-info-side">
            <span className="mf-label">Expert in Charge</span>
            <h2 className="mf-heading">Meet Our <span>Master Mechanic</span></h2>
            <p className="mf-desc">{m.bio}</p>
            <div className="mf-stats-grid">
              <div className="mf-stat-box">
                <div className="mf-stat-val">15+</div>
                <div className="mf-stat-lbl">Years Exp</div>
              </div>
              <div className="mf-stat-box">
                <div className="mf-stat-val">4.9★</div>
                <div className="mf-stat-lbl">Rating</div>
              </div>
            </div>
            <div className="mf-badges">
              <span className="mf-badge">🎓 {m.qual}</span>
              <span className="mf-badge">✅ Verified Expert</span>
            </div>
            <button className="mf-cta-btn" onClick={() => window.dispatchEvent(new CustomEvent('open-booking-modal',{detail:{service:'General Service'}}))}>
              Book with Rajesh →
            </button>
          </div>
          <div className="mf-image-side">
            <div className="mf-img-frame">
              <img src={m.img} alt={m.name} className="mf-main-img" />
              <div className="mf-img-overlay" />
              <div className="mf-floating-card">
                <div className="mf-fc-icon">🔧</div>
                <div className="mf-fc-text">
                  <strong>{m.name}</strong>
                  <span>{m.role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
ReactDOM.createRoot(document.getElementById('react-mechanic-feature-root')).render(<MechanicFeature/>);

function BookingModal(){const[open,setOpen]=React.useState(false);const[service,setService]=React.useState('');const[step,setStep]=React.useState(1);const[selDate,setSelDate]=React.useState(null);const[selTime,setSelTime]=React.useState('');const[calMonth,setCalMonth]=React.useState(new Date().getMonth());const[calYear,setCalYear]=React.useState(new Date().getFullYear());const[form,setFormState]=React.useState({name:'',phone:'',car:'',address:''});
React.useEffect(()=>{const handler=e=>{setService(e.detail.service||'');setStep(1);setSelDate(null);setSelTime('');setFormState({name:'',phone:'',car:'',address:''});const now=new Date();setCalMonth(now.getMonth());setCalYear(now.getFullYear());setOpen(true);document.body.style.overflow='hidden';};window.addEventListener('open-booking-modal',handler);return()=>window.removeEventListener('open-booking-modal',handler);},[]);
const close=()=>{setOpen(false);document.body.style.overflow='';};const set=(k,v)=>setFormState(p=>({...p,[k]:v}));
const today=new Date();const monthNames=['January','February','March','April','May','June','July','August','September','October','November','December'];const dayLabels=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const daysInMonth=new Date(calYear,calMonth+1,0).getDate();const firstDay=new Date(calYear,calMonth,1).getDay();
const prevMonth=()=>{if(calMonth===0){setCalMonth(11);setCalYear(calYear-1);}else setCalMonth(calMonth-1);};const nextMonth=()=>{if(calMonth===11){setCalMonth(0);setCalYear(calYear+1);}else setCalMonth(calMonth+1);};
const isDisabled=day=>new Date(calYear,calMonth,day)<new Date(today.getFullYear(),today.getMonth(),today.getDate());const isToday=day=>today.getDate()===day&&today.getMonth()===calMonth&&today.getFullYear()===calYear;const isSelected=day=>selDate&&selDate.d===day&&selDate.m===calMonth&&selDate.y===calYear;
const timeSlots=['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM','05:00 PM','05:30 PM'];
const formatDate=()=>selDate?`${selDate.d} ${monthNames[selDate.m].slice(0,3)} ${selDate.y}`:'';const canProceedStep1=selDate&&selTime;const canProceedStep2=form.name&&form.phone&&form.car;
const stepDotClass=s=>s===step?'bm-step-dot active':s<step?'bm-step-dot done':'bm-step-dot';const stepLineClass=s=>s<step?'bm-step-line done':'bm-step-line';
return(<div className={`bm-overlay${open?' open':''}`} onClick={e=>{if(e.target===e.currentTarget)close();}}><div className="bm-modal"><button className="bm-close" onClick={close}>✕</button><div className="bm-steps"><div className={stepDotClass(1)}/><div className={stepLineClass(1)}/><div className={stepDotClass(2)}/><div className={stepLineClass(2)}/><div className={stepDotClass(3)}/></div>{service&&<div className="bm-service-badge">🔧 {service}</div>}
{step===1&&(<div><h2 className="bm-title">Pick a <span>Date & Time</span></h2><p className="bm-subtitle">Choose your preferred appointment slot for {service||'your service'}.</p><div className="bm-cal-nav"><button className="bm-cal-btn" onClick={prevMonth}>‹</button><span className="bm-cal-month">{monthNames[calMonth]} {calYear}</span><button className="bm-cal-btn" onClick={nextMonth}>›</button></div><div className="bm-cal-grid">{dayLabels.map(d=><div key={d} className="bm-cal-day-label">{d}</div>)}{Array.from({length:firstDay}).map((_,i)=><div key={'e'+i} className="bm-cal-day empty"/>)}{Array.from({length:daysInMonth}).map((_,i)=>{const day=i+1,dis=isDisabled(day);let cls='bm-cal-day';if(dis)cls+=' disabled';else if(isSelected(day))cls+=' selected';else if(isToday(day))cls+=' today';return<button key={day} className={cls} onClick={()=>!dis&&setSelDate({d:day,m:calMonth,y:calYear})}>{day}</button>;})}</div><div className="bm-time-label">Select Time Slot</div><div className="bm-time-grid">{timeSlots.map(t=><button key={t} className={`bm-time-slot${selTime===t?' selected':''}`} onClick={()=>setSelTime(t)}>{t}</button>)}</div><div className="bm-btn-row"><button className="bm-btn-back" onClick={close}>Cancel</button><button className="bm-btn-next" disabled={!canProceedStep1} onClick={()=>setStep(2)}>Continue →</button></div></div>)}
{step===2&&(<div><h2 className="bm-title">Your <span>Details</span></h2><p className="bm-subtitle">Fill in your info so we can confirm &amp; reach you.</p><div className="bm-summary"><div className="bm-summary-item">📅 <strong>{formatDate()}</strong></div><div className="bm-summary-item">🕐 <strong>{selTime}</strong></div><div className="bm-summary-item">🔧 <strong>{service}</strong></div></div><div className="bm-form-row"><div className="bm-form-group"><label className="bm-form-label">Your Name *</label><input className="bm-form-input" placeholder="Eg. Rahul Kumar" value={form.name} onChange={e=>set('name',e.target.value)}/></div><div className="bm-form-group"><label className="bm-form-label">Phone Number *</label><input className="bm-form-input" placeholder="+91 99999 99999" value={form.phone} onChange={e=>set('phone',e.target.value)}/></div></div><div className="bm-form-group"><label className="bm-form-label">Car Model *</label><input className="bm-form-input" placeholder="Eg. Swift Dzire 2022" value={form.car} onChange={e=>set('car',e.target.value)}/></div><div className="bm-form-group"><label className="bm-form-label">Pickup Address (Optional)</label><input className="bm-form-input" placeholder="Street, City" value={form.address} onChange={e=>set('address',e.target.value)}/></div><div className="bm-btn-row"><button className="bm-btn-back" onClick={()=>setStep(1)}>← Back</button><button className="bm-btn-next" disabled={!canProceedStep2} onClick={()=>setStep(3)}>🚗 Confirm Booking</button></div></div>)}
{step===3&&(<div style={{textAlign:'center'}}><div className="bm-confirm-icon">✅</div><h2 className="bm-title">Booking <span>Confirmed!</span></h2><p className="bm-confirm-text">Thank you, <strong>{form.name}</strong>!<br/>Your <strong>{service}</strong> is booked for<br/><strong>{formatDate()}</strong> at <strong>{selTime}</strong>.<br/>We'll contact you on <strong>{form.phone}</strong> shortly.</p><div className="bm-btn-row" style={{justifyContent:'center'}}><button className="bm-btn-next" style={{flex:'none',padding:'14px 40px'}} onClick={close}>Done ✓</button></div></div>)}
</div></div>);}
ReactDOM.createRoot(document.getElementById('react-booking-modal-root')).render(<BookingModal/>);

function TeamModal(){
  const [open,setOpen]=React.useState(false);
  const close=()=>{setOpen(false);document.body.style.overflow='';};
  
  React.useEffect(()=>{
    const handle=()=>{setOpen(true);document.body.style.overflow='hidden';};
    window.addEventListener('open-team-modal',handle);
    return ()=>window.removeEventListener('open-team-modal',handle);
  },[]);
  
  const m={name:"Rajesh Kumar",role:"Lead Diagnostic Specialist",exp:"15+ Years Exp",qual:"Bosch Certified Expert",img:"main_mechanic.png"};

  return(
    <div className={`bm-overlay${open?' open':''}`} onClick={e=>{if(e.target===e.currentTarget)close();}}>
      <div className="tm-modal bm-modal">
        <button className="bm-close" onClick={close}>✕</button>
        <h2 className="bm-title" style={{textAlign:'center', marginBottom: '10px'}}>Our <span>Expert Mechanic</span></h2>
        <p className="bm-subtitle" style={{textAlign:'center', marginBottom: '30px'}}>Meet the certified professional who brings life back to your car.</p>
        
        <div style={{display:'flex', justifyContent:'center'}}>
            <div className="tm-card" style={{maxWidth:'400px'}}>
              <div className="tm-img-wrap">
                <img src={m.img} alt={m.name} />
              </div>
              <div className="tm-info">
                <h3>{m.name}</h3>
                <div className="tm-role">{m.role}</div>
                <div className="tm-meta">
                  <span className="tm-exp">⏱ {m.exp}</span>
                  <span className="tm-qual">🎓 {m.qual}</span>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('react-team-modal-root')).render(<TeamModal/>);




function toggleTheme(){
  const body=document.body;
  const isLight=body.classList.toggle('light-mode');
  const cb=document.getElementById('themeToggleCb');
  if(cb) cb.checked=isLight;
  localStorage.setItem('carcare-theme',isLight?'light':'dark');
}
(function(){
  const isLight=localStorage.getItem('carcare-theme')==='light';
  if(isLight){
    document.body.classList.add('light-mode');
  }
  document.addEventListener('DOMContentLoaded',function(){
    const cb=document.getElementById('themeToggleCb');
    if(cb) cb.checked=isLight;
  });
})();



(function(){
  const ids=['home','services','offers','pricing','reviews','faq','contact'];
  const links=document.querySelectorAll('nav a');
  function activate(id){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+id));}
  function onScroll(){const y=window.scrollY+window.innerHeight*0.3;let current='home';ids.forEach(id=>{const el=document.getElementById(id);if(el&&el.getBoundingClientRect().top+window.scrollY<=y)current=id;});activate(current);}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
})();
