import {BaseSettingsDialogUtil} from "@/utils/settings/BaseSettingsDialogUtil.ts";
import {GeminiModelList} from "@/models/GeminiModelList.ts";
import CSettingsDialog from "@/components/base/dialog/CSettingsDialog.vue";

export class GeminiSettingsDialogUtil extends BaseSettingsDialogUtil {

  static showGeminiModelDialog(dialogRefs: InstanceType<typeof CSettingsDialog>, value: string) {
    return this.showModelDialog(dialogRefs, GeminiModelList, value);
  }

}