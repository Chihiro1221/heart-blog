import { ITag } from '#/responseResult';
import { fetchTags } from '@/apis/tag';

export default new (class {
  public tags = ref<ITag[]>([]);
  public naturalTags = ref<ITag[]>([]);

  constructor() {}

  public async initTags() {
    this.tags.value = (await fetchTags()).result.data;
    this.addAll();
    this.initNaturalTags();
  }

  public async initNaturalTags() {
    this.naturalTags.value = (await fetchTags()).result.data;
  }

  private addAll() {
    this.tags.value?.unshift({
      name: '全部',
      _id: '',
    } as any);
  }
})();
