export const migrateFunctions: Array<() => void> = [
  /**
   * Migrate from version 1 to 2
   *
   * <ol>
   *   <li>configStore.baseConfig MOVE configStore.defaultChatConfig.openAi
   *     <ol>
   *       <li>apiKey ==> openAi.base.apiKey</li>
   *       <li>apiUrl ==> openAi.chatGpt.apiUrl</li>
   *       <li>model ==> openAi.chatGpt.model</li>
   *       <li>temperature ==> openAi.chatGpt.temperature</li>
   *       <li>contextMaxMessage ==> openAi.chatGpt.contextMaxMessage</li>
   *       <li>contextMaxTokens ==> openAi.chatGpt.contextMaxTokens</li>
   *       <li>responseMaxTokens ==> openAi.chatGpt.responseMaxTokens</li>
   *     </ol>
   *   </li>
   * </ol>
   *
   */
  () => {
    const jsonStr = localStorage.getItem("Config");
    if (!jsonStr) return;
    const configStore = JSON.parse(jsonStr);
    if (!configStore) return;
    if (!configStore.baseConfig) return;
    // move config
    configStore["defaultChatConfig"] = {
      openAi: {
        base: {
          apiKey: configStore.baseConfig.apiKey,
        },
        chatGpt: {
          apiUrl: configStore.baseConfig.apiUrl,
          model: configStore.baseConfig.model,
          temperature: configStore.baseConfig.temperature,
          contextMaxMessage: configStore.baseConfig.contextMaxMessage,
          contextMaxTokens: configStore.baseConfig.contextMaxTokens,
          responseMaxTokens: configStore.baseConfig.responseMaxTokens,
        },
      },
    };
    // delete
    delete configStore.baseConfig.apiKey;
    delete configStore.baseConfig.apiUrl;
    delete configStore.baseConfig.model;
    delete configStore.baseConfig.temperature;
    delete configStore.baseConfig.contextMaxMessage;
    delete configStore.baseConfig.contextMaxTokens;
    delete configStore.baseConfig.responseMaxTokens;
    // save
    localStorage.setItem("Config", JSON.stringify(configStore));
  },
  /**
   * Migrate from version 2 to 3
   *
   * configStore.baseConfig.chatTemplateUrl default value change
   * from "https://xiaochen0517.github.io/chat-gpt-box/chat_template.json" to "https://chat-gpt-box.plus/chat_template.json"
   */
  () => {
    const jsonStr = localStorage.getItem("Config");
    if (!jsonStr) return;
    const configStore = JSON.parse(jsonStr);
    if (!configStore) return;
    if (!configStore.baseConfig) return;
    if (!configStore.baseConfig.chatTemplateUrl) return;
    if (configStore.baseConfig.chatTemplateUrl !== "https://xiaochen0517.github.io/chat-gpt-box/chat_template.json") return;
    configStore.baseConfig.chatTemplateUrl = "https://chat-gpt-box.plus/chat_template.json";
    localStorage.setItem("Config", JSON.stringify(configStore));
  },
];