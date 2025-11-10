/* ===== Helpers ===== */
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = () => matchMedia('(max-width: 820px)').matches;

/* ===== Intro ===== */
function animateIntro(){
  return new Promise(resolve=>{
    const intro = document.getElementById('intro');
    const page  = document.getElementById('page-root');
    if(!intro || !page){ resolve(); return; }
    intro.classList.add('intro-show');
    requestAnimationFrame(()=>{
      setTimeout(()=>{
        intro.classList.add('intro-hide');
        intro.addEventListener('transitionend', ()=>{
          intro.style.display='none';
          document.body.classList.remove('intro-active');
          resolve();
        }, {once:true});
        document.body.classList.remove('intro-active');
      }, REDUCED ? 0 : 700);
    });
  });
}

/* ===== Data fallback ===== */
const DISH_IMG_DEFAULT = 'photos/test.jpg';
const DEFAULT_DATA = {
  eggs:[{title:'Яйца (яичница / омлет / скрэмбл)',price:'250 ₽',img:DISH_IMG_DEFAULT,desc:'Фермерские яйца — глазунья, омлет или скрэмбл.'}],
  sets:[{title:'Средиземноморский сет',price:'590 ₽',img:DISH_IMG_DEFAULT,desc:'Хумус, салат, страчателла.'}],
  porridge:[{title:'Овсяная каша',price:'230 ₽',img:DISH_IMG_DEFAULT,desc:'Кремовая овсянка.'}],
  bakery:[{title:'Авокадо-тост',price:'480 ₽',img:DISH_IMG_DEFAULT,desc:'Авокадо и лимон.'}],
};
const data = window.MENU_DATA || DEFAULT_DATA;

/* ===== Burger ===== */
function initBurger(){
  const burger = document.getElementById('burger');
  const nav = document.getElementById('main-nav');
  if(!burger || !nav) return;
  const toggle = ()=> {
    const open = burger.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  };
  burger.addEventListener('click', toggle, {passive:true});
}

/* ===== HERO: столбики ===== */
function initHeroStack(){
  const shell = document.getElementById('hero-shell');
  const stack = document.getElementById('hero-stack');
  if(!shell || !stack) return;
  const cols = Array.from(stack.querySelectorAll('.hero-col'));

  const setExpanded = (on, idx=null)=>{
    shell.classList.toggle('expanded', on);
    cols.forEach((c,i)=> c.classList.toggle('active', on && i===idx));
    stack.setAttribute('aria-expanded', String(on));
  };

  cols.forEach((col, idx)=>{
    col.addEventListener('click', ()=>{
      if (!isMobile()) return;
      const isActive = col.classList.contains('active');
      setExpanded(!(shell.classList.contains('expanded') && isActive), idx);
    }, {passive:true});
  });

  shell.addEventListener('mouseleave', ()=>{ if(!isMobile()) setExpanded(false); }, {passive:true});
  addEventListener('resize', ()=>{ if(!isMobile()) setExpanded(false); }, {passive:true});
}

/* ===== Modal ===== */
let overlayEl, modalEl, modalImg, modalTitle, modalPrice, modalDesc, modalClose, lastFocusedEl;

function openModalFromItem(item, originEl){
  lastFocusedEl = originEl || document.activeElement;

  const img = new Image(); img.src = item.img;
  (img.decode?.() || Promise.resolve()).finally(()=>{ modalImg.src = item.img; });

  modalTitle.textContent = item.title;
  modalPrice.textContent = item.price;
  modalDesc.textContent = item.desc;

  document.getElementById('page-root')?.setAttribute('inert','');
  overlayEl.hidden = false; modalEl.hidden = false;
  overlayEl.style.display='block'; overlayEl.style.opacity='0';
  modalEl.style.opacity='0';
  modalEl.style.transform = isMobile() ? 'translateX(-50%) translateY(14px)' : 'translate(-50%,-50%) scale(.98)';
  modalEl.style.pointerEvents='auto';   // <-- camelCase
  document.body.classList.add('no-scroll');

  requestAnimationFrame(()=>{
    overlayEl.style.transition = 'opacity .2s';
    modalEl.style.transition = `transform .28s cubic-bezier(.2,.8,.2,1), opacity .28s cubic-bezier(.2,.8,.2,1)`;
    overlayEl.style.opacity = '1';
    modalEl.style.opacity = '1';
    modalEl.style.transform = isMobile() ? 'translateX(-50%) translateY(0)' : 'translate(-50%,-50%) scale(1)';
  });

  overlayEl.addEventListener('click', closeModal, {once:true});
  document.addEventListener('keydown', onEsc, {passive:true});
}
function onEsc(e){ if(e.key==='Escape') closeModal(); }
function closeModal(){
  overlayEl.style.opacity='0';
  modalEl.style.transform = isMobile() ? 'translateX(-50%) translateY(10px)' : 'translate(-50%,-50%) scale(.98)';
  modalEl.style.opacity='0';
  setTimeout(()=>{
    overlayEl.style.display='none'; overlayEl.hidden=true; modalEl.hidden=true;
    modalEl.style.pointerEvents='none';   // <-- camelCase
    document.body.classList.remove('no-scroll');
    document.getElementById('page-root')?.removeAttribute('inert');
    document.removeEventListener('keydown', onEsc);
    lastFocusedEl?.focus();
  }, 220);
}

/* ===== Slider ===== */
function dishSlideTemplate(item, i, total){
  return `
  <div class="slide ${i===0?'active':''}" role="group" aria-roledescription="slide" aria-label="Блюдо ${i+1} из ${total}">
    <article class="dish">
      <div class="dish-media">
        <img src="${item.img}" alt="${item.title}" loading="lazy" width="960" height="720">
      </div>
      <div class="dish-body">
        <h3 class="dish-title">${item.title}</h3>
        <p class="dish-desc">${item.desc}</p>
        <div class="dish-price">${item.price}</div>
      </div>
    </article>
  </div>`;
}

function renderCategorySlides(items){
  const wrapper = document.getElementById('slides-wrapper');
  const dots = document.getElementById('dish-dots');
  if (!wrapper) return {count:0};
  wrapper.innerHTML = items.map((it,i)=> dishSlideTemplate(it, i, items.length)).join('');

  Array.from(wrapper.querySelectorAll('.slide')).forEach((s, i)=>{
    const handler = () => openModalFromItem(items[i], s);
    if (isMobile()) s.addEventListener('click', handler, {passive:true});
    else s.querySelector('img')?.addEventListener('click', handler, {passive:true});
  });

  if (dots){
    dots.innerHTML = items.map((_,i)=> `<span class="dot${i===0?' is-active':''}" aria-hidden="true"></span>`).join('');
  }
  return {count: items.length};
}

function initDishSlider(){
  const tabs = Array.from(document.querySelectorAll('.menu-tabs .tab'));
  const wrapper = document.getElementById('slides-wrapper');
  const prevBtn = document.getElementById('prevDish');
  const nextBtn = document.getElementById('nextDish');
  const slider = document.getElementById('menu-slider');
  const dots = document.getElementById('dish-dots');
  if (!wrapper || !slider) return;

  let currentCat = window.MENU_DEFAULT || Object.keys(data)[0];
  let items = data[currentCat] || [];
  let index = 0, slideW = 0, gap = 24, step = 0;

  wrapper.style.transition = REDUCED ? 'none' : 'transform .55s cubic-bezier(.2,.8,.2,1)';
  wrapper.style.willChange = 'transform';

  // Реальный шаг: смещение между 0-м и 1-м слайдами по X
  const computeStep = ()=>{
    const slides = wrapper.querySelectorAll('.slide');
    if (slides.length >= 2){
      const a = slides[0].getBoundingClientRect();
      const b = slides[1].getBoundingClientRect();
      const delta = Math.round(b.left - a.left);
      if (Math.abs(delta) > 0) return Math.abs(delta);
    }
    const first = slides[0];
    if(!first) return 0;
    const cs = getComputedStyle(first);
    const w = first.getBoundingClientRect().width;
    const ml = parseFloat(cs.marginLeft) || 0;
    const mr = parseFloat(cs.marginRight) || 0;
    return Math.round(w + ml + mr);
  };

  const setPeekAndWidth = ()=>{
    const peek = innerWidth >= 1100 ? 160 : (innerWidth >= 780 ? 100 : 24);
    document.documentElement.style.setProperty('--peek', `${peek}px`);
    gap = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--gap')) || 24;

    const total = slider.clientWidth;
    slideW = Math.max(320, Math.round(total - 2*peek - gap));

    Array.from(wrapper.children).forEach(s=>{
      s.style.flex = `0 0 ${slideW}px`;
      s.style.width = `${slideW}px`;
      s.style.maxWidth = `${slideW}px`;
    });

    step = computeStep();
  };

  const translateTo = (i)=>{
    const targetX = -(i * (step || (slideW + gap)));
    wrapper.style.transform = `translate3d(${targetX}px,0,0)`;
    [i-1,i+1].forEach(k=>{ if(items[k]){ const im=new Image(); im.src=items[k].img; } });
  };

  const updateArrows = ()=>{
    const mobile = isMobile();
    [prevBtn, nextBtn].forEach(btn=>{
      if(!btn) return;
      btn.style.display = mobile ? 'none' : '';
      btn.setAttribute('aria-hidden', mobile ? 'true' : 'false');
      btn.tabIndex = mobile ? -1 : 0;
    });
  };

  const syncUI = ()=>{
    tabs.forEach(t=>{
      const sel = t.id === `tab-${currentCat}`;
      t.classList.toggle('active', sel);
      t.setAttribute('aria-selected', String(sel));
      t.tabIndex = sel ? 0 : -1;
    });
    Array.from(wrapper.children).forEach((s,k)=> s.classList.toggle('active', k===index));
    dots?.querySelectorAll('.dot').forEach((d,k)=> d.classList.toggle('is-active', k===index));
    prevBtn?.toggleAttribute('disabled', index===0);
    nextBtn?.toggleAttribute('disabled', index===items.length-1);
    updateArrows();
  };

  const goTo = (i)=>{
    if (i<0 || i>=items.length) return;
    index = i; translateTo(index); syncUI();
  };

  const switchCategory = (cat)=>{
    currentCat = cat;
    items = data[currentCat] || [];
    renderCategorySlides(items);
    // дождёмся layout, потом точный пересчёт
    requestAnimationFrame(()=>{
      setPeekAndWidth(); translateTo(0); index=0; syncUI();
    });
    // подстраховка на загрузку картинок
    wrapper.querySelectorAll('img').forEach(img=>{
      if(img.complete) return;
      img.addEventListener('load', ()=>{ setPeekAndWidth(); translateTo(index); }, {once:true});
    });
  };

  // init
  renderCategorySlides(items);
  setPeekAndWidth();
  translateTo(index);
  syncUI();
  updateArrows();

  // events
  tabs.forEach(t=> t.addEventListener('click', ()=> switchCategory(t.id.replace('tab-','')), {passive:true}));
  prevBtn?.addEventListener('click', ()=> goTo(index-1), {passive:true});
  nextBtn?.addEventListener('click', ()=> goTo(index+1), {passive:true});

  // swipe
  let startX=0, dx=0, touching=false;
  slider.addEventListener('touchstart',(e)=>{ touching=true; startX=e.touches[0].clientX; dx=0; },{passive:true});
  slider.addEventListener('touchmove',(e)=>{ if(!touching) return; dx=e.touches[0].clientX-startX; },{passive:true});
  slider.addEventListener('touchend',()=>{ if(!touching) return; touching=false; if(Math.abs(dx)>55){ dx>0 ? goTo(index-1) : goTo(index+1); } },{passive:true});

  // resize / reflow
  const ro = new ResizeObserver(()=>{ setPeekAndWidth(); translateTo(index); });
  ro.observe(slider);
  addEventListener('orientationchange', ()=>{ setTimeout(()=>{ setPeekAndWidth(); translateTo(index); }, 200); }, {passive:true});
}

/* ===== Boot ===== */
window.addEventListener('DOMContentLoaded', async ()=>{
  overlayEl = document.getElementById('overlay');
  modalEl   = document.getElementById('dish-modal');
  modalImg  = document.getElementById('modal-img');
  modalTitle= document.getElementById('modal-title');
  modalPrice= document.getElementById('modal-price');
  modalDesc = document.getElementById('modal-desc');
  modalClose= document.getElementById('modal-close');
  modalClose?.addEventListener('click', closeModal, {passive:true});

  await animateIntro();
  initBurger();
  initHeroStack();
  initDishSlider();
});
