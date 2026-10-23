const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {JSDOM, VirtualConsole} = require('jsdom');
const root=path.resolve(__dirname,'..');
function open(file, hash='') {
  let now=0, seq=0;
  const timers=new Map(), frames=new Map(), errors=[];
  const dom=new JSDOM(fs.readFileSync(path.join(root,file),'utf8'), {
    url:'https://example.org/k-journey/'+file+hash, runScripts:'dangerously', pretendToBeVisual:true,
    virtualConsole:new VirtualConsole().on('jsdomError', e=>errors.push(e)),
    beforeParse(w) {
      w.scrollTo=()=>{}; w.HTMLElement.prototype.scrollIntoView=()=>{};
      Object.defineProperty(w.performance,'now',{value:()=>now});
      w.setTimeout=(fn,delay)=>{timers.set(++seq,{fn,delay}); return seq;};
      w.clearTimeout=id=>timers.delete(id);
      w.setInterval=()=>++seq; w.clearInterval=()=>{};
      w.requestAnimationFrame=fn=>{frames.set(++seq,fn); return seq;};
      w.cancelAnimationFrame=id=>frames.delete(id);
      const media=w.HTMLMediaElement.prototype;
      media.play=function(){this._paused=false; return Promise.resolve();};
      media.pause=function(){this._paused=true;}; media.load=()=>{};
      Object.defineProperty(media,'paused',{get(){return this._paused!==false;}});
    }
  });
  const w=dom.window, d=w.document;
  assert.deepEqual(errors,[],file+' initializes without script errors');
  return {w,d,frames,timers,click:s=>{const el=d.querySelector(s); assert.ok(el,s); el.click();},
    frame(t){now=t; const pending=[...frames.values()]; frames.clear(); pending.forEach(fn=>fn(t));},
    flush(delay){for(const [id,t] of [...timers]) if(t.delay===delay){timers.delete(id); t.fn();}},
    close(){dom.window.close();}};
}
test('all pages have valid scripts, unique ids and existing local asset/link targets',()=>{
  for(const file of ['index.html','version-a.html','version-b.html','version-c.html']){
    const s=fs.readFileSync(path.join(root,file),'utf8');
    for(const m of s.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)) new vm.Script(m[1]);
    const doc=new JSDOM(s).window.document;
    const ids=[...doc.querySelectorAll('[id]')].map(e=>e.id);
    assert.equal(new Set(ids).size,ids.length,file+' duplicate IDs');
    for(const m of s.matchAll(/assets\/[a-f0-9]+\.(?:jpg|mp4|mp3)/g)) assert.ok(fs.existsSync(path.join(root,m[0])),m[0]);
    for(const a of doc.querySelectorAll('a[href]')){
      const href=a.getAttribute('href').split('#')[0];
      if(href && !/^https?:/.test(href)) assert.ok(fs.existsSync(path.join(root,href)),href);
    }
    assert.ok(!s.includes(';base64,'),'media extracted from '+file);
  }
});
test('A: collect five species, revisit dex, unlock postcard and close dialog with Escape',()=>{
  const p=open('version-a.html');
  p.click('#station-w001'); p.click('#btn-enter');
  for(const id of ['heron','deer','frogs','matron','whale']){p.click('#hs-'+id); p.click('#sheetClose');}
  assert.equal(p.d.querySelector('#foundCount').textContent,'5 / 5');
  assert.ok(p.d.querySelector('#completeBanner').classList.contains('show'));
  p.click('#btn-dex'); p.click('.dex-card');
  p.d.dispatchEvent(new p.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
  assert.equal(p.d.querySelector('#sheetWrap').getAttribute('aria-hidden'),'true');
  p.click('#btn-dex-back'); p.click('#btn-to-post');
  assert.ok(p.d.querySelector('#scr-post').classList.contains('active')); p.close();
});
test('C: direct entry selects C, exploration video resumes after switching versions',()=>{
  const p=open('version-c.html','#c');
  assert.equal(p.w.currentVer,'c'); p.w.showVer('a'); p.click('#aGoHabitat');
  assert.equal(p.d.querySelector('#aVideo').paused,false);
  p.w.showVer('b'); assert.equal(p.d.querySelector('#aVideo').paused,true);
  p.w.showVer('a'); assert.equal(p.d.querySelector('#aVideo').paused,false); p.close();
});
test('C: beat cannot be counted twice in one cycle, six beats unlock A postcard',()=>{
  const p=open('version-c.html'); p.click('#aGoHabitat');
  for(const h of p.d.querySelectorAll('#ver-a .hotspot')) h.click();
  p.click('#aGoRhythm');
  for(let n=0;n<6;n++){p.frame(n*4800+2400); p.click('#aTap'); p.click('#aTap'); assert.equal(p.w.rhythmA.count,n+1);}
  assert.equal(p.d.querySelector('#aToCard').classList.contains('hidden'),false); p.close();
});
test('C: reset cancels branch reply and completion timers; speakers are correct',()=>{
  const p=open('version-c.html','#c');
  for(let n=0;n<5;n++)p.click('#storyNext');
  p.click('#choiceBox button');
  assert.ok(p.d.querySelector('#chatBox').lastElementChild.classList.contains('fang'));
  p.flush(500); assert.ok(p.d.querySelector('#chatBox').lastElementChild.classList.contains('k'));
  p.w.resetC(); for(let n=0;n<5;n++)p.click('#storyNext');
  p.click('#choiceBox button'); p.w.resetC(); p.flush(500);
  assert.equal(p.d.querySelector('#chatBox').children.length,0);
  for(let n=0;n<5;n++)p.click('#storyNext'); p.click('#choiceBox button'); p.flush(500);
  for(let n=0;n<4;n++)p.click('#storyNext');
  for(let n=0;n<4;n++){p.frame(n*4800+2400); p.click('#cTap'); p.click('#cTap'); assert.equal(p.w.rhythmC.count,n+1);}
  p.w.resetC(); p.flush(700); assert.equal(p.d.querySelector('#chatBox').children.length,0); p.close();
});
test('B: repeated species clicks do not create duplicate breathing loops; reset cancels arrival',()=>{
  const p=open('version-b.html'); p.click('#a-enter'); p.click('[data-reset="a"]'); p.flush(260);
  assert.match(p.d.querySelector('#a-scene').alt,/探索圖/);
  p.click('#a-enter'); for(let i=0;i<5;i++)p.click('#a-spot-'+i);
  const before=p.frames.size; p.click('#a-spot-0'); p.click('#a-spot-0');
  assert.equal(p.frames.size,before); p.close();
});
test('B: direct B entry starts the B panel',()=>{
  const p=open('version-b.html','#b'); assert.equal(p.d.querySelector('#demo-b').hidden,false); p.close();
});
test('B: story rhythm requires four distinct beats and reset cancels pending completion',()=>{
  const p=open('version-b.html','#c');
  for(let i=0;i<60 && p.d.querySelector('#c-rhythm').hidden;i++){
    const choice=p.d.querySelector('#c-choices button');
    if(choice)choice.click(); else p.click('#c-advance');
  }
  assert.equal(p.d.querySelector('#c-rhythm').hidden,false);
  for(let n=0;n<4;n++){
    p.frame(n*2400+2040); p.click('#c-tap'); p.click('#c-tap');
    assert.equal(p.d.querySelector('#c-sync-count').textContent,(n+1)+' / 4');
  }
  p.click('[data-reset="c"]'); p.flush(650);
  assert.equal(p.d.querySelector('#c-advance').textContent,'開始這一站'); p.close();
});
