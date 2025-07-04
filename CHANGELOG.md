## [1.0.0] - 2025-07-04

### Added
- Initial stable release of the Same Window app
- Automatic modification of links with `target="_blank"` and `target="_new"` to open in the same window
- Smart widget detection to only process links within content widgets
- Exclusion of navigation and header links to preserve their original behavior
- Dynamic content support through mutation observers
- User override capability (Ctrl/Cmd/Shift + click to open in new window)
- Compatibility with Nextcloud 28-31

### Features
- **Widget-focused processing**: Only modifies links within dashboard widgets and content areas
- **Smart exclusion**: Automatically excludes navigation, headers, and other UI elements
- **Performance optimized**: Debounced processing to avoid excessive calls
- **User-friendly**: Preserves user choice with keyboard modifier overrides (Ctrl/Cmd/Shift + click)
- **Lightweight**: Minimal footprint with no unnecessary dependencies
