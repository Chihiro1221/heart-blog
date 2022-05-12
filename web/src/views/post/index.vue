<script lang="ts" setup>
import { fetchArticle } from '@/apis/article';
import { createComment } from '@/apis/comment';
import { IArticle, ICate } from '#/responseResult';
import utils from '@/utils';
import ArticleTips from '@/layouts/home/articleTips.vue';
import { action } from '@/apis/action';
import { ActionEnum, ActionObjectEnum } from '@/enum/actionEnum';
import articleService from '@/composable/article';
import actionService from '@/composable/action';
import { ElMessage } from 'element-plus';
import router from '@/router';
import Comment from '@/components/comment.vue';
import { useRoute } from 'vue-router';
import { ThumbsUp, Star, Comment as CommentIcon } from '@icon-park/vue-next';
import BackTop from '../../components/backTop.vue';
import { userStore } from '@/store/user';
import { Status } from '@/enum/statusEnum';
import Avatar from '@/components/avatar.vue';

interface IProp {
  id?: string;
}

interface IScroll {
  title: string;
  lineIndex: string;
  indent: number;
  active: boolean;
}

const user = userStore();
const route = useRoute();
const article = ref<IArticle>();
const titleList = ref<IScroll[]>([]);
const isFixed = ref(false);
const preview = ref();
const catalogue = ref();
const comment = ref();
let anchors: HTMLTitleElement[];
const commentRef = ref<HTMLDivElement>();
const props = withDefaults(defineProps<IProp>(), {});

const fetch = async (_id?: string) => {
  const { result } = _id ? await fetchArticle(_id!) : (await fetchArticle(props.id!)) || {};
  if ((result as any)?.code !== -1 && result.status === Status.ISSUE) article!.value = result;
  else article.value = null as any;
};
watch(
  () => route.params,
  async ({ id }) => {
    // nextTick(() => generateDirectory());
    if (id && route.name === 'post-index') {
      await fetch(id as string);
      await action({
        action_object_type: ActionObjectEnum.ARTICLE,
        action_type: ActionEnum.BROWSE,
        object_id: id as string,
      });
      generateDirectory();
      return;
    }
    article.value = null as any;
    document.removeEventListener('scroll', scrollFn);
  },
  {
    immediate: true,
  }
);

function scrollFn() {
  const scrollTop = document.documentElement.scrollTop || 0;
  anchors.forEach((el: HTMLTitleElement) => {
    const lineIndex = el.getAttribute('data-v-md-line');
    const current = titleList.value.find((item) => item.lineIndex === lineIndex);
    if (lineIndex && scrollTop >= el.offsetTop - 25 && !current?.active) {
      titleList.value.forEach((item) => (item.active = false));
      current!.active = true;
    } else {
      current!.active = false;
    }
  });
  const catalogueOffsetTop = catalogue.value.offsetTop;
  // 目录固定
  isFixed.value = scrollTop - 40 >= catalogueOffsetTop;
}

function generateDirectory() {
  anchors = preview.value?.$el.querySelectorAll('h1,h2,h3,h4,h5,h6');
  const titles = anchors && (Array.from(anchors) as HTMLTitleElement[])?.filter((title) => !!title.innerText.trim());
  if (!anchors) return;
  if (!titles.length) {
    titleList.value = [];
    return;
  }
  const hTags = Array.from(new Set(titles.map((title) => title.tagName))).sort();
  titleList.value = titles.map((el) => {
    return {
      title: el.innerText,
      lineIndex: el.getAttribute('data-v-md-line'),
      indent: hTags.indexOf(el.tagName),
      active: false,
    } as IScroll;
  });
  document.addEventListener('scroll', scrollFn);
}

onMounted(() => {
  if (!article.value) return;
  document.documentElement.scrollTop = 0;
  generateDirectory();
});
// 目录跳转
const handleAnchorClick = (anchor: IScroll) => {
  const { lineIndex } = anchor;
  const heading = preview.value.$el.querySelector(`[data-v-md-line="${lineIndex}"]`);
  if (heading) {
    preview.value.scrollToTarget({
      target: heading,
      scrollContainer: window,
      top: 10,
    });
  }
};
// 点赞
const like = async () => {
  const { result } = await action({
    action_object_type: ActionObjectEnum.ARTICLE,
    action_type: ActionEnum.LIKE,
    object_id: article.value?._id!,
    status: 1,
    user: user.profile?._id,
  });
  ElMessage({
    type: result.status ? 'success' : 'info',
    message: result.status ? '点赞成功' : '已取消点赞',
  });
  await fetch();
};
// 收藏
const collect = async () => {
  const { result } = await action({
    action_object_type: ActionObjectEnum.ARTICLE,
    action_type: ActionEnum.COLLECT,
    object_id: article.value?._id!,
    status: 1,
    user: user.profile?._id,
  });
  ElMessage({
    type: result.status ? 'success' : 'info',
    message: result.status ? '收藏成功' : '已取消收藏',
  });
  await fetch();
};
// 判断当前用户是否点赞过
const currentUserIsLike = computed(() => actionService.findUserAction(article.value?.likes!));
// 判断当前用户是否收藏过
const currentUserIsCollect = computed(() => actionService.findUserAction(article.value?.collects!));

const cateLink = async (cate: ICate) => {
  await router.push('/');
  document.scrollingElement!.scrollTop = 0;
  articleService.changeCateArticle(cate);
};
// 发表评论
const publishComment = async () => {
  if (!user.profile) {
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
    object_id: article.value?._id!,
    action_object_type: ActionObjectEnum.ARTICLE,
    content: comment.value,
  });
  await fetch();
  ElMessage({
    type: 'success',
    message: '发表成功',
  });
  comment.value = '';
};
// 滚动到评论区
const positionComment = () => {
  const offsetTop = commentRef.value?.offsetTop!;
  document.documentElement.scrollTo({
    top: offsetTop - 100,
    behavior: 'smooth',
  });
};
// 点赞评论
const likeComment = async () => {
  await fetch();
};
// 回复评论
const replyComment = async () => {
  await fetch();
};
</script>

<template>
  <div class="main-container">
    <!-- 文章模块 -->
    <div class="article-container">
      <div v-if="article" class="bg-white md:px-8 px-2 py-4 border">
        <div class="user flex items-center mb-4 gap-2">
          <!-- <img
            :src="article.author?.avatar"
            alt=""
            class="avatar cursor-pointer"
            @click.stop="$router.push(`/user/${article?.author?._id}`)" /> -->
          <Avatar @click.stop="$router.push(`/user/${article?.author?._id}`)" className="avatar cursor-pointer" :user="article.author!" />
          <div class="flex flex-col">
            <span class="name cursor-pointer font-[500]" @click.stop="$router.push(`/user/${article?.author?._id}`)">{{
              article.author?.nickname
            }}</span>
            <div class="flex items-center text-gray-500">
              <span class="time text-sm">{{ utils.formatDate(article.createdAt) }}</span>
              <span class="circle"></span>
              <span class="text-sm">浏览量 {{ article.browsers?.length }}</span>
            </div>
          </div>
        </div>
        <div class="text-3xl font-bold">{{ article.title }}</div>
        <img :src="article.cover" alt="" class="my-2" />
        <v-md-preview ref="preview" :text="article.content" class="mt-4" />
        <div class="md:flex items-center gap-4 mt-10">
          <div v-if="article.category" class="text-[14px] mb-4 md:mb-0 flex items-center">
            <span class="text-gray-500">分类：</span>
            <div class="flex items-center" @click="cateLink(article?.category!)">
              <span class="bg-gray-100 hover:bg-gray-200 duration-200 cursor-pointer text-fray-500 rounded-md px-2 py-1">
                {{ article.category?.name }}
              </span>
            </div>
          </div>
          <div v-if="article.tags?.length" class="flex items-center text-[14px]">
            <span class="text-gray-500">标签：</span>
            <div class="flex gap-2">
              <span
                v-for="tag of article.tags"
                :key="tag._id"
                class="rounded-md px-2 py-1 bg-violet-100 cursor-pointer hover:bg-violet-200 duration-200 text-violet-700"
                >{{ tag.name }}</span
              >
            </div>
          </div>
        </div>
      </div>
      <el-empty v-else description="文章不存在或已被删除" />
      <div v-if="article" ref="commentRef" class="bg-white px-8 py-4 border mt-4">
        <h2 class="text-xl">评论</h2>
        <div class="publish-comment mt-4">
          <div class="flex items-center gap-4 justify-start">
            <img
              :src="
                user.profile?.avatar ?? 'https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/e30559a8dc5b1a0ea4b8b2a485d34018.svg'
              "
              alt=""
              class="avatar" />
            <el-input
              v-model.trim="comment"
              :disabled="!user.profile"
              :placeholder="user.profile ? '请在这里输入评论' : '请您登录之后操作'"
              rows="3"
              type="textarea" />
          </div>
          <div class="mt-4 text-right">
            <el-button type="primary" @click="publishComment">发表评论</el-button>
          </div>
        </div>
        <div class="mt-4">
          <Comment :comments="article.comments!" @like="likeComment" @reply-comment="replyComment" />
        </div>
      </div>
    </div>
    <!-- 目录模块 -->
    <div class="hidden md:block">
      <ArticleTips class="!mt-0" />
      <div ref="catalogue" :class="{ fixed: isFixed, 'top-0': true, 'w-[280px]': true }" class="i-card">
        <div class="header">
          <i class="fa-solid fa-bars"></i>
          <h2>文章目录</h2>
        </div>
        <div v-if="titleList.length" class="content">
          <div
            v-for="anchor in titleList"
            :class="{ active: anchor.active, 'font-bold': anchor.active }"
            :style="{ padding: `10px 0 10px ${anchor.indent * 20}px` }"
            class="hover:text-violet-500 duration-200 text-sm"
            @click="handleAnchorClick(anchor)">
            <a style="cursor: pointer">{{ anchor.title }}</a>
          </div>
        </div>
        <el-empty v-else description="暂无目录"></el-empty>
      </div>
    </div>
    <!-- 回到顶部 -->
    <div v-if="article">
      <BackTop />
    </div>
    <!-- 操作模块 -->
    <div v-if="article" class="action-container hidden md:block">
      <div :class="{ active: currentUserIsLike }" class="like relative" @click="like">
        <div class="absolute right-0 top-0 bg-gray-600 px-2 text-xs rounded-md text-white">{{ article.likes?.length }}</div>
        <component :is="ThumbsUp" size="24" />
      </div>
      <div :class="{ active: currentUserIsCollect }" class="collect relative" @click="collect">
        <div class="absolute right-0 top-0 bg-gray-600 px-2 text-xs rounded-md text-white">{{ article.collects?.length }}</div>
        <component :is="Star" size="24" />
      </div>
      <div class="comment" @click="positionComment">
        <component :is="CommentIcon" size="24" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-container {
  @apply relative;
  .article-container {
    @apply md:w-full w-screen md:col-span-3 min-h-[800px];
  }

  .action-container {
    @apply h-full fixed top-[200px] left-[50px];
    > div {
      @apply mb-4 w-[50px] h-[50px] bg-white rounded-full text-gray-500 flex items-center justify-center shadow-md text-[16px] hover:bg-violet-600 hover:text-white duration-300 cursor-pointer;
      &.active {
        @apply bg-violet-600 text-white;
      }
    }
  }
}
</style>
