import CBaseDialog from "@/components/base/dialog/CBaseDialog.vue";
import i18n from "@/i18n/i18n.ts";

const {t} = i18n.global;

export class ChatDialogUtil {

  static showDeleteChatDialog(dialogRefs: InstanceType<typeof CBaseDialog>): Promise<string | number> {
    return dialogRefs.show({
      type: "hint",
      title: t("chat.deleteChat.title"),
      description: t("chat.deleteChat.description"),
      content: "",
    });
  }
}