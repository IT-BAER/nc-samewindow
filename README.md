# Same Window

A Nextcloud App/Modification that prevents links on frontend Widgets from opening in new Windows/Tabs, providing a more seamless user experience.

## Description

The Same Window app automatically modifies links on frontend Widgets to open in the same Window instead of opening new Tabs or Windows. This ensures users stay within the current Nextcloud interface and provides a more integrated experience.

## Features

- **Automatic Link Modification**: Automatically removes `target="_blank"` and `target="_new"` attributes from links
- **Widget-Only Processing**: Only affects links within content widgets, not navigation or headers
- **Smart Link Handling**: Intelligently processes only links that should be modified
- **Tooltip Feedback**: Adds helpful tooltip text to modified links indicating they will open in the same tab
- **Dynamic Content Support**: Handles dynamically loaded content through mutation observers

## Installation

1. Download the latest release from the [releases page](https://github.com/nextcloud/samewindow/releases)
2. Extract the archive to your Nextcloud apps directory
3. Enable the app through the Nextcloud admin interface

## How it Works

1. The app loads on all user pages (not login or public pages)
2. It scans for links with target="_blank" or target="_new" within widgets
3. Removes the `target` attribute from matching links (unless they are in navigation or headers)
4. Adds event listeners to handle click events appropriately
5. Uses mutation observers to handle dynamically added content

## User Override

Users can still open links in new windows/tabs by holding modifier keys while clicking:
- **Ctrl** (Windows/Linux) or **Cmd** (Mac) + click
- **Shift** + click
- **Middle mouse button** click

## Development

### Requirements

- Nextcloud 28.0 or higher
- PHP 8.0 or higher

## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Changelog

### v1.0.0
- First stable release
- Widget-focused link modification
- Improved link detection and processing
- Smart exclusion of navigation and header elements
- Better performance and reliability

## Support

If you encounter any issues or have questions, please:
1. Check the [issues page](https://github.com/nextcloud/samewindow/issues)
2. Create a new issue if your problem hasn't been reported
3. Include your Nextcloud version and browser information
