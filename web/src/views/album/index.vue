<script setup lang="ts">
import Tag from '@/components/tag.vue';
import { fetchAlbum, fetchAlbumById } from '@/apis/album';
import { createComment } from '@/apis/comment';
import Comment from '@/components/comment.vue';
import ItemTag from '@/components/itemTag.vue';
import ItemAction from '@/components/itemAction.vue';
import { IAlbum, IComment, ITag } from '#/responseResult';
import { ElMessage } from 'element-plus';
import { ActionEnum, ActionObjectEnum } from '@/enum/actionEnum';
import { action } from '@/apis/action';
import { userStore } from '@/store/user';
import tagService from '@/composable/tag';

const { result } = await fetchAlbum();
const user = userStore();
const album = ref(result);
const dialogVisible = ref(false);
const currentPhoto = ref<IAlbum>();
const currentTag = ref(0);
const comment = ref();
tagService.initTags();
const showPhotoDialog = async (photo: IAlbum) => {
  dialogVisible.value = true;
  currentPhoto.value = photo;
  await action({
    action_object_type: ActionObjectEnum.ALBUM,
    action_type: ActionEnum.BROWSE,
    object_id: photo._id,
  });
  await changeTag();
};
const handleClose = () => {
  dialogVisible.value = false;
};

const fetchAlbumOne = async (id: string) => {
  const { result } = await fetchAlbumById(id);
  currentPhoto.value = result;
};

const sendComment = async () => {
  if (!comment.value) {
    return ElMessage({
      message: '评论内容不能为空!',
      type: 'warning',
    });
  }
  const dto = {
    action_object_type: ActionObjectEnum.ALBUM,
    content: comment.value,
    object_id: currentPhoto.value?._id,
  } as IComment;
  await createComment(dto);
  await fetchAlbumOne(currentPhoto.value?._id!);
};

const changeTag = async (tag?: ITag, index?: number) => {
  const { result } = tag ? await fetchAlbum({ where: { tags: tag._id } }) : await fetchAlbum();
  album.value.data = result.data;
  if (index) currentTag.value = index!;
};
const like = async () => {
  await changeTag();
};
const load = () => {
  console.log(1);
};
</script>

<template>
  <div class="main-container !grid-cols-1">
    <div class="bg-white border">
      <div class="album p-4 border-b">
        <Tag :currentTag="currentTag" :tags="tagService.tags.value" @change="changeTag" />
      </div>
      <div class="photo" v-if="album.data.length">
        <div class="cursor-pointer group" @click="showPhotoDialog(photo)" v-for="photo of album.data" :key="photo._id">
          <img class="w-[300px]" v-lazy-load="photo.picture" alt="" />
          <div class="mask group-hover:!translate-y-0">
            <ItemAction color="!text-white" :object="photo" @like="like" />
            <div v-if="photo.tags?.length" class="text-white flex items-center mt-2">
              <span class="text-sm">标签：</span>
              <ItemTag color="!text-white" :tags="photo.tags" />
            </div>
            <p class="mt-1 text-violet-200 text-xs truncate">{{ photo.description ?? '暂无描述...' }}</p>
          </div>
        </div>
        <el-dialog v-model="dialogVisible" custom-class="my-dialog" width="70%" title="相册" :before-close="handleClose">
          <div class="gap-4">
            <div class="grid col-span-2">
              <img class="m-0 w-full" :src="currentPhoto?.picture" alt="" />
              <ItemAction class="mt-4" :object="currentPhoto" @like="fetchAlbumOne(currentPhoto?._id!)" />
              <div v-if="currentPhoto?.tags?.length" class="flex items-center mt-2">
                <span class="text-sm">标签：</span>
                <ItemTag :tags="currentPhoto?.tags" />
              </div>
              <p class="mt-2 text-[16px]">{{ currentPhoto?.description }}</p>
            </div>
            <div v-infinite-scroll="load" class="mt-4 comments-container min-w-[300px] max-h-[550px] overflow-auto border-b">
              <div class="flex flex-col justify-center items-end">
                <el-input
                  :disabled="!user.isLogin"
                  :rows="3"
                  :placeholder="user.isLogin ? '在这里发表评论' : '请您登录之后操作'"
                  v-model="comment"
                  type="textarea" />
                <el-button :disabled="!user.isLogin" class="mt-2" type="primary" @click="sendComment">发送</el-button>
              </div>
              <div v-if="currentPhoto?.comments?.length" class="comments">
                <Comment
                  :comments="currentPhoto.comments"
                  @like="fetchAlbumOne(currentPhoto?._id!)"
                  @reply-comment="fetchAlbumOne(currentPhoto?._id!)" />
              </div>
              <div v-else>
                <el-empty description="暂无评论" />
              </div>
            </div>
          </div>
          <template #footer>
            <span class="dialog-footer">
              <el-button type="primary" @click="dialogVisible = false">确认</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
      <el-empty v-else description="暂无图片"></el-empty>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main-container {
  .photo {
    @apply flex flex-wrap gap-2 p-4 justify-start items-start;
    min-height: 600px !important;

    > div {
      @apply border shadow-md shadow-gray-200 relative overflow-hidden;
      .mask {
        @apply p-2 absolute bottom-0 left-0 bg-black bg-opacity-50 w-full h-[80px] translate-y-[80px] duration-300;
      }
    }
  }

  .comments {
    @apply mt-4 overflow-auto;
  }
}
</style>
