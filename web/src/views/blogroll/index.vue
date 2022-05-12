<script setup lang="ts">
import { getBlogroll } from '@/apis/blogroll';
import { IBlogRoll, IComment } from '#/responseResult';
import { userStore } from '@/store/user';
import { createComment, getComments } from '@/apis/comment';
import Comment from '@/components/comment.vue';
import { ElMessage } from 'element-plus';
import { ActionObjectEnum } from '@/enum/actionEnum';
import type { IUser } from '#/responseResult';

const user = userStore();
const blogrolls = ref<IBlogRoll[]>([]);
const comments = ref<IComment[]>([]);
const comment = ref('');
const fetch = async () => {
  const { result } = (await getBlogroll({ where: { status: 1 }, sort: '-createdAt', populate: 'user' })) || {};
  blogrolls.value = result.data;
};
fetch();

const fetchComments = async () => {
  const { result } = await getComments({
    where: {
      action_object_type: 'Blogroll',
      is_show: 1,
    },
    sort: '-createdAt',
    populate: 'user',
  });
  comments.value = result;
};
fetchComments();

// 发表评论
const publishComment = async () => {
  if (!user.isLogin) {
    return ElMessage({
      type: 'error',
      message: '请先登录',
    });
  }
  if (!comment.value) {
    return ElMessage({
      type: 'warning',
      message: '请输入内容之后评论!',
    });
  }
  await createComment({
    action_object_type: ActionObjectEnum.Blogroll,
    content: comment.value,
  });
  await fetchComments();
  ElMessage({
    type: 'success',
    message: '发表成功',
  });
  comment.value = '';
};
// 点赞评论
const likeComment = async () => {
  await fetchComments();
};
// 回复评论
const replyComment = async () => {
  await fetchComments();
};
</script>

<template>
  <div class="w-[1200px] mx-auto bg-white border mt-4 md:p-10 px-4 py-10 box-border">
    <div class="header flex items-center gap-2">
      <img class="w-[20px] h-[20px]" src="/images/blogroll.png" alt="" />
      <h2 class="text-[18px]">友情链接</h2>
    </div>
    <div class="desc text-sm text-gray-500 mt-4">
      注意：以下友情链接没有先后顺序优先。若要加入友情链接，请注册账号之后前往个人中心申请。
    </div>
    <div class="content mt-4 grid border-b pb-20 border-dashed md:grid-cols-4 grid-cols-2">
      <a
        class="item hover:shadow-lg duration-200 shadow-violet-500 cursor-pointer flex items-center gap-4 py-4 px-4 rounded-2xl border"
        v-for="blog of blogrolls"
        :href="blog.site"
        target="_blank"
        :key="blog._id">
        <img class="object-center w-[40px] h-[40px]" :src="blog.avatar" alt="" />
        <div class="overflow-hidden">
          <h2 class="text-[14px]">{{ (blog.user as IUser)?.nickname }}</h2>
          <p class="text-sm text-gray-500 truncate">{{ blog.description }}发大水发大水发大水发大水发</p>
        </div>
      </a>
    </div>
    <div class="comment-container">
      <div class="bg-white mt-4">
        <h2 class="text-xl">评论区</h2>
        <div class="publish-comment mt-4">
          <div class="flex items-center gap-4 justify-start">
            <img
              class="avatar"
              :src="
                user.profile?.avatar ?? 'https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/e30559a8dc5b1a0ea4b8b2a485d34018.svg'
              "
              alt="" />
            <el-input
              :disabled="!user.isLogin"
              rows="3"
              v-model.trim="comment"
              type="textarea"
              :placeholder="user.profile ? '请在这里输入评论' : '请您登录之后操作'" />
          </div>
          <div class="mt-4 text-right">
            <el-button type="primary" @click="publishComment">发表评论</el-button>
          </div>
        </div>
        <div class="mt-4">
          <Comment :comments="comments" @like="likeComment" @reply-comment="replyComment" />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
