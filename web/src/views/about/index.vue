<script setup lang="ts">
const content = ref(`# 😀 个人简介

大家好，这里是本站的站长，当前是大二，学历大专，学习方向是前端攻城狮。

## 爱好

- 打乒乓球
- 踢足球
- 看动漫

## 技术栈

- Vue3
- Vue2
- Nestjs
- Mongodb
- Pinia & Vuex
- Tailwindcss

## 动漫

本人非常喜欢千与千寻！

1. 千与千寻 ✅
2. 你的名字 ✅
3. 天空之城 ✅
4. 哈尔的移动城堡 ✅
5. 借东西的小人阿莉埃蒂 ✅
6. 言叶之庭 ✅
7. 天气之子 ✅
8. 萤火之森
9. 龙猫

## 电影

1. 肖申克的救赎 ✅
2. 触不可及 ✅
3. 南极之恋 ✅
4. 绿皮书
5. 海上钢琴师
6. 钢琴师

# 🐻 关于本站

本站最初其实是想实现一个博客网站，但最后功能点列出现要实现的有一些多，所以做出来之后就类似于一个论坛了，在这个网站我会分享一些关于我自己的学习经验，学习过程中遇到的一些问题，当然本站是支持注册账号的，我也希望对本站有兴趣的朋友可以注册一个账号支持一些站长。当然更好的话可以写文章来分享知识！其他有自己网站的朋友若想加入友情链接请在注册一个账号即可申请，我会经常留意审核。

## 本站技术

其实项目实现起来不难，耗时大概一个月左右，包括上线等，主要的时间都是耽误到了后台以及数据库方面，（现在数据库评论方面还是存在 Bug）毕竟这方面不是我的强项，但我对后端其实还是很感兴趣的，等之后工作了我会考虑学 php 或者 java，之后本博客网站也会实现微信小程序端。

### 后端

- Nestjs
- Ts
- Rbac 权限
- Mongodb
- passport 策略（jwt，local）
- bcrypt
- multer
- swagger

### 后台

- Vue3
- TypeScript
- Ant Design
- Pinia
- Axios
- Dayjs
- Font-awesome
- VeeValidate + yup
- Vite
- TailWindCss
- auto-load-component
- Auto-load-api
- Echarts
- ToastEditor

### 前端

- Vue3
- TypeScript
- Element Plus
- Pinia
- Axios
- Dayjs
- VeeValidate + yup
- Icon-park
- Vite
- TailWindCss
- Auto-load-component
- Auto-load-api
- V-md-editor
- Nprogress

> 有对 mongodb 比较精通的朋友可以帮忙看一下我提出的问题（哈哈哈哈）

# 👍 忠告

如果你同样跟我是大专生，那你就应该明白，当你踏进专科的那刻起你就必须明白：其实我们并没有多少时间！专科三年，其实只有二年半的时间可以学些东西。假如你还打算升本，假如你还想做做兼职学学其他的，那你只有二年在校时间！所以当你走进专科的那一刻起，你就该早给自己定下一个明确的目标，并且支持持之以恒的坚持下去！付诸于行动！加油陌生人！

![7](https://s2.loli.net/2022/04/13/lcIrtx2vGY3NkAF.jpg)

# 📞 联系

有疑问或者想咨询其他事情可以联系我。

qq：2213595911

Github：https://github.com/Chihiro1221

电子邮箱：2213595911@qq.com

# ©️ 项目版权

如侵犯他人著作权、名誉权、隐私权及肖像权等请联系本站删除。
`);
</script>

<template>
  <div class="w-[1200px] bg-white mt-4 p-10 mb-8">
    <div class="flex items-center gap-2">
      <img class="w-[20px] h-[20px]" src="/images/about.png" alt="" />
      <h2 class="text-xl">关于</h2>
    </div>
    <v-md-preview class="mt-4" :text="content" />
  </div>
</template>

<style scoped lang="scss"></style>
