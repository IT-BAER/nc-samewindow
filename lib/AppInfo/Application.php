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

namespace OCA\SameWindow\AppInfo;

use OCA\SameWindow\Listener\LoadAdditionalScriptsListener;
use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\AppFramework\Http\Events\BeforeTemplateRenderedEvent;
use OCP\IConfig;
use OCP\IL10N;
use OCP\IRequest;

class Application extends App implements IBootstrap {
    public const APP_ID = 'samewindow';

    public function __construct(array $urlParams = []) {
        parent::__construct(self::APP_ID, $urlParams);
    }

    public function register(IRegistrationContext $context): void {
        $context->registerEventListener(BeforeTemplateRenderedEvent::class, LoadAdditionalScriptsListener::class);
        
        // Register controllers as OCS controllers
        $context->registerService('OCA\SameWindow\Controller\ConfigController', function($c) {
            return new \OCA\SameWindow\Controller\ConfigController(
                self::APP_ID,
                $c->get(IRequest::class),
                $c->get(IConfig::class)
            );
        });
        
        $context->registerService('OCA\SameWindow\Controller\L10NController', function($c) {
            return new \OCA\SameWindow\Controller\L10NController(
                self::APP_ID,
                $c->get(IRequest::class),
                $c->get(IL10N::class)
            );
        });
        
        // Initialize L10N first for Nextcloud 31 compatibility
        \OC::$server->getL10NFactory()->get(self::APP_ID);
        
        // Load styles first
        \OCP\Util::addStyle(self::APP_ID, 'samewindow');
        
        // Load scripts in correct order
        // First load the translations script without subdirectory path
        \OCP\Util::addScript(self::APP_ID, 'translations');
        
        // Then load the initialization script
        \OCP\Util::addScript(self::APP_ID, 'samewindow-init');
        
        // Finally load the main app script
        \OCP\Util::addScript(self::APP_ID, 'samewindow');
    }

    public function boot(IBootContext $context): void {
        // Initialize translations early to avoid missing translation errors
        $this->initTranslations();
    }
    
    /**
     * Initialize app translations
     */
    private function initTranslations(): void {
        // Make sure translations are properly initialized for Nextcloud 31
        try {
            // Get the language factory
            $l10nFactory = \OC::$server->getL10NFactory();
            
            // Pre-load app translations
            $l10n = $l10nFactory->get(self::APP_ID);
            
            // Force load the translations for this app
            $l10nDir = \OC::$SERVERROOT . '/apps/' . self::APP_ID . '/l10n/';
            $l10nFile = $l10nDir . $l10n->getLanguageCode() . '.json';
            
            if (!file_exists($l10nFile)) {
                $l10nFile = $l10nDir . 'en.json';
            }
            
            if (file_exists($l10nFile)) {
                $translations = json_decode(file_get_contents($l10nFile), true);
                if (isset($translations['translations'])) {
                    // The translations are already properly formatted, no need to do anything else
                }
            }
        } catch (\Exception $e) {
            // Log any errors but continue
            \OCP\Util::writeLog(self::APP_ID, 'Error initializing translations: ' . $e->getMessage(), \OCP\ILogger::WARN);
        }
    }
}
