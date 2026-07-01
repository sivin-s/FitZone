import type { QueryFilter, UpdateQuery, QueryOptions,Document } from "mongoose";


export interface IBaseService<T extends Document>{
    getById(id: string, selectFields?:string): Promise<T | null>;
    getOne(filter: QueryFilter<T>, selectFields?: string): Promise<T | null>;
    getAll(
        filter: QueryFilter<T>,
        selectFields?: string,
        options?: QueryOptions
    ): Promise<T[]>;
    create(data: Partial<T>): Promise<T>;
    update(id: string, updateData: UpdateQuery<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}









