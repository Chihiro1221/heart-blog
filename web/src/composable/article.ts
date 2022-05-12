import { IArticle, ICate } from '#/responseResult';
import { fetchArticles } from '@/apis/article';
import { Query } from '#/requestParams';
import { ref } from 'vue';
import categoryService from '@/composable/category';
import router from '@/router';
import { Status } from '@/enum/statusEnum';

export default new (class {
  public articles = ref<IArticle[]>([]);
  public tags = reactive([
    {
      name: '综合',
      value: '',
    },
    {
      name: '热门',
      value: 'browses',
    },
    {
      name: '最新',
      value: 'createdAt',
    },
  ]);
  public currentTab = ref('');
  public total = ref(0);

  constructor() {
    void this.getArticles({ where: { status: Status.ISSUE } });
  }

  public async getArticles(query?: Query) {
    const { result } = await fetchArticles(query);
    this.articles.value = result.data;
    this.total.value = result.total;
  }

  public changeTag(item: { name: string; value: string }) {
    this.currentTab.value = item.value;
  }

  public changeCateArticle(cate: ICate) {
    void this.getArticles({ where: { category: cate._id, status: Status.ISSUE } });
    this.currentTab.value = '';
    categoryService.currentCategory.value = cate.name;
    void router.push('/');
  }
})();
