// Modern JavaScript for the film companion guide with slideshow functionality
// This provides smooth scrolling, slideshow management, and interactive features

// Film data configuration
const filmData = {
    'ghost-in-shell': {
        name: 'Ghost in the Shell',
        youtubeId: '8RF09G8Ymqg',
        images: [] // Will be populated dynamically
    },
    'matrix': {
        name: 'The Matrix',
        youtubeId: 'vKQi3bBA1y8',
        images: []
    },
    'perfect-blue': {
        name: 'Perfect Blue',
        youtubeId: 'RrWausp8zDQ',
        images: []
    },
    'black-swan': {
        name: 'Black Swan',
        youtubeId: '5jaI1XOB-bs',
        images: []
    },
    'paprika': {
        name: 'Paprika',
        youtubeId: 'PIUqozzyW2k',
        images: []
    },
    'inception': {
        name: 'Inception',
        youtubeId: 'LifqWf0BAOA',
        images: []
    },
    'millennium-actress': {
        name: 'The Millennium Actress',
        youtubeId: '2u5Ee1_jUCY',
        images: []
    }
};

// Store slideshow instances
const slideshows = {};
let lightboxInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    initSmoothScrolling();
    initLightbox();
    initSlideshows();
    initScrollAnimations();
    initLinkManagement();
    logInstructions();
});

/**
 * Initialize all slideshows
 */
function initSlideshows() {
    document.querySelectorAll('.slideshow').forEach(slideshowElement => {
        const filmId = slideshowElement.getAttribute('data-film');
        if (filmId && filmData[filmId]) {
            slideshows[filmId] = new Slideshow(slideshowElement, filmId);
        }
    });
}

/**
 * Slideshow class to manage individual film slideshows
 */
class Slideshow {
    constructor(element, filmId) {
        this.element = element;
        this.filmId = filmId;
        this.currentIndex = 0;
        this.slides = [];
        
        this.container = element.querySelector('.slideshow-container');
        this.slidesWrapper = element.querySelector('.slides-wrapper');
        this.indicatorsContainer = element.querySelector('.slide-indicators');
        this.prevBtn = element.querySelector('.slide-nav.prev');
        this.nextBtn = element.querySelector('.slide-nav.next');
        
        this.loadSlides();
        this.attachEventListeners();
    }
    
    async loadSlides() {
        const data = filmData[this.filmId];
        
        // Try to load images from the images directory
        const imagePath = `images/${this.filmId}/`;
        
        // Check if poster exists
        const posterPath = `${imagePath}poster.jpg`;
        const posterExists = await this.checkImageExists(posterPath);
        
        if (posterExists) {
            this.slides.push({ type: 'image', src: posterPath, alt: `${data.name} poster` });
        } else {
            // Add placeholder for poster
            this.slides.push({ type: 'placeholder', text: `${data.name} Poster\n(Add poster.jpg to ${imagePath})` });
        }
        
        // Try to load screengrabs (screengrab1.jpg, screengrab2.jpg, etc.)
        let screengrabIndex = 1;
        let foundScreengrab = true;
        
        while (foundScreengrab && screengrabIndex <= 20) { // Max 20 screengrabs
            const screengrabPath = `${imagePath}screengrab${screengrabIndex}.jpg`;
            foundScreengrab = await this.checkImageExists(screengrabPath);
            
            if (foundScreengrab) {
                this.slides.push({ 
                    type: 'image', 
                    src: screengrabPath, 
                    alt: `${data.name} screengrab ${screengrabIndex}` 
                });
                screengrabIndex++;
            }
        }
        
        // If no screengrabs found, add a placeholder
        if (screengrabIndex === 1) {
            this.slides.push({ 
                type: 'placeholder', 
                text: `Add Screengrabs\n(screengrab1.jpg, screengrab2.jpg, etc. to ${imagePath})` 
            });
        }
        
        // Always add YouTube trailer at the end
        this.slides.push({ 
            type: 'youtube', 
            videoId: data.youtubeId,
            alt: `${data.name} trailer`
        });
        
        this.render();
    }
    
    async checkImageExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }
    
    render() {
        // Clear existing content
        this.slidesWrapper.innerHTML = '';
        this.indicatorsContainer.innerHTML = '';
        
        // Create slides
        this.slides.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = 'slide';
            if (index === 0) slideElement.classList.add('active');
            
            if (slide.type === 'image') {
                const img = document.createElement('img');
                img.src = slide.src;
                img.alt = slide.alt;
                img.loading = 'lazy';
                slideElement.appendChild(img);
                
                // Add click handler to open lightbox
                slideElement.addEventListener('click', (e) => {
                    if (lightboxInstance) {
                        lightboxInstance.open(this.filmId, index, slideElement);
                    }
                });
                slideElement.style.cursor = 'pointer';
            } else if (slide.type === 'youtube') {
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${slide.videoId}`;
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;
                iframe.title = slide.alt;
                slideElement.appendChild(iframe);
                
                // Add click handler to thumbnail area (not the iframe itself)
                slideElement.addEventListener('click', (e) => {
                    // Only open lightbox if clicking outside the iframe
                    if (e.target === slideElement && lightboxInstance) {
                        lightboxInstance.open(this.filmId, index, slideElement);
                    }
                });
                slideElement.style.cursor = 'pointer';
            } else if (slide.type === 'placeholder') {
                slideElement.classList.add('placeholder');
                const text = document.createElement('div');
                text.className = 'placeholder-text';
                text.textContent = slide.text;
                slideElement.appendChild(text);
            }
            
            this.slidesWrapper.appendChild(slideElement);
        });
        
        // Create indicators
        this.slides.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => this.goToSlide(index));
            this.indicatorsContainer.appendChild(indicator);
        });
        
        this.updateNavigation();
    }
    
    attachEventListeners() {
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Keyboard navigation
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        
        // Touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) this.nextSlide();
            if (touchEndX - touchStartX > 50) this.previousSlide();
        });
    }
    
    goToSlide(index) {
        if (index < 0 || index >= this.slides.length) return;
        
        // Update slides
        const allSlides = this.slidesWrapper.querySelectorAll('.slide');
        allSlides[this.currentIndex].classList.remove('active');
        allSlides[index].classList.add('active');
        
        // Update indicators
        const allIndicators = this.indicatorsContainer.querySelectorAll('.indicator');
        allIndicators[this.currentIndex].classList.remove('active');
        allIndicators[index].classList.add('active');
        
        this.currentIndex = index;
        this.updateNavigation();
    }
    
    nextSlide() {
        this.goToSlide(this.currentIndex + 1);
    }
    
    previousSlide() {
        this.goToSlide(this.currentIndex - 1);
    }
    
    updateNavigation() {
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex === this.slides.length - 1;
    }
}

/**
 * Lightbox class for modal image/video gallery
 */
class Lightbox {
    constructor() {
        this.currentFilmId = null;
        this.currentIndex = 0;
        this.focusTrapElements = [];
        this.triggerElement = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.createLightboxHTML();
        this.attachEventListeners();
    }
    
    createLightboxHTML() {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('aria-label', 'Image and video gallery');
        
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Close lightbox">
                    <span class="material-symbols-rounded">close</span>
                </button>
                <div class="lightbox-slides-container">
                    <button class="lightbox-nav prev" aria-label="Previous slide">
                        <span class="material-symbols-rounded">chevron_left</span>
                    </button>
                    <div class="lightbox-slides"></div>
                    <button class="lightbox-nav next" aria-label="Next slide">
                        <span class="material-symbols-rounded">chevron_right</span>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        
        this.element = lightbox;
        this.slidesContainer = lightbox.querySelector('.lightbox-slides');
        this.closeBtn = lightbox.querySelector('.lightbox-close');
        this.prevBtn = lightbox.querySelector('.lightbox-nav.prev');
        this.nextBtn = lightbox.querySelector('.lightbox-nav.next');
        
        this.focusTrapElements = [this.closeBtn, this.prevBtn, this.nextBtn];
    }
    
    attachEventListeners() {
        // Close button
        this.closeBtn.addEventListener('click', () => this.close());
        
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Backdrop click
        this.element.addEventListener('click', (e) => {
            if (e.target === this.element) {
                this.close();
            }
        });
        
        // Keyboard navigation
        this.keyboardHandler = (e) => {
            if (!this.element.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape':
                    this.close();
                    break;
                case 'ArrowLeft':
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                    this.nextSlide();
                    break;
                case 'Tab':
                    this.handleTabKey(e);
                    break;
            }
        };
        document.addEventListener('keydown', this.keyboardHandler);
        
        // Touch swipe support
        this.element.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        });
        
        this.element.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            const swipeDistance = this.touchStartX - this.touchEndX;
            
            if (Math.abs(swipeDistance) > 50) {
                if (swipeDistance > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
        });
    }
    
    handleTabKey(e) {
        const focusableElements = this.focusTrapElements.filter(el => !el.disabled);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
    
    open(filmId, slideIndex = 0, triggerElement = null) {
        this.currentFilmId = filmId;
        this.currentIndex = slideIndex;
        this.triggerElement = triggerElement;
        
        const slideshow = slideshows[filmId];
        if (!slideshow) return;
        
        // Clear and rebuild slides
        this.slidesContainer.innerHTML = '';
        
        slideshow.slides.forEach((slide, index) => {
            const lightboxSlide = document.createElement('div');
            lightboxSlide.className = 'lightbox-slide';
            if (index === slideIndex) lightboxSlide.classList.add('active');
            
            if (slide.type === 'image') {
                const img = document.createElement('img');
                img.src = slide.src;
                img.alt = slide.alt;
                lightboxSlide.appendChild(img);
            } else if (slide.type === 'youtube') {
                const iframe = document.createElement('iframe');
                // Don't autoplay in lightbox
                iframe.src = `https://www.youtube.com/embed/${slide.videoId}`;
                iframe.allow = 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;
                iframe.title = slide.alt;
                lightboxSlide.appendChild(iframe);
            }
            // Skip placeholder slides in lightbox
            
            if (slide.type !== 'placeholder') {
                this.slidesContainer.appendChild(lightboxSlide);
            }
        });
        
        // Show lightbox
        this.element.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Update navigation
        this.updateNavigation();
        
        // Focus management
        setTimeout(() => {
            this.closeBtn.focus();
        }, 100);
    }
    
    close() {
        this.element.classList.remove('active');
        document.body.style.overflow = '';
        
        // Return focus to trigger element
        if (this.triggerElement) {
            setTimeout(() => {
                this.triggerElement.focus();
            }, 100);
        }
        
        // Clear slides after animation
        setTimeout(() => {
            this.slidesContainer.innerHTML = '';
        }, 300);
    }
    
    goToSlide(index) {
        const allSlides = this.slidesContainer.querySelectorAll('.lightbox-slide');
        if (index < 0 || index >= allSlides.length) return;
        
        allSlides[this.currentIndex].classList.remove('active');
        allSlides[index].classList.add('active');
        
        this.currentIndex = index;
        this.updateNavigation();
    }
    
    nextSlide() {
        const allSlides = this.slidesContainer.querySelectorAll('.lightbox-slide');
        if (this.currentIndex < allSlides.length - 1) {
            this.goToSlide(this.currentIndex + 1);
        }
    }
    
    previousSlide() {
        if (this.currentIndex > 0) {
            this.goToSlide(this.currentIndex - 1);
        }
    }
    
    updateNavigation() {
        const allSlides = this.slidesContainer.querySelectorAll('.lightbox-slide');
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex === allSlides.length - 1;
    }
}

/**
 * Initialize lightbox
 */
function initLightbox() {
    lightboxInstance = new Lightbox();
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Dynamic link management for the "Further Reading" sections
 */
function initLinkManagement() {
    // Enhanced function to add links with rich metadata
    window.addFilmLink = (sectionId, url, title = null, publisher = null, date = null, imageUrl = null) => {
        const linksList = document.getElementById(sectionId);
        if (!linksList) {
            console.error(`Section with id "${sectionId}" not found`);
            return;
        }

        const placeholder = linksList.querySelector('.placeholder-link');
        if (placeholder) {
            placeholder.parentElement.remove();
        }

        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        
        // Add preview image if available
        if (imageUrl) {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = `${title || 'Article'} preview`;
            img.className = 'link-preview';
            a.appendChild(img);
        }
        
        // Create content wrapper
        const contentDiv = document.createElement('div');
        contentDiv.className = 'link-content';
        
        // Create title
        const titleDiv = document.createElement('div');
        titleDiv.className = 'link-title';
        titleDiv.textContent = title || url;
        contentDiv.appendChild(titleDiv);
        
        // Add metadata if available
        if (publisher || date) {
            const metaDiv = document.createElement('div');
            metaDiv.className = 'link-meta';
            
            if (publisher) {
                const publisherSpan = document.createElement('span');
                publisherSpan.className = 'link-publisher';
                
                const publisherIcon = document.createElement('span');
                publisherIcon.className = 'material-symbols-rounded';
                publisherIcon.textContent = 'public';
                publisherSpan.appendChild(publisherIcon);
                
                publisherSpan.appendChild(document.createTextNode(publisher));
                metaDiv.appendChild(publisherSpan);
            }
            
            if (date) {
                const dateSpan = document.createElement('span');
                dateSpan.className = 'link-date';
                
                const dateIcon = document.createElement('span');
                dateIcon.className = 'material-symbols-rounded';
                dateIcon.textContent = 'schedule';
                dateSpan.appendChild(dateIcon);
                
                const timeElement = document.createElement('time');
                timeElement.textContent = date;
                dateSpan.appendChild(timeElement);
                
                metaDiv.appendChild(dateSpan);
            }
            
            contentDiv.appendChild(metaDiv);
        }
        
        a.appendChild(contentDiv);
        li.appendChild(a);
        linksList.appendChild(li);
        
        li.style.opacity = '0';
        li.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            li.style.transition = 'all 0.3s ease';
            li.style.opacity = '1';
            li.style.transform = 'translateY(0)';
        }, 10);
        
        console.log(`✓ Added link: ${title || url}`);
    };

    // Helper to update YouTube trailer ID
    window.updateTrailer = (filmId, youtubeId) => {
        if (filmData[filmId]) {
            filmData[filmId].youtubeId = youtubeId;
            if (slideshows[filmId]) {
                slideshows[filmId].loadSlides();
            }
            console.log(`✓ Updated trailer for ${filmData[filmId].name}`);
        } else {
            console.error(`Film ID "${filmId}" not found`);
        }
    };

    // Helper to reload a specific slideshow after adding images
    window.reloadSlideshow = (filmId) => {
        if (slideshows[filmId]) {
            slideshows[filmId].loadSlides();
            console.log(`✓ Reloaded slideshow for ${filmData[filmId].name}`);
        } else {
            console.error(`Slideshow for "${filmId}" not found`);
        }
    };
}

/**
 * Scroll-triggered animations for sections
 */
function initScrollAnimations() {
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

    document.querySelectorAll('.course-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

/**
 * Console instructions for the user
 */
function logInstructions() {
    console.log('%c🎬 Film Companion Guide - Slideshow Edition', 'font-size: 20px; font-weight: bold; color: #0071e3;');
    console.log('%c\n📁 Image Directory Structure:', 'font-size: 14px; font-weight: bold; color: #1d1d1f;');
    console.log('%cPlace images in: images/<film-id>/', 'font-size: 12px; color: #6e6e73;');
    console.log('%c  • poster.jpg (first slide)', 'font-size: 12px; color: #6e6e73;');
    console.log('%c  • screengrab1.jpg, screengrab2.jpg, etc. (middle slides)', 'font-size: 12px; color: #6e6e73;');
    console.log('%c  • Trailer automatically added as last slide', 'font-size: 12px; color: #6e6e73;');
    
    console.log('%c\n🎥 Film IDs:', 'font-size: 14px; font-weight: bold; color: #1d1d1f;');
    Object.keys(filmData).forEach(id => {
        console.log(`%c  • ${id}`, 'font-size: 12px; color: #6e6e73;');
    });
    
    console.log('%c\n🔧 Useful Functions:', 'font-size: 14px; font-weight: bold; color: #1d1d1f;');
    console.log('%c  reloadSlideshow("film-id") - Reload after adding images', 'font-size: 12px; color: #6e6e73;');
    console.log('%c  updateTrailer("film-id", "youtubeId") - Change trailer', 'font-size: 12px; color: #6e6e73;');
    console.log('%c  addFilmLink("links-section-id", "Title", "url") - Add reading link', 'font-size: 12px; color: #6e6e73;');
    
    console.log('%c\n📚 Link Section IDs:', 'font-size: 14px; font-weight: bold; color: #1d1d1f;');
    console.log('%c  • links-system, links-self, links-bridge, links-dessert', 'font-size: 12px; color: #6e6e73;');
}

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'h' || e.key === 'H') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});
