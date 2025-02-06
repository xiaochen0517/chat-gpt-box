import {SelectOptionItem} from "@/types/base/CSettingDialog.ts";

export const DALLE2ImageSizeList: SelectOptionItem[] = [
  {
    label: "256x256",
    value: "256x256"
  },
  {
    label: "512x512",
    value: "512x512"
  },
  {
    label: "1024x1024",
    value: "1024x1024"
  }
];
export const DALLE3ImageSizeList: SelectOptionItem[] = [
  {
    label: "1024x1024",
    value: "1024x1024"
  },
  {
    label: "1792x1024",
    value: "1792x1024"
  },
  {
    label: "1024x1792",
    value: "1024x1792"
  }
];
export const ImageStyleList: SelectOptionItem[] = [
  {
    label: "vivid",
    value: "vivid"
  },
  {
    label: "natural",
    value: "natural"
  }
];
export const ImageQualityList: SelectOptionItem[] = [
  {
    label: "standard",
    value: "standard"
  },
  {
    label: "hd",
    value: "hd"
  },
];