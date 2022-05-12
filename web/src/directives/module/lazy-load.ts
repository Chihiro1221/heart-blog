import { Directive } from 'vue'

export default {
  beforeMount(el: HTMLImageElement, binding) {
    el.setAttribute('data-src', binding.value)
  },
  mounted(el) {
    const io = new IntersectionObserver(entries => {
      const realSrc = el.getAttribute('data-src')
      // 通过isIntersecting判断是否在可视区域内
      entries[0].isIntersecting && realSrc && (el.src = realSrc)
    })
    // 挂载实例, 提供给后续的unmounted钩子操作
    el.$io = io
    // 监听目标对象
    io.observe(el)
  },
  updated(el, binding) {
    // 实时更新最新的图片路径
    el.$data_src = binding.value
  },
  unmounted(el) {
    // 停止监听工作
    el.$io.disconnect()
  },
} as Directive<any, any>
