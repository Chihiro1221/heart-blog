import { ActionEnum, ActionObjectEnum } from '@/enum/actionEnum';
import { action } from '@/apis/action';
import { ElMessage } from 'element-plus';
import { IAction, IUser } from '#/responseResult';
import { userStore } from '@/store/user';

const user = userStore();
export default new (class {
  public async like(object_type: ActionObjectEnum, object: string) {
    const { result } =
      (await action({
        action_object_type: object_type,
        action_type: ActionEnum.LIKE,
        object_id: object,
        status: 1,
        user: user.profile?._id,
      })) || {};
    if (!result) return;
    ElMessage({
      type: result?.status ? 'success' : 'info',
      message: result?.status ? '点赞成功' : '已取消点赞',
    });
  }

  public findUserAction(arr: any[]) {
    return arr?.some((like: IAction) => {
      return (like.user as IUser)._id === user.profile?._id;
    });
  }
})();
