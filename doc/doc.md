
## Register the API

### Openai Api

Since `Openai` does not support access in Chinese mainland, proxy access is required, 
which is not detailed in this document。

Before using the `Openai Api`, you need to prepare a credit or debit card in the United States, 
and you can also use a virtual credit card, but you need to support the `Openai` payment method.
If you do not bind a bank card after registering the `Openai API`, 
the speed and number of API requests will be greatly limited.

- Registered address: [https://platform.openai.com/signup](https://platform.openai.com/signup)
- `ApiKey` page: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
    - Click on `Create new secret key` to generate the key.
    - Configure the generated key in the settings of `chat-gpt-box`.

### Gemini Api

Registered address: [https://ai.google.dev/](https://ai.google.dev/)

### Use of third-party proxy services

Since `Openai` does not support access from mainland China, 
you can use third-party proxy services such as [2233ai](https://2233.ai/) or [burn hair](https://burn.hair/).

### Local `Ollama` service

You can use the local service of [Ollama](https://ollama.com/), 
with the configuration method similar to `Openai` and other services, and it does not require an `ApiKey`.

## Self-build.

### Environmental requirements.

- [Node.js](https://nodejs.org/en/) 18.x
- [Pnpm](https://pnpm.io/) 9.11.x
- [Rust](https://www.rust-lang.org/) 1.74.x
- [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) latest version

> The version number is for reference only, and there is no guarantee that other versions will work properly.

### Download the source code.

#### Git Clone

```bash
git clone https://github.com/xiaochen0517/chat-gpt-box.git
cd chat-gpt-box
```

#### GitHub Release

Download the [latest version](https://github.com/xiaochen0517/chat-gpt-box/releases/latest) and extract it.

### Install dependencies.

```bash
pnpm install
```

### Build

```bash
# web
pnpm build
# tauri
pnpm build-tauri
```

> You can also use `Github Actions` for automatic builds.
