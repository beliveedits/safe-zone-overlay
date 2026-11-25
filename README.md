# Safe Zone Overlay for Vertical Video

A Chrome extension that draws the Instagram Reels, TikTok and YouTube Shorts safe-zone margins on top of any video preview in your browser, so you can see what the app buttons will cover before you post.

Made by [Bhavesh Vaghela](https://vaghelabhavesh.com), a freelance motion designer and video editor in Rajkot, India.

## How to use

1. Open a page with your draft video: a cloud-drive preview, a client review link or an unlisted upload.
2. Click the extension icon and press "Show the safe zone".
3. Keep text and logos inside the dashed box. The red areas are where the apps usually put their buttons, caption and search bar.

## The margins

Measured on a 1080 x 1920 frame and scaled to the picture on your screen:

| Edge | Margin |
| --- | --- |
| Top | 270 px |
| Bottom | 480 px |
| Right | 140 px |
| Left | 60 px |

These are combined, conservative margins, wider than any single app needs, so one layout works on all three apps. Apps change their layouts from time to time, so check a draft in the real app before you publish.

## What it does

- Fits the picture itself, not the player around it.
- If the page has no video, it shows a centered 9:16 frame to compare against.
- If the picture is not 9:16, it tells you the margins are only approximate.
- Runs only on the tab where you click the icon.

## Privacy

The extension asks for two permissions, activeTab and scripting, to draw the overlay on the tab where you click it. It collects, stores and sends nothing.

## Files

- manifest.json: Manifest V3 definition
- content.js: draws the overlay on the largest visible video
- popup.html and popup.js: the toggle button

## Install from source

1. Download this repository.
2. Open chrome://extensions and turn on Developer mode.
3. Click Load unpacked and choose the folder.

## Free template for your editor

Want the same guide inside Premiere Pro, After Effects, CapCut or DaVinci Resolve? There is a free transparent PNG and SVG version at https://vaghelabhavesh.com/safe-zone-template.html

## License

MIT. See LICENSE.
