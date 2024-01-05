
## 注册API

### Openai Api

由于 `Openai` 不支持中国大陆地区访问，所以需要使用代理访问，此文档不对此进行详细说明。

在使用 `Openai Api` 之前，需要准备一张美国地区的信用卡或者借记卡，也可以使用虚拟信用卡，但是需要支持 `Openai` 的支付方式。
注册 `Openai Api` 后如果不绑定银行卡，接口请求速度和次数会受到极大限制。

- 注册地址：[https://platform.openai.com/signup](https://platform.openai.com/signup)
- `ApiKey` 页面：[https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
    - 点击 `Create new secret key` 在应用的设置中填入生成的 `key` 即可

### Gemini Api

注册地址：[https://ai.google.dev/](https://ai.google.dev/)

## 自行构建

### 环境要求

- [Node.js](https://nodejs.org/en/) 16.x 或 18.x
- [Yarn](https://yarnpkg.com/) 1.22.x
- [Rust](https://www.rust-lang.org/) 1.74.x
- [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) 最新版

> 版本号仅供参考，不保证其他版本可以正常运行。

### 下载源码

#### Git Clone

```bash
git clone https://github.com/xiaochen0517/chat-gpt-box.git
cd chat-gpt-box
```

#### GitHub Release

[下载最新版本](https://github.com/xiaochen0517/chat-gpt-box/releases/latest) 并解压。

### 安装依赖

```bash
yarn install
```

### 构建

#### 移除 `tauri` 自动更新配置

在构建前需要手动删除或者更新 `tauri` 自动更新配置，配置文件位于 `/src-tauri/tauri.config.json` 中。
可以直接删除 `tauri.config.json` 中的 `updater` 配置，并将 `active` 设置为 `false`。

```diff
{
  "tauri": {
    // ...other
    "updater": {
-     "active": true,
+     "active": false,
-     "endpoints": [
-       "https://xiaochen0517.github.io/chat-gpt-box/app_updater.json"
-     ],
-     "dialog": true,
-     "pubkey": "xxx",
-     "windows": {
-       "installMode": "basicUi"
-     }
    },
    // ...other
  }
}
```

#### 创建自己的更新配置

- 安装 `tauri cli`

```bash
# yarn
yarn global add @tauri-apps/cli
# npm
npm install -g @tauri-apps/cli
```

- 生成公私钥

```bash
tauri signer generate --password <password> -f <filename>
```

- 将生成的公钥配置到 `tauri.config.json` 中
- 在环境变量中添加 `TAURI_PRIVATE_KEY` 和 `TAURI_KEY_PASSWORD`，分别对应私钥和密码

#### 构建

```bash
# web
yarn build
# tauri
yarn build-tauri
```

**`android` 构建**

```bash
yarn cap-sync
```

使用 `Android Studio` 打开 `android` 目录，等待依赖加载完成后，点击菜单中 `Build -> Generate Signed Bundle / APK...`，按照提示进行操作即可。