<?php

declare(strict_types=1);

return [
    // Regular web routes as a fallback
    'routes' => [
        // Get config
        ['name' => 'config#getConfig', 'url' => '/config', 'verb' => 'GET'],
        // Set config
        ['name' => 'config#setConfig', 'url' => '/config', 'verb' => 'POST'],
        // Get translations
        ['name' => 'l10n#getTranslations', 'url' => '/l10n', 'verb' => 'GET'],
    ],
];
