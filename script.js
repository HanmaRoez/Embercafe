/* ---------- Flags ---------- */
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = () => window.matchMedia('(max-width: 820px)').matches;

/* ---------- Intro animation ---------- */
function animateIntro(){
  return new Promise(resolve=>{
    const intro = document.getElementById('intro');
    const word  = intro?.querySelector('.intro-word');
    const page  = document.getElementById('page-root');
    if(!intro || !word || !page){ resolve(); return; }

    if (window.gsap && !REDUCED){
      const tl = gsap.timeline({
        defaults:{ ease:'power3.out' },
        onComplete: () => {
          intro.style.display = 'none';
          document.body.classList.remove('intro-active');
          gsap.fromTo(page,{opacity:0,y:8},{opacity:1,y:0,duration:.6,clearProps:'all'});
          resolve();
        }
      });
      tl.to(word, {opacity:1, y:0, scale:1, letterSpacing:'0em', duration:.75});
      tl.to(word, {y:-4, duration:.35});
      tl.to(intro, {opacity:0, duration:.45, delay:.15});
    } else {
      intro.style.display = 'none';
      document.body.classList.remove('intro-active');
      page.style.opacity = 1;
      resolve();
    }
  });
}

/* ---------- Animations (после интро) ---------- */
function initAnimations(){
  if (REDUCED) return;
  if (window.gsap && window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.navlink',{y:-8,opacity:0,stagger:.06,duration:.35,ease:'power1.out'});
    gsap.from('.menu-title',{y:8,opacity:0,duration:.45,delay:.1,ease:'power2.out'});
  }
}

/* ---------- DEFAULT breakfast data (используется, если MENU_DATA не задан) ---------- */
const DISH_IMG_DEFAULT = 'photos/test.jpg';
const DEFAULT_DATA = {
  eggs:[
    {
      title:'Яйца (яичница / омлет / скрэмбл)',
      price:'250 ₽',
      img:DISH_IMG_DEFAULT,
      desc:`Фермерские яйца — как чистый холст для утреннего настроения. Попросите солнечную глазунью с едва схвачёнными краями, воздушный омлет, который пружинит ложкой, или нежный скрэмбл, где каждое зерно яйца мягко тает на языке. Мы готовим на свежем сливочном масле, аккуратно солим крупной солью и добавляем немного перца — только чтобы подчеркнуть вкус. Соберите свою тарелку: спелый авокадо, сочный тунец, сыр, томаты черри, салат и травы. Хотите богаче и ярче — добавьте тонкие ломтики слабосолёного лосося (+340 ₽). Простота, которая никогда не надоедает, и комфорт, который хочется повторить завтра.`
    },
    {
      title:'Омлет с сыром, гуакамоле и тостом с мортделлой и фисташкой',
      price:'490 ₽',
      img:DISH_IMG_DEFAULT,
      desc:`Пышный омлет — как маленькое тёплое облако, куда мы щедро добавляем тянущийся сыр, чтобы он мягко расплавлялся в каждом разрезе. Рядом — ложка гуакамоле из спелого авокадо с соком лайма и щепоткой хлопьев чили: свежесть, сливочность и чуть-чуть огня. На тёплом тосте — тонкие, полупрозрачные слайсы мортделлы, посыпанные дроблёной фисташкой для текстуры и орехового аромата. Каждая деталь поддерживает другую: кремовый омлет, яркая зелёная паста, солоноватая мортделла, хруст фисташки. Завтрак, который звучит как итальянский хит — одновременно уютный и праздничный.`
    },
    {
      title:'Шакшука с фасолью и страчателлой',
      price:'640 ₽',
      img:DISH_IMG_DEFAULT,
      desc:`В глубокой сковороде томятся мясистые томаты с перцем и сладким луком, мы добавляем чеснок, копчёную паприку и зиру — соус становится густым, ароматным и немного дымным. В этот огненно-красный шторм аккуратно разбиваем яйца, чтобы белок схватился, а желток остался текучим. Белая фасоль даёт нежность и лёгкую ореховую мягкость, а щедрая ложка холодной страчателлы сверху добавляет сливочный контраст. Подаём с тёплым хлебом, чтобы собирать соус до последней капли. Это блюдо будит чувства, согревает в серое утро и дарит ощущение среднего востока прямо за столом EmberCafe.`
    }
  ],
  sets:[
    {
      title:'Средиземноморский сет',
      price:'590 ₽',
      img:DISH_IMG_DEFAULT,
      desc:`Тарелка, на которой легко представить шум моря: шёлковистый хумус с оливковым маслом первого отжима и тёплой питой, рядом зелёный салат с хрустящими листьями и лимонной заправкой, ломтики огурца и томатов. Страчателла — как облачко сливок, которое соединяет свежесть и насыщенность, а яйцо всмятку даёт теплоту и нежность желтка. Несколько слайсов мортделлы добавляют умами и лёгкую пряность. Вся композиция собирается в лёгкий, балансный завтрак: поесть вдумчиво, без тяжести, почувствовать солнечный характер кухни и начать день со спокойным, ровным настроением.`
    },
    {
      title:'Итальянский завтрак',
      price:'590 ₽',
      img:DISH_IMG_DEFAULT,
      desc:`Представьте шумную утреннюю площадь, эспрессо в маленькой чашке и тарелку, где всё просто и щедро. Яйцо-глазунья с золотистыми, немного хрустящими краями, запечённый молодой картофель с розмарином и чесноком, сладкие томаты и свежая зелень. Выберите белок по вкусу: нежный лосось или ароматный бекон — любой вариант работает с классической парой хлеба и оливкового масла. Совсем немного соли, пару капель бальзамика — и вот уже знакомые продукты складываются в утреннюю гармонию, где каждая деталь играет роль. Сытно, честно, очень по-итальянски.`
    },
    {
      title:'Кабачковый оладий с яйцом пашот',
      price:'450 ₽',
      img:DISH_IMG_DEFAULT,
      desc:`Мы берём молодые кабачки, натираем их крупно, отжимаем лишнюю влагу и вмешиваем ароматные травы, чтобы оладьи получились лёгкими и пружинистыми. Они обжариваются до тонкой румяной корочки и остаются нежными внутри. Сверху — яйцо пашот с идеально текучим желтком, который медленно растекается по оладью, соединяя все вкусы. Добавляем ложку сметаны, немного зелени и лимонной цедры для свежести. Хотите богаче — дополняем лососем (+340 ₽), и блюдо превращается в полноценный поздний завтрак. Лёгкость, которую хочется повторять без повода и по любому поводу.`
    }
  ],
  porridge:[
    {
      title:'Гречка с копчёной килькой и яйцом пашот',
      price:'490 ₽',
      img:DISH_IMG_DEFAULT,
      desc:`Гречка — одна из тех круп, которая не требует суеты: она рассыпчатая, ореховая и тёплая сама по себе. Мы соединяем её с нежной копчёной килькой — дымок поднимается едва заметно и будто переносит на берег. Сверху опускаем яйцо пашот: при первом надрезе янтарный желток мягко обволакивает каждое зёрнышко. Немного зелёного лука, перца и хорошего масла — и получается не ностальгическая простота, а современный, аккуратный вкус. Это тарелка, которая удивляет скромностью и глубиной: никакой тяжести, только уют и правильная насыщенность на весь день.`
    },
    {
      title:'Овсяная каша на молоке',
      price:'230 ₽',
      img:DISH_IMG_DEFAULT,
      desc:`Классическая овсянка, приготовленная на цельном молоке, — как мягкое одеяло для утра. Мы варим хлопья медленно, чтобы добиться кремовой текстуры без лишней густоты, добавляем щепотку ванили и чуть-чуть соли — так молочный вкус становится ярче и благороднее. Отлично сочетается с ложкой сливочного масла, мёдом или корицей. Хотите настроить под себя — добавьте свежие ягоды или варенье (+180 ₽): кислые ноты смородины, сладость клубники или ароматное яблочное. Простое блюдо, в котором главное — чувство заботы и домашнего тепла.`
    },
    {
      title:'Овсяная каша на кокосовом молоке с бананом и солёной карамелью',
      price:'320 ₽',
      img:DISH_IMG_DEFAULT,
      desc:`В этой версии овсянки молочность заменяет кокос: ароматная, слегка сладковатая основа делает вкус более тропическим. Подаём с тёплым бананом, который карамелизуется на сковороде и становится бархатным, а поверх — лента солёной карамели, где сливочная мягкость встречается с лёгкой морской солью. Получается десерт на завтрак, но без ощущения тяжести. Сочетание текстур — зернистая овсянка, мягкий банан, шелковистая карамель — будит и радует. Это тарелка, которая способна заменить каприз на улыбку и задать настроение на весь день.`
    },
    {
      title:'Рисовая каша на кокосовом молоке с манго и апельсином',
      price:'360 ₽',
      img:DISH_IMG_DEFAULT,
      desc:`Нежная рисовая каша варится на кокосовом молоке до состояния мягкого крема. Сладкий манго добавляет солнечной спелости, а дольки апельсина дают живой цитрусовый акцент, который освежает и балансирует сливочность. Чуть-чуть цедры и несколько капель лайма делают аромат ещё ярче. Это тарелка о тёплых странах и медленном утре: в меру сладкая, ароматная, с правильной плотностью. Такой завтрак бодрит лучше будильника, но делает это мягко — без лишней суеты и гонки, словно вы уже в отпуске.`
    },
    {
      title:'Сырники с цитрусовой сметаной и клубничным пюре',
      price:'480 ₽',
      img:DISH_IMG_DEFAULT,
      desc:`Наши сырники — это золотистые диски с хрустящей корочкой и нежной сердцевиной. Мы делаем их из творога с правильной влажностью, чтобы они оставались пышными и не теряли форму. Подаём со сметаной, взбитой с цедрой лимона и апельсина: свежий аромат поднимается сразу, как только ложка касается тарелки. Рядом — густое клубничное пюре, насыщенное, с лёгкой кислинкой. Три простых элемента складываются в идеальную гармонию: кремовость, свежесть и сочность. Это тот случай, когда не нужно ничего доказывать — достаточно просто взять вилку и улыбнуться.`
    },
    {
      title:'Сырники с бананом и ягодным кремом',
      price:'480 ₽',
      img:DISH_IMG_DEFAULT,
      desc:`Ещё более нежная версия для тех, кто любит десертные завтраки. Пышные сырники подаём с карамелизированным бананом — он становится тёплым и янтарным, с тонкими нотами ванили и тростникового сахара. Ягодный крем на основе сливок и сезонных ягод даёт яркую кисло-сладкую волну, которая подчёркивает творожную мягкость. Контраст текстур — хрустящая корочка, кремовая середина, шелковистый крем — делает каждый кусочек новым. Уютно, насыщенно, но без тяжести: всё, что нужно для хорошего настроения.`
    }
  ],
  bakery:[
    {
      title:'Авокадо-тост',
      price:'480 ₽',
      img:DISH_IMG_DEFAULT,
      desc:`На тёплый хлеб с румяной корочкой мы наносим щедрый слой спелого авокадо, разминаем его вилкой с соком лимона, морской солью и каплей хорошего оливкового масла. Сверху — хлопья чили для лёгкого жара и свежемолотый перец. Вкус чистый и современный, а текстура — бархатная. Хотите добавить глубины — отлично работает тонкий лосось (+340 ₽) и немного укропа. Это простой и при этом удивительно цельный завтрак, который бодрит не хуже крепкого кофе и смотрится в ленте не хуже открытки из Лос-Анджелеса.`
    },
    {
      title:'Яйцо бенедикт: бекон / лосось',
      price:'540 / 790 ₽',
      img:DISH_IMG_DEFAULT,
      desc:`Любимая классика: на поджаренной булочке — слой сливочного масла, далее сочный бекон или нежный лосось, сверху — яйцо пашот с текучим желтком. Всё это покрывает бархатный голландез: мы взбиваем соус до гладкого блеска, добавляем немного лимона и кайенского перца. В итоге получается идеальный баланс: хруст хлеба, нежность яйца, солоноватая основа белка и цитрусовая лёгкость соуса. Бенедикт — это маленький ритуал позднего утра, когда можно позволить себе роскошь не спешить.`
    },
    {
      title:'Скрэмбл-тост с картофелем и куриной отбивной',
      price:'590 ₽',
      img:DISH_IMG_DEFAULT,
      desc:`На хрустящем тосте — сливочный скрэмбл, приготовленный медленно и аккуратно, чтобы сохранить крупные, блестящие «лепестки» яйца. Рядом — румяная куриная отбивная, тонкая и сочная, с лёгким ароматом чеснока и тимьяна. Запечённый бейби-картофель завершает композицию, добавляя уюта и насыщенности. Это сытный, но не тяжёлый вариант, который отлично держит темп дня: энергии хватает, а настроение остаётся лёгким.`
    },
    {
      title:'Крок-мадам с беконом',
      price:'590 ₽',
      img:DISH_IMG_DEFAULT,
      desc:`Французская классика с нашим акцентом. Хрустящий сэндвич с ветчиной и сыром запекается под соусом бешамель до лёгкой корочки, сверху — глазированное яйцо, которое добавляет блюду благородной мягкости. Бекон приносит дымный акцент и делает вкус глубже. Каждый кусок одновременно тянучий и хрустящий, а аромат муската и сливочного масла превращает простую комбинацию в гастрономическое удовольствие. Отлично сочетается с зелёным салатом и терпким кофе.`
    },
    {
      title:'Сэндвич с цыплёнком и цезарем',
      price:'590 ₽',
      img:DISH_IMG_DEFAULT,
      desc:`Собираем наш цезарь в формате сэндвича: сочное куриное филе, запечённое до золотистой корочки, свежий хруст ромэна, стружка пармезана и щедрый слой фирменного соуса с анчоусами и лимоном. Всё это укладывается на поджаренный хлеб, который держит соки и остаётся хрустящим. В результате получается завтрак, который удобно держать в руках и который не теряет характера салата — яркого, солоноватого, бодрящего.`
    },
    {
      title:'Круассан с лососем, огурцом и яйцом пашот',
      price:'690 ₽',
      img:DISH_IMG_DEFAULT,
      desc:`Мы берём тёплый масляный круассан с тонкими слоями теста и наполняем его нежным лососем, свежим огурцом и яйцом пашот. Немного укропа, чёрного перца и капелька лимонного сока — и получается утренний баланс текстур и вкусов. Сладость теста, солоноватая глубина рыбы и текучий желток — сочетание, которое сложно забыть. Идеально для тех дней, когда хочется чувствовать себя в отпуске, даже если до него ещё далеко.`
    },
    {
      title:'Круассан с креветкой и яйцом пашот',
      price:'690 ₽',
      img:DISH_IMG_DEFAULT,
      desc:`В этой версии морская нота становится чуть легче и свежее: сочные креветки, быстро обжаренные с чесноком и лимоном, прячутся в хрупких слоях круассана. Яйцо пашот добавляет кремовость, а лёгкий цитрусовый айоли связывает элементы воедино. Получается завтрак, где много воздуха и света: ничего лишнего, только чистые вкусы и ощущение бодрости.`
    },
    {
      title:'Круассан с красной икрой',
      price:'890 ₽',
      img:DISH_IMG_DEFAULT,
      desc:`Праздничный вариант для тех, кто любит утреннюю роскошь. Тёплый круассан с тонким слоем сливочного масла и щедрой ложкой красной икры — хруст слоёв, солоноватые искры зёрен, кремовая основа. Это не про сложность, а про благородную простоту и текстуры, которые играют вместе. Прекрасно сочетается с игристым или крепким чёрным чаем, а главное — с хорошим настроением на весь день.`
    }
  ]
};

/* Берём данные страницы, если они заданы (например, на mainfood.html) */
const data = window.MENU_DATA || DEFAULT_DATA;

/* ---------- Burger ---------- */
function initBurger(){
  const burger = document.getElementById('burger');
  const nav = document.getElementById('main-nav');
  if(!burger || !nav) return;
  burger.addEventListener('click',()=>{
    const open = burger.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  });
}

/* ---------- Modal ---------- */
let overlayEl, modalEl, modalImg, modalTitle, modalPrice, modalDesc, modalClose;
let lastFocusedEl = null;

function trapFocus(e){
  if (e.key !== 'Tab') return;
  const focusables = modalEl.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');
  if (!focusables.length) return;
  const first = focusables[0], last = focusables[focusables.length-1];
  if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
}
function onModalKeydown(e){ if (e.key === 'Escape'){ e.preventDefault(); closeModal(); } }

function openModalFromItem(item, originEl){
  lastFocusedEl = originEl || document.activeElement;
  modalImg.src = item.img; modalTitle.textContent = item.title;
  modalPrice.textContent = item.price; modalDesc.textContent = item.desc;

  document.getElementById('page-root')?.setAttribute('inert','');
  overlayEl.hidden=false; modalEl.hidden=false;
  overlayEl.style.display='block'; overlayEl.style.opacity='0';
  modalEl.style.opacity='0';
  modalEl.style.transform=isMobile()?'translateX(-50%) translateY(20px)':'translate(-50%,-50%) scale(.9)';
  modalEl.style.pointerEvents='auto'; document.body.classList.add('no-scroll');

  requestAnimationFrame(()=>{
    if (!REDUCED){
      overlayEl.style.transition='opacity .2s';
      modalEl.style.transition='transform .26s cubic-bezier(.22,1,.36,1), opacity .26s cubic-bezier(.22,1,.36,1)';
    }
    overlayEl.style.opacity='1';
    modalEl.style.opacity='1';
    modalEl.style.transform=isMobile()?'translateX(-50%) translateY(0)':'translate(-50%,-50%) scale(1)';
  });

  (modalEl.querySelector('button, [href], [tabindex]:not([tabindex="-1"])') || modalEl).focus();
  overlayEl.addEventListener('click', closeModal, {once:true});
  document.addEventListener('keydown', onModalKeydown);
  modalEl.addEventListener('keydown', trapFocus);
}
function closeModal(){
  overlayEl.style.opacity='0';
  modalEl.style.transform=isMobile()?'translateX(-50%) translateY(12px)':'translate(-50%,-50%) scale(.94)';
  modalEl.style.opacity='0';
  const done = ()=>{
    overlayEl.style.display='none'; overlayEl.hidden=true; modalEl.hidden=true; modalEl.style.pointerEvents='none';
    document.body.classList.remove('no-scroll');
    document.getElementById('page-root')?.removeAttribute('inert');
    document.removeEventListener('keydown', onModalKeydown);
    modalEl.removeEventListener('keydown', trapFocus);
    lastFocusedEl?.focus();
  };
  REDUCED ? done() : setTimeout(done, 240);
}

/* ---------- Slides ---------- */
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

  // клики: на мобиле по всей карточке, на десктопе — по изображению
  Array.from(wrapper.querySelectorAll('.slide')).forEach((s, i)=>{
    const img = s.querySelector('img');
    const open = () => openModalFromItem(items[i], s);
    if (isMobile()){
      s.addEventListener('click', open);
    } else {
      img?.addEventListener('click', open);
    }
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
  let index = 0, slideW = 0;

  function setPeekAndWidth(){
    const w = window.innerWidth;
    const peek = w >= 1100 ? 160 : (w >= 780 ? 100 : 24);
    document.documentElement.style.setProperty('--peek', peek + 'px');

    const total = slider.clientWidth;
    const factor = 0.66; // компактнее
    slideW = Math.max(300, Math.floor((total - 2*peek) * factor));

    Array.from(wrapper.children).forEach(s=>{
      s.style.flex = `0 0 ${slideW}px`;
      s.style.maxWidth = `${slideW}px`;
    });
  }

  function updateArrowVisibility(){
    const mobile = isMobile();
    [prevBtn, nextBtn].forEach(btn=>{
      if(!btn) return;
      btn.style.display = mobile ? 'none' : '';
      btn.setAttribute('aria-hidden', mobile ? 'true' : 'false');
      btn.tabIndex = mobile ? -1 : 0;
    });
  }

  function syncUI(){
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
    const tabEl = document.getElementById(`tab-${currentCat}`);
    if (tabEl) slider.setAttribute('aria-label', `Слайдер блюд — ${tabEl.textContent}`);
    updateArrowVisibility();
  }

  function translateTo(i){
    const gap = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--gap')) || 24;
    const targetX = -(i*(slideW + gap));
    if (window.gsap && !REDUCED){
      gsap.to(wrapper, { x: targetX, duration:.6, ease:'power3.inOut' });
    } else {
      wrapper.style.transform = `translateX(${targetX}px)`;
    }
  }

  function goTo(i){
    if (i<0 || i>=items.length) return;
    index = i; translateTo(index); syncUI();
  }

  function switchCategory(cat){
    currentCat = cat;
    items = data[currentCat] || [];
    renderCategorySlides(items);
    setPeekAndWidth();
    index = 0; translateTo(index); syncUI();
  }

  // init
  renderCategorySlides(items);
  setPeekAndWidth();
  translateTo(index);
  syncUI();
  updateArrowVisibility();

  // events
  tabs.forEach(t=> t.addEventListener('click', ()=> switchCategory(t.id.replace('tab-',''))));
  prevBtn?.addEventListener('click', ()=> goTo(index-1));
  nextBtn?.addEventListener('click', ()=> goTo(index+1));

  // свайпы
  let startX=0, dx=0, touching=false;
  slider.addEventListener('touchstart',(e)=>{ touching=true; startX=e.touches[0].clientX; dx=0; },{passive:true});
  slider.addEventListener('touchmove',(e)=>{ if(!touching) return; dx=e.touches[0].clientX-startX; },{passive:true});
  slider.addEventListener('touchend',()=>{ if(!touching) return; touching=false; if(Math.abs(dx)>55){ dx>0 ? goTo(index-1) : goTo(index+1); } });

  // resize
  let to=null;
  window.addEventListener('resize', ()=>{
    clearTimeout(to);
    to=setTimeout(()=>{
      setPeekAndWidth();
      translateTo(index);
      updateArrowVisibility();
      renderCategorySlides(items); // чтобы клики соответствовали текущему режиму (моб/десктоп)
      syncUI();
    },120);
  });
}

/* ---------- Boot ---------- */
window.addEventListener('DOMContentLoaded', async ()=>{
  overlayEl = document.getElementById('overlay');
  modalEl   = document.getElementById('dish-modal');
  modalImg  = document.getElementById('modal-img');
  modalTitle= document.getElementById('modal-title');
  modalPrice= document.getElementById('modal-price');
  modalDesc = document.getElementById('modal-desc');
  modalClose= document.getElementById('modal-close');
  modalClose?.addEventListener('click', closeModal);

  await animateIntro();   // сначала интро
  initAnimations();       // затем анимации страницы
  initBurger();
  initDishSlider();
});
