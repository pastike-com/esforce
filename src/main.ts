// @ts-nocheck

import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

Vue.directive("click-outside", {
  stopProp(e) {
    e.stopPropagation();
  },

  inserted(el, binding) {
    const handler = (e) => {
      if (!el.contains(e.target) && el !== e.target) {
        binding.value(e);
      }
    };
    el.clickOutside = handler;

    const event = binding.modifiers.mousedown ? "mousedown" : "click";

    document.addEventListener(event, el.clickOutside);
    document.addEventListener("touchstart", el.clickOutside);
  },

  unbind(el, binding) {
    if (!el.clickOutside) return;

    const event = binding.modifiers.mousedown ? "mousedown" : "click";

    document.removeEventListener(event, el.clickOutside);
    document.removeEventListener("touchstart", el.clickOutside);
    delete el.clickOutside;
  },
});

new Vue({
  render: (h) => h(App),
}).$mount("#app");
