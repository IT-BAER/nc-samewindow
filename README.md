# 🔗 Same Window for Nextcloud

<div align="center">

![Nextcloud App Store Version](https://img.shields.io/badge/Nextcloud-28%2B-blue?logo=nextcloud&logoColor=white)
![License](https://img.shields.io/github/license/it-baer/nc-samewindow?color=blue)
![GitHub stars](https://img.shields.io/github/stars/it-baer/nc-samewindow?style=social)

**Keep your Nextcloud experience seamless by preventing links from opening in new tabs**

<img src="nc-samewindow-icon.png" width="120"/>

*Enhance your workflow by staying within the current interface*
</div>

## ✨ Features

- 🔗 **Automatic Link Modification**: Removes `target="_blank"` and `target="_new"` attributes from links
- 🎯 **Widget-Only Processing**: Only affects links within content Widgets, not Navigation or Headers
- 🧠 **Smart Link Handling**: Intelligently processes only links that should be modified
- ⚡ **Dynamic Content Support**: Handles dynamically loaded content through Mutation Observers
- 🚀 **Zero Configuration**: Works immediately with no setup required
- 🔄 **Override Support**: Users can still open in new tabs with middle-click when needed

## 🛠️ How It Works

This app automatically detects links within Nextcloud dashboard widgets that would normally open in new windows/tabs and modifies them to open in the same window instead. This provides a more integrated experience by keeping users within the current Nextcloud interface.

## 👆 User Override Options

Users can still open links in new Windows/Tabs when needed by using:
- **Middle Mouse Button** click


## 🔍 Technical Details

The Same Window app uses:
- JavaScript Mutation Observers to detect dynamically loaded content
- Targeted selectors that only affect widget content areas
- Event listeners that preserve standard browser override behaviors

## 📋 Requirements

- 📦 Nextcloud 28, 29, 30 or 31

## 💜 Support Development

If you find this app useful, consider supporting this and future developments, which heavily relies on coffee:

<div align="center">
<a href="https://www.buymeacoffee.com/itbaer" target="_blank"><img src="https://github.com/user-attachments/assets/64107f03-ba5b-473e-b8ad-f3696fe06002" alt="Buy Me A Coffee" style="height: 60px !important;max-width: 217px !important;" ></a>
</div>

## 📄 License

This project is licensed under the [AGPL-3.0-or-later](LICENSE) license.
