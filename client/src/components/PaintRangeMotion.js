// Paint Range Motion Graphic Component for Godswill Enterprise
// Scoped inside a Custom Element with Shadow DOM to prevent any CSS bleed

class PaintRangeMotion extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.timer = null;
    this.cur = -1;
    this.isPaused = false;
    this.observer = null;
    this.handleResize = this.handleResize.bind(this);
    this.handleVisibility = this.handleVisibility.bind(this);
  }

  connectedCallback() {
    this.render();
    this.initMotion();
  }

  disconnectedCallback() {
    this.cleanup();
  }

  cleanup() {
    if (this.timer) clearTimeout(this.timer);
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('visibilitychange', this.handleVisibility);
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  render() {
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          background: #15101f;
          overflow: hidden;
          position: relative;
          contain: layout paint;
        }

        :host(:focus) {
          outline: none;
        }

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .viewport-wrapper {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: #15101f;
          min-height: 280px;
        }

        #stage {
          width: 1280px;
          height: 720px;
          position: relative;
          overflow: hidden;
          background: #fff8ef;
          transform-origin: center center;
          flex: none;
          user-select: none;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
        }

        .scene {
          position: absolute;
          inset: 0;
          visibility: hidden;
          color: var(--ink, #1d1633);
          background: color-mix(in srgb, var(--a, #fff) 13%, #fff);
          overflow: hidden;
        }

        .scene.on {
          visibility: visible;
        }

        .blob {
          position: absolute;
          width: 760px;
          height: 760px;
          border-radius: 50%;
          background: color-mix(in srgb, var(--a) 42%, #fff);
          right: -90px;
          top: -20px;
          transform: scale(0);
        }

        .flip .blob {
          right: auto;
          left: -90px;
        }

        .txt {
          position: absolute;
          left: 84px;
          top: 200px;
          width: 520px;
          z-index: 2;
        }

        .flip .txt {
          left: auto;
          right: 84px;
          text-align: right;
        }

        h2 {
          font-family: 'Bowlby One', Impact, sans-serif;
          font-weight: 400;
          font-size: 92px;
          line-height: .98;
          letter-spacing: -1px;
          color: var(--ink);
          clip-path: inset(0 100% 0 0);
        }

        .flip h2 {
          clip-path: inset(0 0 0 100%);
        }

        .v {
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 34px;
          font-weight: 700;
          margin-top: 18px;
          opacity: 0;
        }

        .tag {
          display: inline-block;
          margin-top: 30px;
          padding: 10px 22px;
          border-radius: 40px;
          background: var(--a);
          color: #fff;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-weight: 700;
          font-size: 26px;
          opacity: 0;
          transform: scale(.4);
        }

        .card {
          position: absolute;
          right: 110px;
          top: 80px;
          width: 500px;
          height: 560px;
          border-radius: 34px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 30px 60px -20px color-mix(in srgb, var(--ink) 55%, transparent);
          transform: translateY(-760px) rotate(-8deg);
          z-index: 2;
        }

        .flip .card {
          right: auto;
          left: 110px;
        }

        .card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .on .blob {
          animation: pop .9s cubic-bezier(.2,.9,.3,1.1) forwards;
        }

        .on h2 {
          animation: wipe .8s .35s cubic-bezier(.7,0,.2,1) forwards;
        }

        .on .v {
          animation: fade .5s .9s forwards;
        }

        .on .tag {
          animation: stamp .45s 1.25s cubic-bezier(.3,1.6,.5,1) forwards;
        }

        .on .card {
          animation: drop .95s .15s cubic-bezier(.3,1.35,.5,1) forwards;
        }

        .on.out > * {
          animation: none !important;
          transition: opacity .35s;
          opacity: 0;
        }

        @keyframes pop {
          to { transform: scale(1); }
        }

        @keyframes wipe {
          to { clip-path: inset(0); }
        }

        @keyframes fade {
          to { opacity: 1; }
        }

        @keyframes stamp {
          to { opacity: 1; transform: scale(1) rotate(-3deg); }
        }

        @keyframes drop {
          to { transform: translateY(0) rotate(2.5deg); }
        }

        .scene.intro {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          text-align: left;
          background: #17112b;
          padding: 0 90px;
          color: #fff8ef;
        }

        .lines {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 22px;
          margin-top: -60px;
        }

        .intro .lines h1 {
          font-family: 'DM Sans', system-ui, sans-serif;
          font-weight: 700;
          font-size: 46px;
          line-height: 1.15;
          color: #fff8ef;
          text-shadow: none;
          opacity: 0;
        }

        .intro .l1 {
          transform: scale(0);
          transform-origin: left center;
        }

        .intro .l2 {
          color: #7FD0F5;
          transform: translateX(-140%);
        }

        .intro .l3 {
          font-family: 'Bowlby One', Impact, sans-serif;
          font-weight: 400;
          font-size: 82px;
          line-height: 1.02;
          color: #F7C514;
          margin-top: 12px;
          transform: translateY(-480px) scale(1.6);
          transform-origin: center bottom;
        }

        .intro .l3 small {
          display: block;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-weight: 700;
          font-size: 44px;
          color: #fff8ef;
          margin-bottom: 14px;
        }

        .chips {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 22px;
          display: flex;
        }

        .chips i {
          flex: 1;
          background: var(--a);
          transform: scaleY(0);
          transform-origin: bottom;
        }

        .on .chips i {
          animation: rise .4s calc(5s + var(--d)) cubic-bezier(.2,.9,.3,1.2) forwards;
        }

        @keyframes rise {
          to { transform: none; }
        }

        .intro .sub {
          position: absolute;
          left: 90px;
          bottom: 58px;
          margin: 0;
          padding: 0;
          background: none;
          border-radius: 0;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 30px;
          font-weight: 700;
          color: #fff8ef;
          opacity: 0;
          transform: translateY(20px);
        }

        .on .sub {
          animation: up .6s 5.3s cubic-bezier(.2,.9,.3,1) forwards;
        }

        .on .l1 {
          animation: popup .7s .3s cubic-bezier(.3,1.7,.5,1) forwards;
        }

        .on .l2 {
          animation: slidein .8s 2s cubic-bezier(.2,.9,.3,1) forwards;
        }

        .on .l3 {
          animation: stomp 1s 4s cubic-bezier(.4,0,.6,1) forwards;
        }

        .on .lines {
          animation: shake .35s 4.45s linear;
        }

        @keyframes up {
          to { opacity: 1; transform: none; }
        }

        @keyframes popup {
          0% { opacity: 0; transform: scale(0); }
          60% { opacity: 1; transform: scale(1.14); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes slidein {
          to { opacity: 1; transform: none; }
        }

        @keyframes stomp {
          0% { opacity: 0; transform: translateY(-480px) scale(1.6); }
          10% { opacity: 1; }
          45% { opacity: 1; transform: translateY(0) scale(1); }
          55% { opacity: 1; transform: scale(1.2, .78); }
          72% { opacity: 1; transform: translateY(-38px) scale(.97, 1.05); }
          86% { opacity: 1; transform: scale(1.06, .94); }
          100% { opacity: 1; transform: none; }
        }

        @keyframes shake {
          0%, 100% { translate: 0 0; }
          20% { translate: -8px 6px; }
          40% { translate: 8px -5px; }
          60% { translate: -5px 3px; }
          80% { translate: 4px -2px; }
        }

        #bar {
          position: absolute;
          left: 84px;
          right: 84px;
          bottom: 26px;
          display: flex;
          gap: 8px;
          z-index: 5;
        }

        #bar i {
          flex: 1;
          height: 8px;
          border-radius: 8px;
          background: rgba(29, 22, 51, .14);
          overflow: hidden;
          position: relative;
        }

        #bar i::after {
          content: "";
          position: absolute;
          inset: 0;
          background: var(--a);
          transform: scaleX(0);
          transform-origin: left;
        }

        #bar i.done::after {
          transform: none;
        }

        #bar i.cur::after {
          animation: fill 3.6s linear forwards;
        }

        @keyframes fill {
          to { transform: none; }
        }

        /* Controls */
        #replay {
          position: absolute;
          top: 22px;
          right: 26px;
          z-index: 6;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 18px;
          font-weight: 700;
          border: 0;
          border-radius: 30px;
          padding: 10px 20px;
          background: #1d1633;
          color: #fff;
          cursor: pointer;
          box-shadow: 0 0 0 2px rgba(255, 248, 239, .5);
          transition: transform 0.15s ease, background-color 0.15s ease;
        }

        #replay:hover {
          background: #2b1f4c;
        }

        #replay:focus-visible {
          outline: 3px solid #F2B705;
          outline-offset: 3px;
        }

        /* Paused State */
        :host([paused]) #stage *,
        :host([paused]) #stage *::before,
        :host([paused]) #stage *::after {
          animation-play-state: paused !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .scene * {
            animation-duration: .01s !important;
            animation-delay: 0s !important;
          }
          #bar i.cur::after {
            animation-duration: .01s !important;
          }
        }
      </style>

      <div class="viewport-wrapper">
        <main id="stage" aria-label="Paint range motion graphic">
          <button id="replay" type="button" aria-label="Replay motion graphic">Replay</button>

          <section class="scene intro">
            <div class="lines">
              <h1 class="l1">Want to get value for your money?</h1>
              <h1 class="l2">Create a masterpiece with colours and coatings.</h1>
              <h1 class="l3"><small>Look no further.....</small>Value Paint got you!</h1>
            </div>
            <p class="sub">Twelve finishes &amp; more available in 4L and 20L</p>
            <div class="chips">
              <i style="--a:#7B3FC4;--d:0.0s"></i>
              <i style="--a:#E0457B;--d:0.05s"></i>
              <i style="--a:#B02FA8;--d:0.1s"></i>
              <i style="--a:#2E8FE0;--d:0.15s"></i>
              <i style="--a:#2B3FC9;--d:0.2s"></i>
              <i style="--a:#F2B705;--d:0.25s"></i>
              <i style="--a:#E5432F;--d:0.30s"></i>
              <i style="--a:#B3174F;--d:0.35s"></i>
              <i style="--a:#F2B705;--d:0.4s"></i>
              <i style="--a:#D9921B;--d:0.45s"></i>
              <i style="--a:#223A8F;--d:0.5s"></i>
              <i style="--a:#D62B1F;--d:0.55s"></i>
            </div>
          </section>

          <section class="scene prod" style="--a:#7B3FC4;--ink:#3A1670">
            <div class="blob"></div>
            <div class="txt">
              <h2>Value Plus</h2>
              <p class="v">Matt Emulsion Finish</p>
              <span class="tag">20 Ltr</span>
            </div>
            <div class="card">
              <img src="/assets/products/value-plus-matt-emulsion-finish-20-ltr.webp" alt="Value Plus Matt Emulsion Finish 20 litre bucket">
            </div>
          </section>

          <section class="scene prod flip" style="--a:#E0457B;--ink:#7A1038">
            <div class="blob"></div>
            <div class="txt">
              <h2>Value Plus</h2>
              <p class="v">Satin</p>
              <span class="tag">20 Ltr</span>
            </div>
            <div class="card">
              <img src="/assets/products/value-plus-satin-20-ltr.webp" alt="Value Plus Satin 20 litre bucket">
            </div>
          </section>

          <section class="scene prod" style="--a:#B02FA8;--ink:#531463">
            <div class="blob"></div>
            <div class="txt">
              <h2>Buffalo</h2>
              <p class="v">Satin Emulsion Silk</p>
              <span class="tag">20 Ltr</span>
            </div>
            <div class="card">
              <img src="/assets/products/buffalo-satin-emulsion-silk-20-ltr.webp" alt="Buffalo Satin Emulsion Silk 20 litre bucket">
            </div>
          </section>

          <section class="scene prod flip" style="--a:#2E8FE0;--ink:#8E1212">
            <div class="blob"></div>
            <div class="txt">
              <h2>Negro Capa</h2>
              <p class="v">Satin Emulsion</p>
              <span class="tag">20 Ltr</span>
            </div>
            <div class="card">
              <img src="/assets/products/negro-capa-satin-emulsion-20-ltr.webp" alt="Negro Capa Satin Emulsion 20 litre bucket">
            </div>
          </section>

          <section class="scene prod" style="--a:#2B3FC9;--ink:#141F74">
            <div class="blob"></div>
            <div class="txt">
              <h2>Buffalo</h2>
              <p class="v">Emulsion</p>
              <span class="tag">20 Ltr</span>
            </div>
            <div class="card">
              <img src="/assets/products/buffalo-emulsion-20-ltr.webp" alt="Buffalo Emulsion 20 litre bucket">
            </div>
          </section>

          <section class="scene prod flip" style="--a:#F2B705;--ink:#1B1B8A">
            <div class="blob"></div>
            <div class="txt">
              <h2>Value Plus</h2>
              <p class="v">Emulsion</p>
              <span class="tag">20 Ltr</span>
            </div>
            <div class="card">
              <img src="/assets/products/value-plus-emulsion-20-ltr.webp" alt="Value Plus Emulsion 20 litre bucket">
            </div>
          </section>

          <section class="scene prod" style="--a:#E5432F;--ink:#7F1710">
            <div class="blob"></div>
            <div class="txt">
              <h2>Value Paints</h2>
              <p class="v">Standard Quality Emulsion</p>
              <span class="tag">20 Ltr</span>
            </div>
            <div class="card">
              <img src="/assets/products/value-paints-standard-quality-emulsion-20-ltr.webp" alt="Value Paints Standard Quality Emulsion 20 litre bucket">
            </div>
          </section>

          <section class="scene prod flip" style="--a:#B3174F;--ink:#5E0B2A">
            <div class="blob"></div>
            <div class="txt">
              <h2>Buffalo</h2>
              <p class="v">Premium Quality Enamel</p>
              <span class="tag">4 Ltr</span>
            </div>
            <div class="card">
              <img src="/assets/products/buffalo-premium-quality-enamel-4-ltr.webp" alt="Buffalo Premium Quality Enamel 4 litre bucket">
            </div>
          </section>

          <section class="scene prod" style="--a:#F2B705;--ink:#16205E">
            <div class="blob"></div>
            <div class="txt">
              <h2>Value Paints</h2>
              <p class="v">Gloss Finish</p>
              <span class="tag">4 Ltr</span>
            </div>
            <div class="card">
              <img src="/assets/products/value-paints-gloss-finish-4-ltr.webp" alt="Value Paints Gloss Finish 4 litre bucket">
            </div>
          </section>

          <section class="scene prod flip" style="--a:#D9921B;--ink:#7A1010">
            <div class="blob"></div>
            <div class="txt">
              <h2>Value Paints</h2>
              <p class="v">Premium Gloss Finish</p>
              <span class="tag">4 Ltr</span>
            </div>
            <div class="card">
              <img src="/assets/products/value-paints-premium-gloss-finish-4-ltr.webp" alt="Value Paints Premium Gloss Finish 4 litre bucket">
            </div>
          </section>

          <section class="scene prod" style="--a:#223A8F;--ink:#14205A">
            <div class="blob"></div>
            <div class="txt">
              <h2>Value Plus</h2>
              <p class="v">Gloss</p>
              <span class="tag">4 Ltr</span>
            </div>
            <div class="card">
              <img src="/assets/products/value-plus-gloss-4-ltr.webp" alt="Value Plus Gloss 4 litre bucket">
            </div>
          </section>

          <section class="scene prod flip" style="--a:#D62B1F;--ink:#1A1A1A">
            <div class="blob"></div>
            <div class="txt">
              <h2>Value Paints</h2>
              <p class="v">POP Emulsion</p>
              <span class="tag">20 Ltr</span>
            </div>
            <div class="card">
              <img src="/assets/products/value-paints-pop-emulsion-20-ltr.webp" alt="Value Paints POP Emulsion 20 litre bucket">
            </div>
          </section>

          <div id="bar">
            <i style="--a:#7B3FC4"></i>
            <i style="--a:#E0457B"></i>
            <i style="--a:#B02FA8"></i>
            <i style="--a:#2E8FE0"></i>
            <i style="--a:#2B3FC9"></i>
            <i style="--a:#F2B705"></i>
            <i style="--a:#E5432F"></i>
            <i style="--a:#B3174F"></i>
            <i style="--a:#F2B705"></i>
            <i style="--a:#D9921B"></i>
            <i style="--a:#223A8F"></i>
            <i style="--a:#D62B1F"></i>
          </div>
        </main>
      </div>
    `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  handleResize() {
    const stage = this.shadowRoot.getElementById('stage');
    const wrapper = this.shadowRoot.querySelector('.viewport-wrapper');
    if (!stage || !wrapper) return;

    const availableWidth = wrapper.clientWidth || window.innerWidth;
    // Mobile or container constrained scale calculation
    const scale = Math.min(availableWidth / 1280, 1);
    stage.style.transform = `scale(${scale})`;
    wrapper.style.height = `${Math.round(720 * scale)}px`;
  }

  initMotion() {
    const root = this.shadowRoot;
    const stage = root.getElementById('stage');
    const sc = [...root.querySelectorAll('.scene')];
    const segs = [...root.querySelectorAll('#bar i')];
    const bar = root.getElementById('bar');
    const replay = root.getElementById('replay');

    const cols = [
      '#7B3FC4', '#E0457B', '#B02FA8', '#2E8FE0',
      '#2B3FC9', '#F2B705', '#E5432F', '#B3174F',
      '#F2B705', '#D9921B', '#223A8F', '#D62B1F'
    ];

    const dur = sc.map((s, i) => (i === 0 ? 8200 : i === sc.length - 1 ? 4000 : 3600));

    let remainingTime = 0;
    let slideStartTime = 0;

    const show = (i, resumeElapsed = 0) => {
      if (this.timer) clearTimeout(this.timer);
      sc.forEach(s => s.classList.remove('on', 'out'));
      if (this.cur >= 0) void stage.offsetWidth;
      this.cur = i;
      const s = sc[i];
      s.classList.add('on');

      segs.forEach((g, k) => {
        g.classList.remove('cur', 'done');
        if (i > 0 && i < sc.length) {
          if (k < i - 1) g.classList.add('done');
          if (k === i - 1) g.classList.add('cur');
        }
        if (i === sc.length - 1 && k < sc.length - 1) {
          g.classList.add('done');
        }
      });

      if (bar) {
        bar.style.opacity = i ? '1' : '0';
        bar.style.setProperty('--a', i > 0 && i < sc.length ? cols[i - 1] : '#1d1633');
      }

      const totalDur = dur[i];
      const waitTime = Math.max(200, totalDur - resumeElapsed);
      slideStartTime = Date.now() - resumeElapsed;

      this.timer = setTimeout(() => {
        s.classList.add('out');
        this.timer = setTimeout(() => {
          show((i + 1) % sc.length, 0);
        }, 350);
      }, waitTime - 350);
    };

    this.showSlide = show;

    replay.addEventListener('click', () => {
      show(0, 0);
    });

    this.handleResize();
    window.addEventListener('resize', this.handleResize);

    // Pause on tab hide / resume on tab active
    this.handleVisibility = () => {
      if (document.hidden) {
        this.pause();
      } else if (this.isIntersecting) {
        this.resume();
      }
    };
    document.addEventListener('visibilitychange', this.handleVisibility);

    // Pause when scrolled out of view / resume when visible
    this.isIntersecting = false;
    this.observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        this.isIntersecting = entry.isIntersecting;
        if (entry.isIntersecting && !document.hidden) {
          this.resume();
        } else {
          this.pause();
        }
      }
    }, { threshold: 0.2 });

    this.observer.observe(this);

    // Start initial playback
    show(0, 0);
  }

  pause() {
    if (this.isPaused) return;
    this.isPaused = true;
    this.setAttribute('paused', '');
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  resume() {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.removeAttribute('paused');
    if (this.showSlide && this.cur >= 0) {
      // Advance to current slide cleanly
      this.showSlide(this.cur, 0);
    }
  }
}

if (!customElements.get('paint-range-motion')) {
  customElements.define('paint-range-motion', PaintRangeMotion);
}

export default PaintRangeMotion;
