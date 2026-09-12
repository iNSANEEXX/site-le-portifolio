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

            // ==========================================================
            // THEMATIC 3D HERO OBJECTS:
            // 1. Chart / Growth & Conversão (Right)
            // 2. Hourglass / Tempo & Velocidade (Left Bottom)
            // 3. Design Layers & Curva Bézier (Left Top)
            // ==========================================================

            // --- 1. GRÁFICO 3D (Crescimento, Métricas, Alta Conversão) ---
            const chartGroup = new THREE.Group();
            const baseX_chart = 9.2;
            const baseY_chart = 0.3;
            chartGroup.position.set(baseX_chart, baseY_chart, -0.6);
            chartGroup.rotation.set(0.2, -0.45, 0.05);

            // Base chanfrada
            const chartBase = new THREE.Mesh(
                new THREE.BoxGeometry(3.6, 0.22, 1.8),
                new THREE.MeshStandardMaterial({ color: 0x031c22, roughness: 0.2, metalness: 0.85 })
            );
            chartGroup.add(chartBase);

            // 4 Barras de crescimento ascendente
            const barHeights = [1.2, 2.1, 3.2, 4.6];
            const barXs = [-1.2, -0.4, 0.4, 1.2];
            const barMat = new THREE.MeshStandardMaterial({
                color: 0x00404a,
                emissive: 0x00181d,
                roughness: 0.15,
                metalness: 0.9
            });
            const capMat = new THREE.MeshStandardMaterial({
                color: 0xd6fb00,
                emissive: 0x3d4e00,
                roughness: 0.2,
                metalness: 0.3
            });

            for (let i = 0; i < 4; i++) {
                const h = barHeights[i];
                const bar = new THREE.Mesh(new THREE.BoxGeometry(0.58, h, 0.58), barMat);
                bar.position.set(barXs[i], h / 2 + 0.11, 0);
                chartGroup.add(bar);

                const cap = new THREE.Mesh(new THREE.BoxGeometry(0.60, 0.12, 0.60), capMat);
                cap.position.set(barXs[i], h + 0.17, 0);
                chartGroup.add(cap);
            }

            // Curva ascendente de conversão / fita de alta performance
            const curve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(-1.2, 1.3, 0.38),
                new THREE.Vector3(-0.4, 2.2, 0.40),
                new THREE.Vector3(0.4, 3.3, 0.42),
                new THREE.Vector3(1.2, 4.7, 0.45),
                new THREE.Vector3(1.55, 5.15, 0.48)
            ]);
            const tube = new THREE.Mesh(
                new THREE.TubeGeometry(curve, 32, 0.07, 10, false),
                new THREE.MeshBasicMaterial({ color: 0xd6fb00 })
            );
            chartGroup.add(tube);

            // Seta e orb de pico no topo do gráfico
            const arrow = new THREE.Mesh(
                new THREE.ConeGeometry(0.24, 0.45, 16),
                new THREE.MeshBasicMaterial({ color: 0xd6fb00 })
            );
            arrow.position.set(1.55, 5.15, 0.48);
            arrow.rotation.z = -0.45;
            chartGroup.add(arrow);

            const targetPulse = new THREE.Mesh(
                new THREE.SphereGeometry(0.22, 20, 20),
                new THREE.MeshBasicMaterial({ color: 0xeaffb6 })
            );
            targetPulse.position.set(1.2, 4.85, 0.45);
            chartGroup.add(targetPulse);

            group.add(chartGroup);

            // --- 2. AMPULHETA 3D (Tempo, Agilidade, Entrega Rápida) ---
            const hgGroup = new THREE.Group();
            const baseX_hg = -9.2;
            const baseY_hg = -1.8;
            hgGroup.position.set(baseX_hg, baseY_hg, 0.5);
            hgGroup.rotation.set(0.18, 0.35, 0.22);

            const capMetal = new THREE.MeshStandardMaterial({
                color: 0x00545f,
                metalness: 0.9,
                roughness: 0.2
            });
            const glassMat = new THREE.MeshStandardMaterial({
                color: 0x00545f,
                roughness: 0.1,
                metalness: 0.85,
                transparent: true,
                opacity: 0.42
            });

            // Tampas superior e inferior
            const capTop = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.18, 32), capMetal);
            capTop.position.y = 1.9;
            hgGroup.add(capTop);

            const capBottom = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.18, 32), capMetal);
            capBottom.position.y = -1.9;
            hgGroup.add(capBottom);

            // Bulbos de vidro cônico
            const coneTop = new THREE.Mesh(new THREE.ConeGeometry(1.35, 1.8, 28, 1, true), glassMat);
            coneTop.rotation.x = Math.PI;
            coneTop.position.y = 0.9;
            hgGroup.add(coneTop);

            const coneBottom = new THREE.Mesh(new THREE.ConeGeometry(1.35, 1.8, 28, 1, true), glassMat);
            coneBottom.position.y = -0.9;
            hgGroup.add(coneBottom);

            // Anel central Acid Lime
            const centerRing = new THREE.Mesh(
                new THREE.TorusGeometry(0.38, 0.09, 16, 32),
                new THREE.MeshBasicMaterial({ color: 0xd6fb00 })
            );
            centerRing.rotation.x = Math.PI / 2;
            hgGroup.add(centerRing);

            // Struts / Colunas laterais
            for (let i = 0; i < 3; i++) {
                const angle = (i * 2 * Math.PI) / 3;
                const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 3.8, 12), capMetal);
                strut.position.set(Math.cos(angle) * 1.25, 0, Math.sin(angle) * 1.25);
                hgGroup.add(strut);
            }

            // Partículas de areia/luz (fluxo contínuo de tempo)
            const sandParticles = [];
            for (let i = 0; i < 6; i++) {
                const p = new THREE.Mesh(
                    new THREE.SphereGeometry(0.07, 10, 10),
                    new THREE.MeshBasicMaterial({ color: 0xd6fb00 })
                );
                p.position.set((Math.random() - 0.5) * 0.25, 1.0 - i * 0.45, (Math.random() - 0.5) * 0.25);
                hgGroup.add(p);
                sandParticles.push(p);
            }

            group.add(hgGroup);

            // --- 3. DESIGN 3D (Camadas UI & Curva Bézier / Pen Tool) ---
            const designGroup = new THREE.Group();
            const baseX_design = -8.8;
            const baseY_design = 2.8;
            designGroup.position.set(baseX_design, baseY_design, 0.5);
            designGroup.rotation.set(0.32, -0.45, -0.08);

            // Camadas / Artboards UI escalonados
            const l1 = new THREE.Mesh(
                new THREE.BoxGeometry(3.0, 2.0, 0.05),
                new THREE.MeshStandardMaterial({ color: 0x021f26, transparent: true, opacity: 0.5, metalness: 0.8 })
            );
            designGroup.add(l1);

            const l2 = new THREE.Mesh(
                new THREE.BoxGeometry(2.6, 1.7, 0.05),
                new THREE.MeshStandardMaterial({ color: 0x00333c, transparent: true, opacity: 0.65, metalness: 0.85 })
            );
            l2.position.set(0.25, 0.25, 0.35);
            designGroup.add(l2);

            const l3 = new THREE.Mesh(
                new THREE.BoxGeometry(2.2, 1.4, 0.05),
                new THREE.MeshStandardMaterial({ color: 0x00404a, metalness: 0.9, roughness: 0.15 })
            );
            l3.position.set(0.5, 0.5, 0.7);
            designGroup.add(l3);

            // Ferramenta Pen Tool / Nó de Âncora Vetorial com Alças Bézier
            const anchorNode = new THREE.Mesh(
                new THREE.OctahedronGeometry(0.28, 0),
                new THREE.MeshStandardMaterial({ color: 0xd6fb00, emissive: 0x445500, metalness: 0.4, roughness: 0.2 })
            );
            anchorNode.position.set(0.5, 0.5, 0.8);
            designGroup.add(anchorNode);

            // Haste Bézier esquerda e direita
            const handle1 = new THREE.Mesh(
                new THREE.CylinderGeometry(0.025, 0.025, 1.2, 12),
                new THREE.MeshBasicMaterial({ color: 0xd6fb00 })
            );
            handle1.position.set(0.5 + 0.42, 0.5 + 0.42, 0.8);
            handle1.rotation.z = Math.PI / 4;
            designGroup.add(handle1);

            const dot1 = new THREE.Mesh(
                new THREE.SphereGeometry(0.09, 12, 12),
                new THREE.MeshBasicMaterial({ color: 0xeaffb6 })
            );
            dot1.position.set(0.5 + 0.85, 0.5 + 0.85, 0.8);
            designGroup.add(dot1);

            const handle2 = new THREE.Mesh(
                new THREE.CylinderGeometry(0.025, 0.025, 1.2, 12),
                new THREE.MeshBasicMaterial({ color: 0xd6fb00 })
            );
            handle2.position.set(0.5 - 0.42, 0.5 - 0.42, 0.8);
            handle2.rotation.z = Math.PI / 4;
            designGroup.add(handle2);

            const dot2 = new THREE.Mesh(
                new THREE.SphereGeometry(0.09, 12, 12),
                new THREE.MeshBasicMaterial({ color: 0xeaffb6 })
            );
            dot2.position.set(0.5 - 0.85, 0.5 - 0.85, 0.8);
            designGroup.add(dot2);

            group.add(designGroup);

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
                    group.scale.set(0.62, 0.62, 0.62);
                    chartGroup.position.set(6.8, -3.2, 0);
                    designGroup.position.set(-6.8, 3.2, 0);
                    hgGroup.position.set(-6.8, -3.2, 0);
                } else if (width <= 1100) {
                    camera.position.z = 21;
                    group.scale.set(0.78, 0.78, 0.78);
                    chartGroup.position.set(8.2, baseY_chart, -0.6);
                    designGroup.position.set(-8.0, baseY_design, 0.5);
                    hgGroup.position.set(-8.2, baseY_hg, 0.5);
                } else {
                    camera.position.z = 18;
                    group.scale.set(1, 1, 1);
                    chartGroup.position.set(baseX_chart, baseY_chart, -0.6);
                    designGroup.position.set(baseX_design, baseY_design, 0.5);
                    hgGroup.position.set(baseX_hg, baseY_hg, 0.5);
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

                // 1. Gráfico: rotação sutil e bobbing de flutuação
                chartGroup.rotation.y = -0.45 + Math.sin(elapsed * 0.7) * 0.12;
                chartGroup.position.y = baseY_chart + Math.sin(elapsed * 1.1) * 0.32;
                const pulse = 1 + Math.sin(elapsed * 3.5) * 0.18;
                targetPulse.scale.set(pulse, pulse, pulse);

                // 2. Ampulheta: rotação suave, flutuação e fluxo contínuo de areia
                hgGroup.position.y = baseY_hg + Math.cos(elapsed * 1.0) * 0.3;
                hgGroup.rotation.y = 0.35 + Math.sin(elapsed * 0.5) * 0.1;
                for (let i = 0; i < sandParticles.length; i++) {
                    const sp = sandParticles[i];
                    sp.position.y -= 0.035;
                    if (sp.position.y < -1.4) {
                        sp.position.y = 1.2;
                    }
                }

                // 3. Design: flutuação suave e rotação em órbita de vetor
                designGroup.position.y = baseY_design + Math.sin(elapsed * 0.9) * 0.3;
                designGroup.rotation.y = -0.45 + Math.cos(elapsed * 0.6) * 0.12;

                // Smooth Parallax Lerp (subtle)
                mouseX += (targetX - mouseX) * 0.035;
                mouseY += (targetY - mouseY) * 0.035;

                group.rotation.y = mouseX * 0.22 + Math.sin(elapsed * 0.2) * 0.06;
                group.rotation.x = -mouseY * 0.18 + Math.cos(elapsed * 0.2) * 0.05;

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

        /* 1. HERO HIGHLIGHTS & AMBIENT MOTION */
        (() => {
            const pills = $$('.hero-pill');
            if (pills && pills.length) {
                gsap.from(pills, {
                    y: 18,
                    opacity: 0,
                    stagger: 0.12,
                    duration: 0.7,
                    delay: 0.35,
                    ease: 'power3.out'
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
