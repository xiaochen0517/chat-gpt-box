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

  }
];