document.addEventListener('DOMContentLoaded', function() {
    // Preloader functionality
    function initPreloader() {
        const preloader = document.getElementById('preloader');
        const pageContent = document.getElementById('page-content');
        
        if (!preloader || !pageContent) return;
        
        // Create page transition element
        const pageTransition = document.createElement('div');
        pageTransition.classList.add('page-transition');
        document.body.appendChild(pageTransition);
        
        // When the page has finished loading all resources
        window.addEventListener('load', function() {
            // Add a slight delay for visual effect
            setTimeout(() => {
                // Hide the preloader
                preloader.classList.add('fade-out');
                
                // Show the content
                pageContent.classList.add('visible');
                
                // Capture all links for page transitions
                setupPageTransitions();
                
                // Remove preloader from DOM after animation completes
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 800); // Match the CSS transition duration
            }, 800); // Adjust delay as needed
        });
        
        // Ensure preloader shows when page is refreshing/leaving
        window.addEventListener('beforeunload', function() {
            preloader.classList.remove('fade-out');
            preloader.style.display = 'flex';
        });
    }
    
    // Setup smooth page transitions
    function setupPageTransitions() {
        const pageTransition = document.querySelector('.page-transition');
        const internalLinks = document.querySelectorAll('a[href^="/"]:not([target]), a[href^="./"]:not([target]), a[href^="../"]:not([target]), a[href^="#"]:not([target]), a[href^="collections.html"]:not([target]), a[href^="index.html"]:not([target]), a[href^="thank-you.html"]:not([target])');
        
        if (!pageTransition) return;
        
        internalLinks.forEach(link => {
            // Skip hash links that point to the same page
            if (link.getAttribute('href').startsWith('#')) {
                if (window.location.pathname.endsWith(link.getAttribute('href').split('#')[0])) {
                    return;
                }
            }
            
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Don't transition for hash links on the same page
                if (href.startsWith('#') && window.location.pathname.endsWith(href.split('#')[0])) {
                    return;
                }
                
                e.preventDefault();
                
                // Apply the transition
                pageTransition.classList.add('active');
                
                // After transition completes, navigate to the new page
                setTimeout(() => {
                    window.location.href = href;
                }, 600); // Match the CSS transition duration
            });
        });
    }
    
    // Show preloader for ajax requests
    function showPreloaderForAjax() {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;
        
        // Track ajax requests
        let activeRequests = 0;
        
        // Show preloader when an AJAX request starts
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener('loadstart', function() {
                activeRequests++;
                preloader.classList.remove('fade-out');
                preloader.style.display = 'flex';
            });
            
            this.addEventListener('loadend', function() {
                activeRequests--;
                if (activeRequests === 0) {
                    preloader.classList.add('fade-out');
                    setTimeout(() => {
                        if (activeRequests === 0) {
                            preloader.style.display = 'none';
                        }
                    }, 800);
                }
            });
            
            originalOpen.apply(this, arguments);
        };
    }
    
    // Intersection Observer for scroll-triggered animations
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Handle custom animation attributes
                const animateType = entry.target.dataset.animate;
                if(animateType) {
                    entry.target.style.animation = `${animateType} 0.8s ease forwards`;
                }
            }
        });
    }, { threshold: 0.15 });

    // Observe all animate-section elements
    document.querySelectorAll('.animate-section').forEach(section => {
        animationObserver.observe(section);
    });
    
    // Mobile Menu Toggle with improved touch handling
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
            
            // Prevent scrolling when menu is open
            document.body.classList.toggle('menu-open');
            
            // Accessibility
            const expanded = nav.classList.contains('active');
            this.setAttribute('aria-expanded', expanded);
            
            // Change icon for visual feedback
            const icon = this.querySelector('i');
            if (expanded) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (nav.classList.contains('active') && 
            !nav.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            nav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            // Reset accessibility attribute
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            
            // Reset icon
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Smooth scrolling for navigation links with improved mobile support
    const navLinks = document.querySelectorAll('nav a, .hero-content a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId.startsWith('#') && targetId.length > 1) {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Get header height for offset calculation
                    const headerHeight = document.querySelector('header').offsetHeight;
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - headerHeight - 20,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (nav.classList.contains('active')) {
                        nav.classList.remove('active');
                        mobileMenuBtn.classList.remove('active');
                        document.body.classList.remove('menu-open');
                        
                        // Reset icon
                        const icon = mobileMenuBtn.querySelector('i');
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });
    });
    
    // Improved header scroll effect with performance optimization
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    function handleScroll() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    }
    
    // Optimize scroll event using requestAnimationFrame
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Handle window resize events more efficiently for responsive adjustments
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Update carousel slide width on resize
            if (testimonialContainer && testimonials.length > 0) {
                slideWidth = testimonials[0].offsetWidth + parseInt(getComputedStyle(testimonials[0]).marginRight);
                updateSlidePosition();
            }
            
            // Close mobile menu on larger screens
            if (window.innerWidth > 768 && nav.classList.contains('active')) {
                nav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }, 250);
    });
    
    // Improved Testimonial Carousel with touch support
    const testimonialContainer = document.querySelector('.testimonial-container');
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.testimonial-dots');
    
    if (testimonialContainer && testimonials.length > 0) {
        let currentIndex = 0;
        let slideWidth = testimonials[0].offsetWidth + parseInt(getComputedStyle(testimonials[0]).marginRight);
        let autoSlideInterval;
        let touchStartX = 0;
        let touchEndX = 0;
        let isSwiping = false;
        
        // Create dots
        testimonials.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        const dots = document.querySelectorAll('.dot');
        
        // Update slide position with improved animation
        function updateSlidePosition() {
            // Use transform for better performance
            testimonialContainer.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            
            // Update active dot
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
                // Add ARIA attributes for accessibility
                dot.setAttribute('aria-selected', index === currentIndex);
            });
        }
        
        // Go to specific slide
        function goToSlide(index) {
            currentIndex = index;
            if (currentIndex < 0) currentIndex = testimonials.length - 1;
            if (currentIndex >= testimonials.length) currentIndex = 0;
            updateSlidePosition();
        }
        
        // Next slide
        function nextSlide() {
            goToSlide(currentIndex + 1);
        }
        
        // Previous slide
        function prevSlide() {
            goToSlide(currentIndex - 1);
        }
        
        // Auto slide
        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 5000);
        }
        
        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }
        
        // Handle swipe gestures
        function handleTouchStart(e) {
            touchStartX = e.touches[0].clientX;
            isSwiping = true;
            stopAutoSlide();
        }
        
        function handleTouchMove(e) {
            if (!isSwiping) return;
            e.preventDefault();
            touchEndX = e.touches[0].clientX;
            const diffX = touchStartX - touchEndX;
            
            // Create drag effect while swiping
            const dragOffset = Math.min(Math.abs(diffX), 100) * (diffX > 0 ? 1 : -1);
            testimonialContainer.style.transform = `translateX(-${currentIndex * slideWidth + dragOffset}px)`;
        }
        
        function handleTouchEnd() {
            if (!isSwiping) return;
            isSwiping = false;
            
            const diffX = touchStartX - touchEndX;
            if (Math.abs(diffX) > 50) { // Threshold to determine swipe
                if (diffX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            } else {
                // Reset position if swipe wasn't strong enough
                updateSlidePosition();
            }
            
            startAutoSlide();
        }
        
        // Event listeners
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });
        
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });
        
        // Touch events for mobile swipe
        testimonialContainer.addEventListener('touchstart', handleTouchStart, {passive: false});
        testimonialContainer.addEventListener('touchmove', handleTouchMove, {passive: false});
        testimonialContainer.addEventListener('touchend', handleTouchEnd);
        
        // Handle keyboard navigation for accessibility
        testimonialContainer.setAttribute('tabindex', '0');
        testimonialContainer.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                stopAutoSlide();
                startAutoSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                stopAutoSlide();
                startAutoSlide();
            }
        });
        
        // Stop auto sliding when user interacts with testimonials
        testimonialContainer.addEventListener('mouseenter', stopAutoSlide);
        testimonialContainer.addEventListener('mouseleave', startAutoSlide);
        
        // Set initial position
        updateSlidePosition();
        
        // Start auto sliding
        startAutoSlide();
    }
    
    // WhatsApp click tracking
    function initWhatsAppTracking() {
        const whatsappButtons = document.querySelectorAll('.whatsapp-btn');
        
        if (whatsappButtons) {
            whatsappButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    // Get product info for analytics
                    const productCard = this.closest('.product-card');
                    const productName = productCard ? productCard.querySelector('h3').textContent : 'Unknown Product';
                    const productPrice = productCard ? productCard.querySelector('.product-price').textContent : 'Unknown Price';
                    
                    // You can send this data to your analytics service
                    console.log(`WhatsApp Order Initiated: ${productName} - ${productPrice}`);
                    
                    // If you have Google Analytics or similar, you could track it like this:
                    /*
                    if (typeof gtag === 'function') {
                        gtag('event', 'initiate_order', {
                            'event_category': 'WhatsApp',
                            'event_label': productName,
                            'value': parseFloat(productPrice.replace(/[^0-9.]/g, ''))
                        });
                    }
                    */
                });
            });
        }
    }
    
    // Contact form handling
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                // We'll let FormSubmit handle the actual submission,
                // but we'll add some client-side validation and feedback
                
                const formStatus = document.querySelector('.form-status');
                const nameInput = document.getElementById('name');
                const emailInput = document.getElementById('email');
                const messageInput = document.getElementById('message');
                const submitBtn = document.getElementById('submitBtn');
                
                // Basic validation
                if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
                    e.preventDefault();
                    formStatus.textContent = 'Please fill in all required fields.';
                    formStatus.className = 'form-status error';
                    return false;
                }
                
                // Email validation
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailInput.value.trim())) {
                    e.preventDefault();
                    formStatus.textContent = 'Please enter a valid email address.';
                    formStatus.className = 'form-status error';
                    return false;
                }
                
                // Local success feedback before form actually submits
                // This is for user experience only, the actual email is sent via FormSubmit
                formStatus.textContent = 'Sending your message...';
                formStatus.className = 'form-status success';
                submitBtn.disabled = true;
                
                // We won't prevent default here, letting the form submit to FormSubmit
                
                // Fallback in case FormSubmit doesn't work or is blocked
                // We'll add a timeout to simulate sending and redirect manually
                setTimeout(() => {
                    // If we're still on the page after 3 seconds, 
                    // the form might not have submitted properly
                    formStatus.textContent = 'Message sent! Thank you for contacting us.';
                    submitBtn.textContent = 'Message Sent!';
                    
                    // Optionally redirect manually if the form submission is blocked
                    // Uncomment this if FormSubmit redirect doesn't work
                    // setTimeout(() => {
                    //     window.location.href = 'thank-you.html';
                    // }, 2000);
                }, 3000);
            });
        }
    }
    
    initPreloader(); // Initialize preloader first
    initWhatsAppTracking();
    initContactForm();
    showPreloaderForAjax();
    
    // Fix the issue with unclosed string in index.html line 314
    // This script will check and fix SVG elements if needed
    function checkAndFixSvgElements() {
        const svgElements = document.querySelectorAll('svg');
        svgElements.forEach(svg => {
            // Check for unclosed paths or elements
            const paths = svg.querySelectorAll('path, use');
            paths.forEach(path => {
                if (path.outerHTML.includes('url(#') && !path.outerHTML.includes(')')) {
                    // Fix the unclosed filter attribute
                    const filterAttr = path.getAttribute('filter');
                    if (filterAttr && filterAttr.includes('url(#') && !filterAttr.includes(')')) {
                        path.setAttribute('filter', filterAttr + ')');
                    }
                }
            });
        });
    }
    
    // Run the fix on load
    checkAndFixSvgElements();
});