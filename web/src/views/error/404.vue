<script lang='ts' scoped>
</script>
<template>
  <div class='bg-gradient-to-r from-purple-300 to-blue-200'>
    <div class='w-9/12 m-auto py-16 min-h-screen flex items-center justify-center'>
      <div class='bg-white shadow overflow-hidden sm:rounded-lg pb-8'>
        <div class='border-t border-gray-200 text-center pt-8'>
          <h1 class='text-9xl font-bold text-purple-400'>404</h1>
          <h1 class='text-6xl font-medium py-8'>页面找不到</h1>
          <p class='text-2xl pb-8 px-12 font-medium'>您正在访问的页面不存在，可能已经被删除或移动，如有疑问，请联系管理员。</p>
          <button
            @click='$router.back()'
            class='bg-gradient-to-r from-green-300 to-blue-500 hover:from-pink-500 hover:to-green-500 text-white font-semibold px-6 py-3 rounded-md mr-6'>
            返回
          </button>
          <button
            @click='$router.push("/")'
            class='bg-gradient-to-r from-purple-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 text-white font-semibold px-6 py-3 rounded-md mr-6'>
            首页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang='scss' scoped>
.text-9xl {
  font-size: 14rem;
}

@media (max-width: 645px) {
  .text-9xl {
    font-size: 5.75rem;
  }

  .text-6xl {
    font-size: 1.75rem;
  }

  .text-2xl {
    font-size: 1rem;
    line-height: 1.2rem;
  }

  .py-8 {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .px-6 {
    padding-left: 1.2rem;
    padding-right: 1.2rem;
  }

  .mr-6 {
    margin-right: 0.5rem;
  }

  .px-12 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>