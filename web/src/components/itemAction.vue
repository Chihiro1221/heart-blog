<script setup lang='ts'>
import { action } from '@/apis/action';
import { ActionEnum, ActionObjectEnum } from '@/enum/actionEnum';
// import userService from '@/composable/user';
import articleService from '@/composable/article';
import { IAction, IUser } from '#/responseResult';
import { PreviewOpen, ThumbsUp, Comment } from '@icon-park/vue-next';
import { userStore } from '@/store/user';

interface IProp {
  object: any;
  color?: string;
}

const user = userStore();
const emit = defineEmits(['like']);
const prop = withDefaults(defineProps<IProp>(), {
  object: null,
});
watch(
  () => prop.object,
  () => {
  },
  { deep: true },
);

const like = async () => {
  await action({
    action_object_type: ActionObjectEnum.ARTICLE,
    action_type: ActionEnum.LIKE,
    object_id: prop.object._id,
    status: 1,
    user: user.profile?._id,
  });
  emit('like');
};
// 判断当前用户是否点赞过
const currentUserIsLike = computed(() => {
  return prop.object.likes.some((like: IAction) => (like.user as IUser)._id === user.profile?._id);
});
</script>

<template>
  <div class='action'>
    <div :class='color' class='flex items-center gap-2'>
      <component :is='PreviewOpen' />
      <span>{{ object.browsers?.length ?? 0 }}</span>
    </div>
    <div
      :class="{  '!text-violet-500': currentUserIsLike ,'!text-white': color && !currentUserIsLike}"
      @click.stop='like'
      class='hover:!text-violet-500 like flex items-center gap-2'
    >
      <component :is='ThumbsUp' />
      <span>{{ object.likes.length }}</span>
    </div>
    <div :class='color' class='hover:!text-violet-500 like flex items-center gap-2'>
      <component :is='Comment' />
      <span>{{ object.comments?.length }}</span>
    </div>
  </div>
</template>

<style scoped lang='scss'>
.action {
  @apply flex items-center gap-4;
  div {
    @apply text-xs text-gray-600;
    i {
      @apply mr-1;
    }
  }

  .like {
    @apply cursor-pointer duration-300 relative;
  }
}
</style>
