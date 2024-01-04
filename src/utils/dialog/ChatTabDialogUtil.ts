import CBaseDialog from "@/components/base/dialog/CBaseDialog.vue";
import i18n from "@/i18n/i18n.ts";

const {t} = i18n.global;
export class ChatTabDialogUtil {

  static showAddTabDialog(dialogRefs: InstanceType<typeof CBaseDialog>, placeholder: string, value: string): Promise<string | number> {
    return dialogRefs.show({
      type: "input",
      title: t("tab.addTab.title"),
      placeholder: placeholder,
      content: value,
    });
  }

  static showCloseTabDialog(dialogRefs: InstanceType<typeof CBaseDialog>, tabName: string): Promise<string | number> {
    return dialogRefs.show({
      type: "hint",
      title: t("tab.closeTab.title"),
      description: t("tab.closeTab.description", {tabName: tabName}),
      content: "",
    });
  }
}