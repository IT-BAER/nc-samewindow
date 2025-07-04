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

import { getRequestToken } from '@nextcloud/auth'
import { generateUrl } from '@nextcloud/router'
import axios from '@nextcloud/axios'

/**
 * Load translations for the app
 */
export async function loadTranslations() {
    try {
        const response = await axios.get(generateUrl('/apps/samewindow/l10n'), {
            headers: {
                requesttoken: getRequestToken(),
            },
        })
        
        if (response.status === 200 && response.data) {
            // Register translations with OC.L10N
            OC.L10N.register('samewindow', response.data)
            return true
        }
    } catch (error) {
        console.error('Failed to load SameWindow translations:', error)
    }
    
    // Fallback to hardcoded translations if server request fails
    OC.L10N.register('samewindow', {
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
    })
    
    return false
}
