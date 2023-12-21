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

  static showContextMaxMessagesDialog(dialogRefs: InstanceType<typeof CSettingsDialog>, value: number) {
    const description = "If the number of tokens in a message exceeds the maximum number of tokens configured for the current request, " +
      "the number of messages sent will be appropriately reduced until it conforms to the limit set by the maximum tokens configuration.";
    return dialogRefs.show({
      type: "slider",
      title: "Context max messages",
      description: description,
      content: value,
      sliderOptions: {
        min: 0,
        max: 20,
        step: 1,
        showInput: true,
        size: "small"
      }
    });
  }

  static showContextMaxTokensDialog(dialogRefs: InstanceType<typeof CSettingsDialog>, value: number) {
    const description = "The request for tokens is limited by the set number of request messages. " +
      "Calculate whether the tokens for the specified number of messages exceed this value. If they do, " +
      "reduce the number of request messages until it falls below this limit.";
    return dialogRefs.show({
      type: "slider",
      title: "Context max tokens",
      description: description,
      content: value,
      sliderOptions: {
        min: 1,
        max: 4096,
        step: 1,
        showInput: true,
        size: "small"
      }
    });
  }
}