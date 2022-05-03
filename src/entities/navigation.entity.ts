import { NavTypeEnum } from "../enums/nav-type.enum";

export interface NavigationEntity {
  _id: string;
  to: string;
  code?: 301 | 302 | 303 | 307 | 308 | 400 | 401 | 403 | 404 | 500 | number;
  type: NavTypeEnum;
}
