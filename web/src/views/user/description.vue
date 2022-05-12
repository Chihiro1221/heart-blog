<script setup lang="ts">
import { getUserProfileById } from '@/apis/user';
import { IArticle, IUser } from '#/responseResult';
import Avatar from '@/components/avatar.vue';
import { fetchArticles } from '@/apis/article';
import { Status } from '@/enum/statusEnum';
import ArticleItem from '@/layouts/home/articleItem.vue';

interface IProp {
  id: string;
}

const user = ref<IUser>();
const articles = ref<IArticle[]>([]);
const { id } = withDefaults(defineProps<IProp>(), {});
const currentPage = ref(1);
const pageSize = ref(5);
const pageSizes = ref([5, 10, 50, 100]);
const total = ref(100);

const fetch = async () => {
  const { result } = (await getUserProfileById(id)) || {};
  user.value = result;
};
const fetchArticle = async () => {
  const { result } = await fetchArticles({
    where: { author: user.value?._id, status: Status.ISSUE },
    sort: '-stick',
    limit: pageSize.value,
    page: currentPage.value,
  });
  articles.value = result.data;
  total.value = result.total;
};
await fetch();
user.value && (await fetchArticle());

const like = () => fetchArticle();
const pageSizeChange = (size: number) => {
  pageSize.value = size;
  fetchArticle();
};
const currentPageChange = (current: number) => {
  currentPage.value = current;
  fetchArticle();
};
</script>

<template>
  <div class="w-[1200px] mt-4">
    <template v-if="user">
      <div class="user w-full bg-white py-8 px-12 md:flex justify-center gap-20 items-center">
        <div class="flex items-center md:justify-start justify-center">
          <Avatar className="avatar !w-[80px] !h-[80px]" :user="user" />
          <div class="ml-6 desc flex flex-col justify-evenly">
            <h2 class="text-xl font-bold">{{ user.nickname }}</h2>
            <p class="text-gray-600">{{ user.description ?? '这个人很懒，什么都没留下。' }}</p>
            <div class="flex mt-4 items-center gap-4 text-[14px]">
              <el-tooltip v-if="user.qq" class="box-item" effect="dark" :content="user.qq + ''" placement="bottom">
                <img class="w-[15px]" src="/images/tencentqq.svg" alt="" />
              </el-tooltip>
              <el-tooltip v-if="user?.github" class="box-item" effect="dark" :content="user.github" placement="bottom">
                <img class="w-[15px]" src="/images/github.svg" alt="" />
              </el-tooltip>
              <el-tooltip
                v-if="!user.blogroll?.status && user.blogroll"
                class="box-item"
                effect="dark"
                :content="user.blogroll?.site"
                placement="bottom">
                <img class="w-[15px]" src="/images/firefoxbrowser.svg" alt="" />
              </el-tooltip>
            </div>
          </div>
        </div>
        <div class="grid grid-flow-col mt-4 justify-center gap-10 text-center">
          <div>
            <div class="mb-2 font-bold text-[18px]">文章数</div>
            <div>{{ user.articles?.count ?? 0 }}</div>
          </div>
          <div>
            <div class="mb-2 font-bold text-[18px]">点赞数</div>
            <div>{{ user.likes?.count ?? 0 }}</div>
          </div>
          <div>
            <div class="mb-2 font-bold text-[18px]">浏览量</div>
            <div>{{ user.browsers?.count ?? 0 }}</div>
          </div>
        </div>
      </div>
      <div v-if="articles.length" class="articles">
        <div @click="$router.push(`/post/${article._id}`)" class="item" v-for="article of articles" :key="article._id">
          <ArticleItem @like="like" :article="article" />
          <div class="hidden md:flex max-w-[250px] self-end px-4 self-end">
            <img v-lazy-load="article.cover" class="border w-[250px] h-[150px] object-cover" alt="" />
          </div>
        </div>
        <div v-if="articles.length" class="flex items-center mt-8 justify-center">
          <el-pagination
            v-model:currentPage="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="pageSizes"
            background
            layout="total, sizes, prev, pager, next"
            :total="total"
            @size-change="pageSizeChange"
            @current-change="currentPageChange" />
        </div>
      </div>
      <el-empty v-else description="暂无文章"></el-empty>
    </template>
    <el-empty v-else class="mt-20" description="没有该用户的信息"></el-empty>
  </div>
</template>

<style scoped lang="scss">
// ::v-deep.avatar-container {
//   > img {
//     @apply md:w-[100px] md:h-[100px] w-[70px] h-[70px] shadow rounded-full;
//   }
// }

.articles {
  @apply mt-4 mb-8 bg-white md:w-[80%] mx-auto min-h-[500px];
  > .item {
    @apply flex-1 p-4 cursor-pointer border-b md:grid grid-cols-3 items-center duration-200 hover:bg-gray-200 mb-0;
    &:last-of-type {
      @apply border-0;
    }
  }
}
</style>
