/**
 * LUCAS DESIGN - PREMIUM PORTFOLIO INTERACTION ENGINE
 * Sticky Navbar, Active Navigation Highlighting, Mobile Drawer & Contact Form Submits
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. Sticky Header Transform on Scroll
    // ==========================================================================
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
    });

    // ==========================================================================
    // 2. Active Section Highlighting on Nav Links
    // ==========================================================================
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        let currentSection = '';
        const scrollPosition = window.scrollY + 120; // offset header height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                currentSection = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSection}`) {
                item.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // 3. Mobile Navigation Drawer Toggle
    // ==========================================================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && mobileDrawer) {
        // Toggle menu drawer
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileDrawer.classList.toggle('active');
            // Change menu icon to close cross state
            const iconSvg = mobileMenuBtn.querySelector('svg');
            if (mobileDrawer.classList.contains('active')) {
                iconSvg.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
            } else {
                iconSvg.innerHTML = '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
            }
        });

        // Close drawer clicking anywhere else
        document.addEventListener('click', (e) => {
            if (!mobileDrawer.contains(e.target) && e.target !== mobileMenuBtn) {
                mobileDrawer.classList.remove('active');
                const iconSvg = mobileMenuBtn.querySelector('svg');
                iconSvg.innerHTML = '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
            }
        });

        // Close drawer clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileDrawer.classList.remove('active');
                const iconSvg = mobileMenuBtn.querySelector('svg');
                iconSvg.innerHTML = '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
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
    // 5. Mobile Slider Dots Synchronization (CSS Snap Scroll)
    // ==========================================================================
    const projectsSlider = document.getElementById('projects-slider');
    const dotButtons = document.querySelectorAll('.dot-btn');

    if (projectsSlider && dotButtons.length > 0) {
        // Detect current slide on scroll
        projectsSlider.addEventListener('scroll', () => {
            const width = projectsSlider.offsetWidth;
            const scrollLeft = projectsSlider.scrollLeft;
            const activeIndex = Math.round(scrollLeft / width);

            dotButtons.forEach((dot, idx) => {
                if (idx === activeIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        });

        // Click dots to scroll to slide
        dotButtons.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                const width = projectsSlider.offsetWidth;
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
    // 7. Interactive Mouse Glow Tracker for Cards
    // ==========================================================================
    const hoverCards = document.querySelectorAll('.project-card, .why-card');
    
    hoverCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ==========================================================================
    // 8. Dynamic Header Word Alternator (Typing Effect)
    // ==========================================================================
    const switchWords = ["Realtors", "Clinics", "Contractors", "Local Businesses"];
    const textTarget = document.getElementById('dynamic-word');
    
    if (textTarget) {
        let index = 0;
        setInterval(() => {
            // Fade out
            textTarget.style.opacity = '0';
            textTarget.style.transform = 'translateY(-8px)';
            
            setTimeout(() => {
                // Change text & fade in
                index = (index + 1) % switchWords.length;
                textTarget.textContent = switchWords[index];
                textTarget.style.opacity = '1';
                textTarget.style.transform = 'translateY(0)';
            }, 300);
        }, 3600); // changes every 3.6s
    }
});
