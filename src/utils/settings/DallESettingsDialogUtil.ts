import CSettingsDialog from "@/components/base/dialog/CSettingsDialog.vue";
import {BaseSettingsDialogUtil} from "@/utils/settings/BaseSettingsDialogUtil.ts";
import {DallEModelList, ImageQualityList, ImageStyleList} from "@/models/DallEModelList.ts";
import {SelectOptionItem} from "@/types/base/CSettingDialog.ts";
import i18n from "@/i18n/i18n.ts";

const {t} = i18n.global;
export class DallESettingsDialogUtil extends BaseSettingsDialogUtil {
  
  static showDallEModelDialog(dialogRefs: InstanceType<typeof CSettingsDialog>, value: string) {
    return this.showModelDialog(dialogRefs, DallEModelList, value);
  }
  
  static showImageCountDialog(dialogRefs: InstanceType<typeof CSettingsDialog>, value: number) {
    return dialogRefs.show({
      type: "slider",
      title: t("settings.dalle.imageCount.title"),
      description: t("settings.dalle.imageCount.description"),
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
      title: t("settings.dalle.imageSize.title"),
      content: value,
      selectOptions: {
        list: list,
      }
    });
  }
  
  static showImageStyleDialog(dialogRefs: InstanceType<typeof CSettingsDialog>, value: string) {
    return dialogRefs.show({
      type: "select",
      title: t("settings.dalle.imageStyle.title"),
      description: t("settings.dalle.imageStyle.description"),
      content: value,
      selectOptions: {
        list: ImageStyleList,
      }
    });
  }
  
  static showImageQualityDialog(dialogRefs: InstanceType<typeof CSettingsDialog>, value: string) {
    return dialogRefs.show({
      type: "select",
      title: t("settings.dalle.imageQuality.title"),
      description: t("settings.dalle.imageQuality.description"),
      content: value,
      selectOptions: {
        list: ImageQualityList,
      }
    });
  }
  
}