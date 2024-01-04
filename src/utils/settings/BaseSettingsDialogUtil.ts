import CBaseDialog from "@/components/base/dialog/CBaseDialog.vue";
import {SelectOptionItem} from "@/types/base/CSettingDialog.ts";
import {LanguageList} from "@/models/LanguageList.ts";
import i18n from "@/i18n/i18n.ts";

const {t} = i18n.global;
export class BaseSettingsDialogUtil {

  static showLanguageDialog(dialogRefs: InstanceType<typeof CBaseDialog>, value: string) {
    return dialogRefs.show({
      type: "select",
      title: "Language",
      content: value,
      selectOptions: {
        list: LanguageList,
      },
    });
  }

  static showApiKeyDialog(dialogRefs: InstanceType<typeof CBaseDialog>, value: string) {
    return dialogRefs.show({
      type: "input",
      title: t("settings.basic.apiKey.title"),
      placeholder: "Please input api key.",
      content: value,
    });
  }

  static showApiDialog(dialogRefs: InstanceType<typeof CBaseDialog>, value: string) {
    return dialogRefs.show({
      type: "input",
      title: t("settings.apiUrl.title"),
      placeholder: t("settings.apiUrl.placeholder"),
      content: value,
    });
  }

  static showModelDialog(dialogRefs: InstanceType<typeof CBaseDialog>, list: SelectOptionItem[], value: string) {
    return dialogRefs.show({
      type: "select",
      title: t("settings.model.title"),
      content: value,
      selectOptions: {
        list: list,
      },
    });
  }

  static showTemperatureDialog(dialogRefs: InstanceType<typeof CBaseDialog>, value: number) {
    return dialogRefs.show({
      type: "slider",
      title: t("settings.temperature.title"),
      description: t("settings.temperature.description"),
      content: value,
      sliderOptions: {
        min: 0,
        max: 1,
        step: 0.1,
        showInput: true,
        size: "small",
      },
    });
  }

  static showContextMaxMessagesDialog(dialogRefs: InstanceType<typeof CBaseDialog>, value: number) {
    return dialogRefs.show({
      type: "slider",
      title: t("settings.contextMaxMessages.title"),
      description: t("settings.contextMaxMessages.description"),
      content: value,
      sliderOptions: {
        min: 0,
        max: 20,
        step: 1,
        showInput: true,
        size: "small",
      },
    });
  }

  static showContextMaxTokensDialog(dialogRefs: InstanceType<typeof CBaseDialog>, value: number) {
    return dialogRefs.show({
      type: "slider",
      title: t("settings.contextMaxTokens.title"),
      description: t("settings.contextMaxTokens.description"),
      content: value,
      sliderOptions: {
        min: 1,
        max: 4096,
        step: 1,
        showInput: true,
        size: "small",
      },
    });
  }

  static showResponseMaxTokensDialog(dialogRefs: InstanceType<typeof CBaseDialog>, value: number) {
    return dialogRefs.show({
      type: "slider",
      title: t("settings.responseMaxTokens.title"),
      description: t("settings.responseMaxTokens.description"),
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

  static showChatTemplateUrlDialog(dialogRefs: InstanceType<typeof CBaseDialog>, value: string): Promise<string | number> {
    return dialogRefs.show({
      type: "input",
      title: t("settings.basic.chatTemplateUrl.title"),
      placeholder: t("settings.basic.chatTemplateUrl.placeholder"),
      content: value,
    });
  }
}