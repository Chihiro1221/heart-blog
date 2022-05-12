import { albumRules } from "./albumRules"
import { articleRules } from "./articleRules"
import { tagRules } from "./tagRules"
import { cateRules } from "./cateRules"
import { roleRules } from "./roleRules"
import { menuRules } from "./menuRules"
import { userRules } from "./userRules"
import { blogrollRules } from "@/rules/blogrollRules"

export default {
  user: userRules,
  menu: menuRules,
  role: roleRules,
  cate: cateRules,
  tag: tagRules,
  article: articleRules,
  Album: albumRules,
  blogroll: blogrollRules,
}
