import { InjectModel } from "nestjs-typegoose"
import { Model } from "mongoose"
import { Crud } from "nestjs-mongoose-crud"
import { ApiTags } from "@nestjs/swagger"
import { Controller } from "@nestjs/common"
import { Category } from "@db/db/models/category.model"

@ApiTags("分类")
@Crud({
  model: Category,
  routes: {
    create: false,
    delete: false,
    update: false,
  },
})
@Controller("categories")
export class CategoriesController {
  constructor(@InjectModel(Category) private readonly model: Model<Category>) {}
}
