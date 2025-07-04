/**
 * @copyright Copyright (c) 2025 Developer
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

(function() {
    'use strict';

    // Bail early if OC is not defined
    if (typeof OC === 'undefined') {
        console.error('SameWindow: OC is not defined, cannot initialize');
        return;
    }

    // Add debug logging to help diagnose issues
    const DEBUG = false; // Set to false for production
    function logDebug(message, ...args) {
        if (DEBUG) {
            console.log(`SameWindow DEBUG: ${message}`, ...args);
        }
    }

    // App is always enabled with default configuration
    const config = {
        enabled: true,
        // Main dashboard widgets and content areas
        widgetSelectors: [
            '.widget', 
            '.widgets', 
            '.widget-container', 
            '.dashboard-widget', 
            '.app-content .content', 
            '.app-content-list', 
            '.app-content-detail', 
            '#app-content',
            '.section',
            '.content-wrapper',
            '.dashboard-widget-item',
            '.api-dashboard-widget-item',
            '.panel', // Panel widgets
            '.panel-content', // Panel content areas
            '.recommendation' // Recommendation widgets
        ],
        // Links that should be modified
        targetSelectors: 'a[target="_blank"], a[target="_new"], a.recommendation, a[class*="recommendation"]',
        // Areas to exclude (navigation, headers, etc.)
        excludeSelectors: [
            '.external-link', 
            '.new-window-link', 
            '.navigation', 
            '#navigation', 
            '#app-navigation', 
            '.app-navigation', 
            '.header-right', 
            'header', 
            '#header', 
            '.header',
            '#appmenu',
            '.app-menu'
        ]
    };

    // Function to construct URL for recommendation links
    function constructRecommendationUrl(link) {
        logDebug('Constructing URL for recommendation link:', {
            'aria-describedby': link.getAttribute('aria-describedby'),
            'data-original-title': link.getAttribute('data-original-title'),
            'title': link.getAttribute('title'),
            'href': link.href,
            'id': link.id,
            'className': link.className
        });
        
        // Try to extract file ID from aria-describedby attribute
        const ariaDescribedBy = link.getAttribute('aria-describedby');
        if (ariaDescribedBy) {
            const match = ariaDescribedBy.match(/recommendation-description-(\d+)/);
            if (match) {
                const fileId = match[1];
                // Construct proper Nextcloud file URL
                const url = `${window.location.origin}/index.php/apps/files/files/${fileId}?dir=/&openfile=true`;
                logDebug('Constructed URL from file ID:', url);
                return url;
            }
        }
        
        // Fallback: try to use original title if available
        const originalTitle = link.getAttribute('data-original-title') || link.getAttribute('title');
        if (originalTitle && originalTitle.startsWith('/')) {
            const cleanTitle = originalTitle.split(' - ')[0]; // Remove our tooltip text
            const url = `${window.location.origin}/index.php/f${cleanTitle}`;
            logDebug('Constructed URL from title:', url);
            return url;
        }
        
        logDebug('Could not construct URL for recommendation link');
        return null;
    }

    // Check if an element should be excluded
    function isExcluded(element) {
        // Check if element itself matches any exclude selector
        for (const selector of config.excludeSelectors) {
            if (element.matches && element.matches(selector)) {
                logDebug('Element matches exclude selector', selector, element);
                return true;
            }
            
            // Check if element is inside an excluded container
            const parent = element.closest(selector);
            if (parent) {
                logDebug('Element is inside excluded container', selector, parent);
                return true;
            }
        }
        return false;
    }

    // Check if an element is inside a widget
    function isInWidget(element) {
        // Check if the element itself is a widget link
        if (element.matches && element.matches('.item-list__entry, .dashboard-widget-item, .api-dashboard-widget-item, .recommendation')) {
            logDebug('Element is a widget link', element);
            return true;
        }
        
        // Check if element is a link inside a dashboard widget or panel
        if (element.tagName === 'A') {
            // Check for various dashboard widget patterns
            const widgetParent = element.closest('.dashboard-widget, .panel, .widget, [class*="dashboard-widget"]');
            if (widgetParent) {
                logDebug('Element is a link inside dashboard widget', widgetParent);
                return true;
            }
            
            // Check for recommendation widgets or similar structures
            const recommendationParent = element.closest('[id*="recommendation"], [class*="recommendation"], [data-testid*="recommendation"]');
            if (recommendationParent) {
                logDebug('Element is a link inside recommendation widget', recommendationParent);
                return true;
            }
            
            // Generic Vue component detection - look for elements with data-v-* attributes
            // that are likely widget containers (have certain classes or structure)
            let parent = element.parentElement;
            while (parent && parent !== document.body) {
                // Check if parent has Vue data attributes and looks like a widget
                const hasVueData = Array.from(parent.attributes).some(attr => attr.name.startsWith('data-v-'));
                if (hasVueData) {
                    // Check if it has widget-like characteristics
                    const classList = parent.classList;
                    const hasWidgetClass = Array.from(classList).some(cls => 
                        cls.includes('widget') || 
                        cls.includes('panel') || 
                        cls.includes('dashboard') ||
                        cls.includes('recommendation') ||
                        cls.includes('item-list') ||
                        cls.includes('file-list')
                    );
                    if (hasWidgetClass) {
                        logDebug('Element is inside Vue widget component', parent);
                        return true;
                    }
                }
                parent = parent.parentElement;
            }
        }
        
        // Check other widget selectors
        for (const selector of config.widgetSelectors) {
            if (element.matches && element.matches(selector)) {
                logDebug('Element matches widget selector', selector, element);
                return true;
            }
            
            const parent = element.closest(selector);
            if (parent) {
                logDebug('Element is inside widget', selector, parent);
                return true;
            }
        }
        return false;
    }

    // Function to modify links
    function modifyLinks() {
        try {
            logDebug('Starting to modify links');
            
            // Find all links with target="_blank" or target="_new"
            const targetLinks = document.querySelectorAll(config.targetSelectors);
            logDebug(`Found ${targetLinks.length} target links`);
            
            let modified = 0;
            
            targetLinks.forEach(link => {
                logDebug('Processing link:', {
                    href: link.href,
                    target: link.getAttribute('target'),
                    classes: link.className,
                    id: link.id,
                    parentClasses: link.parentElement?.className,
                    parentId: link.parentElement?.id
                });
                
                // Skip if the link is already processed
                if (link.hasAttribute('data-samewindow-processed')) {
                    logDebug('Link already processed, skipping');
                    return;
                }
                
                // Mark as processed to avoid reprocessing
                link.setAttribute('data-samewindow-processed', 'true');
                
                // Check if link should be excluded
                if (isExcluded(link)) {
                    logDebug('Skipping excluded link', link);
                    return;
                }
                
                // Check if link is inside a widget
                if (!isInWidget(link)) {
                    logDebug('Skipping link not in widget', link);
                    return;
                }
                
                logDebug('Modifying link', link);
                modified++;
                
                // Check if this link has a target that opens new window
                const target = link.getAttribute('target');
                const isRecommendationLink = link.matches('.recommendation, [class*="recommendation"]');
                
                if (target === '_blank' || target === '_new' || isRecommendationLink) {
                    // Store the original target for restoration if needed
                    if (target) {
                        link.setAttribute('data-original-target', target);
                        // Remove the target attribute to prevent new window opening
                        link.removeAttribute('target');
                    }
                    
                    // For recommendation links, store the original title before modifying it
                    if (isRecommendationLink) {
                        const originalTitle = link.getAttribute('title') || '';
                        link.setAttribute('data-original-title', originalTitle);
                    }
                    
                    // Don't modify the title - let users discover middle-click behavior naturally

                    // Handle click events to allow modifier key overrides
                    link.addEventListener('click', function(e) {
                        logDebug('Click event:', {
                            href: link.href,
                            ctrlKey: e.ctrlKey,
                            metaKey: e.metaKey,
                            shiftKey: e.shiftKey,
                            which: e.which,
                            button: e.button,
                            isRecommendation: isRecommendationLink
                        });
                        
                        // If user uses modifier keys or middle click, open in new tab/window
                        if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) {
                            logDebug('Modifier key detected, opening in new tab/window');
                            
                            // Prevent default behavior
                            e.preventDefault();
                            
                            // For recommendation links, try to construct URL from title
                            let url = link.href;
                            if (isRecommendationLink) {
                                url = constructRecommendationUrl(link);
                                if (!url) {
                                    logDebug('Could not construct URL for recommendation link');
                                    return;
                                }
                            }
                            
                            // Open in new tab/window based on modifier key
                            if (url && url !== window.location.href) {
                                if (e.shiftKey) {
                                    // Shift+click opens in new window
                                    logDebug('Opening in new window (Shift+click)');
                                    window.open(url, '_blank', 'noopener,noreferrer');
                                } else {
                                    // Ctrl/Cmd+click or middle click opens in new tab
                                    logDebug('Opening in new tab (Ctrl/Cmd+click or middle click)');
                                    window.open(url, '_blank');
                                }
                            }
                            return;
                        }
                        
                        logDebug('Normal click, will open in same window');
                        
                        // For normal clicks on recommendation links, let Vue.js handle the navigation
                        // For regular links, ensure target is removed (same window behavior)
                        if (!isRecommendationLink) {
                            link.removeAttribute('target');
                        }
                        // Let the browser/Vue handle the click naturally
                    }, true); // Use capture phase to intercept before Vue.js
                    
                    // Also handle mousedown event to catch middle clicks
                    link.addEventListener('mousedown', function(e) {
                        if (e.button === 1) { // Middle click
                            logDebug('Middle click detected (mousedown)');
                            e.preventDefault();
                            
                            // For recommendation links, try to construct URL from title
                            let url = link.href;
                            if (isRecommendationLink) {
                                url = constructRecommendationUrl(link);
                                if (!url) {
                                    logDebug('Could not construct URL for recommendation link');
                                    return;
                                }
                            }
                            
                            if (url && url !== window.location.href) {
                                window.open(url, '_blank');
                            }
                        }
                    }, true); // Use capture phase
                }
            });
            
            logDebug(`Modified ${modified} links`);
            
        } catch (error) {
            console.error('SameWindow: Error modifying links:', error);
        }
    }

    // Observer to watch for dynamically added content
    function setupObserver() {
        try {
            const observer = new MutationObserver(function(mutations) {
                let shouldProcess = false;
                
                for (const mutation of mutations) {
                    if (mutation.type === 'childList') {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                // Look for new target links
                                if (node.querySelector && node.querySelector(config.targetSelectors)) {
                                    shouldProcess = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (shouldProcess) break;
                }
                
                if (shouldProcess) {
                    // Debounce the processing to avoid excessive calls
                    clearTimeout(observer.timer);
                    observer.timer = setTimeout(modifyLinks, 100);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            logDebug('Observer set up successfully');
            
        } catch (error) {
            console.error('SameWindow: Error setting up observer:', error);
        }
    }

    // Initialize the app
    function init() {
        try {
            logDebug('Initializing SameWindow');
            
            // Process existing links
            modifyLinks();
            
            // Set up observer for dynamic content
            setupObserver();
            
            // Process links when DOM is fully loaded
            document.addEventListener('DOMContentLoaded', modifyLinks);
            
            // Also process after a short delay for dynamic content
            setTimeout(modifyLinks, 1000);
            
            console.log('SameWindow: Initialized successfully');
            
        } catch (error) {
            console.error('SameWindow: Error during initialization:', error);
        }
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose for debugging
    window.SameWindow = {
        config: config,
        modifyLinks: modifyLinks,
        isInWidget: isInWidget,
        isExcluded: isExcluded
    };
})();
