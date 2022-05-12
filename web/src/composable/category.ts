import { fetchCategories } from '@/apis/category';
import { ICate } from '#/responseResult';
import { ref } from 'vue';

export default new (class {
  public categories = ref<ICate[]>([]);
  public currentCategory = ref('默认分类');

  public async initCategory() {
    this.categories.value = (await fetchCategories()).result.data;
  }
})();
