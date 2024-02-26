import CBaseDialog from "@/components/base/dialog/CBaseDialog.vue";
import {BaseSettingsDialogUtil} from "@/utils/settings/BaseSettingsDialogUtil.ts";
import {getOllamaModelList} from "@/models/OllamaModelList.ts";

export class OllamaSettingsDialogUtil extends BaseSettingsDialogUtil {
  
  static async showOllamaModelDialog(dialogRefs: InstanceType<typeof CBaseDialog>, value: string) {
    const modelList = await getOllamaModelList();
    return this.showModelDialog(dialogRefs, modelList, value);
  }

}