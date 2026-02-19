import './style.css';
import { gsap } from 'gsap';

const instagramLink = {
  label: 'Instagram',
  href: 'https://www.instagram.com/bvoxlab/?hl=en',
};

const articleItems = [
  {
    label: 'Carnival Is Special',
    href: 'https://www.instagram.com/p/DUtfK_SFCU8/?hl=en&img_index=1',
  },
  {
    label: 'Baile Funk Subgenres Pt. 1',
    href: 'https://www.instagram.com/p/DDIP0EfpX5k/?hl=en&img_index=1',
  },
  {
    label: 'Baile Funk Subgenres Pt. 2',
    href: 'https://www.instagram.com/p/DDVslFnSg1e/?hl=en&img_index=1',
  },
];

const articleMarkup = articleItems
  .map(
    (item, index) => `
      <li>
        <a href="${item.href}" target="_blank" rel="noreferrer">
          <span class="menu-article-index">${index + 1}.</span>
          <span class="menu-article-title">${item.label}</span>
          <span class="menu-article-arrow" aria-hidden="true">↗</span>
        </a>
      </li>`,
  )
  .join('');

const menuMarkup = `
  <section class="menu-section menu-section--social" aria-label="Social">
    <a class="menu-social-link" href="${instagramLink.href}" target="_blank" rel="noreferrer">${instagramLink.label}</a>
  </section>
  <section class="menu-section menu-section--articles" aria-labelledby="menu-articles-title">
    <p id="menu-articles-title" class="menu-label">Articles</p>
    <ol class="menu-articles">${articleMarkup}</ol>
  </section>
`;

document.querySelector('#app').innerHTML = `
  <div class="app-shell">
    <div class="video-layer">
      <video id="hero-video" class="hero-video" muted loop playsinline preload="auto" aria-hidden="true"></video>
      <div class="video-overlay"></div>
    </div>

    <header class="site-chrome" aria-hidden="true">
      <a class="site-logo site-logo--top" href="/" aria-label="BVOX home">
        <img class="logo-image logo-image--nav" src="/bvox-logo-no-shadow-trim.png" alt="BVOX" />
      </a>
      <button id="menu-toggle" class="menu-toggle" type="button" aria-expanded="false" aria-controls="menu-panel">Menu</button>
    </header>

    <button id="menu-backdrop" class="menu-backdrop" type="button" aria-label="Close menu"></button>
    <aside id="menu-panel" class="menu-panel" aria-hidden="true" aria-label="BVOX menu">
      <button id="menu-close" class="menu-close" type="button">Close</button>
      <nav class="menu-links">${menuMarkup}</nav>
    </aside>

    <main id="landing" class="landing" aria-hidden="true">
      <section class="hero-copy" aria-label="BVOX details">
        <p class="hero-text hero-text--title" data-reveal-line>CREATIVE LAB &amp; STUDIO</p>
        <p class="hero-text hero-text--body" data-reveal-line>L.A.'s home for Brazilian culture</p>
        <p class="hero-text hero-text--body" data-reveal-line>Directing, dance, music, nightlife</p>
      </section>

      <p class="desktop-copyright" data-reveal-bottom>©2026 All Rights Reserved</p>

      <div class="mobile-footer" data-reveal-bottom>
        <img class="logo-image logo-image--footer" src="/bvox-logo-no-shadow-trim.png" alt="BVOX" />
        <p>©2026 All Rights Reserved</p>
      </div>
    </main>

    <section id="intro" class="intro" aria-label="BVOX intro animation">
      <div class="intro-spotlight" aria-hidden="true"></div>
      <div class="intro-logo" aria-hidden="true">
        <img class="logo-image logo-image--intro" src="/bvox-logo-no-shadow-trim.png" alt="BVOX" />
      </div>
    </section>
  </div>
`;

const intro = document.getElementById('intro');
const landing = document.getElementById('landing');
const siteChrome = document.querySelector('.site-chrome');
const revealLines = gsap.utils.toArray('[data-reveal-line]');
const bottomReveal = gsap.utils.toArray('[data-reveal-bottom]');
const menuToggle = document.getElementById('menu-toggle');
const menuPanel = document.getElementById('menu-panel');
const menuClose = document.getElementById('menu-close');
const menuBackdrop = document.getElementById('menu-backdrop');
const menuLinks = gsap.utils.toArray('.menu-panel a');
const heroVideo = document.getElementById('hero-video');
const videoLayer = document.querySelector('.video-layer');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobileMedia = window.matchMedia('(max-width: 767px)');

let introTimeline;
let introFinished = false;
let menuOpen = false;

const setHeroVideoSource = () => {
  const source = mobileMedia.matches ? '/hero-15s-v2-hq.mp4' : '/hero-17s-web-hq.mp4';
  const poster = mobileMedia.matches ? '/hero-poster-mobile-v2.jpg' : '/hero-poster-web.jpg';

  if (heroVideo.dataset.source === source) {
    return;
  }

  heroVideo.dataset.source = source;
  heroVideo.src = source;
  heroVideo.poster = poster;
  heroVideo.load();
};

const playVideo = (reset = false) => {
  if (reset) {
    heroVideo.currentTime = 0;
  }
  const playRequest = heroVideo.play();
  if (playRequest) {
    playRequest.catch(() => {});
  }
};

const getTunnelReveal = () =>
  mobileMedia.matches
    ? { inner: '31vmin', outer: '43vmin' }
    : { inner: '27vmin', outer: '38vmin' };

const setMenuState = (open) => {
  if (open === menuOpen) {
    return;
  }

  menuOpen = open;
  document.body.classList.toggle('menu-open', open);
  menuPanel.setAttribute('aria-hidden', String(!open));
  menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
};

const revealLandingState = () => {
  gsap.set(intro, { autoAlpha: 0, pointerEvents: 'none' });
  gsap.set(landing, { autoAlpha: 1 });
  gsap.set(siteChrome, { autoAlpha: 1 });
  gsap.set(revealLines, { autoAlpha: 1, y: 0 });
  gsap.set(bottomReveal, { autoAlpha: 1, y: 0 });
  gsap.set(videoLayer, { autoAlpha: 1, '--reveal-inner': '170vmax', '--reveal-outer': '200vmax' });

  intro.setAttribute('aria-hidden', 'true');
  landing.setAttribute('aria-hidden', 'false');
  siteChrome.setAttribute('aria-hidden', 'false');

  document.body.classList.add('intro-complete');
};

const finishIntro = (fromTimeline = false) => {
  if (introFinished) {
    return;
  }

  introFinished = true;

  if (!fromTimeline && introTimeline) {
    introTimeline.kill();
  }

  if (!fromTimeline) {
    playVideo(true);
  }
  revealLandingState();
};

const runIntro = () => {
  const tunnelReveal = getTunnelReveal();
  const chromeRevealAt = 3.53;
  const middleRevealAt = chromeRevealAt + 0.5;
  const bottomRevealAt = 5.75;

  gsap.set(videoLayer, {
    autoAlpha: 0,
    '--reveal-inner': tunnelReveal.inner,
    '--reveal-outer': tunnelReveal.outer,
  });
  gsap.set(landing, { autoAlpha: 1 });
  gsap.set(siteChrome, { autoAlpha: 0 });
  gsap.set(revealLines, { autoAlpha: 0, y: 12 });
  gsap.set(bottomReveal, { autoAlpha: 0, y: 8 });
  gsap.set('.intro-logo', { autoAlpha: 0 });
  gsap.set('.logo-image--intro', { scale: 0.96 });
  gsap.set('.intro-spotlight', { autoAlpha: 0, scale: 0.9 });

  introTimeline = gsap.timeline({
    defaults: { ease: 'power2.out' },
    onComplete: () => finishIntro(true),
  });

  introTimeline
    .to('.intro-logo', { autoAlpha: 1, duration: 0.34 }, 0)
    .to('.logo-image--intro', { scale: 1, duration: 0.34, ease: 'power2.out' }, 0)
    .to('.intro-spotlight', { autoAlpha: 1, scale: 1, duration: 0.72, ease: 'power3.out' }, 0.08)
    .call(playVideo, [true], 0.88)
    .to(videoLayer, { autoAlpha: 1, duration: 0.26, ease: 'power1.out' }, 0.88)
    .to('.intro-logo', { autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, 1.28)
    .to(videoLayer, { '--reveal-inner': '170vmax', '--reveal-outer': '200vmax', duration: 1.55, ease: 'power2.inOut' }, 2.38)
    .to('.intro-spotlight', { autoAlpha: 0, duration: 1.2, ease: 'power2.out' }, 2.46)
    .to(intro, { autoAlpha: 0, duration: 0.24, ease: 'power2.inOut' }, 3.11)
    .to(siteChrome, { autoAlpha: 1, duration: 0.24 }, chromeRevealAt)
    .to(
      revealLines,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.52,
        stagger: 0.3,
      },
      middleRevealAt,
    )
    .to(
      bottomReveal,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.42,
      },
      bottomRevealAt,
    );
};

menuToggle.addEventListener('click', () => setMenuState(!menuOpen));
menuClose.addEventListener('click', () => setMenuState(false));
menuBackdrop.addEventListener('click', () => setMenuState(false));
menuLinks.forEach((link) => link.addEventListener('click', () => setMenuState(false)));

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setMenuState(false);
  }
});

setHeroVideoSource();

if (mobileMedia.addEventListener) {
  mobileMedia.addEventListener('change', setHeroVideoSource);
} else {
  mobileMedia.addListener(setHeroVideoSource);
}

if (reducedMotion) {
  finishIntro(false);
} else {
  runIntro();
}
