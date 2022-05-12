<script setup lang="ts">
import { IAction } from '#/responseResult';
import { userStore } from '@/store/user';
import { ElMessage, ElMessageBox } from 'element-plus';
import utils from '@/utils';
import { ArrowDown } from '@element-plus/icons-vue';
import { getUserCollection, updateUserCollection } from '@/apis/user';

const user = userStore();
const actions = ref<IAction[]>();

const fetch = async () => {
  if (!user.isLogin) return;
  const { result } = (await getUserCollection(user.profile?._id!)) || {};
  if (!result) ElMessage({ type: 'error', message: '获取文章失败' });
  actions.value = result;
};
await fetch();
const cancelCollect = (id: string) => {
  ElMessageBox.confirm('确认取消收藏该文章吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      const result = (await updateUserCollection(id, { status: 0 })) || {};
      if (!result.code) {
        await fetch();
        ElMessage({
          type: 'success',
          message: '取消收藏成功',
        });
      }
    })
    .catch((err) => err);
};
</script>

<template>
  <div class="topic">
    <template v-if="actions?.length">
      <div @click="$router.push(`/post/${action.article?._id}`)" class="item" v-for="action of actions" :key="action._id">
        <div class="content">
          <div class="head">
            <h2>{{ action.article?.title ?? '文章已丢失，请删除' }}</h2>
            <span class="hidden md:block">收藏于：{{ utils.formatDate(action.article?.updatedAt!) }}</span>
          </div>
          <div class="category">
            <div class="cate">
              分类：<span>{{ action.article?.category?.name ?? '暂无分类' }}</span>
            </div>
            <div class="tag">
              标签：
              <template v-if="action.article?.tags?.length">
                <span v-for="tag of action.article.tags">{{ tag.name }}</span>
              </template>
              <template v-else>
                <span>暂无标签</span>
              </template>
            </div>
          </div>
        </div>
        <div class="action">
          <el-dropdown>
            <span class="el-dropdown-link text-violet-500">
              操作
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="cancelCollect(action._id!)">取消收藏</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </template>
    <el-empty v-else description="暂无内容"></el-empty>
  </div>
</template>

<style scoped lang="scss">
.topic {
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
        @apply items-center gap-4 text-xs hidden md:flex;
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
