export interface Model {
  label: string;
  value: string;
}

export const GPTModelList: Model[] = [
  {
    label: "gpt-3.5-turbo",
    value: "gpt-3.5-turbo"
  },
  {
    label: "gpt-3.5-turbo-0301",
    value: "gpt-3.5-turbo-0301"
  },
  {
    label: "gpt-3.5-turbo-0613",
    value: "gpt-3.5-turbo-0613"
  },
  {
    label: "gpt-3.5-turbo-1106",
    value: "gpt-3.5-turbo-1106"
  },
  {
    label: "gpt-3.5-turbo-16k",
    value: "gpt-3.5-turbo-16k"
  },
  {
    label: "gpt-3.5-turbo-16k-0613",
    value: "gpt-3.5-turbo-16k-0613"
  },
  {
    label: "gpt-4",
    value: "gpt-4"
  },
  {
    label: "gpt-4-0314",
    value: "gpt-4-0314"
  },
  {
    label: "gpt-4-0613",
    value: "gpt-4-0613"
  },
  {
    label: "gpt-4-1106-preview",
    value: "gpt-4-1106-preview"
  }
];

export const DALLEModelList: Model[] = [
  {
    label: "dall-e-2",
    value: "dall-e-2"
  },
  {
    label: "dall-e-3",
    value: "dall-e-3"
  }
];
