# Installing Mixamo Batcher 2.0 without the Chrome Web Store

Mixamo Batcher is distributed as an unpacked browser extension. This installation method is free and does not require a Chrome Web Store developer account or registration fee.

## 1. Download the extension

Download the latest stable archive from the [GitHub Releases page](https://github.com/unkitpi/mixamo-batcher/releases/latest). Use the ZIP asset named `mixamo-batcher-2.0.1.zip`.

Save the archive somewhere accessible, such as your Downloads folder.

## 2. Extract the archive

Extract the ZIP into a permanent folder. Do not load the ZIP file itself and do not delete the extracted folder after installation. For example:

```text
Documents/Mixamo Batcher 2/
```

The extracted folder must contain `manifest.json`, `background.js`, `content.js`, `index.html`, and the other extension files directly at its top level.

## 3. Open the extension manager

Use the browser-specific address below:

| Browser | Extension manager |
| --- | --- |
| Google Chrome | `chrome://extensions` |
| Chromium | `chrome://extensions` |
| Microsoft Edge | `edge://extensions` |
| Brave | `brave://extensions` |

Enable **Developer mode** using the switch in the extension manager.

## 4. Load the extension

Click **Load unpacked** and select the extracted `Mixamo Batcher 2` folder. Do not select the parent Downloads folder and do not select the ZIP archive.

After installation, the extension should appear as **Mixamo Batcher 2.0**. If the browser shows a warning about developer mode, that warning is expected for locally installed unpacked extensions.

## 5. Use Mixamo Batcher

Open [Mixamo](https://www.mixamo.com/) and sign in. Navigate to **Animations**, then reload the page once after installing or updating the extension.

Create a project and an animation pack. Select an animation in Mixamo and use **Add To Pack** in the Batcher panel. Open **Pack Settings** to configure batch export options, including **In Place for Entire Pack**, then choose **Download Pack**.

## Updating the extension

When a new release is available, download and extract the new ZIP into a new folder. In the extension manager, either remove the previous Mixamo Batcher entry and load the new folder, or use **Reload** if you replaced the files in the existing folder.

Always keep project backups by using the extension’s export function before removing an old installation or clearing browser extension data.

## Troubleshooting

| Problem | Solution |
| --- | --- |
| **Load unpacked** is missing | Enable **Developer mode** first. |
| The browser says the manifest is missing | Select the extracted folder containing `manifest.json`, not the ZIP or its parent folder. |
| The panel does not appear | Confirm that you are signed in to Mixamo, open the **Animations** view, and reload the page. |
| Mixamo behaves unexpectedly | Disable the extension, reload Mixamo, and reinstall the latest stable release from GitHub. |
| Projects disappeared | Restore the JSON backup using the extension’s import function. |
| Chrome blocks the extension | Confirm that you are using the stable release archive and that the extension is loaded only once. |

## Privacy and permissions

The extension operates on Mixamo pages and stores projects locally in the browser. It does not require a remote account, backend service, or Chrome Web Store installation. Mixamo authentication and animation downloads continue to be handled by Mixamo itself.

For source code, bug reports, and new releases, visit the [Mixamo Batcher GitHub repository](https://github.com/unkitpi/mixamo-batcher).
