import CSettingsDialog from "@/components/base/dialog/CSettingsDialog.vue";
import {BaseSettingsDialogUtil} from "@/utils/settings/BaseSettingsDialogUtil.ts";
import {DallEModelList, ImageQualityList, ImageStyleList} from "@/models/DallEModelList.ts";
import {SelectOptionItem} from "@/types/base/CSettingDialog.ts";

export class DallESettingsDialogUtil extends BaseSettingsDialogUtil {
  
  static showDallEModelDialog(dialogRefs: InstanceType<typeof CSettingsDialog>, value: string) {
    return this.showModelDialog(dialogRefs, DallEModelList, value);
  }
  
  static showImageCountDialog(dialogRefs: InstanceType<typeof CSettingsDialog>, value: number) {
    const description = "This parameter is ignored when the model is dall-e-3 because the dall-4-3 model can only generate one image. " +
      "When the model is dall-e-2, this parameter indicates the number of images generated.";
    return dialogRefs.show({
      type: "slider",
      title: "Image count",
      description: description,
      content: value,
      sliderOptions: {
        min: 1,
        max: 4,
        step: 1,
        showInput: true,
        size: "small"
      }
    });
  }
  
  static showImageSizeDialog(dialogRefs: InstanceType<typeof CSettingsDialog>, list: SelectOptionItem[], value: string) {
    return dialogRefs.show({
      type: "select",
      title: "Image size",
      content: value,
      selectOptions: {
        list: list,
      }
    });
  }
  
  static showImageStyleDialog(dialogRefs: InstanceType<typeof CSettingsDialog>, value: string) {
    const description = "This parameter just works when the model is dall-e-3. " +
      "When the model is dall-e-2, this parameter is ignored.";
    return dialogRefs.show({
      type: "select",
      title: "Image style",
      description: description,
      content: value,
      selectOptions: {
        list: ImageStyleList,
      }
    });
  }
  
  static showImageQualityDialog(dialogRefs: InstanceType<typeof CSettingsDialog>, value: number) {
    const description = "This parameter just works when the model is dall-e-3. " +
      "When the model is dall-e-2, this parameter is ignored.";
    return dialogRefs.show({
      type: "select",
      title: "Image quality",
      description: description,
      content: value,
      selectOptions: {
        list: ImageQualityList,
      }
    });
  }
  
}