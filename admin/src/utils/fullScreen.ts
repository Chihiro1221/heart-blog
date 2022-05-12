import { Ref } from 'vue'

export function fullScreen(state: Ref<boolean>) {
  state.value = !state.value
  if (state.value) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
