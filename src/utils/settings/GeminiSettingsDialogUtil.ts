import {BaseSettingsDialogUtil} from "@/utils/settings/BaseSettingsDialogUtil.ts";
import {GeminiModelList} from "@/models/GeminiModelList.ts";
import CSettingsDialog from "@/components/base/dialog/CSettingsDialog.vue";

export class GeminiSettingsDialogUtil extends BaseSettingsDialogUtil {

  static showGeminiModelDialog(dialogRefs: InstanceType<typeof CSettingsDialog>, value: string) {
    return this.showModelDialog(dialogRefs, GeminiModelList, value);
  }

  static showMaxOutputTokensDialog(dialogRefs: InstanceType<typeof CSettingsDialog>, value: number) {
    return dialogRefs.show({
      type: "slider",
      title: "Max Output Tokens",
      content: value,
      sliderOptions: {
        min: 0,
        max: 2048,
        step: 1,
        showInput: true,
        size: "small"
      }
    });
  }

  static showTopKDialog(dialogRefs: InstanceType<typeof CSettingsDialog>, value: number) {
    return dialogRefs.show({
      type: "input",
      title: "Top K",
      content: value,
      inputOptions: {
        type: "number",
        min: 0,
        max: 100,
        size: "small"
      }
    });
  }

  static showTopPDialog(dialogRefs: InstanceType<typeof CSettingsDialog>, value: number) {
    return dialogRefs.show({
      type: "slider",
      title: "Top P",
      content: value,
      sliderOptions: {
        min: 0,
        max: 1,
        step: 0.1,
        showInput: true,
        size: "small"
      }
    });
  }

}