[toc]

# 注册API



# 自行构建

`/src-tauri/tauri.config.json`

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