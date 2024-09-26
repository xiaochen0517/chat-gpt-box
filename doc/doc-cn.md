## 注册API

### Openai Api

由于 `Openai` 不支持中国大陆地区访问，所以需要使用代理访问，此文档不对此进行详细说明。

在使用 `Openai Api` 之前，需要准备一张美国地区的信用卡或者借记卡，也可以使用虚拟信用卡，但是需要支持 `Openai` 的支付方式。
注册 `Openai Api` 后如果不绑定银行卡，接口请求速度和次数会受到极大限制。

- 注册地址：[https://platform.openai.com/signup](https://platform.openai.com/signup)
- `ApiKey` 页面：[https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
    - 点击 `Create new secret key` 生成密钥。
    - 在 `chat-gpt-box` 的设置中配置生成的密钥。

### Gemini Api

注册地址：[https://ai.google.dev/](https://ai.google.dev/)

### 使用第三方代理服务

由于 `Openai` 不支持中国大陆地区访问，可以使用第三方代理服务，
如 [2233ai](https://2233.ai/) 或 [burn hair](https://burn.hair/) 等。

### 本地 `Ollama` 服务

可以使用 [Ollama](https://ollama.com/) 本地服务，配置方式与 `Openai` 等其他服务相同，不需要 `ApiKey`。

## 自行构建

### 环境要求

- [Node.js](https://nodejs.org/en/) 16.x 或 18.x
- [Pnpm](https://pnpm.io/) 9.11.x
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
pnpm install
```

### 构建

```bash
# web
pnpm build
# tauri
pnpm build-tauri
```

> 也可以使用 `Github Actions` 进行自动构建。
