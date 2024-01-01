import CSettingsDialog from "@/components/base/dialog/CSettingsDialog.vue";
import i18n from "@/i18n/i18n.ts";

const {t} = i18n.global;
export class ChatTabDialogUtil {

  static showAddTabDialog(dialogRefs: InstanceType<typeof CSettingsDialog>, placeholder: string, value: string): Promise<string | number> {
    return dialogRefs.show({
      type: "input",
      title: t("tab.addTab.title"),
      placeholder: placeholder,
      content: value,
    });
  }
}