// Modern JavaScript for the film companion guide
// This provides smooth scrolling, image handling, and interactive features

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initSmoothScrolling();
    initImageHandling();
    initLinkManagement();
    initScrollAnimations();
});

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
 * Handle poster image loading and error states
 */
function initImageHandling() {
    const posterImages = document.querySelectorAll('.poster-image');
    
    posterImages.forEach(img => {
        // Show image when loaded
        img.addEventListener('load', function() {
            if (this.complete && this.naturalHeight !== 0) {
                this.style.display = 'block';
                const placeholder = this.nextElementSibling;
                if (placeholder && placeholder.classList.contains('placeholder-text')) {
                    placeholder.style.display = 'none';
                }
            }
        });

        // Handle error by keeping placeholder visible
        img.addEventListener('error', function() {
            this.style.display = 'none';
            const placeholder = this.nextElementSibling;
            if (placeholder && placeholder.classList.contains('placeholder-text')) {
                placeholder.style.display = 'flex';
            }
        });

        // Check if image is already loaded (cached)
        if (img.complete && img.naturalHeight !== 0 && img.src !== '') {
            img.dispatchEvent(new Event('load'));
        }
    });
}

/**
 * Dynamic link management for the "Further Reading" sections
 */
function initLinkManagement() {
    // Helper function to add a new link
    window.addFilmLink = (sectionId, linkText, linkUrl) => {
        const linksList = document.getElementById(sectionId);
        if (!linksList) {
            console.error(`Section with id "${sectionId}" not found`);
            return;
        }

        // Remove placeholder if it exists
        const placeholder = linksList.querySelector('.placeholder-link');
        if (placeholder) {
            placeholder.parentElement.remove();
        }

        // Create new link element
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = linkUrl;
        a.textContent = linkText;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        
        li.appendChild(a);
        linksList.appendChild(li);
        
        // Animate the new link
        li.style.opacity = '0';
        li.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            li.style.transition = 'all 0.3s ease';
            li.style.opacity = '1';
            li.style.transform = 'translateY(0)';
        }, 10);
    };

    // Helper function to update poster images
    window.updatePosterImage = (filmId, imageUrl) => {
        const img = document.querySelector(`.poster-image[data-film="${filmId}"]`);
        if (!img) {
            console.error(`Poster for film "${filmId}" not found`);
            return;
        }
        img.src = imageUrl;
    };

    // Example usage in console:
    // addFilmLink('links-system', 'The Matrix and Ghost in the Shell Connection', 'https://example.com');
    // updatePosterImage('ghost', 'path/to/image.jpg');
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

    // Observe all course sections
    document.querySelectorAll('.course-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

/**
 * Utility function to generate different poster placeholder gradients
 */
const posterGradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
];

// Apply different gradients to each placeholder
document.querySelectorAll('.poster-placeholder').forEach((placeholder, index) => {
    const gradientIndex = index % posterGradients.length;
    placeholder.style.background = posterGradients[gradientIndex];
});

/**
 * Add keyboard navigation support
 */
document.addEventListener('keydown', (e) => {
    // Press 'H' to scroll to top
    if (e.key === 'h' || e.key === 'H') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

/**
 * Console message for the user
 */
console.log('%c🎬 Film Companion Guide', 'font-size: 20px; font-weight: bold; color: #0071e3;');
console.log('%cTo add links, use: addFilmLink(sectionId, linkText, linkUrl)', 'font-size: 12px; color: #6e6e73;');
console.log('%cSection IDs: "links-system", "links-self", "links-bridge", "links-dessert"', 'font-size: 12px; color: #6e6e73;');
console.log('%c\nTo update posters, use: updatePosterImage(filmId, imageUrl)', 'font-size: 12px; color: #6e6e73;');
console.log('%cFilm IDs: "ghost", "matrix", "perfect-blue", "black-swan", "paprika", "inception", "millennium"', 'font-size: 12px; color: #6e6e73;');
