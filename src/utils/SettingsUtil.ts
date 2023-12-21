import CSettingsDialog from "@/components/base/dialog/CSettingsDialog.vue";

export class SettingsUtil {
  
  static showApiDialog(dialogRefs: InstanceType<typeof CSettingsDialog>, value: string) {
    return dialogRefs.show({
      type: "input",
      title: "Api url",
      placeholder: "Please input api url.",
      content: value
    });
  }
  
  static showTemperatureDialog(dialogRefs: InstanceType<typeof CSettingsDialog>, value: number) {
    const description = "The lower this value, the more rigorous the output will be; " +
      "the higher the value, the more random the output will be. " +
      "Too low or too high can both affect the quality of what's generated, generally maintaining it at 0.7 is sufficient.";
    return dialogRefs.show({
      type: "slider",
      title: "Temperature",
      description: description,
      content: String(value),
      sliderOptions: {
        min: 0,
        max: 100,
        step: 1,
        showInput: true,
        size: "small"
      }
    });
  }
}