import CSettingsDialog from "@/components/base/dialog/CSettingsDialog.vue";

export class ChatBaseSettingsDialogUtil {

  static showChatNameDialog(dialogRefs: InstanceType<typeof CSettingsDialog>, value: string): Promise<string | number> {
    return dialogRefs.show({
      type: "input",
      title: "Chat name",
      placeholder: "Please input chat name.",
      content: value,
    });
  }

  static showChatPromptDialog(dialogRefs: InstanceType<typeof CSettingsDialog>, value: string): Promise<string | number> {
    return dialogRefs.show({
      type: "input",
      title: "Chat prompt",
      placeholder: "Please input chat prompt.",
      content: value,
    });
  }
}