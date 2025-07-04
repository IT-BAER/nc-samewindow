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

    // App is always enabled with default configuration
    const config = {
        enabled: true,
        targetSelectors: 'a[target="_blank"], a[target="_new"]',
        excludeSelectors: '.external-link, .new-window-link'
    };

    // Function to modify links
    function modifyLinks() {
        try {
            // Find all links that match the target selectors
            const targetLinks = document.querySelectorAll(config.targetSelectors);
            
            targetLinks.forEach(link => {
                // Skip if the link matches exclude selectors
                if (config.excludeSelectors && link.matches(config.excludeSelectors)) {
                    return;
                }

                // Skip if the link is already processed
                if (link.hasAttribute('data-samewindow-processed')) {
                    return;
                }

                // Mark as processed
                link.setAttribute('data-samewindow-processed', 'true');

                // Remove target attributes that open new windows
                if (link.hasAttribute('target')) {
                    const target = link.getAttribute('target');
                    if (target === '_blank' || target === '_new') {
                        link.removeAttribute('target');
                        
                        // Add a visual indicator that this link was modified
                        link.setAttribute('title', 
                            (link.getAttribute('title') || '') + 
                            ' (Modified by SameWindow to open in same tab)'
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
        } catch (error) {
            console.error('SameWindow: Error modifying links:', error);
        }
    }

    // Observer to watch for dynamically added content
    function setupObserver() {
        try {
            const observer = new MutationObserver(function(mutations) {
                let shouldProcess = false;
                
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(function(node) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                // Check if the added node or its children contain links
                                if (node.tagName === 'A' || node.querySelectorAll('a').length > 0) {
                                    shouldProcess = true;
                                }
                            }
                        });
                    }
                });
                
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
        } catch (error) {
            console.error('SameWindow: Error setting up observer:', error);
        }
    }

    // Initialize the app
    function init() {
        try {
            // Process existing links
            modifyLinks();
            
            // Set up observer for dynamic content
            setupObserver();
            
            // Process links when widgets are loaded
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
        modifyLinks: modifyLinks
    };
})();
