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
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\DataResponse;
use OCP\IConfig;
use OCP\IRequest;

class ConfigController extends Controller {

	public function __construct(
		string $appName,
		IRequest $request,
		private IConfig $config,
	) {
		parent::__construct($appName, $request);
	}

	/**
	 * @NoAdminRequired
	 * @CORS
	 */
	public function getConfig(): DataResponse {
		$data = [
			'enabled' => $this->config->getAppValue(Application::APP_ID, 'enabled', 'yes') === 'yes',
			'target_selectors' => $this->config->getAppValue(Application::APP_ID, 'target_selectors', 'a[target="_blank"], a[target="_new"]'),
			'exclude_selectors' => $this->config->getAppValue(Application::APP_ID, 'exclude_selectors', '.external-link, .new-window-link'),
		];
		return new DataResponse($data);
	}

	/**
	 * @NoAdminRequired
	 * @CORS
	 */
	public function setConfig(): DataResponse {
		$params = $this->request->getParams();

		$enabled = isset($params['enabled']) ? (bool)$params['enabled'] : null;
		$targetSelectors = $params['targetSelectors'] ?? null;
		$excludeSelectors = $params['excludeSelectors'] ?? null;

		if ($enabled !== null) {
			$this->config->setAppValue(Application::APP_ID, 'enabled', $enabled ? 'yes' : 'no');
		}

		if ($targetSelectors !== null) {
			$this->config->setAppValue(Application::APP_ID, 'target_selectors', $targetSelectors);
		}

		if ($excludeSelectors !== null) {
			$this->config->setAppValue(Application::APP_ID, 'exclude_selectors', $excludeSelectors);
		}

		return new DataResponse(['status' => 'success']);
	}
}
