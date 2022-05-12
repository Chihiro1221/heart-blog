import { Directive } from "vue";

export default {
  beforeMount(el: HTMLImageElement, binding) {
    el.setAttribute("data-src", binding.value);
  },
  mounted(el) {
    function scale(img: HTMLImageElement, height = 500) {
      return Math.min(height / img.naturalHeight, height / img.naturalWidth);
    }

    const src = el.getAttribute("data-src");
    el.src = src;
    el.onload = () => {
      el.width = el.naturalWidth * scale(el);
      el.height = el.naturalHeight * scale(el);
    };
  },
} as Directive<any, any>;
