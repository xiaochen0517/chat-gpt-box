import {SelectOptionItem} from "@/types/base/CSettingDialog.ts";
import axios from "axios";

export const getOllamaModelList = async (): Promise<SelectOptionItem[]> => {
  const response = await axios.get("http://localhost:11434/api/tags");
  const models = response.data.models;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return models.map((model: any) => {
    return {
      label: model.model,
      value: model.model,
    };
  });
};