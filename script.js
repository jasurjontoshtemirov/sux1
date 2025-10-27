// Global variables
let currentSlide = 0;
let servicesCurrentSlide = 0;
let autoPlayInterval = null;
let servicesAutoPlayInterval = null;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initCarousel();
    initServicesCarousel();
    initContactForm();
    initAnimations();
    initButtons();
});

// Navigation
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            if (navMenu) navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
        });
    });
}

// Main Carousel
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (slides.length === 0) return;
    
    function goToSlide(slideIndex) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = slideIndex;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        goToSlide(nextIndex);
    }
    
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(prevIndex);
    }
    
    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(nextSlide, 4000);
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }
    
    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    dots.forEach(function(dot, index) {
        dot.addEventListener('click', function() {
            goToSlide(index);
        });
    });
    
    // Auto play
    startAutoPlay();
    
    // Pause on hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }
}

// Services Carousel
function initServicesCarousel() {
    const slides = document.querySelectorAll('.services-slide');
    const dots = document.querySelectorAll('.services-dot');
    
    if (slides.length === 0) return;
    
    function goToSlide(slideIndex) {
        slides[servicesCurrentSlide].classList.remove('active');
        dots[servicesCurrentSlide].classList.remove('active');
        
        servicesCurrentSlide = slideIndex;
        
        slides[servicesCurrentSlide].classList.add('active');
        dots[servicesCurrentSlide].classList.add('active');
    }
    
    function nextSlide() {
        const nextIndex = (servicesCurrentSlide + 1) % slides.length;
        goToSlide(nextIndex);
    }
    
    function startServicesAutoPlay() {
        if (servicesAutoPlayInterval) {
            clearInterval(servicesAutoPlayInterval);
        }
        servicesAutoPlayInterval = setInterval(nextSlide, 2500); // 1 second
    }
    
    function stopServicesAutoPlay() {
        if (servicesAutoPlayInterval) {
            clearInterval(servicesAutoPlayInterval);
            servicesAutoPlayInterval = null;
        }
    }
    
    // Dots navigation
    dots.forEach(function(dot, index) {
        dot.addEventListener('click', function() {
            goToSlide(index);
        });
    });
    
    // Start auto play
    startServicesAutoPlay();
    
    // Pause on hover
    const servicesCarouselContainer = document.querySelector('.services-carousel-container');
    if (servicesCarouselContainer) {
        servicesCarouselContainer.addEventListener('mouseenter', stopServicesAutoPlay);
        servicesCarouselContainer.addEventListener('mouseleave', startServicesAutoPlay);
    }
}

// Contact Form
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[type="text"]').value;
            const phone = this.querySelector('input[type="tel"]').value;
            const message = this.querySelector('textarea').value;
            
            if (!name || !phone || !message) {
                alert('Iltimos, barcha maydonlarni to\'ldiring!');
                return;
            }
            
            const submitBtn = this.querySelector('.btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Yuborilmoqda...';
            submitBtn.disabled = true;
            
            setTimeout(function() {
                alert('Xabaringiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog\'lanamiz.');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Animations
function initAnimations() {
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.service-card, .contact-item, .stat, .info-card').forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Counter animation for stats
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('h3');
                if (statNumber) {
                    const text = statNumber.textContent;
                    const number = parseInt(text.replace(/[^\d]/g, ''));
                    animateCounter(statNumber, number);
                    statsObserver.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat').forEach(function(stat) {
        statsObserver.observe(stat);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(function() {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (target >= 1000) {
            element.textContent = Math.floor(current).toLocaleString() + '+';
        } else {
            element.textContent = Math.floor(current) + '%';
        }
    }, 20);
}

// Button effects
function initButtons() {
    document.querySelectorAll('.btn').forEach(function(btn) {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Phone number clicks
    document.querySelectorAll('.phone-number').forEach(function(phoneElement) {
        phoneElement.addEventListener('click', function() {
            const phoneNumber = this.textContent.trim();
            if (confirm(phoneNumber + ' raqamiga qo\'ng\'iroq qilishni xohlaysizmi?')) {
                window.open('tel:' + phoneNumber.replace(/\s/g, ''));
            }
        });
    });
}

// Header background on scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    }
});

// Loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});