import {createRouter, createWebHashHistory} from "vue-router";

export type RouteType = {
  path: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: () => Promise<any>
};

const routes: RouteType[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/HomePage.vue"),
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("@/views/SettingsPage.vue"),
  },
  {
    path: "/settings/keyMap",
    name: "KeyMap",
    component: () => import("@/views/KeyMapPage.vue"),
  },
  {
    path: "/chat/editor/:chatId",
    name: "ChatEditor",
    component: () => import("@/views/ChatEditorPage.vue"),
  },
  {
    path: "/chat/template",
    name: "ChatTemplate",
    component: () => import("@/views/ChatTemplatePage.vue"),
  },
  {
    path: "/about",
    name: "About",
    component: () => import("@/views/AboutPage.vue"),
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
