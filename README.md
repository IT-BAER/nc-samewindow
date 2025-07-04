# Same Window

A Nextcloud App/Modification that prevents links on frontend Widgets from opening in new Windows/Tabs, providing a more seamless user experience.

## Description

The Same Window App automatically modifies links on frontend Widgets to open in the same window instead of opening new tabs or windows. This ensures users stay within the current Nextcloud interface and provides a more integrated experience.

## Features

- **Automatic Link Modification**: Automatically removes `target="_blank"` and `target="_new"` attributes from links
- **Widget-Only Processing**: Only affects links within content Widgets, not Navigation or Headers
- **Smart Link Handling**: Intelligently processes only links that should be modified
- **Dynamic Content Support**: Handles dynamically loaded content through Mutation Observers

## User Override

Users can still open links in new Windows/Tabs by using:
- **Middle Mouse Button** click

## Development

### Requirements

- Nextcloud 28.0 or higher

