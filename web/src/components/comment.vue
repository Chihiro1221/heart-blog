<script lang="ts" setup>
import utils from '@/utils';
import actionService from '@/composable/action';
import { ActionObjectEnum } from '@/enum/actionEnum';
import { ElMessage } from 'element-plus';
import { createComment } from '@/apis/comment';
import type { IComment } from '#/responseResult';
import { ThumbsUp, Comment } from '@icon-park/vue-next';
import { userStore } from '@/store/user';
interface IProp {
  comments: IComment[];
}

const user = userStore();

// 评论状态
function addCommentState(comments: IComment[], current?: IComment) {
  comments.forEach((comment) => {
    comment.state = false;
    if (comment.children?.length) {
      addCommentState(comment.children);
    }
  });
  if (current) current.state = true;
}

const emit = defineEmits(['like', 'reply-comment']);
const props = withDefaults(defineProps<IProp>(), {});
const comments = ref(props.comments);
const reply = ref('');
watch(
  () => props.comments,
  (value) => {
    comments.value = value;
  },
  {
    deep: true,
  }
);

addCommentState(comments.value);
const like = async (comment: IComment) => {
  await actionService.like(ActionObjectEnum.COMMENT, comment._id!);
  emit('like');
};
// 判断当前用户是否点赞过
const currentUserIsLike = (comment: IComment) => {
  return actionService.findUserAction(comment.likes!);
};
// 发表评论
const publishComment = async (comment: IComment) => {
  if (!user.profile) {
    return ElMessage({
      type: 'info',
      message: '请先登录',
    });
  }
  if (!reply.value) {
    return ElMessage({
      type: 'warning',
      message: '请输入内容之后评论!',
    });
  }
  const { result } =
    (await createComment({
      object_id: comment.object_id,
      action_object_type: ActionObjectEnum.COMMENT,
      content: reply.value,
      parent: comment._id,
    })) || {};
  if (!result) return;
  ElMessage({
    type: 'success',
    message: '发表成功',
  });
  comment.state = false;
  emit('reply-comment');
  reply.value = '';
};
</script>

<template>
  <template v-if="comments.length">
    <div v-for="comment of comments">
      <div class="comment-container">
        <img @click="$router.push(`/user/${comment.user?._id}`)" :src="comment.user?.avatar" alt="" class="avatar cursor-pointer" />
        <div class="content-container">
          <div class="nickname-container">
            <span class="text-gray-800 font-bold text-[14px]">{{ comment.user?.nickname }}</span>
            <span class="text-gray-400 text-xs">{{ utils.formatDate(comment.createdAt!) }}</span>
          </div>
          <h2 class="content">{{ comment.content }}</h2>
          <div class="flex items-center gap-4">
            <div
              :class="{ active: currentUserIsLike(comment) }"
              class="text-xs flex items-center gap-2 hover:text-violet-500 duration-200 cursor-pointer"
              @click="like(comment)">
              <component :is="ThumbsUp" />
              <span>{{ comment.likes?.length ?? 0 }}</span>
            </div>
            <div
              v-if="!comment.state"
              class="text-xs flex items-center gap-2 hover:text-violet-500 duration-200 cursor-pointer"
              @click="addCommentState(comments, comment)">
              <component :is="Comment" />
              <span>{{ comment.children?.length ?? 0 }}</span>
            </div>
            <div v-else class="text-sm cursor-pointer text-violet-500 duration-200" @click="comment.state = false">取消评论</div>
          </div>
          <div v-if="comment.state" class="mt-2">
            <el-input v-model.trim="reply" :placeholder="`回复${comment.user?.nickname}...`" rows="3" type="textarea" />
            <div class="text-right">
              <el-button class="mt-2" size="small" type="primary" @click="publishComment(comment)">发送</el-button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="comment.children?.length" class="ml-20">
        <div v-for="cc of comment.children" :key="cc._id" class="comment-container">
          <img :src="cc.user?.avatar" alt="" />
          <div class="content-container">
            <div class="nickname-container">
              <span v-if="comment._id === (cc.parent as IComment)?._id" class="text-gray-800 font-bold text-[14px]">{{
                cc.user?.nickname
              }}</span>
              <span v-else class="text-[14px]"
                >{{ cc.user?.nickname }}回复了{{ (cc.parent as IComment)?.user?.nickname
                }}</span
              >
              <span class="text-gray-400 text-xs">{{ utils.formatDate(cc.createdAt!) }}</span>
            </div>
            <h2 class="content">{{ cc.content }}</h2>
            <div class="flex items-center gap-4">
              <div
                :class="{ active: currentUserIsLike(cc) }"
                class="text-xs hover:text-violet-500 flex items-center gap-2 duration-200 cursor-pointer"
                @click="like(cc)">
                <component :is="ThumbsUp" />
                <span>{{ cc.likes?.length ?? 0 }}</span>
              </div>
              <div
                v-if="!cc.state"
                class="text-xs flex items-center gap-2 hover:text-violet-500 duration-200 cursor-pointer"
                @click="addCommentState(comment.children!, cc)">
                <component :is="Comment" />
                <span>{{ cc.children?.length ?? 0 }}</span>
              </div>
              <div v-else class="text-sm cursor-pointer text-violet-500 duration-200" @click="cc.state = false">取消评论</div>
            </div>
            <div v-if="cc.state" class="mt-2">
              <el-input v-model.trim="reply" :placeholder="`回复${cc.user?.nickname}...`" rows="3" type="textarea" />
              <div class="text-right">
                <el-button class="mt-2" size="small" type="primary" @click="publishComment(cc)">发送</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <el-empty v-else description="暂无评论"></el-empty>
</template>

<style lang="scss" scoped>
.comment-container {
  @apply grid mb-4;
  grid-template-columns: 50px 1fr;

  .content-container {
    @apply ml-4 col-auto auto-cols-fr items-start;
    .nickname-container {
      @apply flex justify-between items-center;
    }

    .content {
      @apply my-2 text-gray-500 text-[14px];
    }
  }
}
</style>
