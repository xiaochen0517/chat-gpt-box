import CBaseDialog from "@/components/base/dialog/CBaseDialog.vue";
import {ChatGptModelList} from "@/models/ChatGptModelList.ts";
import {BaseSettingsDialogUtil} from "@/utils/settings/BaseSettingsDialogUtil.ts";

export class ChatGptSettingsDialogUtil extends BaseSettingsDialogUtil {
  
  static showChatGptModelDialog(dialogRefs: InstanceType<typeof CBaseDialog>, value: string) {
    return this.showModelDialog(dialogRefs, ChatGptModelList, value);
  }

}