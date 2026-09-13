/* ==========================================================================
   LUCAS — Portfólio · Cinematic "Motion Design Video Reel" Engine
   (GSAP + ScrollTrigger + GPU Composited Motion Reel Engine)
   60Hz Optimized for Mobile & Desktop · 100% Original Palette
   ========================================================================== */
(() => {
    'use strict';

    const $  = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
    const reduce = false;
    const fine   = window.matchMedia('(pointer: fine)').matches;
    const nf = new Intl.NumberFormat('pt-PT');

    const boot = () => {
        const hasGSAP = !!(window.gsap && window.ScrollTrigger);
        const animate = hasGSAP && !reduce;

        if (hasGSAP) {
            window.gsap.registerPlugin(window.ScrollTrigger);
        }

        /* ---------- Ambient Atmospheric Particles (Lightweight Desktop Only) ---------- */
        if (fine) {
            (() => {
                const canvas = $('#ambient-particles');
                if (!canvas || reduce) return;
                const ctx = canvas.getContext('2d');
                let w = 0, h = 0;
                let particles = [];
                let rafId = null;

                const resize = () => {
                    w = window.innerWidth;
                    h = window.innerHeight;
                    canvas.width = w;
                    canvas.height = h;
                    canvas.style.width = w + 'px';
                    canvas.style.height = h + 'px';
                };
                resize();
                window.addEventListener('resize', resize, { passive: true });

                const count = 18;
                for (let i = 0; i < count; i++) {
                    particles.push({
                        x: Math.random() * (w || window.innerWidth),
                        y: Math.random() * (h || window.innerHeight),
                        size: Math.random() * 2 + 0.8,
                        vx: (Math.random() - 0.5) * 0.22,
                        vy: (Math.random() - 0.5) * 0.22,
                        alpha: Math.random() * 0.4 + 0.2,
                        isEmber: i % 5 === 0,
                        phase: Math.random() * Math.PI * 2
                    });
                }

                const draw = () => {
                    ctx.clearRect(0, 0, w, h);
                    for (let p of particles) {
                        p.phase += 0.02;
                        p.x += p.vx;
                        p.y += p.vy;

                        if (p.x < 0) p.x = w;
                        if (p.x > w) p.x = 0;
                        if (p.y < 0) p.y = h;
                        if (p.y > h) p.y = 0;

                        const currentAlpha = p.alpha * (0.7 + Math.sin(p.phase) * 0.3);
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                        ctx.fillStyle = p.isEmber
                            ? `rgba(214, 251, 0, ${currentAlpha * 0.9})`
                            : `rgba(0, 84, 95, ${currentAlpha * 0.85})`;
                        ctx.fill();
                    }
                    rafId = requestAnimationFrame(draw);
                };
                draw();

                document.addEventListener('visibilitychange', () => {
                    if (document.hidden) cancelAnimationFrame(rafId);
                    else rafId = requestAnimationFrame(draw);
                });
            })();
        }

        /* ---------- Hero Floating Elements Parallax Interaction ---------- */
        if (fine && !reduce) {
            const hero = $('#hero');
            const floats = $$('.hero-float-item');
            if (hero && floats.length) {
                let mx = 0, my = 0;
                let curX = 0, curY = 0;
                let ticking = false;

                const speeds = [
                    { x: 18, y: 14 },   // Olhos (top-left)
                    { x: -22, y: -18 }, // Gráfico (right)
                    { x: 16, y: 20 }    // Relógio (bottom-left)
                ];

                const loop = () => {
                    curX += (mx - curX) * 0.08;
                    curY += (my - curY) * 0.08;

                    floats.forEach((el, i) => {
                        const sp = speeds[i] || { x: 15, y: 15 };
                        const px = curX * sp.x;
                        const py = curY * sp.y;
                        el.style.transform = `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, 0)`;
                    });

                    if (Math.abs(mx - curX) > 0.01 || Math.abs(my - curY) > 0.01) {
                        requestAnimationFrame(loop);
                    } else {
                        ticking = false;
                    }
                };

                window.addEventListener('mousemove', (e) => {
                    mx = (e.clientX / window.innerWidth - 0.5) * 2;
                    my = (e.clientY / window.innerHeight - 0.5) * 2;
                    if (!ticking) {
                        ticking = true;
                        requestAnimationFrame(loop);
                    }
                }, { passive: true });
            }
        }

        /* ---------- Process Wave Interactive Liquid Ripple Reaction ---------- */
        if (fine) {
            (() => {
                const waveArt = $('.process-wave-art');
                if (!waveArt) return;
                let targetRotateX = 0, targetRotateY = 0, targetScale = 1;
                let curRotateX = 0, curRotateY = 0, curScale = 1;
                let animId = null;

                const onMove = (e) => {
                    const rect = waveArt.getBoundingClientRect();
                    const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
                    const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
                    targetRotateY = Math.max(-8, Math.min(8, x * 7));
                    targetRotateX = Math.max(-8, Math.min(8, -y * 7));
                    targetScale = 1.04;
                    if (!animId) animId = requestAnimationFrame(update);
                };

                const onLeave = () => {
                    targetRotateX = 0;
                    targetRotateY = 0;
                    targetScale = 1;
                    if (!animId) animId = requestAnimationFrame(update);
                };

                const update = () => {
                    curRotateX += (targetRotateX - curRotateX) * 0.08;
                    curRotateY += (targetRotateY - curRotateY) * 0.08;
                    curScale += (targetScale - curScale) * 0.08;
                    waveArt.style.transform = `perspective(900px) rotateX(${curRotateX.toFixed(2)}deg) rotateY(${curRotateY.toFixed(2)}deg) scale(${curScale.toFixed(3)})`;
                    if (Math.abs(targetRotateX - curRotateX) > 0.02 || Math.abs(targetRotateY - curRotateY) > 0.02 || Math.abs(targetScale - curScale) > 0.002) {
                        animId = requestAnimationFrame(update);
                    } else {
                        animId = null;
                    }
                };

                waveArt.addEventListener('mousemove', onMove, { passive: true });
                waveArt.addEventListener('mouseleave', onLeave, { passive: true });
            })();
        }

        /* ---------- Instant Ready Signal ---------- */
        document.documentElement.classList.remove('is-loading');
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();

        /* ---------- WhatsApp links ---------- */
        (() => {
            const num = window.WHATSAPP_NUMBER;
            if (!num) return;
            $$('a[href*="wa.me/"]').forEach((a) => {
                try {
                    const u = new URL(a.href);
                    a.href = `https://wa.me/${num}?text=${encodeURIComponent(u.searchParams.get('text') || '')}`;
                } catch (_) {}
            });
        })();

        /* ---------- Anchor navigation (Native 60Hz/120Hz Smooth Scroll) ---------- */
        $$('a[href^="#"]').forEach((a) => {
            a.addEventListener('click', (e) => {
                const id = a.getAttribute('href');
                if (id.length < 2) return;
                const target = $(id);
                if (!target) return;
                e.preventDefault();
                closeMobileNav();
                const y = target.getBoundingClientRect().top + window.scrollY - 75;
                window.scrollTo({ top: y, behavior: 'smooth' });
            });
        });

        /* ---------- Header sticky + scrollspy (Cached Layout) ---------- */
        (() => {
            const navbar = $('#navbar');
            const links = $$('.nav a');
            const sections = $$('main section[id]');
            const bar = $('#scroll-progress');
            let sectionTops = [];
            const cacheOffsets = () => {
                sectionTops = sections.map((s) => ({ id: s.id, top: s.offsetTop, height: s.offsetHeight }));
            };
            cacheOffsets();
            window.addEventListener('resize', cacheOffsets, { passive: true });

            let ticking = false;
            const update = () => {
                const y = window.scrollY;
                navbar && navbar.classList.toggle('stuck', y > 30);
                const doc = document.documentElement;
                const max = doc.scrollHeight - doc.clientHeight;
                if (bar && max > 0) bar.style.width = (y / max * 100) + '%';
                const pos = y + 140;
                let cur = '';
                for (let i = 0; i < sectionTops.length; i++) {
                    const s = sectionTops[i];
                    if (pos >= s.top && pos < s.top + s.height) cur = s.id;
                }
                links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
                ticking = false;
            };
            window.addEventListener('scroll', () => {
                if (!ticking) { ticking = true; requestAnimationFrame(update); }
            }, { passive: true });
            update();
        })();

        /* ---------- Mobile nav ---------- */
        const burger = $('#burger');
        const mnav = $('#mobile-nav');
        function closeMobileNav() {
            if (!mnav) return;
            mnav.classList.remove('open');
            burger && burger.setAttribute('aria-expanded', 'false');
            document.removeEventListener('click', outside);
        }
        function outside(e) {
            if (mnav && !mnav.contains(e.target) && !burger.contains(e.target)) closeMobileNav();
        }
        if (burger && mnav) {
            burger.addEventListener('click', (e) => {
                e.stopPropagation();
                const open = mnav.classList.toggle('open');
                burger.setAttribute('aria-expanded', String(open));
                if (open) document.addEventListener('click', outside);
            });
        }

        /* ---------- Marquee ---------- */
        (() => {
            const r = $('#marquee');
            if (r) r.innerHTML += r.innerHTML;
        })();

        /* ---------- FAQ (Smooth Grid Rows) ---------- */
        (() => {
            const items = $$('.faq-item');
            items.forEach((item) => {
                const q = $('.faq-q', item);
                if (!q) return;
                q.addEventListener('click', () => {
                    const open = item.classList.contains('open');
                    items.forEach((o) => {
                        o.classList.remove('open');
                        const oq = $('.faq-q', o);
                        oq && oq.setAttribute('aria-expanded', 'false');
                    });
                    if (!open) {
                        item.classList.add('open');
                        q.setAttribute('aria-expanded', 'true');
                    }
                    if (window.ScrollTrigger) {
                        setTimeout(() => window.ScrollTrigger.refresh(), 460);
                    }
                });
            });
        })();

        /* ---------- ROI calculator (€ / pt-PT with Smooth Cubic Ease) ---------- */
        (() => {
            const traffic = $('#traffic-input'), speed = $('#speed-input'), contract = $('#contract-input');
            if (!traffic || !speed || !contract) return;
            const tv = $('#traffic-val'), sv = $('#speed-val'), cv = $('#contract-val'), le = $('#leads-lost-val'), re = $('#revenue-lost-val');
            const anim = (el, to, suffix = '') => {
                if (el._raf) cancelAnimationFrame(el._raf);
                const from = parseInt(el.textContent.replace(/\D/g, ''), 10) || 0;
                if (reduce) { el.textContent = nf.format(to) + suffix; return; }
                const t0 = performance.now();
                const step = (t) => {
                    const p = Math.min((t - t0) / 380, 1);
                    const ease = 1 - Math.pow(1 - p, 3);
                    el.textContent = nf.format(Math.round(from + (to - from) * ease)) + suffix;
                    if (p < 1) el._raf = requestAnimationFrame(step); else el._raf = null;
                };
                el._raf = requestAnimationFrame(step);
            };
            const calc = () => {
                const t = +traffic.value, s = +speed.value, c = +contract.value;
                tv.textContent = nf.format(t);
                sv.textContent = s.toFixed(1).replace('.', ',') + 's';
                cv.textContent = nf.format(c) + '€';
                const loss = Math.min(0.9, Math.max(0, s - 1) * 0.07);
                const lostYear = Math.round(t * 0.025 * loss * 12);
                anim(le, lostYear);
                anim(re, Math.round(lostYear * c * 0.15), ' €');
            };
            [traffic, speed, contract].forEach((i) => i.addEventListener('input', calc));
            calc();
        })();





        /* ---------- Dual Cursor (Precision Pinpoint + Damped Trailing Ring) ---------- */
        if (fine && !reduce) {
            const cur = $('#cursor'), dot = $('#cursor-dot'), lbl = $('.cursor-label');
            if (cur) {
                let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, on = false, raf = false;
                const loop = () => {
                    cx += (x - cx) * 0.18;
                    cy += (y - cy) * 0.18;
                    cur.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
                    if (dot) dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
                    if (Math.abs(x - cx) > 0.05 || Math.abs(y - cy) > 0.05) {
                        requestAnimationFrame(loop);
                    } else {
                        raf = false;
                    }
                };
                window.addEventListener('mousemove', (e) => {
                    x = e.clientX;
                    y = e.clientY;
                    if (!on) { document.body.classList.add('has-cursor'); on = true; }
                    if (!raf) { raf = true; requestAnimationFrame(loop); }
                }, { passive: true });
                document.addEventListener('mouseleave', () => {
                    document.body.classList.remove('has-cursor');
                    on = false;
                });
                const sel = 'a, button, input, select, textarea, [data-tilt], [data-cursor], .faq-q, .gfx-filter';
                document.body.addEventListener('mouseover', (e) => {
                    const t = e.target.closest(sel);
                    if (!t) return;
                    const label = t.dataset.cursor || (t.closest('[data-cursor]') || {}).dataset?.cursor;
                    if (label) {
                        document.body.classList.add('cursor-view');
                        if (lbl) lbl.textContent = label;
                    } else {
                        document.body.classList.add('cursor-hover');
                    }
                });
                document.body.addEventListener('mouseout', (e) => {
                    if (e.target.closest(sel)) {
                        document.body.classList.remove('cursor-hover', 'cursor-view');
                    }
                });
            }
        }

        /* ---------- Card Spotlight Tracker (Desktop Only - Zero Touch Overhead) ---------- */
        if (fine) {
            const cards = $$('.work-card, .cap, .plan, .calc, .faq-item, .about-photo');
            cards.forEach((card) => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                }, { passive: true });
            });
        }

        /* ---------- Magnetic with Elastic Physics ---------- */
        if (fine && !reduce && window.gsap) {
            const { gsap } = window;
            $$('.magnetic').forEach((el) => {
                const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
                const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' });
                let r = null;
                el.addEventListener('mouseenter', () => {
                    r = el.getBoundingClientRect();
                });
                el.addEventListener('mousemove', (e) => {
                    if (!r) r = el.getBoundingClientRect();
                    const cx = (e.clientX - (r.left + r.width / 2)) * 0.32;
                    const cy = (e.clientY - (r.top + r.height / 2)) * 0.32;
                    xTo(cx);
                    yTo(cy);
                });
                el.addEventListener('mouseleave', () => {
                    gsap.to(el, {
                        x: 0,
                        y: 0,
                        duration: 0.75,
                        ease: 'elastic.out(1.1, 0.4)',
                        overwrite: 'auto'
                    });
                    r = null;
                });
            });
        }

        /* ---------- No-GSAP / reduced motion fallback ---------- */
        if (!animate) return;

        const { gsap, ScrollTrigger } = window;
        gsap.registerPlugin(ScrollTrigger);
        document.documentElement.classList.add('anim');

        /* ==========================================================================
           MOTION DESIGN ENGINE (Cinematic 60Hz/120Hz Native Accelerated Reel)
           ========================================================================== */

        /* 1. HERO HIGHLIGHTS & AMBIENT MOTION */
        (() => {
            const pills = $$('.hero-pill');
            if (pills && pills.length) {
                gsap.from(pills, {
                    y: 18,
                    opacity: 0,
                    filter: 'blur(6px)',
                    stagger: 0.1,
                    duration: 0.75,
                    delay: 0.35,
                    ease: 'power3.out',
                    clearProps: 'filter'
                });
            }
        })();

        /* 2. WORK CARDS STORYBOARD GLIDE */
        (() => {
            const isMobile = window.innerWidth <= 680;
            $$('.work-card[data-slide]').forEach((card) => {
                const isLeft = card.dataset.slide === 'left';
                gsap.from(card, {
                    x: isMobile ? 0 : (isLeft ? -36 : 36),
                    y: isMobile ? 24 : 0,
                    rotateZ: isMobile ? 0 : (isLeft ? -1.2 : 1.2),
                    opacity: 0,
                    filter: 'blur(10px)',
                    duration: 0.8,
                    ease: 'power2.out',
                    clearProps: 'filter',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 92%',
                        once: true
                    }
                });
            });
        })();


        /* 4. CINEMATIC HEADLINE REVEAL (Hero Word Reel + Snappy Section Rise) */
        const splitWords = (el) => {
            const out = [];
            Array.from(el.childNodes).forEach((node) => {
                if (node.nodeType === 3) {
                    node.textContent.split(/(\s+)/).forEach((tok) => {
                        if (!tok.trim()) { if (tok) out.push(document.createTextNode(tok)); return; }
                        const w = document.createElement('span'); w.className = 'split-word';
                        const inner = document.createElement('span'); inner.textContent = tok;
                        w.appendChild(inner); out.push(w);
                    });
                } else if (node.nodeName === 'BR') {
                    out.push(node.cloneNode());
                } else {
                    const w = document.createElement('span'); w.className = 'split-word';
                    const inner = document.createElement('span'); inner.appendChild(node.cloneNode(true));
                    w.appendChild(inner); out.push(w);
                }
            });
            el.textContent = '';
            out.forEach((n) => el.appendChild(n));
            return $$('.split-word > span', el);
        };

        const h1 = $('h1[data-anim="rise"]');
        if (h1) {
            const words = splitWords(h1);
            gsap.set(h1, { opacity: 1 });
            gsap.from(words, {
                y: 26,
                opacity: 0,
                filter: 'blur(10px)',
                duration: 0.8,
                ease: 'power3.out',
                stagger: 0.04,
                clearProps: 'filter'
            });
        }

        const secHeadlines = $$('.split-head h2, .statement-text h2, .about-text h2, .cta h2, .contact-intro h2');
        secHeadlines.forEach((el) => {
            gsap.from(el, {
                y: 24,
                opacity: 0,
                filter: 'blur(12px)',
                duration: 0.85,
                ease: 'power2.out',
                clearProps: 'filter',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    once: true
                }
            });
        });

        const headlines = h1 ? [h1, ...secHeadlines] : secHeadlines;

        /* 7. FADE & STAGGER ELEMENTS (Cinematic Blur-in on Scroll) */
        $$('[data-anim="fade"]').forEach((el) => {
            gsap.from(el, {
                y: 22,
                opacity: 0,
                filter: 'blur(10px)',
                duration: 0.8,
                ease: 'power2.out',
                clearProps: 'filter',
                scrollTrigger: { trigger: el, start: 'top 92%', once: true }
            });
        });

        $$('[data-anim="stagger"]').forEach((el) => {
            const children = Array.from(el.children).filter(c => !headlines.includes(c) && !c.classList.contains('work-card'));
            if (children.length) {
                gsap.from(children, {
                    y: 20,
                    opacity: 0,
                    filter: 'blur(8px)',
                    duration: 0.75,
                    ease: 'power2.out',
                    stagger: 0.07,
                    clearProps: 'filter',
                    scrollTrigger: { trigger: el, start: 'top 90%', once: true }
                });
            }
        });

        const phone = $('.statement-phone');
        if (phone) {
            gsap.from(phone, {
                y: 36,
                opacity: 0,
                filter: 'blur(14px)',
                duration: 0.9,
                ease: 'power2.out',
                clearProps: 'filter',
                scrollTrigger: {
                    trigger: phone,
                    start: 'top 90%',
                    once: true
                }
            });
        }

        /* 7. PARALLAX (Desktop Only) */
        if (fine) {
            $$('[data-parallax]').forEach((el) => {
                const v = parseFloat(el.dataset.parallax) || 0;
                gsap.fromTo(el, { y: -v }, {
                    y: v, ease: 'none',
                    scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true }
                });
            });
        }

        /* 9. PROCESS LIST DRAWING LINE */
        const processList = $('.process-list');
        if (processList) {
            ScrollTrigger.create({
                trigger: processList,
                start: 'top 78%',
                once: true,
                onEnter: () => processList.classList.add('in')
            });
        }

        /* 10. PROCESS ROCKET FLIGHT CHOREOGRAPHY */
        (() => {
            const stage = $('.process-flight-stage');
            const vessel = $('.process-rocket-vessel');
            const section = $('#process');
            if (!stage || !vessel || !section) return;

            if (reduce) {
                gsap.set(vessel, { x: 0, y: 0, opacity: 1, scale: 1 });
                return;
            }

            const calcOffsets = () => {
                const w = window.innerWidth;
                const isMobile = w <= 768 || !fine;
                const isTablet = w <= 992 && !isMobile;
                // Proportional flight distance adapted to mobile and desktop screens
                const dist = isMobile
                    ? Math.min(w * 0.72, 320)
                    : (isTablet ? Math.min(w * 0.65, 460) : Math.max(w * 0.58, 480));
                const startX = dist;
                const startY = dist * 0.80; // Exact collinear trajectory along 38.6° axis
                const endX = -dist * 1.08;
                const endY = -dist * 1.08 * 0.80;
                return {
                    startX,
                    startY,
                    midX: isMobile ? -16 : -25,
                    midY: isMobile ? -12 : -20,
                    endX,
                    endY,
                    isMobile
                };
            };

            let flightTl = null;

            const buildFlightTimeline = () => {
                if (flightTl) flightTl.kill();
                const { startX, startY, midX, midY, endX, endY, isMobile } = calcOffsets();

                // Initial position: far bottom-right on exact collinear line
                gsap.set(vessel, {
                    x: startX,
                    y: startY,
                    scale: isMobile ? 0.92 : 0.9,
                    opacity: 0,
                    rotation: 0,
                    force3D: true
                });

                flightTl = gsap.timeline({
                    repeat: -1,
                    repeatDelay: isMobile ? 1.4 : 1.4,
                    defaults: { overwrite: 'auto', force3D: true }
                });

                if (isMobile) {
                    // Mobile 60/120Hz GPU-accelerated fluid flight:
                    // Avoids low-fps crawl, maintains continuous dynamic momentum, and glides smoothly
                    flightTl
                        .to(vessel, {
                            opacity: 1,
                            duration: 0.28,
                            ease: 'power1.out',
                            force3D: true
                        }, 0)
                        .to(vessel, {
                            x: 0,
                            y: 0,
                            scale: 1,
                            rotation: 0,
                            duration: 1.1,
                            ease: 'power2.out',
                            force3D: true
                        }, 0)
                        .to(vessel, {
                            x: midX,
                            y: midY,
                            scale: 1.03,
                            rotation: -2,
                            duration: 1.35,
                            ease: 'power1.inOut',
                            force3D: true
                        })
                        .to(vessel, {
                            x: endX,
                            y: endY,
                            scale: 1.08,
                            rotation: -4.5,
                            duration: 1.05,
                            ease: 'power2.in',
                            force3D: true
                        })
                        .to(vessel, {
                            opacity: 0,
                            duration: 0.3,
                            ease: 'power2.in',
                            force3D: true
                        }, '-=0.3');
                } else {
                    // Desktop timeline
                    flightTl
                        .to(vessel, {
                            opacity: 1,
                            duration: 0.25,
                            ease: 'power1.out',
                            force3D: true
                        }, 0)
                        .to(vessel, {
                            x: 0,
                            y: 0,
                            scale: 1,
                            rotation: 0,
                            duration: 1.35,
                            ease: 'power3.out',
                            force3D: true
                        }, 0)
                        .to(vessel, {
                            x: midX,
                            y: midY,
                            scale: 1.025,
                            rotation: -2.5,
                            duration: 1.7,
                            ease: 'sine.inOut',
                            force3D: true
                        })
                        .to(vessel, {
                            x: endX,
                            y: endY,
                            scale: 1.08,
                            rotation: -5,
                            duration: 1.15,
                            ease: 'power2.in',
                            force3D: true
                        })
                        .to(vessel, {
                            opacity: 0,
                            duration: 0.35,
                            ease: 'power2.in',
                            force3D: true
                        }, '-=0.35');
                }
            };

            buildFlightTimeline();

            // Rebuild offsets on resize to adapt to viewport changes
            window.addEventListener('resize', () => {
                const wasRunning = flightTl && flightTl.isActive();
                buildFlightTimeline();
                if (!wasRunning) flightTl.pause(0);
            }, { passive: true });

            // Only run flight when #process is visible in viewport
            ScrollTrigger.create({
                trigger: section,
                start: 'top 85%',
                end: 'bottom 15%',
                onEnter: () => flightTl && flightTl.play(),
                onLeave: () => flightTl && flightTl.pause(),
                onEnterBack: () => flightTl && flightTl.play(),
                onLeaveBack: () => flightTl && flightTl.pause()
            });

            // Interactive touch / tap turbo boost on both mobile and desktop
            const triggerTurboBoost = () => {
                const flameImg = $('.process-flame-img', vessel);
                gsap.to(vessel, {
                    scale: 1.08,
                    duration: 0.22,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.out',
                    force3D: true,
                    overwrite: 'auto'
                });
                if (flameImg) {
                    const isMobileOrTouch = window.innerWidth <= 768 || !window.matchMedia('(pointer: fine)').matches;
                    const flameFilter = isMobileOrTouch
                        ? 'drop-shadow(0 0 35px rgba(214, 251, 0, 0.95)) drop-shadow(0 15px 35px rgba(0, 84, 95, 0.85))'
                        : 'url(#liquidWaveFilter) drop-shadow(0 0 65px rgba(214, 251, 0, 0.95)) drop-shadow(0 25px 65px rgba(0, 84, 95, 0.85))';
                    gsap.to(flameImg, {
                        filter: flameFilter,
                        duration: 0.25,
                        yoyo: true,
                        repeat: 1,
                        ease: 'power2.out',
                        force3D: true,
                        overwrite: 'auto'
                    });
                }
            };
            stage.addEventListener('pointerdown', triggerTurboBoost, { passive: true });
        })();

        /* 11. 3D TILT WITH SPECULAR SHEEN */
        if (fine) {
            $$('[data-tilt]').forEach((el) => {
                const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power2.out' });
                const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power2.out' });
                
                if (el.classList.contains('mock') && !el.querySelector('.mock-sheen')) {
                    const sheen = document.createElement('div');
                    sheen.className = 'mock-sheen';
                    el.appendChild(sheen);
                }

                let r = null;
                el.addEventListener('mouseenter', () => {
                    r = el.getBoundingClientRect();
                    gsap.set(el, { transformPerspective: 1000 });
                });
                el.addEventListener('mousemove', (e) => {
                    if (!r) r = el.getBoundingClientRect();
                    const px = (e.clientX - r.left) / r.width - 0.5;
                    const py = (e.clientY - r.top) / r.height - 0.5;
                    ry(px * 10);
                    rx(py * -10);
                    el.style.setProperty('--sheen-x', `${px * 40}%`);
                    el.style.setProperty('--sheen-y', `${py * 40}%`);
                }, { passive: true });
                el.addEventListener('mouseleave', () => {
                    rx(0);
                    ry(0);
                    r = null;
                });
            });
        }

        /* 12. COUNTERS (Smooth GSAP Interpolation) */
        (() => {
            const els = $$('.count');
            if (!els.length) return;
            els.forEach((el) => {
                const target = parseInt(el.dataset.target, 10) || 0;
                if (reduce) { el.textContent = target; return; }
                const obj = { val: 0 };
                ScrollTrigger.create({
                    trigger: el,
                    start: 'top 88%',
                    once: true,
                    onEnter: () => {
                        gsap.to(obj, {
                            val: target,
                            duration: 1.6,
                            ease: 'power2.out',
                            onUpdate: () => {
                                el.textContent = Math.round(obj.val);
                            }
                        });
                    }
                });
            });
        })();

        /* 13. SAFETY FALLBACK REVEAL & WINDOW LOAD REFRESH */
        ScrollTrigger.refresh();
        const ensureVisible = () => {
            $$('[data-anim]').forEach((el) => {
                if (parseFloat(getComputedStyle(el).opacity) === 0) gsap.set(el, { opacity: 1, y: 0, clearProps: 'filter' });
                if (el.dataset.anim === 'stagger') {
                    Array.from(el.children).forEach((c) => {
                        if (parseFloat(getComputedStyle(c).opacity) === 0) gsap.set(c, { opacity: 1, y: 0, clearProps: 'filter' });
                    });
                }
            });
            const phone = $('.statement-phone');
            if (phone && parseFloat(getComputedStyle(phone).opacity) === 0) {
                gsap.set(phone, { opacity: 1, y: 0, clearProps: 'filter' });
            }
        };
        setTimeout(ensureVisible, 1200);
        setTimeout(ensureVisible, 3000);
        window.addEventListener('load', () => {
            if (window.ScrollTrigger) window.ScrollTrigger.refresh();
        });

        /* 14. PAUSE MARQUEE WHEN TAB HIDDEN */
        document.addEventListener('visibilitychange', () => {
            const r = $('#marquee');
            if (r) r.style.animationPlayState = document.hidden ? 'paused' : 'running';
        });
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
})();
