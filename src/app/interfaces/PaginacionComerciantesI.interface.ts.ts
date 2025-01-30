import { ComercianteI } from "./Comerciante.interface";

export interface PaginacionComerciantesI {
    content: ComercianteI[];  
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  }