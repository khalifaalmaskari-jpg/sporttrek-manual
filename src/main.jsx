import React, {useEffect, useMemo, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {BookOpen, Search, AlertTriangle, ChevronRight, ChevronLeft, Wrench, CircuitBoard, Bookmark, BookmarkCheck, Home, Images, ListChecks, Compass, Sun, X, Menu, ArrowUpRight, CheckCircle2, SlidersHorizontal, MapPinned, FileText, ShieldAlert, ZoomIn, Download, ExternalLink, ClipboardCheck} from 'lucide-react';
import manual from './manual.json';
import OwnerTools from './OwnerTools.jsx';
import './style.css';

// Resolve illustrations within the GitHub Pages project subdirectory.
for(const volume of manual.volumes) for(const chapter of volume.chapters) for(const block of chapter.blocks){
  if(block.type==='image'&&block.src?.startsWith('/')) block.src=import.meta.env.BASE_URL+block.src.slice(1);
}

const all=manual.volumes.flatMap(v=>v.chapters);
const lookup=(name)=>all.find(c=>c.title.toLowerCase().includes(name.toLowerCase()));
const icons=[BookOpen,Wrench,CircuitBoard];
const volumeNames=['Owner’s operating manual','Troubleshooting & repair','Technical reference'];

function useStored(key,defaultValue){
  const [value,setValue]=useState(()=>{try{const raw=localStorage.getItem(key);return raw===null?defaultValue:JSON.parse(raw);}catch{return defaultValue;}});
  useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{}},[key,value]);
  return [value,setValue];
}
const contentText=c=>c.blocks.map(b=>b.type==='text'||b.type==='heading'?b.text:b.type==='table'?[...b.headers,...b.rows.flat()].join(' '):'').join(' ');
const firstMatch=(c,q)=>{const t=contentText(c).toLowerCase(),idx=t.indexOf(q.toLowerCase());return idx<0?'':contentText(c).slice(Math.max(0,idx-65),idx+125);};

function App(){
  const [view,setView]=useState({page:'home'});
  const [query,setQuery]=useState('');
  const [saved,setSaved]=useStored('sporttrek-saved',[]);
  const [checked,setChecked]=useStored('sporttrek-checked',{});
  const [openedImage,setOpenedImage]=useState(null);
  const [menuOpen,setMenuOpen]=useState(false);
  const contentRef=useRef(null);
  useEffect(()=>{document.documentElement.dataset.theme=localStorage.getItem('sporttrek-theme')||'light';},[]);
  const navigate=(page,extra={})=>{setView({page,...extra});setMenuOpen(false);window.scrollTo({top:0,behavior:'instant'});};
  const openChapter=(chapter,focus)=>navigate('chapter',{id:chapter.id,focus});
  const active=all.find(c=>c.id===view.id);
  const isSaved=active&&saved.includes(active.id);
  const toggleSaved=id=>setSaved(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  const results=useMemo(()=>{
    const q=query.trim().toLowerCase();if(!q)return [];
    return all.map(c=>({c,score:(c.title.toLowerCase().includes(q)?10:0)+(c.blocks.some(b=>b.type==='heading'&&b.text.toLowerCase().includes(q))?5:0)+(contentText(c).toLowerCase().includes(q)?1:0)})).filter(x=>x.score).sort((a,b)=>b.score-a.score).map(x=>x.c);
  },[query]);
  const images=useMemo(()=>all.flatMap(c=>c.blocks.filter(b=>b.type==='image').map((b,i)=>({...b,chapter:c,index:i}))),[]);
  useEffect(()=>{if(view.page==='chapter'&&view.focus){const id=setTimeout(()=>{const els=[...document.querySelectorAll('[data-section]')];const el=els.find(e=>e.textContent.toLowerCase().includes(view.focus.toLowerCase()));el?.scrollIntoView({behavior:'smooth',block:'start'});},100);return()=>clearTimeout(id);}},[view]);
  useEffect(()=>{if('serviceWorker' in navigator&&import.meta.env.PROD)navigator.serviceWorker.register(import.meta.env.BASE_URL+'sw.js').catch(()=>{});},[]);

  const quick=[
    {title:'Emergency',sub:'What to do first',icon:ShieldAlert,tone:'danger',chapter:lookup('Emergency troubleshooting quick reference')},
    {title:'Set up camp',sub:'Arrival & leveling',icon:MapPinned,tone:'teal',chapter:lookup('Arrival, setup and departure')},
    {title:'LevelMatePRO',sub:'Connect, level, recall',icon:Compass,tone:'sand',chapter:lookup('How-to guides for factory trailer systems'),focus:'LevelMatePRO'},
    {title:'Find a fault',sub:'Symptom to fix',icon:Wrench,tone:'blue',chapter:lookup('Expanded diagnostic decision charts')},
  ];
  const tools=[
    {name:'Pre-trip checklist',text:'Check your rig before towing',chapter:lookup('Trip workbooks'),focus:'Pre-trip'},
    {name:'Campsite setup',text:'Level, connect and inspect',chapter:lookup('Trip workbooks'),focus:'Setup'},
    {name:'Departure checklist',text:'Pack up safely',chapter:lookup('Trip workbooks'),focus:'Departure'},
    {name:'Fuse & relay chart',text:'Find protection devices',chapter:lookup('Fuse and relay location reference')},
    {name:'UAE heat guide',text:'High-temperature operating tips',chapter:lookup('UAE extreme heat')},
  ];

  return <div className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={()=>navigate('home')} aria-label="Home"><span className="mark">ST</span><span><strong>SportTrek</strong><small>FIELD GUIDE</small></span></button>
      <div className="topright"><span className="model-pill">2019 · 343VBH</span><button className="icon-button" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Open menu"><Menu size={21}/></button></div>
    </header>
    {menuOpen&&<div className="menu-pop"><button onClick={()=>navigate('home')}>Home</button><button onClick={()=>navigate('manual')}>All chapters</button><button onClick={()=>navigate('workbook')}>My RV dashboard</button><button onClick={()=>navigate('images')}>Drawings</button><button onClick={()=>navigate('saved')}>Saved chapters</button></div>}

    {view.page==='home'&&<main className="content home-view">
      <div className="hero"><div className="eyebrow"><span className="status-dot"/> YOUR OWNER COMPANION <span>V6</span></div><h1>Your trailer.<br/><em>All in one place.</em></h1><p>Clear steps for setting up, fixing problems, and understanding your SportTrek.</p><div className="hero-meta"><span>2019 STT343VBH</span><span>38 chapters</span><span>14 drawings</span></div><div className="hero-art"><svg viewBox="0 0 330 125" role="img" aria-label="Travel trailer illustration"><path d="M39 83h252v19H39z" fill="#294b46"/><path d="M55 39h195a12 12 0 0 1 12 12v38H47V47a8 8 0 0 1 8-8" fill="#f2eadc"/><rect x="66" y="49" width="56" height="26" rx="3" fill="#8fb6ae"/><rect x="134" y="49" width="55" height="26" rx="3" fill="#8fb6ae"/><rect x="201" y="49" width="36" height="40" rx="3" fill="#d9c9ac"/><path d="M262 84h26l23 18" stroke="#eee5d3" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="92" cy="103" r="16" fill="#182c2b" stroke="#e0ac6b" strokeWidth="5"/><circle cx="218" cy="103" r="16" fill="#182c2b" stroke="#e0ac6b"/><path d="M37 88h233" stroke="#d9a86e" strokeWidth="3"/></svg></div></div>
      <button className="search-field" onClick={()=>navigate('search')}><Search size={21}/><span>Search any part of the manual</span><kbd>38</kbd></button>
      <section className="section"><div className="section-title"><div><span className="overline">START HERE</span><h2>What do you need?</h2></div></div><div className="quick-grid">{quick.map(q=><button key={q.title} className={'quick-card '+q.tone} onClick={()=>openChapter(q.chapter,q.focus)}><q.icon size={25} strokeWidth={1.8}/><strong>{q.title}</strong><span>{q.sub}</span><ChevronRight size={18} className="quick-arrow"/></button>)}</div></section>
      <section className="section"><div className="section-title"><div><span className="overline">BROWSE THE MANUAL</span><h2>Three volumes</h2></div><button className="plain-link" onClick={()=>navigate('manual')}>View all <ArrowUpRight size={16}/></button></div><div className="volume-stack">{manual.volumes.map((v,i)=>{const Icon=icons[i];return <button className="volume-card" key={v.title} onClick={()=>navigate('volume',{index:i})}><span className={'volume-icon v'+i}><Icon size={23}/></span><span className="volume-copy"><small>VOLUME 0{i+1} · {v.chapters.length} CHAPTERS</small><strong>{volumeNames[i]}</strong></span><ChevronRight size={19}/></button>})}</div></section>
      <section className="section"><div className="section-title"><div><span className="overline">READY FOR THE ROAD</span><h2>Trip tools</h2></div></div><div className="tool-list">{tools.slice(0,3).map(t=><button key={t.name} onClick={()=>openChapter(t.chapter,t.focus)}><ListChecks size={20}/><span><strong>{t.name}</strong><small>{t.text}</small></span><ChevronRight size={17}/></button>)}</div></section>
      <section className="section visual-section"><div className="section-title"><div><span className="overline">SEE IT FIRST</span><h2>Visual guides</h2></div></div><div className="visual-grid"><button onClick={()=>navigate('workbook')}><img loading="lazy" src={import.meta.env.BASE_URL+'assets/guide-hitch-check.webp'} alt="Illustration of a tow hitch and safety chains"/><span><strong>Pre-trip hitch check</strong><small>Illustrative photo · Open checklist</small></span></button><button onClick={()=>navigate('workbook')}><img loading="lazy" src={import.meta.env.BASE_URL+'assets/guide-campsite-level.webp'} alt="Illustration of a chocked trailer at a campsite"/><span><strong>Campsite leveling</strong><small>Illustrative photo · Open setup</small></span></button><button onClick={()=>navigate('images')}><img loading="lazy" src={import.meta.env.BASE_URL+'assets/manual-02.png'} alt="SportTrek reference floorplan drawing"/><span><strong>Floorplan reference</strong><small>Manufacturer/reference drawing · Verify on RV</small></span></button><button onClick={()=>navigate('images')}><img loading="lazy" src={import.meta.env.BASE_URL+'assets/manual-07.png'} alt="Electrical reference schematic illustration"/><span><strong>Electrical reference</strong><small>Partial/general schematic · Verify on RV</small></span></button></div></section>
      <section className="section"><button className="dashboard-cta" onClick={()=>navigate('workbook')}><ClipboardCheck size={26}/><span><strong>My RV dashboard</strong><small>Trip checklists, maintenance, equipment, fault guides and backups</small></span><ChevronRight size={20}/></button></section>
      <p className="home-warning"><AlertTriangle size={16}/> Some wiring, relay positions and component models need verification on your trailer. Follow its labels first.</p>
    </main>}

    {view.page==='manual'&&<main className="content standard-page"><PageHead kicker="EXPLORE" title="The manual" detail="Browse by volume. Every chapter is here, including tables and factory drawings."/><div className="volume-stack spaced">{manual.volumes.map((v,i)=>{const Icon=icons[i];return <button className="volume-card tall" key={v.title} onClick={()=>navigate('volume',{index:i})}><span className={'volume-icon v'+i}><Icon size={24}/></span><span className="volume-copy"><small>VOLUME {String(i+1).padStart(2,'0')} · {v.chapters.length} CHAPTERS</small><strong>{volumeNames[i]}</strong><span className="chapter-preview">{v.chapters.slice(0,3).map(c=>c.title).join(' · ')}</span></span><ChevronRight size={20}/></button>})}</div><div className="reading-tip"><BookOpen size={20}/><p>Open a chapter to see its instructions, charts, and pictures. Save the ones you use often.</p></div></main>}

    {view.page==='volume'&&<main className="content standard-page"><button className="back-link" onClick={()=>navigate('manual')}><ChevronLeft size={18}/> All volumes</button><PageHead kicker={'VOLUME '+String(view.index+1).padStart(2,'0')} title={volumeNames[view.index]} detail={`${manual.volumes[view.index].chapters.length} chapters`} /><div className="chapter-list">{manual.volumes[view.index].chapters.map((c,i)=><button key={c.id} onClick={()=>openChapter(c)}><span className="chapter-number">{view.index+1}.{i+1}</span><span className="chapter-name">{c.title}</span>{saved.includes(c.id)&&<BookmarkCheck size={16} className="saved-icon"/>}<ChevronRight size={18}/></button>)}</div></main>}

    {view.page==='search'&&<main className="content standard-page"><PageHead kicker="FIND ANYTHING" title="Search the guide" detail="Search titles, procedures, fault charts, and table entries."/><div className="search-input-wrap"><Search size={21}/><input aria-label="Search manual" autoFocus placeholder="Try “slide fuse” or “water heater”" value={query} onChange={e=>setQuery(e.target.value)}/>{query&&<button onClick={()=>setQuery('')} aria-label="Clear"><X size={19}/></button>}</div><div className="search-results"><div className="result-meta">{query.trim()?`${results.length} matching chapters`:'POPULAR SEARCHES'}</div>{!query.trim()&&<div className="suggestions">{['LevelMatePRO','Fuse','Water heater','Departure','Air conditioning','Propane'].map(s=><button key={s} onClick={()=>setQuery(s)}>{s}</button>)}</div>}{results.map(c=><button className="result-card" key={c.id} onClick={()=>openChapter(c)}><span className="result-volume">VOLUME {c.volume} · CHAPTER</span><strong>{c.title}</strong><p>{firstMatch(c,query)}</p><ChevronRight size={18}/></button>)}{query&&results.length===0&&<div className="empty"><Search size={31}/><h3>No match found</h3><p>Try a shorter term or browse the chapters.</p></div>}</div></main>}

    {view.page==='saved'&&<main className="content standard-page"><PageHead kicker="YOUR SHORTLIST" title="Saved chapters" detail="Keep your most-used procedures one tap away. Saved on this iPhone."/>{saved.length===0?<div className="empty"><Bookmark size={30}/><h3>Nothing saved yet</h3><p>Open any chapter and tap Save to bookmark it.</p><button onClick={()=>navigate('manual')}>Browse chapters</button></div>:<div className="chapter-list">{saved.map(id=>all.find(c=>c.id===id)).filter(Boolean).map(c=><button key={c.id} onClick={()=>openChapter(c)}><BookmarkCheck size={19}/><span className="chapter-name">{c.title}</span><ChevronRight size={18}/></button>)}</div>}</main>}

    {view.page==='workbook'&&<OwnerTools openChapter={openChapter} heatChapter={lookup('UAE extreme heat')}/>}

    {view.page==='images'&&<main className="content standard-page"><PageHead kicker="VISUAL REFERENCE" title="Drawings & diagrams" detail="14 images taken from your Word manual. Factory examples and conceptual layouts are labeled in their chapters."/><div className="gallery">{images.map((im,i)=><button key={i} onClick={()=>setOpenedImage(im)}><div className="gallery-thumb"><img loading="lazy" src={im.src} alt={im.alt}/><ZoomIn size={19}/></div><strong>{im.chapter.title}</strong><small>VIEW DRAWING</small></button>)}</div></main>}

    {view.page==='chapter'&&active&&<main className="content reader" ref={contentRef}><div className="reader-head"><button className="back-link" onClick={()=>navigate('volume',{index:active.volume-1})}><ChevronLeft size={18}/> Volume {active.volume}</button><span>CHAPTER {active.volume}.{manual.volumes[active.volume-1].chapters.indexOf(active)+1}</span></div><h1>{active.title}</h1><div className="reader-actions"><button onClick={()=>toggleSaved(active.id)}>{isSaved?<BookmarkCheck size={18}/>:<Bookmark size={18}/>} {isSaved?'Saved':'Save chapter'}</button><button onClick={()=>window.print()}><Download size={18}/> Print</button></div>{active.blocks.some(b=>b.type==='heading')&&<details className="chapter-outline"><summary><ListChecks size={18}/> Jump to a section <ChevronRight size={17}/></summary><div>{active.blocks.filter(b=>b.type==='heading'&&b.level===3).map((b,i)=><button key={i} onClick={e=>{const headings=[...document.querySelectorAll('[data-section]')];headings.find(h=>h.getAttribute('data-section')===b.text)?.scrollIntoView({behavior:'smooth',block:'start'});e.currentTarget.closest('details').open=false;}}>{b.text}</button>)}</div></details>}<div className="article-body">{active.blocks.map((block,i)=><React.Fragment key={i}>{block.type==='heading'&&<h2 className={block.level===4?'minor-heading':''} data-section={block.text}>{block.text}</h2>}{block.type==='text'&&<Paragraph block={block} index={i} chapter={active} checked={checked} setChecked={setChecked}/>}{block.type==='table'&&<DataTable block={block}/>}{block.type==='image'&&<figure><button onClick={()=>setOpenedImage({...block,chapter:active})} aria-label="Enlarge drawing"><img loading="lazy" src={block.src} alt={block.alt}/><span><ZoomIn size={16}/> View full size</span></button>{block.alt&&block.alt!=='Manual drawing or manufacturer illustration'&&<figcaption>{block.alt}</figcaption>}</figure>}</React.Fragment>)}</div><div className="verify-box"><AlertTriangle size={19}/><p>Verify component labels and ratings on your trailer. This guide distinguishes confirmed specifications from drawings that show general or conceptual routing.</p></div><div className="next-links"><button onClick={()=>navigate('volume',{index:active.volume-1})}><BookOpen size={17}/> Other chapters</button><button onClick={()=>navigate('search')}><Search size={17}/> Search</button></div></main>}

    {openedImage&&<div className="lightbox" role="dialog" aria-modal="true" onClick={()=>setOpenedImage(null)}><div className="lightbox-top"><span>{openedImage.chapter?.title||'Manual drawing'}</span><button onClick={()=>setOpenedImage(null)} aria-label="Close image"><X size={24}/></button></div><img src={openedImage.src} alt={openedImage.alt}/><p>Pinch to zoom on iPhone. Check the image caption and verification notes in its chapter.</p></div>}

    <nav className="bottom-nav" aria-label="Main navigation"><button className={view.page==='home'?'selected':''} onClick={()=>navigate('home')}><Home size={21}/><span>Home</span></button><button className={['manual','volume','chapter'].includes(view.page)?'selected':''} onClick={()=>navigate('manual')}><BookOpen size={21}/><span>Manual</span></button><button className={view.page==='workbook'?'selected':''} onClick={()=>navigate('workbook')}><ClipboardCheck size={21}/><span>My RV</span></button><button className={view.page==='search'?'selected':''} onClick={()=>navigate('search')}><Search size={21}/><span>Search</span></button><button className={view.page==='images'?'selected':''} onClick={()=>navigate('images')}><Images size={21}/><span>Drawings</span></button></nav>
  </div>;
}

function PageHead({kicker,title,detail}){return <div className="page-head"><span className="overline">{kicker}</span><h1>{title}</h1><p>{detail}</p></div>}
function Paragraph({block,index,chapter,checked,setChecked}){
  const key=chapter.id+'_'+index,checkable=block.text.startsWith('☐');
  if(checkable)return <label className="check-row"><input type="checkbox" checked={!!checked[key]} onChange={e=>setChecked(prev=>({...prev,[key]:e.target.checked}))}/><span>{block.text.slice(1).trim()}</span></label>;
  const list=block.style==='List Paragraph';
  return <p className={(list?'list-line ':'')+(block.style==='Caption'?'caption-line':'')}>{block.text}</p>;
}
function DataTable({block}){return <div className="table-wrap" tabIndex={0} aria-label="Scroll table horizontally"><table><thead><tr>{block.headers.map((h,i)=><th key={i}>{h}</th>)}</tr></thead><tbody>{block.rows.map((r,i)=><tr key={i}>{r.map((v,j)=><td key={j}>{v}</td>)}</tr>)}</tbody></table></div>}

createRoot(document.getElementById('root')).render(<App/>);
