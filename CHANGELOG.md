## [1.0.0] - 2025-07-04

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
