import { UserDocument } from "@/apis/userApi"
import { RuleObject } from "ant-design-vue/lib/form/interface"
import { reactive, ref } from "vue"
// 表单默认数据
export const userFormState = ref<UserDocument>({
  username: "",
  nickname: "",
})
// 验证密码
const validatePass = async (rule: RuleObject, value: string) => {
  if (!value) {
    return Promise.reject("密码不能为空!")
  }
  return Promise.resolve()
}

// 校验重复密码
const validateReNewPass = (rule: RuleObject, value: string) => {
  if (!value) {
    return Promise.reject("重复密码不能为空!")
  } else {
    if (value !== userFormState.value.password) {
      return Promise.reject("两次密码不一致!")
    }
    console.log(rule)
  }
  return Promise.resolve()
}
// 表单校验规则
export const userRules = reactive({
  username: [
    {
      required: true,
      message: "用户名称是必须的",
      trigger: "blur",
    },
    {
      max: 8,
      min: 5,
      message: "用户名长度在5到8位",
      trigger: "blur",
    },
  ],
  nickname: [
    {
      required: true,
      message: "用户昵称是必须的",
      trigger: "blur",
    },
    {
      max: 10,
      min: 2,
      message: "用户昵称在2到10位",
      trigger: "blur",
    },
  ],
  rawPassword: [
    {
      required: true,
      message: "原密码是必须的",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      validator: validatePass,
      trigger: "blur",
    },
  ],
  reNewPassword: [
    {
      validator: validateReNewPass,
      trigger: "blur",
    },
  ],
  description: {
    max: 100,
    message: "个人简介在100字之内",
    trigger: "blur",
  },
  qq: {
    pattern: /^[1-9][0-9]{4,}$/,
    message: "qq格式不正确",
    trigger: "blur",
  },
  email: {
    pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
    message: "邮箱格式不正确",
    trigger: "blur",
  },
})
// 用户配置
export const userColumns = reactive([
  {
    title: "用户名",
    dataIndex: "username",
    slots: { customRender: "username" },
  },
  {
    title: "用户昵称",
    dataIndex: "nickname",
  },
  {
    title: "角色",
    dataIndex: "role",
    slots: { customRender: "role" },
  },
  {
    title: "是否启用",
    dataIndex: "is_enabled",
    slots: { customRender: "is_enabled" },
  },
  {
    title: "操作",
    slots: { customRender: "action" },
  },
])
