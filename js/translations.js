/**
 * @copyright Copyright (c) 2025 Developer
 *
 * @license AGPL-3.0-or-later
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
    
    // Define translations
    var translations = {
        "Same Window": "Same Window",
        "Prevent links on frontend widgets from opening in new windows/tabs": "Prevent links on frontend widgets from opening in new windows/tabs",
        "Configure how links should behave on frontend widgets": "Configure how links should behave on frontend widgets",
        "Enable Same Window functionality": "Enable Same Window functionality",
        "When enabled, links on frontend widgets will open in the same window instead of new tabs": "When enabled, links on frontend widgets will open in the same window instead of new tabs",
        "Target Selectors": "Target Selectors",
        "CSS selectors for links that should be modified (comma-separated)": "CSS selectors for links that should be modified (comma-separated)",
        "Exclude Selectors": "Exclude Selectors",
        "CSS selectors for links that should be excluded from modification (comma-separated)": "CSS selectors for links that should be excluded from modification (comma-separated)",
        "Save": "Save",
        "Saving...": "Saving...",
        "Settings saved successfully": "Settings saved successfully",
        "Error saving settings": "Error saving settings"
    };
    
    // Store in window for global access (needed for Nextcloud 31)
    if (typeof window !== 'undefined') {
        window.samewindowTranslations = translations;
    }
    
    // Register translations with OC.L10N if available
    if (typeof OC !== 'undefined' && OC.L10N) {
        try {
            OC.L10N.register('samewindow', translations);
            console.debug('SameWindow translations registered');
        } catch (e) {
            console.error('Failed to register SameWindow translations:', e);
        }
    }
})();
