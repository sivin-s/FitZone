import type {
  Document,
  QueryFilter,
  UpdateQuery,
  QueryOptions,
} from "mongoose";

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IBaseRepository<T extends Document> {
  // crud operations
  findById(id: string, selectFields?: string): Promise<T | null>;
  findOne(filter: QueryFilter<T>, selectFields?: string): Promise<T | null>;
  find(
    filter: QueryFilter<T>,
    selectFields?: string,
    options?: QueryOptions,
  ): Promise<T[]>;
  findPaginated(
    filter: QueryFilter<T>,
    page: number,
    limit: number,
    selectFields?: string,
    options?: QueryOptions,
  ): Promise<PaginatedResult<T>>;
  countDocuments(filter: QueryFilter<T>): Promise<number>;
  create(doc: Partial<T>): Promise<T>;
  update(id: string, updateData: UpdateQuery<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
