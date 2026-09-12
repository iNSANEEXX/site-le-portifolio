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

        
        /* ---------- Interactive 3D WebGL Moving Objects (Three.js) ---------- */
        (() => {
            const canvas = document.getElementById('canvas3d');
            if (!canvas || !window.THREE) return;

            const hero = document.getElementById('hero');
            const scene = new THREE.Scene();

            const getHeroSize = () => ({
                width: hero ? hero.clientWidth : window.innerWidth,
                height: hero ? hero.clientHeight : window.innerHeight
            });

            let { width, height } = getHeroSize();

            const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
            camera.position.z = 18;

            const renderer = new THREE.WebGLRenderer({
                canvas,
                alpha: true,
                antialias: true,
                powerPreference: 'high-performance'
            });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(width, height);

            // Group containing 3D floating shapes
            const group = new THREE.Group();
            scene.add(group);

            // 1. Torus Ring (Cyber Deep Teal / Obsidian Glass)
            const torusGeo = new THREE.TorusGeometry(3.6, 1.05, 30, 60);
            const torusMat = new THREE.MeshStandardMaterial({
                color: 0x00404a,
                emissive: 0x001a1f,
                roughness: 0.15,
                metalness: 0.85
            });
            const torus = new THREE.Mesh(torusGeo, torusMat);
            torus.position.set(4.8, 1.2, -1.5);
            torus.rotation.set(0.6, 0.4, 0.2);
            group.add(torus);

            // Wireframe accent ring in Acid Lime
            const wireGeo = new THREE.TorusGeometry(3.62, 0.35, 16, 40);
            const wireMat = new THREE.MeshBasicMaterial({
                color: 0xd6fb00,
                wireframe: true,
                transparent: true,
                opacity: 0.28
            });
            const wireRing = new THREE.Mesh(wireGeo, wireMat);
            wireRing.position.copy(torus.position);
            group.add(wireRing);

            // 2. Floating Crystal / Icosahedron (Acid Lime Glow)
            const icoGeo = new THREE.IcosahedronGeometry(1.9, 0);
            const icoMat = new THREE.MeshStandardMaterial({
                color: 0xd6fb00,
                emissive: 0x223500,
                roughness: 0.25,
                metalness: 0.65,
                flatShading: true
            });
            const ico = new THREE.Mesh(icoGeo, icoMat);
            ico.position.set(-5.5, -2.2, 0.5);
            group.add(ico);

            // 3. Mini Floating Satellite Spheres
            const sphereMatLime = new THREE.MeshStandardMaterial({
                color: 0xeaffb6,
                emissive: 0x3d4e00,
                roughness: 0.1,
                metalness: 0.9
            });
            const sphereMatTeal = new THREE.MeshStandardMaterial({
                color: 0x00545f,
                emissive: 0x002228,
                roughness: 0.2,
                metalness: 0.8
            });

            const sphere1 = new THREE.Mesh(new THREE.SphereGeometry(0.75, 24, 24), sphereMatLime);
            sphere1.position.set(-3.8, 3.2, 1.2);
            group.add(sphere1);

            const sphere2 = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 20), sphereMatTeal);
            sphere2.position.set(6.2, -3.5, 0.8);
            group.add(sphere2);

            // Lights
            const keyLight = new THREE.DirectionalLight(0xd6fb00, 2.5);
            keyLight.position.set(5, 8, 8);
            scene.add(keyLight);

            const rimLight = new THREE.DirectionalLight(0x00545f, 4.0);
            rimLight.position.set(-8, -5, -4);
            scene.add(rimLight);

            const ambientLight = new THREE.AmbientLight(0x03181d, 1.8);
            scene.add(ambientLight);

            const pointLight = new THREE.PointLight(0xeaffb6, 1.5, 30);
            pointLight.position.set(0, 2, 6);
            scene.add(pointLight);

            // Responsive Resize
            const onResize = () => {
                const s = getHeroSize();
                width = s.width;
                height = s.height;
                camera.aspect = width / height;
                if (width <= 680) {
                    camera.position.z = 24;
                    group.scale.set(0.75, 0.75, 0.75);
                } else if (width <= 1024) {
                    camera.position.z = 21;
                    group.scale.set(0.85, 0.85, 0.85);
                } else {
                    camera.position.z = 18;
                    group.scale.set(1, 1, 1);
                }
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            };
            onResize();
            window.addEventListener('resize', onResize, { passive: true });

            // Interactive Mouse Parallax (Lerp)
            let mouseX = 0, mouseY = 0;
            let targetX = 0, targetY = 0;

            if (fine) {
                window.addEventListener('mousemove', (e) => {
                    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
                    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
                }, { passive: true });
            }

            // Render loop with clock & visibility pause
            const clock = new THREE.Clock();
            let animId = null;
            let isVisible = true;

            const render = () => {
                if (!isVisible) return;
                const elapsed = clock.getElapsedTime();

                // Continuous 3D rotation & bobbing
                torus.rotation.x = elapsed * 0.35;
                torus.rotation.y = elapsed * 0.45;
                wireRing.rotation.x = -elapsed * 0.25;
                wireRing.rotation.y = elapsed * 0.38;

                ico.rotation.x = -elapsed * 0.4;
                ico.rotation.y = elapsed * 0.5;
                ico.rotation.z = elapsed * 0.2;

                // Subtle orbital floating
                torus.position.y = 1.2 + Math.sin(elapsed * 1.2) * 0.45;
                wireRing.position.y = torus.position.y;
                ico.position.y = -2.2 + Math.cos(elapsed * 1.1) * 0.55;
                sphere1.position.y = 3.2 + Math.sin(elapsed * 1.5) * 0.35;
                sphere2.position.y = -3.5 + Math.cos(elapsed * 1.4) * 0.35;

                // Smooth Parallax Lerp
                mouseX += (targetX - mouseX) * 0.04;
                mouseY += (targetY - mouseY) * 0.04;

                group.rotation.y = mouseX * 0.35 + Math.sin(elapsed * 0.2) * 0.1;
                group.rotation.x = -mouseY * 0.25 + Math.cos(elapsed * 0.2) * 0.08;

                renderer.render(scene, camera);
                animId = requestAnimationFrame(render);
            };

            render();

            // Lifecycle / Battery saving
            document.addEventListener('visibilitychange', () => {
                isVisible = !document.hidden;
                if (isVisible) {
                    clock.start();
                    render();
                } else if (animId) {
                    cancelAnimationFrame(animId);
                }
            });
        })();

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

        /* ---------- Gallery filter + lightbox with Film Dissolve ---------- */
        (() => {
            const grid = $('#gfx-grid');
            if (!grid) return;
            const cards = $$('.gfx-card', grid);
            const filters = $$('.gfx-filter');
            filters.forEach((btn) => btn.addEventListener('click', () => {
                filters.forEach((b) => b.classList.remove('is-active'));
                btn.classList.add('is-active');
                const f = btn.dataset.filter;
                cards.forEach((card) => {
                    const match = f === 'all' || card.dataset.cat === f;
                    if (reduce) { card.classList.toggle('is-hidden', !match); return; }
                    card.classList.add('fade');
                    setTimeout(() => {
                        card.classList.toggle('is-hidden', !match);
                        requestAnimationFrame(() => card.classList.remove('fade'));
                    }, 180);
                });
                if (window.ScrollTrigger) setTimeout(() => window.ScrollTrigger.refresh(), 280);
            }));

            const dlg = $('#lightbox'), img = $('#lightbox-img'), cap = $('#lightbox-cap');
            if (!dlg || !dlg.showModal) return;
            let idx = 0, list = [];
            const show = (i) => {
                list = cards.filter((c) => !c.classList.contains('is-hidden'));
                idx = (i + list.length) % list.length;
                const c = list[idx];
                img.src = $('img', c).getAttribute('src');
                img.alt = $('figcaption', c).textContent;
                cap.textContent = $('figcaption', c).textContent;
            };
            cards.forEach((c) => c.addEventListener('click', () => {
                show(cards.filter((x) => !x.classList.contains('is-hidden')).indexOf(c));
                dlg.showModal();
                if (window.gsap) {
                    gsap.fromTo(img, { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' });
                }
            }));
            $('#lightbox-close').addEventListener('click', () => dlg.close());
            $('#lightbox-prev').addEventListener('click', () => show(idx - 1));
            $('#lightbox-next').addEventListener('click', () => show(idx + 1));
            dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
            dlg.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') show(idx - 1);
                if (e.key === 'ArrowRight') show(idx + 1);
            });
        })();

        /* ---------- Contact form ---------- */
        (() => {
            const form = $('#contact-form'), ok = $('#form-success'), rd = $('#form-redirect');
            if (!form || !ok) return;
            if (rd) rd.value = location.href;
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = $('button[type="submit"]', form);
                if (btn) { btn.disabled = true; btn.textContent = 'A enviar...'; }
                try {
                    const r = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
                    if (!r.ok) throw 0;
                    form.querySelectorAll('.form-row, .form-group, button[type="submit"]').forEach((n) => n.hidden = true);
                    ok.hidden = false;
                } catch (_) {
                    alert('Falha no envio. Tenta novamente ou fala pelo WhatsApp.');
                    if (btn) { btn.disabled = false; btn.textContent = 'Enviar mensagem'; }
                }
            });
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

        /* 1. HERO 3D INTRO MONTAGE & DYNAMIC CAMERA PASS */
        (() => {
            const browserMock = $('.hero-stage .mock-browser');
            const phoneMock = $('.hero-stage .mock-phone');
            const browserFloat = $('.hero-float-browser');
            const phoneFloat = $('.hero-float-phone');

            // Immediate intro sequence with 3D sweep (renders instantly, no blank delay)
            if (browserMock) {
                gsap.from(browserMock, {
                    y: 32,
                    scale: 0.96,
                    rotateX: 6,
                    duration: 0.65,
                    ease: 'power3.out'
                });
                if (fine && window.innerWidth > 680) {
                    gsap.to(browserMock, {
                        y: -10,
                        duration: 3.8,
                        repeat: -1,
                        yoyo: true,
                        ease: 'sine.inOut',
                        delay: 0.7
                    });
                }
            }
            if (phoneMock) {
                gsap.from(phoneMock, {
                    y: 45,
                    x: 20,
                    scale: 0.9,
                    rotateZ: 3,
                    duration: 0.75,
                    ease: 'back.out(1.2)'
                });
                if (fine && window.innerWidth > 680) {
                    gsap.to(phoneMock, {
                        y: -14,
                        duration: 4.4,
                        repeat: -1,
                        yoyo: true,
                        ease: 'sine.inOut',
                        delay: 0.8
                    });
                }
            }

            // On scroll: subtle depth parallax pass (desktop only)
            if (phoneFloat && browserFloat && window.innerWidth > 680) {
                gsap.to(phoneFloat, {
                    yPercent: -14,
                    xPercent: -3,
                    rotateZ: -2,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '#hero',
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 0.6
                    }
                });
                gsap.to(browserFloat, {
                    yPercent: 6,
                    scale: 0.98,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '#hero',
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 0.6
                    }
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
                    opacity: 0.25,
                    duration: 0.65,
                    ease: 'power2.out',
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
                duration: 0.75,
                ease: 'power3.out',
                stagger: 0.035
            });
        }

        const secHeadlines = $$('.split-head h2, .statement-text h2, .about-text h2, .cta h2, .contact-intro h2');
        secHeadlines.forEach((el) => {
            gsap.from(el, {
                y: 22,
                opacity: 0.2,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    once: true
                }
            });
        });

        const headlines = h1 ? [h1, ...secHeadlines] : secHeadlines;

        /* 7. FADE & STAGGER ELEMENTS (Fast, snappy, zero blank lag) */
        $$('[data-anim="fade"]').forEach((el) => {
            gsap.from(el, {
                y: 22,
                opacity: 0.35,
                duration: 0.65,
                ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 92%', once: true }
            });
        });

        $$('[data-anim="stagger"]').forEach((el) => {
            const children = Array.from(el.children).filter(c => !headlines.includes(c) && !c.classList.contains('work-card'));
            if (children.length) {
                gsap.from(children, {
                    y: 18,
                    opacity: 0.35,
                    duration: 0.6,
                    ease: 'power2.out',
                    stagger: 0.05,
                    scrollTrigger: { trigger: el, start: 'top 90%', once: true }
                });
            }
        });

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

        /* 9. SHOWCASE (pinned with smooth cross-fade - Desktop Only) */
        (() => {
            const steps = $$('.showcase-step');
            const media = $('#showcase-img');
            const barFill = $('#showcase-bar');
            if (!steps.length || !media || window.innerWidth <= 1024) return;

            // Preload images
            steps.forEach(s => {
                if (s.dataset.img) {
                    const preload = new Image();
                    preload.src = s.dataset.img;
                }
            });

            let active = -1;
            const activate = (i) => {
                if (i === active || !steps[i]) return;
                active = i;
                steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
                if (barFill) barFill.style.width = (((i + 1) / steps.length) * 100) + '%';
                const src = steps[i].dataset.img;
                if (src && !media.src.endsWith(src)) {
                    gsap.to(media, {
                        opacity: 0.2,
                        duration: 0.2,
                        ease: 'power1.out',
                        onComplete: () => {
                            media.src = src;
                            gsap.to(media, {
                                opacity: 1,
                                duration: 0.35,
                                ease: 'power2.out'
                            });
                        }
                    });
                }
            };

            steps.forEach((s, i) => {
                ScrollTrigger.create({
                    trigger: s,
                    start: 'top 65%',
                    end: 'bottom 65%',
                    onEnter: () => activate(i),
                    onEnterBack: () => activate(i)
                });
            });
            activate(0);
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
                if (parseFloat(getComputedStyle(el).opacity) === 0) gsap.set(el, { opacity: 1, y: 0 });
                if (el.dataset.anim === 'stagger') {
                    Array.from(el.children).forEach((c) => {
                        if (parseFloat(getComputedStyle(c).opacity) === 0) gsap.set(c, { opacity: 1, y: 0 });
                    });
                }
            });
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
