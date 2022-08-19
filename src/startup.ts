import { Startup } from "@ipare/core";
import "@ipare/inject";
import "@ipare/env";
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
    .add(NavigatorMiddleware);
}
