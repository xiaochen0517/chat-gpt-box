export type DialogType = "input" | "slider" | "select";
export type SliderOptions = {
  min: number;
  max: number;
  step: number;
  showInput: boolean;
  size: "small" | "medium";
};
export type SelectOptionItem = {
  label: string;
  value: string | number;
};
export type SelectOptions = {
  list: SelectOptionItem[];
};
export type ShowOption = {
  type: DialogType;
  title: string;
  description?: string;
  placeholder?: string;
  content: string | number;
  sliderOptions?: SliderOptions;
  selectOptions?: SelectOptions;
};