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
        if (typeof OC === 'undefined') {
            console.error('OC is not defined - SameWindow cannot initialize');
            return;
        }
        
        // Ensure translations are registered if they're available
        if (OC.L10N && window.samewindowTranslations && !OC.L10N.getTranslationData('samewindow')) {
            try {
                OC.L10N.register('samewindow', window.samewindowTranslations);
                console.debug('SameWindow translations registered from init');
            } catch (e) {
                console.error('Failed to register SameWindow translations in init.js:', e);
            }
        }
        
        console.debug('SameWindow app init complete');
    });
})();
