import CSettingsDialog from "@/components/base/dialog/CSettingsDialog.vue";
import {SelectOptionItem} from "@/types/base/CSettingDialog.ts";

export class BaseSettingsDialogUtil {
  
  static showApiDialog(dialogRefs: InstanceType<typeof CSettingsDialog>, value: string) {
    return dialogRefs.show({
      type: "input",
      title: "Api url",
      placeholder: "Please input api url.",
      content: value
    });
  }
  
  static showModelDialog(dialogRefs: InstanceType<typeof CSettingsDialog>, list: SelectOptionItem[], value: string) {
    return dialogRefs.show({
      type: "select",
      title: "Model",
      content: value,
      selectOptions: {
        list: list,
      }
    });
  }
}