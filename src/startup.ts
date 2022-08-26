import "@ipare/inject";
import "@ipare/env";
import "@ipare/logger";

import { Startup } from "@ipare/core";
import { CollectionService } from "./services/collection.service";
import { CbappService } from "./services/cbapp.service";
import { InjectType } from "@ipare/inject";
import NavigatorMiddleware from "./middlewares/navigator.middleware";

export default function <T extends Startup>(startup: T, mode: string): T {
  return startup
    .useVersion()
    .useEnv(mode)
    .useInject()
    .inject(CollectionService, InjectType.Singleton)
    .inject(CbappService, InjectType.Singleton)
    .useConsoleLogger()
    .use(async (ctx, next) => {
      const logger = await ctx.getLogger();
      logger.info("event: " + JSON.stringify(ctx.lambdaEvent));
      logger.info("context: " + JSON.stringify(ctx.lambdaContext));
      await next();
    })
    .add(NavigatorMiddleware);
}
