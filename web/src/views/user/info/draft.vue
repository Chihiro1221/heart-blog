<script setup lang='ts'>
import Badge from '@/components/badge.vue';
import { IArticle } from '#/responseResult';
import { fetchArticles, recycleArticle } from '@/apis/article';
import { userStore } from '@/store/user';
import { Status } from '@/enum/statusEnum';
import { ElMessage, ElMessageBox } from 'element-plus';
import utils from '@/utils';
import { ArrowDown } from '@element-plus/icons-vue';

const user = userStore();
const articles = ref<IArticle[]>();
const search = ref();
const currentPage = ref(1);
const pageSize = ref(5);
const pageSizes = ref([5, 10, 50, 100]);
const total = ref(100);

const fetch = async () => {
  const { result } =
  (await fetchArticles({
    where: { author: user.profile?._id, title: { $regex: search.value ?? '' }, status: [Status.DRAFT] },
    sort: '-createdAt',
    limit: pageSize.value,
    page: currentPage.value
  })) || {};
  if (!result) ElMessage({ type: 'error', message: '获取文章失败' });
  articles.value = result.data;
  total.value = result.total;
};
await fetch();
const searchArticle = () => {
  fetch();
};
const pageSizeChange = (size: number) => {
  pageSize.value = size;
  fetch();
};
const currentPageChange = (current: number) => {
  currentPage.value = current;
  fetch();
};
const recycle = (id: string) => {
  ElMessageBox.confirm('确定将该文章移入回收站吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const result = (await recycleArticle(id)) || {};
      if (!result.code) {
        await fetch();
        ElMessage({
          type: 'success',
          message: '已移入回收站'
        });
      }
    })
    .catch((err) => err);
};
</script>

<template>
  <div class='topic'>
    <div class='screen'>
      <label>
        <input
          v-model.trim='search'
          @blur='searchArticle'
          class='rounded-xl text-sm indent-2 placeholder:text-sm px-2 py-1 outline-none border'
          type='text'
          placeholder='请输入文章标题' />
      </label>
      <el-button type='primary' class='ml-2' @click='searchArticle'>搜索</el-button>
    </div>
    <template v-if='articles?.length'>
      <div @click='$router.push(`/post/${article._id}`)' class='item' v-for='article of articles' :key='article._id'>
        <div class='content'>
          <div class='head'>
            <h2>{{ article.title }}</h2>
            <span class='hidden md:block'>最后更新于：{{ utils.formatDate(article.updatedAt) }}</span>
          </div>
          <div class='category'>
            <div class='cate'>
              分类：<span>{{ article.category?.name ?? '暂无分类' }}</span>
            </div>
            <div class='tag'>
              标签：
              <template v-if='article.tags?.length'>
                <span v-for='tag of article.tags'>{{ tag.name }}</span>
              </template>
              <template v-else>
                <span>暂无标签</span>
              </template>
            </div>
          </div>
        </div>
        <div class='action'>
          <el-dropdown>
            <span class='el-dropdown-link text-violet-500'>
              操作
              <el-icon class='el-icon--right'>
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click='$router.push(`/post/edit/${article._id}`)'>编辑</el-dropdown-item>
                <el-dropdown-item @click='recycle(article._id)'>删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <div>
            <Badge color='#ccc' v-if='article.status === Status.DRAFT'>草稿</Badge>
          </div>
        </div>
      </div>
    </template>
    <el-empty v-else description='暂无内容'></el-empty>
    <div class='flex items-center mt-8 justify-center'>
      <el-pagination
        v-model:currentPage='currentPage'
        v-model:page-size='pageSize'
        :page-sizes='pageSizes'
        background
        layout='total, sizes, prev, pager, next'
        :total='total'
        @size-change='pageSizeChange'
        @current-change='currentPageChange' />
    </div>
  </div>
</template>

<style scoped lang='scss'>
.topic {
  @apply pb-4;
  .screen {
    @apply p-4 border-b;
  }

  .item {
    @apply flex items-center justify-between border-b p-4 box-border duration-200 cursor-pointer bg-white hover:bg-gray-200;
    @apply mb-0;
    .content {
      @apply flex flex-col gap-4;
      .head {
        @apply flex items-center;
        h2 {
          @apply font-bold;
          @apply text-xl;
        }

        span {
          @apply text-sm ml-4;
          @apply text-gray-500;
        }
      }

      .category {
        @apply md:flex hidden items-center gap-4 text-xs;
        .cate {
          span {
            @apply bg-gray-500 text-white py-1 px-2 rounded-sm  cursor-pointer hover:bg-gray-400 duration-200;
          }
        }

        .tag {
          @apply flex items-center gap-2;
          span {
            @apply bg-violet-500 py-1 px-2 rounded-sm cursor-pointer text-white hover:bg-violet-400 duration-200;
          }
        }
      }
    }

    .action {
      @apply text-[14px] flex flex-col items-end gap-2;
      .edit {
        @apply hover:text-violet-500 duration-200 cursor-pointer;
      }

      .remove {
        @apply hover:text-red-500 duration-200 cursor-pointer;
      }
    }
  }
}
</style>
