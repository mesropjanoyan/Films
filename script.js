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

document.addEventListener('DOMContentLoaded', () => {
    initSmoothScrolling();
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
            } else if (slide.type === 'youtube') {
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${slide.videoId}`;
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;
                iframe.title = slide.alt;
                slideElement.appendChild(iframe);
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
    window.addFilmLink = (sectionId, linkText, linkUrl) => {
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
        a.href = linkUrl;
        a.textContent = linkText;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        
        li.appendChild(a);
        linksList.appendChild(li);
        
        li.style.opacity = '0';
        li.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            li.style.transition = 'all 0.3s ease';
            li.style.opacity = '1';
            li.style.transform = 'translateY(0)';
        }, 10);
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
