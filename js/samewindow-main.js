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
            '.content-wrapper'
        ],
        // Links that should be modified
        targetSelectors: 'a[target="_blank"], a[target="_new"]',
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
                // Skip if the link is already processed
                if (link.hasAttribute('data-samewindow-processed')) {
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
                
                // Remove target attributes that open new windows
                if (link.hasAttribute('target')) {
                    const target = link.getAttribute('target');
                    if (target === '_blank' || target === '_new') {
                        link.removeAttribute('target');
                        
                        // Add a visual indicator that this link was modified
                        const currentTitle = link.getAttribute('title') || '';
                        link.setAttribute('title', 
                            currentTitle + 
                            (currentTitle ? ' - ' : '') + 
                            'Opens in same tab'
                        );
                    }
                }

                // Also handle click events for any programmatic target="_blank" settings
                link.addEventListener('click', function(e) {
                    // Prevent default if it would open in new window
                    if (e.ctrlKey || e.metaKey || e.shiftKey) {
                        // Allow user to override by holding Ctrl/Cmd/Shift
                        return;
                    }
                    
                    // For relative links, let them navigate normally
                    if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
                        return;
                    }
                    
                    // For external links, navigate in same window
                    if (link.href && link.href !== window.location.href) {
                        window.location.href = link.href;
                        e.preventDefault();
                    }
                });
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
