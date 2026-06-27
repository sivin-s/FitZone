import {injectable} from "inversify";
import type { Document, QueryFilter, UpdateQuery, QueryOptions } from "mongoose";
import type { IBaseRepository } from "../interfaces/IBaseRepository";

// type
import type {IBaseService } from "../interfaces/IBaseService";

@injectable()
export abstract class BaseService<T extends Document> implements IBaseService<T>{
    constructor(protected readonly repository: IBaseRepository<T>){}
    
     async getById(id: string, selectFields?: string): Promise<T | null> {
        return await this.repository.findById(id,selectFields);
     }

     async getOne(filter: QueryFilter<T>, selectFields?: string): Promise<T | null> {
         return await this.repository.findOne(filter, selectFields);
     }

     async getAll(filter: QueryFilter<T>, selectFields?: string, options?: QueryOptions): Promise<T[]> {
         return await this.repository.find(filter, selectFields, options)
     }

     async create(data: Partial<T>): Promise<T> {
         return await this.repository.create(data);
     }

     async update(id: string, updateData: UpdateQuery<T>): Promise<T | null> {
         return await this.repository.update(id, updateData)
     }

     async delete(id: string): Promise<boolean> {
        return await this.repository.delete(id);
     }




}



