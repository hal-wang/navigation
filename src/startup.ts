import "@halsp/inject";
import "@halsp/logger";

import { HttpStartup } from "@halsp/http";
import { getVersion } from "@halsp/env";
import { CollectionService } from "./services/collection.service";
import { CbappService } from "./services/cbapp.service";
import { InjectType } from "@halsp/inject";
import NavigatorMiddleware from "./middlewares/navigator.middleware";

export default function <T extends HttpStartup>(startup: T): T {
  return startup
    .use(async (ctx, next) => {
      ctx.res.set("version", (await getVersion()) ?? "");
      await next();
    })
    .useEnv()
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
