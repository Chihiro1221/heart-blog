<script lang="ts" setup>
import listService from "@/composables/list"
import { utils } from "@/utils"
import type { ArticleDocument } from "@/apis/articleApi"
import commentApi, { CommentDocument } from "@/apis/commentApi"

const activeKey = ref("1")
const childActionKey = ref("Article")
const comments = ref<CommentDocument[]>([])
const childTab = reactive([
  {
    title: "文章评论",
    key: "Article",
  },
  {
    title: "相册评论",
    key: "Album",
  },
  {
    title: "友链评论",
    key: "Blogroll",
  },
])
const fetch = async () => {
  const { result } =
    (await commentApi.getList({
      where: { action_object_type: childActionKey.value },
      populate: ["user", "object_id"],
      sort: "-createdAt",
    })) || {}
  comments.value = result.data
}
fetch()
const commentChanged = () => {
  fetch()
}
</script>
<template>
  <div class="card">
    <h2 class="text-[18px]">最近动态</h2>
    <a-tabs v-model:activeKey="activeKey" size="small">
      <a-tab-pane key="1" tab="最近文章">
        <div class="content">
          <div v-for="article of listService.articles.value" :key="article._id!">
            <router-link :to="{ path: `/content/articles/edit/${article._id}` }" class="text-gray-700"
              >《{{ article.title }}》
            </router-link>
            <span>{{ utils.formatDate(article.createdAt!) }}</span>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="最新评论">
        <a-tabs v-model:activeKey="childActionKey" size="small" tab-position="left" @change="commentChanged">
          <a-tab-pane v-for="tab of childTab" :key="tab.key" :tab="tab.title">
            <div class="mt-4">
              <template v-if="comments.length">
                <div v-for="comment of comments" :key="comment._id!" class="flex flex-direction items-start mb-2">
                  <img :src="comment.user?.avatar" alt="" class="avatar !m-2 !mt-0" />
                  <div class="flex-1">
                    <div class="flex items-center text-xs justify-between">
                      <div class="flex items-center">
                        <span>{{ comment.user?.nickname }}</span>
                        <div class="text-gray-500 ml-2">
                          <router-link
                            v-if="comment.object_id"
                            :to="`/content/articles/edit/${(comment.object_id as ArticleDocument)._id}`"
                          >
                            发表在《
                            <span>
                              {{ (comment.object_id as ArticleDocument).title ?? (comment.object_id as ArticleDocument)._id
                              }} </span
                            >》
                          </router-link>
                          <div v-else>友情链接</div>
                        </div>
                      </div>
                      <span>{{ utils.formatDate(comment.createdAt!) }}</span>
                    </div>
                    <p class="mt-2 text-gray-700">{{ comment.content }}</p>
                  </div>
                </div>
              </template>
              <a-empty v-else />
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<style lang="scss" scoped>
.content {
  div {
    @apply py-4 border-b flex items-center justify-between;
  }
}
</style>
