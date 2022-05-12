import dashboard from "@/composables/dashboard"
const { initArticles, initBrowses, initCollects, initComments, initLikes } = dashboard
export async function initData() {
  return {
    tooltip: {},
    legend: {
      data: ["数量"],
    },
    xAxis: {
      data: ["文章", "浏览", "收藏", "点赞", "评论"],
    },
    yAxis: {},
    series: [
      {
        name: "数量",
        type: "bar",
        data: [await initArticles(), await initBrowses(), await initCollects(), await initLikes(), await initComments()],
      },
    ],
  }
}
