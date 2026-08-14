## [1.0.4] - 2026-08-14

### Added
- Compatibility with Nextcloud 34

## [1.0.3] - 2026-04-04

### Added
- Compatibility with Nextcloud 33
- GitHub Actions release workflow (build, sign, publish to App Store)

### Changed
- Updated `<licence>` tag to SPDX format `AGPL-3.0-or-later` (required for NC 31+)

### Fixed
- Security: `window.open` calls for Ctrl/Cmd+click and middle-click now include `noopener,noreferrer` to prevent reverse tabnapping

## [1.0.2] - 2025-10-09

### Added
- Verified compatibility with Nextcloud 32 

### Changed
- Improved widget detection and recommendation link handling for updated dashboard markup
- Normalized generated URLs to support sub-directory installations on newer server versions

## [1.0.1] - 2025-07-10

### Fixed
- Fixed Screenshot URL in appinfo.xml

## [1.0.1] - 2025-07-04

### Added
- Initial stable release of the Same Window App
- Automatic modification of links with `target="_blank"` and `target="_new"` to open in the same window
- Smart Widget detection to only process links within content Widgets
- Exclusion of Navigation and Header links to preserve their original behavior
- Dynamic content support through Mutation Observers
- User override capability (middle-click to open in new window)
- Compatibility with Nextcloud 28-31

### Features
- **Widget-focused Processing**: Only modifies links within Dashboard Widgets and content areas
- **Smart Exclusion**: Automatically excludes Navigation, Headers, and other UI elements
- **Performance Optimized**: Debounced processing to avoid excessive calls
- **User-friendly**: Preserves user choice with middle-click override
- **Lightweight**: Minimal footprint with no unnecessary dependencies
