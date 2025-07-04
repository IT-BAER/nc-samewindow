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

namespace OCA\SameWindow\Settings;

use OCA\SameWindow\AppInfo\Application;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\IConfig;
use OCP\Settings\ISettings;

class Admin implements ISettings {

    public function __construct(
        private IConfig $config,
    ) {
    }

    public function getForm(): TemplateResponse {
        $parameters = [
            'enabled' => $this->config->getAppValue(Application::APP_ID, 'enabled', 'yes') === 'yes',
            'target_selectors' => $this->config->getAppValue(Application::APP_ID, 'target_selectors', 'a[target="_blank"], a[target="_new"]'),
            'exclude_selectors' => $this->config->getAppValue(Application::APP_ID, 'exclude_selectors', '.external-link, .new-window-link'),
        ];

        return new TemplateResponse(Application::APP_ID, 'admin', $parameters);
    }

    public function getSection(): string {
        return 'samewindow';
    }

    public function getPriority(): int {
        return 50;
    }
}
