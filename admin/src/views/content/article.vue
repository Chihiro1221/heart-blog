<script lang="ts" setup>
import { computed, ref } from "vue"
import { message } from "ant-design-vue"
import listService from "@/composables/list"
import articleApi from "@/apis/articleApi"
import actionApi from "@/apis/actionApi"
import { PushpinOutlined, DiffOutlined, LikeFilled, DownOutlined } from "@ant-design/icons-vue"
import { articleColumns } from "@/rules/articleRules"
import { Status } from "@/enum/apiEnum"
import { Query } from "#/query"
import { ActionDocument } from "#/action"
import { utils } from "@/utils"
import { ActionEnum, ActionObjectEnum } from "@/enum/actionEnum"
import { authStore } from "@/store/auth"
import commentApi from "@/apis/commentApi"
import type { CommentDocument } from "@/apis/commentApi"

// 表格加载状态
const tableLoading = ref<boolean>(false)
// 多选数组
const selectRowKeys = ref<string[]>()
// 状态过滤
const filterState = ref<Status | null>(null)
// 分类过滤
const filterCategory = ref<string | null>(null)
// 检索
const filterSearch = ref<string | any>()
// 点赞模态框
const actionModalVisible = ref<boolean>(false)
// 点赞存储
const actions = ref<(ActionDocument | CommentDocument)[]>()
const user = authStore()
// 存储评论内容
const commentContent = ref()
// 发表评论对话框
const publishCommentVisible = ref<boolean>(false)
// 存储编辑文章id
const currentEditArticle = ref()
// 存储上一条评论
const parentComment = ref()
// 删除
const remove = async (id: string) => {
  const res = (await articleApi.deleteById(id)).result
  if (res) {
    message.success("删除成功")
    await listService.initArticles()
  }
}
// 选中事件
const rowSelection = {
  onChange: (selectedRowKeys: string[]) => {
    selectRowKeys.value = selectedRowKeys
  },
}
const cancelDelete = () => {
  message.info("取消删除")
}
// 删除所选
const confirmDeleteMany = async () => {
  const res = (await articleApi.deleteList(selectRowKeys.value!)).result
  if (res) {
    message.success("批量删除成功!")
    await listService.initArticles()
  }
}
// 彻底删除
const confirmedDeleteMany = async () => {
  const res = (await articleApi.confirmedDeleteMany(selectRowKeys.value!)).result
  if (res) {
    message.success("彻底删除成功!")
    await listService.initArticles()
  }
}
// 批量删除状态
const deleteManyState = computed(() => {
  return !selectRowKeys.value?.length
})

// 文章状态过滤
const changeStateFilter = async () => {
  let query: Query = { where: {} }
  if (filterState.value) query.where.status = filterState.value
  if (filterCategory.value) query.where.category = filterCategory.value
  await listService.initArticles(query)
}
// 文章搜索
const searchChange = async () => {
  await listService.initArticles({ where: { title: { $regex: filterSearch.value } } })
}
// 重置过滤条件
const resetFilterOptions = async () => {
  filterCategory.value = null
  filterState.value = null
  filterSearch.value = null
  await listService.initArticles()
}

// 切换页数
const pageSizeChanged = async (pageOption: any) => {
  listService.paginationOptions.value = pageOption
  await listService.initArticles({
    where: { title: { $regex: filterSearch.value }, status: filterState.value, category: filterCategory.value },
    limit: listService.paginationOptions.value.pageSize,
    page: listService.paginationOptions.value.current,
  })
}
// 显示点赞模态框
const showActionsModal = (data: ActionDocument[], articleId?: string) => {
  actionModalVisible.value = true
  actions.value = data
  currentEditArticle.value = articleId
}
// 确认是点赞还是收藏
const actionState = computed(() => {
  let state
  actions.value?.forEach((item: any) => {
    if (item.action_type === ActionEnum.LIKE) state = "点赞"
    else if (item.action_type === ActionEnum.COLLECT) state = "收藏"
    else if (item.content) state = "评论"
  })
  if (!actions.value?.length) {
    state = "操作"
  }
  return state
})
// 重新获取操作数据
const anewDate = async () => {
  const { result } = (await articleApi.getById(currentEditArticle.value)) || {}
  console.log(result)

  actions.value = result.comments
}
// 点赞
const like = async (comment: CommentDocument) => {
  if (!comment.is_show) return message.warning("无法对已隐藏的评论操作")
  await actionApi.add({
    action_object_type: ActionObjectEnum.COMMENT,
    action_type: ActionEnum.LIKE,
    object_id: comment._id!,
  })
  await anewDate()
}
// 显示发表评论对话框
const publishComment = async (comment?: any) => {
  if (comment && !comment?.is_show) return message.warning("无法对已隐藏的评论操作")
  if (comment) parentComment.value = comment._id
  publishCommentVisible.value = true
}
// 确认发表评论
const publishedCommented = async () => {
  await commentApi.add({
    action_object_type: "Article",
    content: commentContent.value,
    object_id: currentEditArticle.value,
    parent: parentComment.value,
  })
  publishCommentVisible.value = false
  parentComment.value = null
  await anewDate()
}
// 判断当前用户是否点赞
const isLike = (comment: CommentDocument) => {
  return comment.likes?.some((item) => (item.user as any) === user.profile._id)
}
// 隐藏评论
const hiddenComment = async (comment: CommentDocument) => {
  comment.is_show = comment.is_show === 0 ? 1 : 0
  const { result } = (await commentApi.updateById(comment._id!, comment)) || {}
  if (result) {
    message.success("隐藏成功")
  }
}
// 发布文章
const publish = async (id: string) => {
  const { result } = await articleApi.updateById(id, { status: Status.ISSUE })
  if (!result) return message.error("发布失败")
  message.success("发布成功")
  await listService.initArticles()
}
</script>
<template>
  <div v-if="listService.roles?.value?.length" class="menu-container">
    <a-table
      :columns="articleColumns"
      :data-source="listService.articles.value"
      :indentSize="50"
      :loading="tableLoading"
      :pagination="listService.paginationOptions.value"
      :row-selection="rowSelection"
      :scroll="{ x: 2000 }"
      defaultExpandAllRows
      rowKey="_id"
      @change="pageSizeChanged"
    >
      <template #title>
        <div class="mb-2">
          <h1 class="text-xl text-gray-700">文章管理</h1>
          <div class="flex items-center">
            <a-button type="primary" @click="$router.push('/content/articles/edit')">
              <DiffOutlined />
              写文章
            </a-button>
            <a-popconfirm
              :disabled="deleteManyState"
              cancel-text="取消"
              ok-text="确认"
              title="确认删除所选文章吗？他们将会被移入回收站。"
              @cancel="message.info('已取消!')"
              @confirm="confirmDeleteMany"
            >
              <a-button :disabled="deleteManyState" class="ml-2" danger ghost type="primary">移入回收站</a-button>
            </a-popconfirm>
            <a-popconfirm
              :disabled="deleteManyState"
              cancel-text="取消"
              ok-text="确认"
              title="注意：彻底删除回收站将不会保留文章!"
              @cancel="message.info('已取消!')"
              @confirm="confirmedDeleteMany"
            >
              <a-button :disabled="deleteManyState" class="ml-2" danger type="primary">彻底删除</a-button>
            </a-popconfirm>
            <span class="flex items-center mx-2 text-gray-500 text-sm">
              <PushpinOutlined style="color: red" />
              表示的是置顶哦
            </span>
          </div>
          <div class="flex items-center mt-4 gap-4">
            <div class="search flex items-center">
              <span class="min-w-[50px]">搜索：</span>
              <a-input v-model:value="filterSearch" placeholder="请输入文章标题" @blur="searchChange" @keydown.enter="searchChange" />
            </div>
            <div class="status">
              <span class="mr-2">状态筛选：</span>
              <a-select v-model:value="(filterState as Status)" style="width: 120px" @change="changeStateFilter">
                <a-select-option :value="null">全部</a-select-option>
                <a-select-option v-for="(status, index) of Status" :key="index" :value="status">
                  <span v-if="status === Status.ISSUE">
                    <a-badge color="green" text="已发布" />
                  </span>
                  <span v-else-if="status === Status.DRAFT">
                    <a-badge status="default" text="草稿" />
                  </span>
                  <span v-else-if="status === Status.PRIVATE">
                    <a-badge color="orange" text="私密" />
                  </span>
                  <span v-else>
                    <a-badge color="red" text="回收站" />
                  </span>
                </a-select-option>
              </a-select>
            </div>
            <div class="category flex items-center">
              <span class="mr-2 min-w-[70px]">分类筛选：</span>
              <a-tree-select
                v-model:value="(filterCategory as string)"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :replaceFields="{ title: 'name', value: '_id', key: '_id', children: 'children' }"
                :tree-data="listService.categories.value"
                allow-clear
                placeholder="请选择分类过滤"
                style="width: 100%"
                tree-default-expand-all
                @change="changeStateFilter"
              >
              </a-tree-select>
            </div>
            <a-button type="primary" @click="resetFilterOptions">重置条件</a-button>
          </div>
        </div>
      </template>

      <template #a_title="{ text: title, record: row }">
        <div class="flex items-center">
          <PushpinOutlined v-if="row.is_stick" style="color: red" />
          <a-button class="!pl-2" type="link" @click="$router.push(`/content/articles/edit/${row._id}`)">
            {{ title }}
          </a-button>
        </div>
      </template>

      <template #category="{ text: category }">
        <a-tag v-if="category" class="cate-tag shadow-2xl" color="#108ee9">
          {{ category?.name }}
        </a-tag>
        <span v-else>--</span>
      </template>

      <template #tags="{ text: tags }">
        <div v-if="tags?.length" class="flex flex-col items-start justify-center">
          <a-tag
            v-for="tag of tags"
            :key="tag._id"
            :style="{ borderColor: tag?.color, backgroundColor: 'white', color: tag?.color }"
            class="!m-1 block"
            >{{ tag?.name }}
          </a-tag>
        </div>
        <span v-else>--</span>
      </template>

      <template #status="{ text: status }">
        <span v-if="status === Status.ISSUE">
          <a-badge color="green" text="已发布" />
        </span>
        <span v-else-if="status === Status.DRAFT">
          <a-badge status="default" text="草稿" />
        </span>
        <span v-else-if="status === Status.PRIVATE">
          <a-badge color="orange" text="私密" />
        </span>
        <span v-else>
          <a-badge color="red" text="回收站" />
        </span>
      </template>

      <template #likes="{ text: likes }">
        <div>
          <a-badge :count="likes.length" :overflowCount="999" class="cursor-pointer" showZero @click="showActionsModal(likes)" />
        </div>
      </template>

      <template #comments="{ text: comments, record: row }">
        <div>
          <a-badge
            :count="comments?.length"
            :number-style="{
              backgroundColor: 'green',
            }"
            :overflowCount="999"
            class="cursor-pointer"
            showZero
            @click="showActionsModal(comments, row._id)"
          />
        </div>
      </template>

      <template #browsers="{ text: browsers }">
        <div>
          <a-badge
            :count="browsers.length"
            :number-style="{
              backgroundColor: '#448ef7',
            }"
            :overflowCount="999"
            class="cursor-pointer"
            showZero
          />
        </div>
      </template>

      <template #collects="{ text: collects }">
        <div>
          <a-badge
            :count="collects.length"
            :number-style="{
              backgroundColor: 'orange',
            }"
            :overflowCount="999"
            class="cursor-pointer"
            showZero
            @click="showActionsModal(collects)"
          />
        </div>
      </template>

      <template #cover="{ text: cover, record: row }">
        <div class="cover cursor-pointer" @click="row.cover_isShow = true">
          <img v-if="cover" :src="cover" alt="..." />
        </div>
        <a-modal v-model:visible="row.cover_isShow" :footer="null" title="预览图" width="650px" @ok="row.cover_isShow = false">
          <img :src="cover" alt="..." />
        </a-modal>
      </template>

      <template #author="{ text: author }">
        <span>{{ author?.nickname }}</span>
      </template>

      <template #createdAt="{ text: createdAt }">
        <span>{{ utils.formatDate(createdAt) }}</span>
      </template>

      <template #action="{ text: row }">
        <a-button size="small" type="link" @click="publish(row._id)" v-if="row.status === Status.PRIVATE">发布</a-button>
        <a-button size="small" type="link" @click="$router.push(`/content/articles/edit/${row._id}`)">编辑</a-button>
        <a-popconfirm cancel-text="取消" ok-text="确认" title="确认删除这个文章吗" @cancel="cancelDelete" @confirm="remove(row._id)">
          <a-button class="ml-2" danger size="small" type="text">删除</a-button>
        </a-popconfirm>
      </template>
    </a-table>

    <a-modal
      v-model:visible="actionModalVisible"
      :cancelButtonProps="{ hidden: true }"
      :title="`${'用户' + actionState}列表`"
      okText="确认"
      @ok="actionModalVisible = false"
    >
      <template v-if="actionState !== '评论'">
        <template v-if="actions?.length">
          <div
            v-for="item of actions"
            :key="item._id!"
            class="py-2 px-4 list flex items-center cursor-pointer hover:bg-gray-100 duration-300"
          >
            <div class="avatar !m-0">
              <img :src="item.user?.avatar" alt="" class="object-cover w-full h-full" />
            </div>
            <div class="ml-2">
              <div class="nickname font-bold text-md">{{ item.user?.nickname }}</div>
              <div class="createTime text-xs text-gray-700">点赞于：{{ utils.formatDate(item.createdAt!) }}</div>
            </div>
          </div>
        </template>
        <a-empty v-else />
      </template>
      <template v-else>
        <a-button type="primary" @click="publishComment()">发表评论</a-button>
        <a-comment v-for="comment of actions" :key="comment._id!">
          <template #actions>
            <div key="comment-basic-like" class="w-full">
              <div class="flex items-center text-xs">
                <a-tooltip title="点赞" @click="like((comment as CommentDocument))">
                  <div class="flex items-center cursor-pointer">
                    <LikeFilled v-if="isLike((comment as CommentDocument))" class="mr-2" style="color: #2db7f5" />
                    <LikeFilled v-else class="mr-2" />
                    <span>{{ comment.likes?.length }}</span>
                  </div>
                </a-tooltip>
                <span key="comment-basic-reply-to" class="ml-2 cursor-pointer" @click="publishComment((comment as CommentDocument))"
                  >评论</span
                >
                <!-- 更多操作 -->
                <a-dropdown class="ml-2" :trigger="['click']">
                  <a class="ant-dropdown-link" @click.prevent>
                    更多操作
                    <DownOutlined />
                  </a>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item @click="hiddenComment((comment as CommentDocument))">
                        <a v-if="comment.is_show" href="javascript:;" class="text-xs">设置为隐藏</a>
                        <a v-else href="javascript:;" class="text-xs">显示评论</a>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
              <p class="mt-2 text-xs text-indigo-600" v-if="!comment.is_show">注意：这条评论已经被隐藏。</p>
            </div>
          </template>
          <template #author
            ><a>{{ comment.user?.nickname }}</a></template
          >
          <template #avatar>
            <a-avatar :src="comment.user?.avatar" alt="Han Solo" />
          </template>
          <template #content>
            <div class="flex items-center">
              <p>
                {{ comment.content }}
              </p>
            </div>
          </template>
          <template #datetime>
            <a-tooltip>
              <span>{{ utils.formatDate(comment.createdAt!) }}</span>
            </a-tooltip>
          </template>
          <!-- 嵌套评论 -->
          <a-comment v-for="c of comment.children" :key="c._id!">
            <template #actions>
              <div key="comment-basic-like" class="w-full">
                <div class="flex items-center text-xs">
                  <a-tooltip title="点赞" @click="like((c as CommentDocument))">
                    <div class="flex items-center cursor-pointer">
                      <LikeFilled v-if="isLike((c as CommentDocument))" class="mr-2" style="color: #2db7f5" />
                      <LikeFilled v-else class="mr-2" />
                      <span>{{ c.likes?.length }}</span>
                    </div>
                  </a-tooltip>
                  <span key="comment-basic-reply-to" class="ml-2 cursor-pointer" @click="publishComment((c as CommentDocument))">评论</span>
                </div>
              </div>
            </template>
            <template #author
              ><a>{{ c.user?.nickname }}</a></template
            >
            <template #avatar>
              <a-avatar :src="c.user?.avatar" alt="Han Solo" />
            </template>
            <template #content>
              <p class="flex items-center">
                <span class="text-xs text-gray-600"> 回复{{ comment.user?.nickname }}: </span>
                <span>
                  {{ c.content }}
                </span>
              </p>
            </template>
            <template #datetime>
              <a-tooltip>
                <span>{{ utils.formatDate(c.createdAt!) }}</span>
              </a-tooltip>
            </template>
          </a-comment>
        </a-comment>
        <!-- 发表或回复评论对话框 -->
        <a-modal
          v-model:visible="publishCommentVisible"
          :title="`${parentComment ? '回复' : '发表'}评论`"
          @cancel="() => (parentComment = null)"
          @ok="publishedCommented"
        >
          <a-form-item>
            <a-textarea v-model:value="commentContent" :rows="4" placeholder="请输入评论内容"></a-textarea>
          </a-form-item>
        </a-modal>
      </template>
    </a-modal>
  </div>
</template>

<style lang="scss" scoped>
.cover {
  min-width: 120px;
  min-height: 90px;
  margin: 0 !important;

  img {
    width: 100%;
    height: 100%;
  }
}

.ant-modal-body {
  padding: 20px 0 !important;
}
</style>
