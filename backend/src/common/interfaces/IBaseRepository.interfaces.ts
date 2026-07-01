import type {Document,QueryFilter,UpdateQuery,QueryOptions} from 'mongoose'

export interface IBaseRepository<T extends Document>{
    // crud operations
    findById(id: string, selectFields?: string): Promise<T | null>;
    findOne(filter: QueryFilter<T>, selectFields?: string): Promise<T | null>;
    find(
        filter: QueryFilter<T>,
        selectFields?: string,
        options?: QueryOptions
    ): Promise<T[]>;
    create(doc: Partial<T>): Promise<T>;
    update(id: string, updateData: UpdateQuery<T>):Promise<T | null>;
    delete(id: string): Promise<boolean>;
}