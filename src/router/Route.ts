import type { Page } from "./Page";
import type { PageContext } from "./Page";


export type PageConstructor = new (
    context: PageContext,
    params: Record<string, string>,
) => Page;


export interface Route {
    path: string;
    page: PageConstructor;
}