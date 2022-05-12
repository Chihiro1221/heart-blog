<script setup lang='ts'>
import { ITag } from '#/responseResult';

interface IProp {
  tags: ITag[];
  currentTag: number | null;
}

withDefaults(defineProps<IProp>(), {});

const emit = defineEmits(['change', 'reset']);
const selectedTag = (tag: ITag | null, index: number) => {
  if (!tag?._id) tag = null;
  emit('change', tag, index);
};
const reset = () => {
  emit('reset');
};
</script>

<template>
  <div class='tag-container'>
    <div class='cursor-pointer' @click='reset'>标签：</div>
    <div class='tag'>
      <a :class='{ active: currentTag === index }' @click='selectedTag(tag, index)' href='#'
         v-for='(tag, index) of tags' :key='tag._id'>{{
          tag.name
        }}</a>
    </div>
  </div>
</template>

<style scoped lang='scss'>
.tag-container {
  display: grid;
  grid-template-columns: 50px auto;

  .tag {
    @apply text-sm flex items-center gap-4 flex-wrap;
    a {
      @apply hover:text-violet-600 duration-200;
    }
  }
}
</style>
