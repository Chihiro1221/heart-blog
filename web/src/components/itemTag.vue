<script setup lang="ts">
import { ITag } from '#/responseResult';
interface IProp {
  tags: ITag[];
  color?: string;
}
withDefaults(defineProps<IProp>(), {
  color: 'text-gray-400',
});
</script>
<template>
  <div class="tag">
    <div :class="color" v-for="tag of tags" :key="tag._id">
      <a @click.stop="$router.push(`/tag/${tag._id}`)">{{ tag.name }}</a>
      <div class="circle"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tag {
  @apply flex items-center;
  div {
    @apply flex text-[13px] items-center;

    a {
      @apply hover:text-violet-500 duration-300;
    }

    &:last-of-type {
      .circle {
        @apply hidden;
      }
    }
  }
}
</style>
