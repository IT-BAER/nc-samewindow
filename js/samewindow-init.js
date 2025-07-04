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

    // Initialize the app
    document.addEventListener('DOMContentLoaded', function() {
        if (typeof OC === 'undefined' || typeof OC.L10N === 'undefined') {
            return;
        }
        
        // Check if translations are already registered
        if (!OC.L10N.getTranslationData('samewindow')) {
            // If not registered yet, register again to ensure availability
            try {
                OC.L10N.register('samewindow', window.samewindowTranslations || {
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
                });
            } catch (e) {
                console.error('Failed to register SameWindow translations in init.js:', e);
            }
        }
    });
})();
