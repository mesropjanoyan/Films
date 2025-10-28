/**
 * Film Home School - Main Application
 * Author: Mesrop Janoyan
 */

import { createClient } from '@supabase/supabase-js'

// Supabase Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Application initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('Film Home School application loaded');
    init();
});

/**
 * Initialize the application
 */
async function init() {
    console.log('Initializing Film Home School...');
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
    
    // Setup event listeners FIRST before any DOM manipulation
    setupEventListeners();
    
    // Load glossary terms from Supabase
    const glossaryMap = await loadGlossary();
    console.log('Glossary loaded with', glossaryMap.size, 'terms');
    
    // Highlight glossary terms in the main content
    if (glossaryMap.size > 0) {
        highlightGlossaryTerms('.main-content', glossaryMap);
        
        // Initialize tooltip functionality
        initializeGlossaryTooltips();
    } else {
        console.error('No glossary terms loaded!');
    }
    
    loadContent();
}

/**
 * Setup event listeners for interactive elements
 */
function setupEventListeners() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const root = document.documentElement;
            const currentTheme = root.getAttribute('data-theme');
            
            // Toggle between light and dark
            // If currentTheme is 'dark', switch to light
            // Otherwise (light, null, or undefined), switch to dark
            if (currentTheme === 'dark') {
                root.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                console.log('Switched to light mode');
            } else {
                root.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                console.log('Switched to dark mode');
            }
        });
        
        console.log('Theme toggle button found and listener attached');
    } else {
        console.error('Theme toggle button not found');
    }
    
    console.log('Event listeners initialized');
}

/**
 * Load initial content
 */
async function loadContent() {
    console.log('Loading initial content...');
    // Add content loading logic here
    // Example: Fetch data from Supabase
    // const { data, error } = await supabase.from('your_table').select('*')
}

/**
 * Load glossary terms and definitions from Supabase
 * @returns {Promise<Map>} - A Map with terms as keys and definitions as values
 */
async function loadGlossary() {
    try {
        console.log('Attempting to fetch glossary from Supabase...');
        
        // Fetch term, definition, and wikipedia_url columns from the glossary table
        const { data, error } = await supabase
            .from('glossary')
            .select('term, definition, wikipedia_url')
            .order('term', { ascending: true });

        if (error) {
            console.error('Supabase error:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
        }

        console.log('Raw data from Supabase:', data);
        console.log('Number of records:', data ? data.length : 0);

        // If no data from Supabase, try loading from CSV
        if (!data || data.length === 0) {
            console.warn('No data in Supabase. Loading from local CSV file...');
            return await loadGlossaryFromCSV();
        }

        // Create a new Map to store the glossary
        const glossaryMap = new Map();

        // Populate the Map with term as key and object with definition and wikipedia_url as value
        if (data && data.length > 0) {
            data.forEach(entry => {
                if (entry.term && entry.definition) {
                    glossaryMap.set(entry.term, {
                        definition: entry.definition,
                        wikipedia_url: entry.wikipedia_url || null
                    });
                }
            });
        }

        console.log(`Loaded ${glossaryMap.size} glossary terms from Supabase`);
        return glossaryMap;

    } catch (error) {
        console.error('Exception loading glossary:', error);
        console.error('Stack trace:', error.stack);
        console.warn('Falling back to CSV file...');
        return await loadGlossaryFromCSV();
    }
}

/**
 * Load glossary from local CSV file as fallback
 * @returns {Promise<Map>} - A Map with terms as keys and objects with definition and wikipedia_url
 */
async function loadGlossaryFromCSV() {
    try {
        const response = await fetch('/local_files/glossary.csv');
        if (!response.ok) {
            console.error('Failed to load CSV file');
            return new Map();
        }
        
        const csvText = await response.text();
        const lines = csvText.split('\n');
        const glossaryMap = new Map();
        
        // Parse header to find column indices
        const header = lines[0].toLowerCase().split(',');
        const termIndex = header.indexOf('term');
        const definitionIndex = header.indexOf('definition');
        const wikiIndex = header.findIndex(col => col.includes('wiki'));
        
        // Skip header row, start from line 1
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Simple CSV parsing (note: this won't handle commas within quoted fields perfectly)
            // For production, consider using a proper CSV parser library
            const values = line.split(',');
            
            if (values.length > definitionIndex) {
                const term = values[termIndex]?.replace(/^"|"$/g, '').trim();
                let definition = values[definitionIndex]?.replace(/^"|"$/g, '').trim();
                const wikipedia_url = wikiIndex >= 0 ? values[wikiIndex]?.replace(/^"|"$/g, '').trim() : null;
                
                if (term && definition) {
                    // Clean up escaped quotes
                    definition = definition.replace(/""/g, '"');
                    
                    glossaryMap.set(term, {
                        definition: definition,
                        wikipedia_url: wikipedia_url || null
                    });
                }
            }
        }
        
        console.log(`Loaded ${glossaryMap.size} glossary terms from CSV file`);
        return glossaryMap;
        
    } catch (error) {
        console.error('Error loading CSV:', error);
        return new Map();
    }
}

/**
 * Highlight glossary terms in the content
 * @param {string} selector - CSS selector for the content to scan (e.g., '.main-content')
 * @param {Map} glossaryMap - Map of glossary terms and definitions
 */
function highlightGlossaryTerms(selector, glossaryMap) {
    const containers = document.querySelectorAll(selector);
    
    if (containers.length === 0) {
        console.warn(`No elements found for selector: ${selector}`);
        return;
    }

    console.log(`Found ${containers.length} container(s) to scan for glossary terms`);
    
    // Convert Map to array and sort by length (longest first to avoid partial matches)
    const terms = Array.from(glossaryMap.entries()).sort((a, b) => b[0].length - a[0].length);
    
    containers.forEach(container => {
        highlightInElement(container, terms);
    });

    console.log(`Glossary highlighting complete`);
}

/**
 * Highlight glossary terms within a specific element
 * @param {Element} element - The element to process
 * @param {Array} terms - Array of [term, definition] pairs
 */
function highlightInElement(element, terms) {
    // Get all text nodes
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                // Skip if parent is already a glossary term
                if (node.parentElement && node.parentElement.classList.contains('glossary-term')) {
                    return NodeFilter.FILTER_REJECT;
                }
                // Skip if text is only whitespace
                if (!node.textContent.trim()) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    const textNodes = [];
    let currentNode;
    while (currentNode = walker.nextNode()) {
        textNodes.push(currentNode);
    }

    // Process each text node
    textNodes.forEach(textNode => {
        const text = textNode.textContent;
        const matches = [];

        // Find all term matches in this text node
        terms.forEach(([term, data]) => {
            // Escape special regex characters in the term
            const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            
            // Create case-insensitive regex with word boundaries
            const regex = new RegExp(`\\b${escapedTerm}\\b`, 'gi');
            let match;

            while ((match = regex.exec(text)) !== null) {
                matches.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0], // Preserve original capitalization from the text
                    definition: typeof data === 'string' ? data : data.definition,
                    wikipedia_url: typeof data === 'object' ? data.wikipedia_url : null,
                    term: term
                });
            }
        });

        // If we have matches, rebuild the node
        if (matches.length > 0) {
            // Sort matches by position and remove overlaps (keep first occurrence)
            matches.sort((a, b) => a.start - b.start);
            const nonOverlapping = [];
            
            matches.forEach(match => {
                const overlaps = nonOverlapping.some(existing => 
                    (match.start >= existing.start && match.start < existing.end) ||
                    (match.end > existing.start && match.end <= existing.end)
                );
                if (!overlaps) {
                    nonOverlapping.push(match);
                }
            });

            // Create document fragment with highlighted terms
            const fragment = document.createDocumentFragment();
            let lastIndex = 0;

            nonOverlapping.forEach(match => {
                // Add text before the match
                if (match.start > lastIndex) {
                    fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.start)));
                }

                // Add the glossary term span
                const span = document.createElement('span');
                span.className = 'glossary-term';
                span.setAttribute('data-definition', match.definition);
                if (match.wikipedia_url) {
                    span.setAttribute('data-wikipedia-url', match.wikipedia_url);
                }
                span.textContent = match.text; // Use the actual text from the document (preserves capitalization)
                fragment.appendChild(span);

                lastIndex = match.end;
            });

            // Add remaining text
            if (lastIndex < text.length) {
                fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
            }

            // Replace the text node with the fragment
            textNode.parentNode.replaceChild(fragment, textNode);
        }
    });
}

/**
 * Initialize glossary tooltip functionality
 * Handles both desktop (hover) and mobile (click) interactions
 */
function initializeGlossaryTooltips() {
    // Create a single tooltip div and append it to the body
    const tooltip = document.createElement('div');
    tooltip.id = 'glossary-tooltip';
    tooltip.className = 'glossary-tooltip';
    document.body.appendChild(tooltip);

    let currentTerm = null; // Track the currently active term for mobile
    let hideTimeout = null; // Timeout for delayed hiding

    /**
     * Build tooltip content with definition and optional Wikipedia link
     */
    function buildTooltipContent(definition, wikipediaUrl) {
        tooltip.innerHTML = ''; // Clear existing content
        
        // Add definition text
        const defText = document.createElement('p');
        defText.className = 'tooltip-definition';
        defText.textContent = definition;
        tooltip.appendChild(defText);
        
        // Add Wikipedia link if available
        if (wikipediaUrl) {
            const wikiLink = document.createElement('a');
            wikiLink.href = wikipediaUrl;
            wikiLink.target = '_blank';
            wikiLink.rel = 'noopener noreferrer';
            wikiLink.className = 'tooltip-wiki-link';
            
            // Wikipedia logo using inline SVG
            wikiLink.innerHTML = `
                <span class="wiki-icon-container">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" class="wiki-icon" aria-label="Wikipedia">
                        <path d="M 120.85,29.21 C 120.85,29.62 120.72,29.99 120.47,30.33 C 120.21,30.66 119.94,30.83 119.63,30.83 C 117.14,31.07 115.09,31.87 113.51,33.24 C 111.92,34.6 110.29,37.21 108.6,41.05 L 82.8,99.19 C 82.63,99.73 82.16,100 81.38,100 C 80.77,100 80.3,99.73 79.96,99.19 L 65.49,68.93 L 48.85,99.19 C 48.51,99.73 48.04,100 47.43,100 C 46.69,100 46.2,99.73 45.96,99.19 L 20.61,41.05 C 19.03,37.44 17.36,34.92 15.6,33.49 C 13.85,32.06 11.4,31.17 8.27,30.83 C 8,30.83 7.74,30.69 7.51,30.4 C 7.27,30.12 7.15,29.79 7.15,29.42 C 7.15,28.47 7.42,28 7.96,28 C 10.22,28 12.58,28.1 15.05,28.3 C 17.34,28.51 19.5,28.61 21.52,28.61 C 23.58,28.61 26.01,28.51 28.81,28.3 C 31.74,28.1 34.34,28 36.6,28 C 37.14,28 37.41,28.47 37.41,29.42 C 37.41,30.36 37.24,30.83 36.91,30.83 C 34.65,31 32.87,31.58 31.57,32.55 C 30.27,33.53 29.62,34.81 29.62,36.4 C 29.62,37.21 29.89,38.22 30.43,39.43 L 51.38,86.74 L 63.27,64.28 L 52.19,41.05 C 50.2,36.91 48.56,34.23 47.28,33.03 C 46,31.84 44.06,31.1 41.46,30.83 C 41.22,30.83 41,30.69 40.78,30.4 C 40.56,30.12 40.45,29.79 40.45,29.42 C 40.45,28.47 40.68,28 41.16,28 C 43.42,28 45.49,28.1 47.38,28.3 C 49.2,28.51 51.14,28.61 53.2,28.61 C 55.22,28.61 57.36,28.51 59.62,28.3 C 61.95,28.1 64.24,28 66.5,28 C 67.04,28 67.31,28.47 67.31,29.42 C 67.31,30.36 67.15,30.83 66.81,30.83 C 62.29,31.14 60.03,32.42 60.03,34.68 C 60.03,35.69 60.55,37.26 61.6,39.38 L 68.93,54.26 L 76.22,40.65 C 77.23,38.73 77.74,37.11 77.74,35.79 C 77.74,32.69 75.48,31.04 70.96,30.83 C 70.55,30.83 70.35,30.36 70.35,29.42 C 70.35,29.08 70.45,28.76 70.65,28.46 C 70.86,28.15 71.06,28 71.26,28 C 72.88,28 74.87,28.1 77.23,28.3 C 79.49,28.51 81.35,28.61 82.8,28.61 C 83.84,28.61 85.38,28.52 87.4,28.35 C 89.96,28.12 92.11,28 93.83,28 C 94.23,28 94.43,28.4 94.43,29.21 C 94.43,30.29 94.06,30.83 93.32,30.83 C 90.69,31.1 88.57,31.83 86.97,33.01 C 85.37,34.19 83.37,36.87 80.98,41.05 L 71.26,59.02 L 84.42,85.83 L 103.85,40.65 C 104.52,39 104.86,37.48 104.86,36.1 C 104.86,32.79 102.6,31.04 98.08,30.83 C 97.67,30.83 97.47,30.36 97.47,29.42 C 97.47,28.47 97.77,28 98.38,28 C 100.03,28 101.99,28.1 104.25,28.3 C 106.34,28.51 108.1,28.61 109.51,28.61 C 111,28.61 112.72,28.51 114.67,28.3 C 116.7,28.1 118.52,28 120.14,28 C 120.61,28 120.85,28.4 120.85,29.21 z" />
                    </svg>
                </span>
                <span>Read more on Wikipedia</span>
            `;
            
            tooltip.appendChild(wikiLink);
        }
    }

    // Desktop: Mouseover event listener
    document.addEventListener('mouseover', (event) => {
        const term = event.target.closest('.glossary-term');
        
        if (term) {
            // Clear any pending hide timeout
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
            
            const definition = term.getAttribute('data-definition');
            const wikipediaUrl = term.getAttribute('data-wikipedia-url');
            
            if (definition) {
                buildTooltipContent(definition, wikipediaUrl);
                positionTooltip(tooltip, term);
                tooltip.classList.add('show');
            }
        }
        
        // Also check if hovering over tooltip itself - keep it visible
        if (event.target.closest('.glossary-tooltip')) {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }
        }
    });

    // Desktop: Mouseout event listener
    document.addEventListener('mouseout', (event) => {
        const term = event.target.closest('.glossary-term');
        
        if (term) {
            // Clear any existing timeout
            if (hideTimeout) {
                clearTimeout(hideTimeout);
            }
            
            // Set a delay before hiding (300ms gives time to move cursor to tooltip)
            hideTimeout = setTimeout(() => {
                tooltip.classList.remove('show');
            }, 300);
        }
        
        // If leaving the tooltip, hide it with delay
        if (event.target.closest('.glossary-tooltip')) {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
            }
            
            hideTimeout = setTimeout(() => {
                tooltip.classList.remove('show');
            }, 300);
        }
    });

    // Mobile: Click event listener
    document.addEventListener('click', (event) => {
        const term = event.target.closest('.glossary-term');
        
        // Don't close tooltip if clicking the Wikipedia link
        if (event.target.closest('.tooltip-wiki-link')) {
            return;
        }
        
        if (term) {
            event.preventDefault();
            
            if (currentTerm === term && tooltip.classList.contains('show')) {
                tooltip.classList.remove('show');
                currentTerm = null;
            } else {
                const definition = term.getAttribute('data-definition');
                const wikipediaUrl = term.getAttribute('data-wikipedia-url');
                
                if (definition) {
                    buildTooltipContent(definition, wikipediaUrl);
                    positionTooltip(tooltip, term);
                    tooltip.classList.add('show');
                    currentTerm = term;
                }
            }
        } else {
            // User clicked anywhere else - hide the tooltip
            if (tooltip.classList.contains('show')) {
                tooltip.classList.remove('show');
                currentTerm = null;
            }
        }
    });

    console.log('Glossary tooltips initialized');
}

/**
 * Position the tooltip relative to the target element
 * @param {HTMLElement} tooltip - The tooltip element
 * @param {HTMLElement} target - The target element (glossary term)
 */
function positionTooltip(tooltip, target) {
    const rect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    // Position above the term by default
    let top = rect.top + window.scrollY - tooltipRect.height - 12;
    let left = rect.left + window.scrollX;
    
    // If tooltip would go off the top of the screen, position it below instead
    if (rect.top - tooltipRect.height - 12 < 0) {
        top = rect.bottom + window.scrollY + 12;
    }
    
    // Ensure tooltip doesn't go off the right edge of the screen
    if (left + tooltipRect.width > window.innerWidth) {
        left = window.innerWidth - tooltipRect.width - 20;
    }
    
    // Ensure tooltip doesn't go off the left edge
    if (left < 10) {
        left = 10;
    }
    
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
}

/**
 * Utility function for API calls (for non-Supabase APIs)
 * @param {string} url - The API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} - The fetch promise
 */
async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// Export functions if using modules
export { init, fetchData, loadGlossary, highlightGlossaryTerms, initializeGlossaryTooltips }
