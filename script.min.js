/**
 * LUCAS DESIGN - PREMIUM PORTFOLIO INTERACTION ENGINE
 * Sticky Navbar, Active Navigation Highlighting, Mobile Drawer & Contact Form Submits
 */

document.addEventListener('DOMContentLoaded', () => {

    const isDesktop = window.matchMedia('(pointer: fine)').matches;

    // ==========================================================================
    // 1 & 2. Throttled Sticky Header & Cached Active Nav Link Highlighting
    // ==========================================================================
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item');
    
    let cachedSectionOffsets = [];

    // Cache section dimensions to prevent layout thrashing (forced reflow) on scroll
    const cacheSectionDimensions = () => {
        cachedSectionOffsets = Array.from(sections).map(section => {
            const top = section.offsetTop;
            return {
                id: section.getAttribute('id'),
                top: top,
                bottom: top + section.offsetHeight
            };
        });
    };

    cacheSectionDimensions();
    window.addEventListener('resize', cacheSectionDimensions);

    let scrollPending = false;
    const updateScrollEvents = () => {
        const scrollY = window.scrollY;

        // Sticky header toggle
        if (scrollY > 50) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }

        // Active navigation item highlighting
        let currentSection = '';
        const scrollPosition = scrollY + 120; // offset header height

        for (let i = 0; i < cachedSectionOffsets.length; i++) {
            const sec = cachedSectionOffsets[i];
            if (scrollPosition >= sec.top && scrollPosition < sec.bottom) {
                currentSection = sec.id;
                break;
            }
        }

        navItems.forEach(item => {
            if (item.getAttribute('href') === `#${currentSection}`) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    };

    window.addEventListener('scroll', () => {
        if (!scrollPending) {
            scrollPending = true;
            requestAnimationFrame(() => {
                updateScrollEvents();
                scrollPending = false;
            });
        }
    });

    // ==========================================================================
    // 3. Mobile Navigation Drawer Toggle (Memory Safe Event Listeners)
    // ==========================================================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && mobileDrawer) {
        const closeDrawerOnOutsideClick = (e) => {
            if (!mobileDrawer.contains(e.target) && e.target !== mobileMenuBtn) {
                closeDrawer();
            }
        };

        const openDrawer = () => {
            mobileDrawer.classList.add('active');
            const iconSvg = mobileMenuBtn.querySelector('svg');
            iconSvg.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
            document.addEventListener('click', closeDrawerOnOutsideClick);
        };

        const closeDrawer = () => {
            mobileDrawer.classList.remove('active');
            const iconSvg = mobileMenuBtn.querySelector('svg');
            iconSvg.innerHTML = '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
            document.removeEventListener('click', closeDrawerOnOutsideClick);
        };

        // Toggle menu drawer
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (mobileDrawer.classList.contains('active')) {
                closeDrawer();
            } else {
                openDrawer();
            }
        });

        // Close drawer clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeDrawer();
            });
        });
    }

    // ==========================================================================
    // 4. Contact Form Async Submission (Web3Forms API Integration)
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formSuccessMessage = document.getElementById('form-success');
    const formRedirect = document.getElementById('form-redirect');

    if (contactForm && formSuccessMessage) {
        // Set clean self-redirect parameter before post
        if (formRedirect) {
            formRedirect.value = window.location.href;
        }

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    contactForm.style.display = 'none';
                    formSuccessMessage.style.display = 'block';
                    formSuccessMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    contactForm.reset();
                } else {
                    alert('Submission failed. Please check connection and try again.');
                }
            } catch (error) {
                console.error('Submission Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }

    // ==========================================================================
    // 5. Mobile Slider Dots Synchronization (CSS Snap Scroll - Optimized Layout Reads)
    // ==========================================================================
    const projectsSlider = document.getElementById('projects-slider');
    const dotButtons = document.querySelectorAll('.dot-btn');

    if (projectsSlider && dotButtons.length > 0) {
        let scrollPending = false;
        let cachedWidth = projectsSlider.offsetWidth;

        window.addEventListener('resize', () => {
            cachedWidth = projectsSlider.offsetWidth;
        });

        // Detect current slide on scroll
        projectsSlider.addEventListener('scroll', () => {
            if (!scrollPending) {
                scrollPending = true;
                requestAnimationFrame(() => {
                    const scrollLeft = projectsSlider.scrollLeft;
                    const activeIndex = Math.round(scrollLeft / (cachedWidth || 1));

                    dotButtons.forEach((dot, idx) => {
                        if (idx === activeIndex) {
                            dot.classList.add('active');
                        } else {
                            dot.classList.remove('active');
                        }
                    });
                    scrollPending = false;
                });
            }
        });

        // Click dots to scroll to slide
        dotButtons.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                const width = cachedWidth || projectsSlider.offsetWidth;
                projectsSlider.scrollTo({
                    left: width * idx,
                    behavior: 'smooth'
                });
            });
        });
    }

    // ==========================================================================
    // 6. Fade-in Scroll Animations (Intersection Observer)
    // ==========================================================================
    const animatedSections = document.querySelectorAll('section:not(#inicio)');
    
    animatedSections.forEach(section => {
        section.classList.add('fade-in-scroll');
    });

    const scrollObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, scrollObserverOptions);

    animatedSections.forEach(section => {
        scrollObserver.observe(section);
    });



    // ==========================================================================
    // 8. Dynamic Header Word Alternator (Typing Effect)
    // ==========================================================================
    const switchWords = ["Realtors", "Clinics", "Contractors", "Local Businesses"];
    const textTarget = document.getElementById('dynamic-word');
    
    if (textTarget) {
        let index = 0;
        setInterval(() => {
            textTarget.classList.add('fade-out');
            
            setTimeout(() => {
                index = (index + 1) % switchWords.length;
                textTarget.textContent = switchWords[index];
                textTarget.classList.remove('fade-out');
                textTarget.classList.add('fade-in');
                
                // Force reflow
                textTarget.offsetWidth;
                
                textTarget.classList.remove('fade-in');
            }, 350);
        }, 3800);
    }

    // ==========================================================================
    // 9. Count Up Animation for Highlights
    // ==========================================================================
    const highlightNums = document.querySelectorAll('.hh-num');
    
    if (highlightNums.length > 0) {
        const countUpObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetEl = entry.target;
                    const text = targetEl.textContent.trim();
                    const numericMatch = text.match(/\d+/);
                    
                    if (numericMatch) {
                        const targetVal = parseInt(numericMatch[0]);
                        const suffix = text.replace(numericMatch[0], '');
                        let startVal = 0;
                        const duration = 1500; // 1.5s
                        const startTime = performance.now();
                        
                        function updateCount(currentTime) {
                            const elapsed = currentTime - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            
                            // Quadratic ease out
                            const easeProgress = progress * (2 - progress);
                            const currentVal = Math.round(easeProgress * targetVal);
                            
                            targetEl.textContent = currentVal + suffix;
                            
                            if (progress < 1) {
                                requestAnimationFrame(updateCount);
                             }
                        }
                        
                        requestAnimationFrame(updateCount);
                        observer.unobserve(targetEl);
                    }
                }
            });
        }, { threshold: 0.5 });
        
        highlightNums.forEach(num => {
            countUpObserver.observe(num);
        });
    }

    // ==========================================================================
    // 10. Premium Custom Cursor Engine (Lerp, Consolidated Loop & Idle Sleep) - GPU Optimized - PC Only
    // ==========================================================================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;
    let cursorActive = false;
    let cursorAnimating = false;

    if (isDesktop && cursorDot && cursorOutline) {
        const updateCursor = () => {
            if (!cursorActive) {
                cursorAnimating = false;
                return;
            }

            // Position the dot
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

            // Position outline with lag interpolation (lerp)
            const ease = 0.15;
            const dx = mouseX - outlineX;
            const dy = mouseY - outlineY;
            outlineX += dx * ease;
            outlineY += dy * ease;
            cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;

            // If outline has not fully caught up, keep animating. Otherwise, pause loop to save CPU cycles.
            if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
                requestAnimationFrame(updateCursor);
            } else {
                cursorAnimating = false;
                outlineX = mouseX;
                outlineY = mouseY;
            }
        };

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!cursorActive) {
                document.body.classList.add('custom-cursor-active');
                cursorDot.style.opacity = '1';
                cursorOutline.style.opacity = '1';
                cursorActive = true;
            }

            if (!cursorAnimating) {
                cursorAnimating = true;
                requestAnimationFrame(updateCursor);
            }
        });

        // Hover expansions
        const hoverTargets = document.querySelectorAll('a, button, input, select, textarea, .project-card, .why-card, .faq-trigger');
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                cursorDot.classList.add('hover');
                cursorOutline.classList.add('hover');
            });
            target.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('hover');
                cursorOutline.classList.remove('hover');
            });
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            document.body.classList.remove('custom-cursor-active');
            cursorDot.style.opacity = '0';
            cursorOutline.style.opacity = '0';
            cursorActive = false;
            cursorAnimating = false;
        });
    }

    // ==========================================================================
    // 11. Reusable Magnetic Elements Engine (Optimized with Frame Lock & Transitions) - PC Only
    // ==========================================================================
    if (isDesktop) {
        const magneticTargets = document.querySelectorAll('.magnetic-target, .btn-purple, .btn-outline, .floating-cta');
        
        magneticTargets.forEach(target => {
            let rect = null;
            let mouseMovePending = false;
            let currentX = 0;
            let currentY = 0;
    
            target.addEventListener('mouseenter', () => {
                rect = target.getBoundingClientRect();
                target.style.transition = 'none'; // Temporarily disable transitions during raw tracking to prevent fighting
            });
    
            target.addEventListener('mousemove', (e) => {
                currentX = e.clientX;
                currentY = e.clientY;
                
                if (!mouseMovePending) {
                    mouseMovePending = true;
                    requestAnimationFrame(() => {
                        if (rect) {
                            const centerX = rect.left + rect.width / 2;
                            const centerY = rect.top + rect.height / 2;
                            const distanceX = currentX - centerX;
                            const distanceY = currentY - centerY;
                
                            // Pull element 25% of the distance towards the mouse
                            target.style.transform = `translate3d(${distanceX * 0.25}px, ${distanceY * 0.25}px, 0) scale(1.03)`;
                        }
                        mouseMovePending = false;
                    });
                }
            });
    
            target.addEventListener('mouseleave', () => {
                rect = null;
                mouseMovePending = false;
                // Restore transitions for smooth return snapback
                target.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
                target.style.transform = 'translate3d(0, 0, 0) scale(1)';
            });
        });
    }

    // ==========================================================================
    // 12. Speed & Lead ROI Calculator Engine
    // ==========================================================================
    const trafficInput = document.getElementById('traffic-input');
    const speedInput = document.getElementById('speed-input');
    const contractInput = document.getElementById('contract-input');

    const trafficVal = document.getElementById('traffic-val');
    const speedVal = document.getElementById('speed-val');
    const contractVal = document.getElementById('contract-val');

    const leadsLostVal = document.getElementById('leads-lost-val');
    const revenueLostVal = document.getElementById('revenue-lost-val');

    if (trafficInput && speedInput && contractInput) {
        const formatNumber = (num) => {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };

        const calculateROI = () => {
            const traffic = parseInt(trafficInput.value);
            const speed = parseFloat(speedInput.value);
            const contract = parseInt(contractInput.value);

            // Update UI text values
            trafficVal.textContent = formatNumber(traffic);
            speedVal.textContent = `${speed.toFixed(1)}s`;
            contractVal.textContent = `$${formatNumber(contract)}`;

            // Calculation
            // Baseline conversion rate at 1.0s is 2.5%
            // Loss of 7% conversion rate per second above 1.0s
            const baselineRate = 0.025;
            const delay = Math.max(0, speed - 1.0);
            const conversionLossFactor = Math.min(0.9, delay * 0.07);
            
            const fastLeadsMonthly = traffic * baselineRate;
            const actualLeadsMonthly = fastLeadsMonthly * (1 - conversionLossFactor);
            const leadsLostMonthly = fastLeadsMonthly - actualLeadsMonthly;
            
            const yearlyLeadsLost = Math.round(leadsLostMonthly * 12);
            // Assumes a 15% lead-to-client closing rate for local niches
            const closeRate = 0.15;
            const yearlyRevenueLost = Math.round(yearlyLeadsLost * contract * closeRate);

            // Animate counters instead of immediate updates
            animateCounter(leadsLostVal, yearlyLeadsLost);
            animateCounter(revenueLostVal, yearlyRevenueLost, '$');
        };

        const animateCounter = (element, targetValue, prefix = '') => {
            // Cancel any ongoing frame to prevent overlapping rendering loops
            if (element.activeAnimationFrameId) {
                cancelAnimationFrame(element.activeAnimationFrameId);
            }

            const startValue = parseInt(element.textContent.replace(/[^0-9]/g, '')) || 0;
            const duration = 400; // fast animation
            const startTime = performance.now();

            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const currentValue = Math.round(startValue + (targetValue - startValue) * progress);
                
                element.textContent = prefix + formatNumber(currentValue);

                if (progress < 1) {
                    element.activeAnimationFrameId = requestAnimationFrame(update);
                } else {
                    element.activeAnimationFrameId = null;
                }
            };
            element.activeAnimationFrameId = requestAnimationFrame(update);
        };

        trafficInput.addEventListener('input', calculateROI);
        speedInput.addEventListener('input', calculateROI);
        contractInput.addEventListener('input', calculateROI);

        // Initial run
        calculateROI();
    }

    // ==========================================================================
    // 13. Interactive FAQ Accordion Trigger
    // ==========================================================================
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.closest('.faq-item');
            const content = item.querySelector('.faq-content');
            const isActive = item.classList.contains('active');

            // Close all other FAQ items for a clean experience
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-content').style.maxHeight = '0px';
                    otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                content.style.maxHeight = '0px';
                trigger.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('active');
                content.style.maxHeight = `${content.scrollHeight}px`;
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });
});
