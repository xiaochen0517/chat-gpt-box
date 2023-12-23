import CSettingsDialog from "@/components/base/dialog/CSettingsDialog.vue";
import {ChatGptModelList} from "@/models/ChatGptModelList.ts";
import {BaseSettingsDialogUtil} from "@/utils/settings/BaseSettingsDialogUtil.ts";

export class ChatGptSettingsDialogUtil extends BaseSettingsDialogUtil {
  
  static showChatGptModelDialog(dialogRefs: InstanceType<typeof CSettingsDialog>, value: string) {
    return this.showModelDialog(dialogRefs, ChatGptModelList, value);
  }
  
  static showResponseMaxTokensDialog(dialogRefs: InstanceType<typeof CSettingsDialog>, value: number) {
    const description: string = "When the value is 0, the number of tokens returned is automatic.";
    return dialogRefs.show({
      type: "slider",
      title: "Response max tokens",
      description: description,
      content: value,
      sliderOptions: {
        min: 0,
        max: 4096,
        step: 1,
        showInput: true,
        size: "small"
      }
    });
  }

}