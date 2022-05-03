import "@sfajs/http";
import { SfaHttp } from "@sfajs/http";
import { setStartup } from "./src";

const startup = setStartup(
  new SfaHttp().useHttpJsonBody().use(async (ctx, next) => {
    console.log(ctx.req.method, ctx.req.path);
    await next();
  }),
  true
);

function listen(port: number) {
  const server = startup.listen(port);
  server.on("listening", () => {
    console.log(`start: http://localhost:${port}`);
  });
  server.on("error", (err) => {
    if (err.code == "EADDRINUSE") {
      listen(port + 1);
    } else {
      console.error("Failed to start");
    }
  });
}

listen(2333);
