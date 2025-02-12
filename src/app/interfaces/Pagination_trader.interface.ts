import { TraderI } from "./traders.interface";

export interface Pagination_traderI {
    content: TraderI[];  
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  }