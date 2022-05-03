import { HttpMethod, Middleware } from "@sfajs/core";
import { Inject } from "@sfajs/inject";
import { NavigationEntity } from "../entities/navigation.entity";
import { NavTypeEnum } from "../enums/nav-type.enum";
import { CollectionService } from "../services/collection.service";

export default class NavigatorMiddleware extends Middleware {
  @Inject
  private readonly collectionService!: CollectionService;

  async invoke(): Promise<void> {
    const host = this.ctx.req.headers.host as string;
    if (!host) {
      this.redirectDefault();
      return;
    }

    const res = await this.collectionService.navigation.doc(host).get();
    const nav = res.data[0] as NavigationEntity;
    if (!nav) {
      this.redirectDefault();
      return;
    }

    if (nav.type == NavTypeEnum.message || nav.type == NavTypeEnum.rootMsg) {
      this.ctx.res
        .setStatus(nav.code || 400)
        .setBody(
          nav.type == NavTypeEnum.rootMsg ? nav.to : { message: nav.to }
        );
    } else {
      this.redirect(
        nav.type == NavTypeEnum.url ? nav.to : this.getDomainUrl(nav),
        nav.code || 307
      );
    }
  }

  redirectDefault(): void {
    if (!this.ctx.req.method || this.ctx.req.method == HttpMethod.get) {
      this.redirect("https://hal.wang", 301);
    } else {
      this.notFoundMsg();
    }
  }

  getDomainUrl(nav: NavigationEntity): string {
    let domain = nav.to;
    const proto = this.ctx.req.getHeader("x-forwarded-proto");
    const path = this.ctx.req.path;
    if (!domain.startsWith("http://") && !domain.startsWith("https://")) {
      domain = `${proto}://${domain}`;
    }

    let url = `${domain}/${path}`;
    if (this.ctx.req.query && Object.keys(this.ctx.req.query).length) {
      Object.keys(this.ctx.req.query).forEach((key, index) => {
        const value = encodeURIComponent(this.ctx.req.query[key] as string);
        url += `${index == 0 ? "?" : "&"}${key}=${value}`;
      });
    }
    return url;
  }
}
