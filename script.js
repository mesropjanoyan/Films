// Modern JavaScript for the film companion guide with slideshow functionality
// This provides smooth scrolling, slideshow management, and interactive features

// Film data configuration
const filmData = {
    'ghost-in-shell': {
        name: 'Ghost in the Shell',
        youtubeId: '8RF09G8Ymqg',
        images: [], // Will be populated dynamically
        rating: 'TV-MA',
        year: 1995,
        duration: '1h 25m',
        genres: 'Action/Sci-Fi/Anime',
        tomatometer: 95,
        rtLink: 'https://www.rottentomatoes.com/m/ghost_in_the_shell'
    },
    'matrix': {
        name: 'The Matrix',
        youtubeId: 'vKQi3bBA1y8',
        images: [],
        rating: 'R',
        year: 1999,
        duration: '2h 16m',
        genres: 'Sci-Fi/Action/Mystery & Thriller',
        tomatometer: 83,
        rtLink: 'https://www.rottentomatoes.com/m/matrix'
    },
    'perfect-blue': {
        name: 'Perfect Blue',
        youtubeId: 'RrWausp8zDQ',
        images: [],
        rating: 'R',
        year: 1999,
        duration: '1h 20m',
        genres: 'Mystery & Thriller/Anime',
        tomatometer: 84,
        rtLink: 'https://www.rottentomatoes.com/m/perfect_blue_1999'
    },
    'black-swan': {
        name: 'Black Swan',
        youtubeId: '5jaI1XOB-bs',
        images: [],
        rating: 'R',
        year: 2010,
        duration: '1h 48m',
        genres: 'Drama/Mystery & Thriller',
        tomatometer: 85,
        rtLink: 'https://www.rottentomatoes.com/m/black_swan_2010'
    },
    'paprika': {
        name: 'Paprika',
        youtubeId: 'PIUqozzyW2k',
        images: [],
        rating: 'R',
        year: 2007,
        duration: '1h 30m',
        genres: 'Sci-Fi/Action/Adventure/Anime',
        tomatometer: 87,
        rtLink: 'https://www.rottentomatoes.com/m/paprika'
    },
    'inception': {
        name: 'Inception',
        youtubeId: 'LifqWf0BAOA',
        images: [],
        rating: 'PG-13',
        year: 2010,
        duration: '2h 28m',
        genres: 'Sci-Fi/Mystery & Thriller/Action',
        tomatometer: 87,
        rtLink: 'https://www.rottentomatoes.com/m/inception'
    },
    'millennium-actress': {
        name: 'The Millennium Actress',
        youtubeId: '2u5Ee1_jUCY',
        images: [],
        rating: 'PG',
        year: 2003,
        duration: '1h 27m',
        genres: 'Drama/Fantasy/Anime',
        tomatometer: 93,
        rtLink: 'https://www.rottentomatoes.com/m/millennium_actress_2001'
    }
};

// Glossary data with terms, definitions, and Wikipedia links
const glossary = [
    {
        term: 'live-action',
        definition: 'A film or show featuring real actors or animals, rather than animation or computer-generated effects.',
        wikiLink: 'https://en.wikipedia.org/wiki/Live_action'
    },
    {
        term: 'double feature',
        definition: 'A cinema program where two films are shown back-to-back; used here to pair an anime with the film it influenced.',
        wikiLink: 'https://en.wikipedia.org/wiki/Double_feature'
    },
    {
        term: 'cyberpunk',
        definition: 'A subgenre of science fiction set in a futuristic, dystopian society dominated by high-tech computer technology.',
        wikiLink: 'https://en.wikipedia.org/wiki/Cyberpunk'
    },
    {
        term: 'dystopian',
        definition: 'An imagined state or society, typically futuristic, characterized by great injustice, oppression, and misery.',
        wikiLink: 'https://en.wikipedia.org/wiki/Dystopia'
    },
    {
        term: 'psychological horror',
        definition: 'A subgenre of horror that focuses on mental and emotional instability to create suspense, rather than relying on gore.',
        wikiLink: 'https://en.wikipedia.org/wiki/Psychological_horror'
    },
    {
        term: 'doppelgänger',
        definition: 'A look-alike or \'double\' of a living person, often used in fiction (especially in thrillers) to explore themes of identity and the self.',
        wikiLink: 'https://en.wikipedia.org/wiki/Doppelg%C3%A4nger'
    },
    {
        term: 'homage',
        definition: 'A respectful tribute within a creative work that references the style or specific elements of another artist\'s work.',
        wikiLink: 'https://en.wikipedia.org/wiki/Homage_(arts)'
    },
    {
        term: 'surrealism',
        definition: 'A style in art and film that explores the workings of the mind, featuring illogical, dream-like scenes and symbolic imagery.',
        wikiLink: 'https://en.wikipedia.org/wiki/Surrealism'
    },
    {
        term: 'blockbuster',
        definition: 'A film that is a great commercial success, typically one with a large budget, major stars, and widespread appeal.',
        wikiLink: 'https://en.wikipedia.org/wiki/Blockbuster_(entertainment)'
    },
    {
        term: 'reality-bending',
        definition: 'A narrative or visual style that warps, questions, or breaks the established rules of the physical world.',
        wikiLink: 'https://en.wikipedia.org/wiki/Speculative_fiction'
    }
];

// Store slideshow instances
const slideshows = {};
let lightboxInstance = null;

/**
 * Initialize theme toggle functionality
 * Handles light/dark mode switching with localStorage persistence
 * Respects system preference, defaults to light mode if no preference detected
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    const html = document.documentElement;
    const icon = themeToggle.querySelector('.material-symbols-rounded');
    
    // Check for saved theme preference first
    const savedTheme = localStorage.getItem('theme');
    
    // Apply initial theme
    if (savedTheme) {
        // User has explicitly chosen a theme
        html.setAttribute('data-theme', savedTheme);
        updateIcon(savedTheme);
    } else {
        // No saved preference - check system preference
        const prefersDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const prefersLightQuery = window.matchMedia('(prefers-color-scheme: light)');
        
        if (prefersDarkQuery.matches) {
            // Browser is set to dark mode
            html.setAttribute('data-theme', 'dark');
            updateIcon('dark');
        } else if (prefersLightQuery.matches) {
            // Browser is explicitly set to light mode
            html.setAttribute('data-theme', 'light');
            updateIcon('light');
        } else {
            // No browser setting whatsoever - default to light mode
            html.setAttribute('data-theme', 'light');
            updateIcon('light');
        }
    }
    
    // Theme toggle click handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
    });
    
    // Update icon based on theme
    function updateIcon(theme) {
        if (icon) {
            icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
        }
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only update if user hasn't set a preference
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            updateIcon(newTheme);
        }
    });
}

/**
 * Shared constants for both hero systems
 */
const HERO_FILMS = [
    'ghost-in-shell',
    'matrix',
    'perfect-blue',
    'black-swan',
    'paprika',
    'inception',
    'millennium-actress'
];
const SCREENGRABS_PER_FILM = 8;

/**
 * Initialize hero toggle functionality
 * Handles switching between falling collage and scrolling film strip heroes
 */
function initHeroToggle() {
    const heroToggle = document.getElementById('hero-toggle');
    if (!heroToggle) return;
    
    const heroCollage = document.getElementById('heroCollage');
    const heroScrolling = document.getElementById('heroScrolling');
    const icon = heroToggle.querySelector('.material-symbols-rounded');
    
    // Check for saved hero preference, default to 'collage'
    const savedHero = localStorage.getItem('hero-style') || 'collage';
    
    // Track which heroes have been initialized
    let collageInitialized = false;
    let scrollingInitialized = false;
    
    // Apply initial hero style and initialize
    const isScrolling = savedHero === 'scrolling';
    heroCollage.classList.toggle('hidden', isScrolling);
    heroScrolling.classList.toggle('hidden', !isScrolling);
    if (icon) icon.textContent = isScrolling ? 'auto_awesome_mosaic' : 'theaters';
    
    // Initialize only the visible hero
    if (isScrolling) {
        initHeroScrolling();
        scrollingInitialized = true;
    } else {
        initHeroCollage();
        collageInitialized = true;
    }
    
    // Hero toggle click handler
    heroToggle.addEventListener('click', () => {
        const isCurrentlyScrolling = !heroScrolling.classList.contains('hidden');
        const newStyle = isCurrentlyScrolling ? 'collage' : 'scrolling';
        
        heroCollage.classList.toggle('hidden', !isCurrentlyScrolling);
        heroScrolling.classList.toggle('hidden', isCurrentlyScrolling);
        if (icon) icon.textContent = isCurrentlyScrolling ? 'theaters' : 'auto_awesome_mosaic';
        
        // Lazy initialize the hero being switched to
        if (newStyle === 'scrolling' && !scrollingInitialized) {
            initHeroScrolling();
            scrollingInitialized = true;
        } else if (newStyle === 'collage' && !collageInitialized) {
            initHeroCollage();
            collageInitialized = true;
        }
        
        localStorage.setItem('hero-style', newStyle);
    });
}

/**
 * Main initialization - runs when DOM is fully loaded
 * Initializes all interactive features in sequence
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize toggle first - this will handle hero initialization internally
    initHeroToggle();
    initThemeToggle();
    
    // Initialize other features
    initSmoothScrolling();
    initLightbox();
    initSlideshows();
    initScrollAnimations();
    initLinkManagement();
    initGlossary();
    
    // Populate Further Reading sections with curated articles
    populateFurtherReadingLinks();
    
    // Initialize collapsible reading lists
    initCollapsibleReadingLists();
});

/**
 * Populate all Further Reading sections with curated articles
 * Organized by course section with rich metadata
 */
function populateFurtherReadingLinks() {
    // First Course: The System — Ghost in the Shell & The Matrix
    addFilmLink('links-system', 'https://www.theguardian.com/film/2009/oct/19/hollywood-ghost-in-the-shell', 'Hollywood\'s new frontier', 'The Guardian', 'Oct 2009', 'images/link-previews/ghost-theguardian.jpg');
    addFilmLink('links-system', 'https://www.slashfilm.com/778619/the-classic-anime-that-inspired-the-matrix/', 'The Classic Anime That Inspired The Matrix', 'SlashFilm', null, 'images/link-previews/ghost-slashfilm.jpg');
    addFilmLink('links-system', 'https://bigpicturefilmclub.com/how-ghost-in-the-shell-inspired-the-matrix-a-cyberpunk-revolution/', 'How Ghost in the Shell Inspired The Matrix', 'Big Picture Film Club', null, 'images/link-previews/ghost-bigpicturefilmclub.jpg');
    addFilmLink('links-system', 'https://www.vox.com/2017/4/4/15138682/ghost-in-the-shell-anime-philosophy', 'Ghost in the Shell\'s anime philosophy', 'Vox', 'Apr 2017', 'images/link-previews/ghost-vox.jpg');
    
    // Second Course: The Self — Perfect Blue & Black Swan
    addFilmLink('links-self', 'https://www.dazeddigital.com/artsandculture/article/26075/1/the-cult-japanese-filmmaker-that-inspired-darren-aronofsky', 'The cult Japanese filmmaker that inspired Darren Aronofsky', 'Dazed Digital', null, 'images/link-previews/perfect-dazeddigital.jpg');
    addFilmLink('links-self', 'https://faroutmagazine.co.uk/identity-crisis-perfect-blue-persona-black-swan/', 'Identity crisis: Perfect Blue, Persona, and Black Swan', 'Far Out Magazine', null, 'images/link-previews/perfect-faroutmagazine.jpg');
    addFilmLink('links-self', 'https://animationobsessive.substack.com/p/the-real-history-of-perfect-blue', 'The Real History of Perfect Blue', 'Animation Obsessive', null, 'images/link-previews/perfect-animationobsessive.jpg');
    
    // Third Course: The Bridge — Paprika & Inception
    addFilmLink('links-bridge', 'https://filmschoolrejects.com/inception-paprika-synergy/', 'Inception and Paprika: Synergy', 'Film School Rejects', null, 'images/link-previews/paprika-filmschoolrejects.jpg');
    addFilmLink('links-bridge', 'https://www.hollywoodinsider.com/paprika-inception-dream-world/', 'Paprika and Inception\'s Dream World', 'The Hollywood Insider', null, 'images/link-previews/paprika-hollywoodinsider.jpg');
    addFilmLink('links-bridge', 'https://independentpicturehouse.org/2025/01/03/paprika-more-than-anime-inception/', 'Paprika: More than anime Inception', 'Independent Picturehouse', 'Jan 2025', 'images/link-previews/paprika-independentpicturehouse.jpg');
    addFilmLink('links-bridge', 'https://collider.com/best-movies-inspired-by-anime-the-matrix-avatar/', 'Best Movies Inspired by Anime', 'Collider', null, 'images/link-previews/paprika-collider.jpg');
    
    // The Dessert Course: Millennium Actress
    addFilmLink('links-dessert', 'https://lwlies.com/home-ents/millennium-actress-satoshi-kon-cinema-love-letter', 'Millennium Actress: A cinema love letter', 'Little White Lies', null, 'images/link-previews/millennium-lwlies.jpg');
    addFilmLink('links-dessert', 'https://vaguevisages.com/2019/09/19/millennium-actress-satoshi-kan-essay/', 'Millennium Actress: Satoshi Kon Essay', 'Vague Visages', 'Sep 2019', 'images/link-previews/millennium-vaguevisages.jpg');
    addFilmLink('links-dessert', 'https://bfidatadigipres.github.io/pdf/2022-05-04-millennium-actress.pdf', 'Millennium Actress Analysis', 'BFI', 'May 2022', 'images/link-previews/millennium-bfidatadigipres.jpg');
    addFilmLink('links-dessert', 'https://www.youtube.com/watch?v=1dfn-yMmvis', 'Millennium Actress Video Essay', 'YouTube', null, 'images/link-previews/youtube-millennium.jpg');
}

/**
 * Initialize collapsible reading lists
 * All reading lists start collapsed showing only first link preview
 */
function initCollapsibleReadingLists() {
    const toggleButtons = document.querySelectorAll('.links-toggle');
    
    toggleButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const linksHeader = this.closest('.links-header');
            const linksSection = linksHeader.closest('.links-section');
            const linksList = linksSection.querySelector('.links-list');
            
            // Toggle collapsed state
            const isCollapsed = linksList.classList.contains('collapsed');
            
            if (isCollapsed) {
                // Expand
                linksList.classList.remove('collapsed');
                this.setAttribute('aria-expanded', 'true');
                this.setAttribute('aria-label', 'Collapse reading list');
            } else {
                // Collapse
                linksList.classList.add('collapsed');
                this.setAttribute('aria-expanded', 'false');
                this.setAttribute('aria-label', 'Expand reading list');
            }
        });
        
        // Add keyboard support
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

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
        
        // Add preview image if available, otherwise add fallback icon
        if (imageUrl) {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = `${title || 'Article'} preview`;
            img.className = 'link-preview';
            img.loading = 'lazy'; // Performance: lazy load images
            a.appendChild(img);
        } else {
            // Fallback: Material Symbols article icon
            const iconDiv = document.createElement('div');
            iconDiv.className = 'link-icon-fallback';
            const icon = document.createElement('span');
            icon.className = 'material-symbols-rounded';
            icon.textContent = 'article';
            icon.setAttribute('aria-hidden', 'true');
            iconDiv.appendChild(icon);
            a.appendChild(iconDiv);
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
                publisherIcon.setAttribute('aria-hidden', 'true'); // Accessibility: icons are decorative
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
                dateIcon.setAttribute('aria-hidden', 'true'); // Accessibility: icons are decorative
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

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'h' || e.key === 'H') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

/**
 * Hero Collage Animation System
 * Loads all 56 screengrabs once and cycles them endlessly
 * Uses density gradient for natural distribution (top-heavy, center-focused)
 */
function initHeroCollage() {
    const collageContainer = document.getElementById('heroCollage');
    if (!collageContainer) return;

    // Configuration constants
    const CONFIG = {
        CYCLE_INTERVAL: 3000,           // Move one image every 3 seconds
        SCREENGRAB_MAX_WIDTH: 320,      // Maximum screengrab width in pixels
        SCREENGRAB_MAX_HEIGHT: 240,     // Maximum screengrab height in pixels
        POSTER_MAX_WIDTH: 200,          // Maximum poster width (smaller, portrait)
        POSTER_MAX_HEIGHT: 300,         // Maximum poster height (portrait ratio)
        BOTTOM_SAFE_ZONE: 250           // Pixels from bottom to avoid gradient cutoff
    };

    // Build array of all images: posters + screengrabs
    const allImages = [
        // Add posters first (marked with type for sizing)
        ...HERO_FILMS.map(film => ({
            src: `images/${film}/poster.jpg`,
            type: 'poster'
        })),
        // Add screengrabs
        ...HERO_FILMS.flatMap(film =>
            Array.from({ length: SCREENGRABS_PER_FILM }, (_, i) => ({
                src: `images/${film}/screengrab${i + 1}.jpg`,
                type: 'screengrab'
            }))
        )
    ];
    
    // Shuffle for visual variety
    const shuffledImages = allImages.sort(() => Math.random() - 0.5);

    // Track all image elements
    const imageElements = [];

    /**
     * Generate position using density gradient distribution
     * Top-heavy (power function), center-focused (bell curve), manual left correction
     * @returns {Object} Position object with left, top (percentages), and rotation (degrees)
     */
    function generatePosition() {
        const container = collageContainer.getBoundingClientRect();
        const containerWidth = container.width;
        const containerHeight = container.height;
        
        // Calculate usable area (exclude bottom safe zone to prevent gradient cutoff)
        const usableTop = 0;
        const usableBottom = 100 - ((CONFIG.BOTTOM_SAFE_ZONE / containerHeight) * 100);
        const usableHeight = usableBottom - usableTop;
        
        // Vertical distribution: Power function creates strong top bias
        const verticalBias = Math.pow(Math.random(), 2.5); // ^2.5 heavily favors top
        const top = usableTop + (verticalBias * usableHeight);
        
        // Horizontal distribution: Bell curve for center focus
        // Average of 3 random numbers approximates Gaussian distribution
        let horizontalRandom = 0;
        for (let i = 0; i < 3; i++) {
            horizontalRandom += Math.random();
        }
        horizontalRandom = horizontalRandom / 3; // 0-1, centered at 0.5
        
        // Convert to ±1 range centered at 0
        const horizontalBias = (horizontalRandom - 0.5) * 2;
        const centerX = 50; // Center of viewport (50%)
        const left = centerX + (horizontalBias * 50); // ±50% from center
        
        // Manual symmetry correction: 150px leftward shift counters rightward bias
        const leftCorrectionPercent = (-150 / containerWidth) * 100;
        const correctedLeft = left + leftCorrectionPercent;
        
        // Add small random jitter for natural variation
        const jitterX = (Math.random() - 0.5) * 3;
        const jitterY = (Math.random() - 0.5) * 3;
        
        return {
            left: Math.max(0, Math.min(100, correctedLeft + jitterX)),
            top: Math.max(0, Math.min(usableBottom, top + jitterY)),
            rotation: (Math.random() - 0.5) * 8 // Small rotation for natural look
        };
    }

    /**
     * Create an image element with position
     */
    function createImage(imageData, position, zIndex) {
        const img = document.createElement('img');
        img.src = imageData.src;
        img.alt = imageData.type === 'poster' ? 'Film poster' : 'Film screengrab';
        
        // Use different max dimensions based on image type
        const maxWidth = imageData.type === 'poster' ? CONFIG.POSTER_MAX_WIDTH : CONFIG.SCREENGRAB_MAX_WIDTH;
        const maxHeight = imageData.type === 'poster' ? CONFIG.POSTER_MAX_HEIGHT : CONFIG.SCREENGRAB_MAX_HEIGHT;
        
        Object.assign(img.style, {
            left: position.left + '%',
            top: position.top + '%',
            maxWidth: `${maxWidth}px`,
            maxHeight: `${maxHeight}px`,
            objectFit: 'cover',
            transform: `rotate(${position.rotation}deg)`,
            zIndex: zIndex
        });
        
        return img;
    }

    /**
     * Reposition an image from bottom to top with new random position
     */
    function cycleImage(imgData) {
        // Generate new position
        const newPosition = generatePosition();
        
        // Animate to new position from above
        const img = imgData.element;
        
        // Set initial state (above viewport)
        img.style.transition = 'none';
        img.style.opacity = '0';
        img.style.transform = `translateY(-120%) scale(0.8) rotate(${newPosition.rotation - 15}deg)`;
        
        // Update position
        img.style.left = newPosition.left + '%';
        img.style.top = newPosition.top + '%';
        
        // Force reflow
        img.offsetHeight;
        
        // Animate in
        img.style.transition = 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 1.2s ease-out';
        img.style.opacity = '1';
        img.style.transform = `translateY(0) scale(1) rotate(${newPosition.rotation}deg)`;
        
        // Update stored position
        imgData.position = newPosition;
        imgData.lastCycled = Date.now();
    }

    /**
     * Initialize all 63 images on load (7 posters + 56 screengrabs)
     */
    function initialize() {
        shuffledImages.forEach((imageData, index) => {
            const position = generatePosition();
            const img = createImage(imageData, position, index + 1);
            
            collageContainer.appendChild(img);
            
            imageElements.push({
                element: img,
                imageData: imageData,
                position: position,
                lastCycled: Date.now()
            });
        });

        // Cycling logic - find and recycle oldest image
        const doCycle = () => {
            const container = collageContainer.getBoundingClientRect();
            const containerHeight = container.height;
            const bottomThreshold = 100 - ((CONFIG.BOTTOM_SAFE_ZONE / containerHeight) * 100);
            
            const bottomImages = imageElements.filter(img => 
                img.position.top > bottomThreshold * 0.7 // In lower 30%
            );
            
            const oldestImage = (bottomImages.length > 0 ? bottomImages : imageElements)
                .reduce((oldest, current) => 
                    current.lastCycled < oldest.lastCycled ? current : oldest
                );
            
            cycleImage(oldestImage);
        };

        // Start cycling animation
        let cycleIntervalId = setInterval(doCycle, CONFIG.CYCLE_INTERVAL);
        
        // Pause animation when page is not visible (performance optimization)
        document.addEventListener('visibilitychange', () => {
            clearInterval(cycleIntervalId);
            if (!document.hidden) {
                cycleIntervalId = setInterval(doCycle, CONFIG.CYCLE_INTERVAL);
            }
        });
    }

    // Start the collage
    initialize();
}

/**
 * Hero Scrolling Film Strips System
 * Creates horizontally scrolling rows of film screengrabs in alternating directions
 */
function initHeroScrolling() {
    const scrollingContainer = document.getElementById('heroScrolling');
    if (!scrollingContainer) return;

    const NUM_ROWS = 8;

    // Build and shuffle image array
    const allImages = HERO_FILMS
        .flatMap(film => 
            Array.from({ length: SCREENGRABS_PER_FILM }, (_, i) => 
                `images/${film}/screengrab${i + 1}.jpg`
            )
        )
        .sort(() => Math.random() - 0.5);

    // Create a film strip row with seamless infinite scroll
    const createFilmStrip = (images, direction) => {
        const strip = document.createElement('div');
        strip.className = `film-strip ${direction === 'right' ? 'scroll-right' : 'scroll-left'}`;
        
        const content = document.createElement('div');
        content.className = 'film-strip-content loading';
        
        // Duplicate images for seamless loop (animate by -50%)
        const fragment = document.createDocumentFragment();
        [...images, ...images].forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Film screengrab';
            fragment.appendChild(img);
        });
        
        content.appendChild(fragment);
        strip.appendChild(content);
        return strip;
    };

    // Create and append all film strips
    const imagesPerRow = Math.ceil(allImages.length / NUM_ROWS);
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < NUM_ROWS; i++) {
        const startIdx = i * imagesPerRow;
        const rowImages = allImages.slice(startIdx, startIdx + imagesPerRow);
        const direction = i % 2 === 0 ? 'left' : 'right';
        fragment.appendChild(createFilmStrip(rowImages, direction));
    }
    
    scrollingContainer.appendChild(fragment);
    
    // Start animations smoothly after DOM settles
    requestAnimationFrame(() => {
        setTimeout(() => {
            scrollingContainer.querySelectorAll('.film-strip-content')
                .forEach(content => content.classList.remove('loading'));
        }, 100);
    });
}

/**
 * Initialize glossary tooltips
 * Finds glossary terms in content and wraps them with interactive tooltips
 */
function initGlossary() {
    // Select content areas to search for glossary terms
    const contentAreas = document.querySelectorAll('p, li, h3, h4, .film-tagline');
    
    // Sort glossary by term length (longest first) to avoid partial matches
    const sortedGlossary = [...glossary].sort((a, b) => b.term.length - a.term.length);
    
    // Track already processed text nodes to avoid duplicate wrapping
    const processedNodes = new WeakSet();
    
    contentAreas.forEach(element => {
        // Skip if already processed or if it contains glossary terms already
        if (element.querySelector('.glossary-term')) return;
        
        // Get all text nodes
        const textNodes = getTextNodes(element);
        
        textNodes.forEach(textNode => {
            if (processedNodes.has(textNode)) return;
            
            let text = textNode.textContent;
            let hasMatch = false;
            const fragments = [];
            let lastIndex = 0;
            
            // Find all glossary terms in this text node
            sortedGlossary.forEach(({ term, definition, wikiLink }) => {
                // Create case-insensitive regex that matches whole words, including plurals
                // Match the term with optional 's' or 'es' at the end
                const pluralPattern = term.endsWith('s') 
                    ? `${escapeRegex(term)}(?:es)?` 
                    : `${escapeRegex(term)}(?:s|es)?`;
                const regex = new RegExp(`\\b(${pluralPattern})\\b`, 'gi');
                let match;
                
                while ((match = regex.exec(text)) !== null) {
                    hasMatch = true;
                    
                    // Store the match info
                    fragments.push({
                        start: match.index,
                        end: match.index + match[0].length,
                        text: match[0],
                        term,
                        definition,
                        wikiLink
                    });
                }
            });
            
            if (hasMatch) {
                // Sort fragments by position
                fragments.sort((a, b) => a.start - b.start);
                
                // Remove overlapping matches (keep first match)
                const nonOverlapping = [];
                fragments.forEach(fragment => {
                    const overlaps = nonOverlapping.some(existing => 
                        (fragment.start >= existing.start && fragment.start < existing.end) ||
                        (fragment.end > existing.start && fragment.end <= existing.end)
                    );
                    if (!overlaps) {
                        nonOverlapping.push(fragment);
                    }
                });
                
                // Create new content with wrapped terms
                const newContent = document.createDocumentFragment();
                let currentIndex = 0;
                
                nonOverlapping.forEach(fragment => {
                    // Add text before the match
                    if (currentIndex < fragment.start) {
                        newContent.appendChild(
                            document.createTextNode(text.substring(currentIndex, fragment.start))
                        );
                    }
                    
                    // Create glossary term wrapper
                    const wrapper = createGlossaryTerm(fragment.text, fragment.definition, fragment.wikiLink);
                    newContent.appendChild(wrapper);
                    
                    currentIndex = fragment.end;
                });
                
                // Add remaining text
                if (currentIndex < text.length) {
                    newContent.appendChild(document.createTextNode(text.substring(currentIndex)));
                }
                
                // Replace the text node with the new content
                textNode.parentNode.replaceChild(newContent, textNode);
                processedNodes.add(textNode);
            }
        });
    });
    
    // Create single global tooltip and add event listeners
    initTooltipBehavior();
}

/**
 * Get all text nodes within an element
 */
function getTextNodes(element) {
    const textNodes = [];
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: (node) => {
                // Skip empty text nodes and nodes in script/style tags
                if (!node.textContent.trim() || 
                    node.parentElement.tagName === 'SCRIPT' || 
                    node.parentElement.tagName === 'STYLE') {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );
    
    let node;
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }
    
    return textNodes;
}

/**
 * Escape special regex characters
 */
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Create a glossary term element (no embedded tooltip)
 */
function createGlossaryTerm(text, definition, wikiLink) {
    const wrapper = document.createElement('span');
    wrapper.className = 'glossary-term';
    wrapper.textContent = text;
    
    // Store definition and link as data attributes
    wrapper.dataset.definition = definition;
    wrapper.dataset.wikiLink = wikiLink;
    wrapper.dataset.termText = text;
    
    return wrapper;
}

/**
 * Initialize tooltip behavior with single global tooltip
 */
function initTooltipBehavior() {
    // Create single global tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'glossary-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    document.body.appendChild(tooltip);
    
    let currentTerm = null;
    let hideTimeout = null;
    
    /**
     * Build tooltip content from term data
     */
    function buildTooltipContent(term) {
        const definition = term.dataset.definition;
        const wikiLink = term.dataset.wikiLink;
        const termText = term.dataset.termText;
        
        // Extract Wikipedia article title from URL
        // URL format: https://en.wikipedia.org/wiki/Article_Name
        let articleTitle = 'Wikipedia';
        try {
            const url = new URL(wikiLink);
            const pathParts = url.pathname.split('/');
            const encodedTitle = pathParts[pathParts.length - 1];
            // Decode and replace underscores with spaces
            articleTitle = decodeURIComponent(encodedTitle).replace(/_/g, ' ');
        } catch (e) {
            // If URL parsing fails, use default
            console.warn('Failed to parse Wikipedia URL:', wikiLink);
        }
        
        tooltip.innerHTML = '';
        
        // Wikipedia link (rich format) - shown first as heading
        const link = document.createElement('a');
        link.className = 'glossary-tooltip-link';
        link.href = wikiLink;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', `Read more about ${termText} on Wikipedia`);
        
        // Left side content (icon + text)
        const linkContent = document.createElement('div');
        linkContent.className = 'glossary-tooltip-link-content';
        
        // Wikipedia icon
        const wikiIcon = document.createElement('img');
        wikiIcon.src = 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Wikipedia%27s_W.svg';
        wikiIcon.alt = 'Wikipedia';
        wikiIcon.className = 'wiki-icon';
        wikiIcon.width = 20;
        wikiIcon.height = 20;
        wikiIcon.loading = 'lazy';
        linkContent.appendChild(wikiIcon);
        
        // Text container
        const linkTextContainer = document.createElement('div');
        linkTextContainer.className = 'glossary-tooltip-link-text';
        
        const linkTitle = document.createElement('span');
        linkTitle.className = 'glossary-tooltip-link-title';
        linkTitle.textContent = articleTitle;
        linkTextContainer.appendChild(linkTitle);
        
        const linkSubtitle = document.createElement('span');
        linkSubtitle.className = 'glossary-tooltip-link-subtitle';
        linkSubtitle.textContent = 'Wikipedia';
        linkTextContainer.appendChild(linkSubtitle);
        
        linkContent.appendChild(linkTextContainer);
        link.appendChild(linkContent);
        
        // Right side icon (open in new tab)
        const icon = document.createElement('span');
        icon.className = 'material-symbols-rounded';
        icon.textContent = 'open_in_new';
        icon.setAttribute('aria-hidden', 'true');
        link.appendChild(icon);
        
        tooltip.appendChild(link);
        
        // Definition - shown below link
        const def = document.createElement('div');
        def.className = 'glossary-tooltip-definition';
        def.textContent = definition;
        tooltip.appendChild(def);
    }
    
    /**
     * Position tooltip near the term
     */
    function positionTooltip(term) {
        const rect = term.getBoundingClientRect();
        tooltip.classList.add('show');
        
        // Measure tooltip
        const tooltipRect = tooltip.getBoundingClientRect();
        
        // Calculate position (above the term with scroll offset)
        let top = rect.top + window.scrollY - tooltipRect.height - 12;
        let left = rect.left + window.scrollX + (rect.width / 2) - (tooltipRect.width / 2);
        
        // Keep tooltip within viewport horizontally
        const viewportWidth = window.innerWidth;
        if (left < 20) {
            left = 20;
        } else if (left + tooltipRect.width > viewportWidth - 20) {
            left = viewportWidth - tooltipRect.width - 20;
        }
        
        // If not enough space above, show below
        if (rect.top - tooltipRect.height - 12 < 0) {
            top = rect.bottom + window.scrollY + 12;
        }
        
        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
    }
    
    /**
     * Show tooltip for a term
     */
    function showTooltip(term) {
        // Clear any hide timeout
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }
        
        // If showing same term, do nothing
        if (currentTerm === term) {
            return;
        }
        
        // Hide previous term
        if (currentTerm) {
            currentTerm.classList.remove('active');
        }
        
        // Show new term
        currentTerm = term;
        term.classList.add('active');
        buildTooltipContent(term);
        positionTooltip(term);
    }
    
    /**
     * Hide tooltip
     */
    function hideTooltip() {
        tooltip.classList.remove('show');
        if (currentTerm) {
            currentTerm.classList.remove('active');
            currentTerm = null;
        }
    }
    
    /**
     * Schedule tooltip hide with delay
     */
    function scheduleHide() {
        if (hideTimeout) {
            clearTimeout(hideTimeout);
        }
        hideTimeout = setTimeout(() => {
            hideTooltip();
        }, 300);
    }
    
    // Add event listeners to all glossary terms
    document.querySelectorAll('.glossary-term').forEach(term => {
        // Mouse enter
        term.addEventListener('mouseenter', () => {
            showTooltip(term);
        });
        
        // Mouse leave
        term.addEventListener('mouseleave', () => {
            scheduleHide();
        });
        
        // Click for mobile
        term.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentTerm === term) {
                hideTooltip();
            } else {
                showTooltip(term);
            }
        });
    });
    
    // Allow hovering over tooltip itself
    tooltip.addEventListener('mouseenter', () => {
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }
    });
    
    tooltip.addEventListener('mouseleave', () => {
        scheduleHide();
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.glossary-term') && !e.target.closest('.glossary-tooltip')) {
            hideTooltip();
        }
    });
}