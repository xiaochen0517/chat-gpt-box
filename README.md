<h2 align="center">
<img src="./doc/icon.png" alt="icon" width="30" style="background-color: white;border-radius: 5px;">
<span>ChatGPTBox</span>
</h2>
<p align="center">
    English | <a href="./README-CN.md">简体中文</a>
</p>
<p align="center">
    <em>Your Ultimate Copilot on the Desktop. ChatGPTBox is a desktop app for GPT-3.5 (OpenAI API).</em>
</p>

<p align="center">
    <img alt="windows11" src="https://img.shields.io/badge/windows-11-brightgreen">
</p>

## Features

- Supports multiple platforms, including Windows, Linux, macOS
- Allows for individual customization of chat settings, with multiple chat configurations that do not interfere with
  each other
- Single chat configurations support multiple tabs, enabling multiple chat windows to be opened at the same time
- Global shortcut key support, with customizable shortcuts

## Roadmap

- [x] Multi-tab
- [x] Shortcut key configuration
- [x] Dark mode toggle
- [x] Multi-model support
- [ ] Mobile support
    - [x] Mobile web
        - [x] Android
        - [ ] iOS
- [ ] DALL·E image generation
- [ ] TTS (Text-to-Speech) synthesis
- [ ] Whisper speech recognition

## Tutorial

### Download/Build

Download Release: [GitHub Release](https://github.com/xiaochen0517/chat-gpt-box/releases)

You can download the pre-packaged executable file, or package it yourself.

```shell
# Install dependencies
yarn install

# Build Web version
yarn build

# Build Tauri desktop version
yarn build-tauri
```

> To work on the Android version, you need to download and install
> [Android Studio](https://developer.android.com/studio).
> Once installed, run `yarn install && yarn build` to package the web version.
> After that, use `npx cap sync` to synchronize it to the android directory.
> You can then directly open the android folder in the project directory as an Android project
> and proceed to package it.

### Install

#### Windows

Install by running the `msi` or `exe` file.

#### Linux

Since `tauri` requires `webkit2gtk` support, it is necessary to install `webkit2gtk`.

```shell
# Install webkit2gtk
sudo apt install libwebkit2gtk-4.1-0

# Install deb package
sudo dpkg -i chat-gpt-box_*.*.*_amd64.deb
```

#### macOS

Directly run the `dmg` file, drag `ChatGPTBox.app` into the `Applications` folder,
then open Finder, right-click on `ChatGPTBox.app`, select `open`, and the application will launch.

## Contact Me

- [Email](mailto:xiaochen0517@qq.com)

## License

[Apache License v2.0](./LICENSE)