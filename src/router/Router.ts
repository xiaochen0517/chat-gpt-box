import {createRouter, createWebHashHistory} from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/HomePage.vue")
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import('../views/SettingsPage.vue')
  },
  {
    path: "/chat/editor/:chatId",
    name: "ChatEditor",
    component: () => import('../views/ChatEditorPage.vue')
  },
  {
    path: "/test",
    name: "Test",
    component: () => import('../views/TestPage.vue')
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
