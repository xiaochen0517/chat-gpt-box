export type DialogType = "hint" | "input" | "slider" | "select";
export type InputOptions = {
  type: "text" | "number";
  min: number;
  max: number;
  size: "small" | "medium";
};
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
  inputOptions?: InputOptions;
  sliderOptions?: SliderOptions;
  selectOptions?: SelectOptions;
};