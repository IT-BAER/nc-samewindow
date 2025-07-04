<?php

declare(strict_types=1);

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

namespace OCA\SameWindow\Controller;

use OCA\SameWindow\AppInfo\Application;
use OCP\AppFramework\Http;
use OCP\AppFramework\OCS\OCSController;
use OCP\AppFramework\Http\DataResponse;
use OCP\IRequest;
use OCP\IL10N;

class L10NController extends OCSController {

    public function __construct(
        string $appName,
        IRequest $request,
        private IL10N $l10n
    ) {
        parent::__construct($appName, $request);
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     * @PublicPage
     * @CORS
     * 
     * @return DataResponse
     */
    public function getTranslations(): DataResponse {
        // Load translations from JSON file
        $jsonFile = __DIR__ . '/../../l10n/' . $this->l10n->getLanguageCode() . '.json';
        
        if (!file_exists($jsonFile)) {
            $jsonFile = __DIR__ . '/../../l10n/en.json';
        }
        
        if (file_exists($jsonFile)) {
            $translations = json_decode(file_get_contents($jsonFile), true);
            if ($translations && isset($translations['translations'])) {
                return new DataResponse($translations['translations']);
            }
        }
        
        // Fallback hardcoded translations
        return new DataResponse([
            "Same Window" => "Same Window",
            "Prevent links on frontend widgets from opening in new windows/tabs" => "Prevent links on frontend widgets from opening in new windows/tabs",
            "Configure how links should behave on frontend widgets" => "Configure how links should behave on frontend widgets",
            "Enable Same Window functionality" => "Enable Same Window functionality",
            "When enabled, links on frontend widgets will open in the same window instead of new tabs" => "When enabled, links on frontend widgets will open in the same window instead of new tabs",
            "Target Selectors" => "Target Selectors",
            "CSS selectors for links that should be modified (comma-separated)" => "CSS selectors for links that should be modified (comma-separated)",
            "Exclude Selectors" => "Exclude Selectors",
            "CSS selectors for links that should be excluded from modification (comma-separated)" => "CSS selectors for links that should be excluded from modification (comma-separated)",
            "Save" => "Save",
            "Saving..." => "Saving...",
            "Settings saved successfully" => "Settings saved successfully",
            "Error saving settings" => "Error saving settings"
        ]);
    }
}
