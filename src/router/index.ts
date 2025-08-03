import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import ContactPage from "../views/ContactPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/contact",
  },
  {
    path: "/contact",
    name: "Contact",
    component: ContactPage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
