/**
 * GQ Pools - Professional Pool Services
 * Main JavaScript File
 * Developed by Christian Herencia
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // Language Switcher
    // ===================================
    const langButtons = document.querySelectorAll('.lang-btn');
    let currentLang = 'en';
    
    function switchLanguage(lang) {
        currentLang = lang;
        
        // Update active state on buttons
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
        
        // Update all translatable elements
        document.querySelectorAll('[data-en]').forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                // Check if element has child elements that shouldn't be overwritten
                if (element.children.length === 0) {
                    element.textContent = text;
                } else {
                    // For elements with children, find text nodes
                    const textNode = Array.from(element.childNodes).find(
                        node => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
                    );
                    if (textNode) {
                        textNode.textContent = text;
                    }
                }
            }
        });
        
        // Update meta tags
        updateMetaTags(lang);
        
        // Save preference
        localStorage.setItem('gqpools_lang', lang);
    }
    
    function updateMetaTags(lang) {
        const title = document.querySelector('title');
        if (title) {
            title.textContent = title.getAttribute(`data-${lang}`) || title.textContent;
        }
        
        const description = document.querySelector('meta[name="description"]');
        if (description) {
            description.setAttribute('content', description.getAttribute(`data-${lang}-content`) || description.getAttribute('content'));
        }
        
        const keywords = document.querySelector('meta[name="keywords"]');
        if (keywords) {
            keywords.setAttribute('content', keywords.getAttribute(`data-${lang}-content`) || keywords.getAttribute('content'));
        }
    }
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            switchLanguage(btn.dataset.lang);
        });
    });
    
    // Load saved language preference
    const savedLang = localStorage.getItem('gqpools_lang') || 'en';
    switchLanguage(savedLang);
    
    // ===================================
    // Mobile Menu Toggle
    // ===================================
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // ===================================
    // Navbar Scroll Effect
    // ===================================
    const navbar = document.getElementById('navbar');
    
    function handleNavbarScroll() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // Check on load
    
    // ===================================
    // Active Navigation Link on Scroll
    // ===================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNavLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    
    // ===================================
    // Carousel / Slideshow
    // ===================================
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    let slideInterval;
    
    function showSlide(index) {
        // Handle wrap-around
        if (index >= carouselSlides.length) {
            index = 0;
        } else if (index < 0) {
            index = carouselSlides.length - 1;
        }
        
        // Remove active class from all slides and indicators
        carouselSlides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current slide and indicator
        carouselSlides[index].classList.add('active');
        indicators[index].classList.add('active');
        
        currentSlide = index;
    }
    
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }
    
    function stopAutoSlide() {
        clearInterval(slideInterval);
    }
    
    // Event listeners for carousel controls
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }
    
    // Event listeners for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            stopAutoSlide();
            startAutoSlide();
        });
    });
    
    // Touch support for carousel
    let touchStartX = 0;
    let touchEndX = 0;
    const carouselContainer = document.querySelector('.carousel-container');
    
    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carouselContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
    
    function handleSwipe() {
        if (touchStartX - touchEndX > 50) {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        } else if (touchEndX - touchStartX > 50) {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        }
    }
    
    // Start auto slide
    startAutoSlide();
    
    // Pause on hover
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoSlide);
        carouselContainer.addEventListener('mouseleave', startAutoSlide);
    }
    
    // ===================================
    // Scroll to Top Button
    // ===================================
    const scrollTopBtn = document.getElementById('scrollTop');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ===================================
    // Portfolio Modal
    // ===================================
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modal = document.getElementById('portfolioModal');
    const modalImage = document.getElementById('modalImage');
    const modalClose = document.getElementById('modalClose');
    const prevModal = document.getElementById('prevModal');
    const nextModal = document.getElementById('nextModal');
    let currentModalIndex = 0;
    
    function openModal(index) {
        currentModalIndex = index;
        const img = portfolioItems[index].querySelector('img');
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function showPrevImage() {
        currentModalIndex = (currentModalIndex - 1 + portfolioItems.length) % portfolioItems.length;
        const img = portfolioItems[currentModalIndex].querySelector('img');
        modalImage.src = img.src;
        modalImage.alt = img.alt;
    }
    
    function showNextImage() {
        currentModalIndex = (currentModalIndex + 1) % portfolioItems.length;
        const img = portfolioItems[currentModalIndex].querySelector('img');
        modalImage.src = img.src;
        modalImage.alt = img.alt;
    }
    
    // Open modal on portfolio item click
    portfolioItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openModal(index);
        });
    });
    
    // Close modal
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Close modal on background click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Modal navigation
    if (prevModal) {
        prevModal.addEventListener('click', showPrevImage);
    }
    
    if (nextModal) {
        nextModal.addEventListener('click', showNextImage);
    }
    
    // Keyboard navigation for modal
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    });
    
    // ===================================
    // Smooth Scroll for Anchor Links
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (href === '#' || href === '') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===================================
    // Intersection Observer for Animations
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .testimonial-card, .portfolio-item, .feature');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // ===================================
    // Lazy Loading for Images
    // ===================================
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
    
    // ===================================
    // Parallax Effect for Hero Section
    // ===================================
    const heroSlides = document.querySelectorAll('.carousel-slide');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = document.querySelector('.hero')?.offsetHeight || 0;
        
        if (scrolled < heroHeight) {
            heroSlides.forEach(slide => {
                slide.style.backgroundPositionY = `${scrolled * 0.5}px`;
            });
        }
    });
    
    // ===================================
    // Contact Form Validation (if needed in future)
    // ===================================
    // Placeholder for future contact form functionality
    
    // ===================================
    // Performance: Debounce Scroll Events
    // ===================================
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // ===================================
    // Initialize Google Maps (if needed)
    // ===================================
    // The map is embedded via iframe for simplicity
    
    // ===================================
    // Console Branding
    // ===================================
    console.log('%c GQ Pools ', 'background: #0077b6; color: white; font-size: 20px; font-weight: bold; padding: 10px 20px;');
    console.log('%c Professional Pool Services in Lanoka Harbor, NJ ', 'color: #0077b6; font-size: 14px;');
    console.log('%c Developed by Christian Herencia ', 'color: #6c757d; font-size: 12px;');
    
    // ===================================
    // Page Load Animation
    // ===================================
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
    
});
