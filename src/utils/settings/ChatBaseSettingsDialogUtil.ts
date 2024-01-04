import CBaseDialog from "@/components/base/dialog/CBaseDialog.vue";
import i18n from "@/i18n/i18n.ts";

const {t} = i18n.global;

export class ChatBaseSettingsDialogUtil {

  static showChatNameDialog(dialogRefs: InstanceType<typeof CBaseDialog>, value: string): Promise<string | number> {
    return dialogRefs.show({
      type: "input",
      title: t("chat.chatName.title"),
      placeholder: t("chat.chatName.placeholder"),
      content: value,
    });
  }

  static showChatPromptDialog(dialogRefs: InstanceType<typeof CBaseDialog>, value: string): Promise<string | number> {
    return dialogRefs.show({
      type: "input",
      title: t("chat.chatPrompt.title"),
      placeholder: t("chat.chatPrompt.placeholder"),
      content: value,
    });
  }
}