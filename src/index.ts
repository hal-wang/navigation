import { SfaCloudbase } from "@sfajs/cloudbase";
import * as fs from "fs";
import NavigatorMiddleware from "./middlewares/navigator.middleware";
import { CollectionService } from "./services/collection.service";
import { CbappService } from "./services/cbapp.service";
import { InjectType } from "@sfajs/inject";
import * as dotenv from "dotenv";
import { Startup } from "@sfajs/core";

const version = (() => {
  let path = "./package.json";
  while (!fs.existsSync(path)) {
    path = "../" + path;
  }
  const pkgStr = fs.readFileSync(path, "utf-8");
  return JSON.parse(pkgStr).version;
})();

export function setStartup<T extends Startup>(startup: T, dev: boolean): T {
  if (dev) {
    dotenv.config({
      path: "./.env.local",
    });
  }

  return startup
    .use(async (ctx, next) => {
      ctx.res.setHeader("version", version);
      await next();
    })
    .useInject()
    .inject(CollectionService, InjectType.Singleton)
    .inject(CbappService, InjectType.Singleton)
    .add(NavigatorMiddleware);
}

const startup = setStartup(new SfaCloudbase(), false);
export const main = async (
  event: Record<string, unknown>,
  context: Record<string, unknown>
): Promise<unknown> => {
  console.log("event", JSON.stringify(event));
  console.log("context", JSON.stringify(context));

  return await startup.run(event, context);
};
