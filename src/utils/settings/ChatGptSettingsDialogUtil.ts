import CSettingsDialog from "@/components/base/dialog/CSettingsDialog.vue";
import {ChatGptModelList} from "@/models/ChatGptModelList.ts";
import {BaseSettingsDialogUtil} from "@/utils/settings/BaseSettingsDialogUtil.ts";

export class ChatGptSettingsDialogUtil extends BaseSettingsDialogUtil {
  
  static showChatGptModelDialog(dialogRefs: InstanceType<typeof CSettingsDialog>, value: string) {
    return this.showModelDialog(dialogRefs, ChatGptModelList, value);
  }

}