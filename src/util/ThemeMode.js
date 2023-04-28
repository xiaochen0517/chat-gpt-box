import store from "@/store/store.js";

const setProperty = (name, value) => {
  document.documentElement.style.setProperty(name, value);
};

// 切换模式
export const switchMode = (mode) => {
  console.log("切换模式", mode);
  if (mode) {
    const darkTheme = ThemeInfo.dark;
    for (const property of darkTheme) {
      setProperty(property.name, property.value);
    }
  } else {
    const lightTheme = ThemeInfo.light;
    for (const property of lightTheme) {
      setProperty(property.name, property.value);
    }
  }
  store.commit("setDarkMode", mode);
};

const ThemeInfo = {
  light: [
    {
      name: "--primary-bg-color",
      value: "#FFFFFF"
    },
    {
      name: "--primary-dark-bg-color",
      value: "#EEEEEE"
    },
    {
      name: "--border-color",
      value: "#E0E0E0"
    },
    {
      name: "--border-color-light",
      value: "#FFFFFF33"
    },
    {
      name: "--border-color-dark",
      value: "#0000FF"
    },
    {
      name: "--primary-text-color",
      value: "#333333"
    },
    {
      name: "--primary-text-color-light",
      value: "#666666"
    },
    {
      name: "--primary-text-color-dark",
      value: "#000000"
    },
  ],
  dark: [
    {
      name: "--primary-bg-color",
      value: "#343541"
    },
    {
      name: "--primary-dark-bg-color",
      value: "#40414F"
    },
    {
      name: "--border-color",
      value: "#40414F"
    },
    {
      name: "--border-color-light",
      value: "#FFFFFF33"
    },
    {
      name: "--border-color-dark",
      value: "#0000ff"
    },
    {
      name: "--primary-text-color",
      value: "#fff"
    },
    {
      name: "--primary-text-color-light",
      value: "#666"
    },
    {
      name: "--primary-text-color-dark",
      value: "#000"
    },
  ],
};
