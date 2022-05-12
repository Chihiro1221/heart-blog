import { Module } from "@nestjs/common"
import { ActionsController } from "./actions.controller"
import { ActionsService } from "apps/admin/src/actions/actions.service"

@Module({
  controllers: [ActionsController],
  providers: [ActionsService],
})
export class ActionsModule {}
