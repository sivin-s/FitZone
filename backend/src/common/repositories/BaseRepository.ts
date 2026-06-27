import {injectable} from "inversify";
import type { Model, Document, QueryFilter, UpdateQuery, QueryOptions } from "mongoose";

// types
import type {IBaseRepository} from '../interfaces/IBaseRepository'

  // crud operations
// abstract class implementation
@injectable()
export abstract class BaseRepository<T extends Document> implements IBaseRepository<T>{
    constructor(protected readonly model: Model<T>){}

    async findById(id: string, selectFields?: string ): Promise<T | null> {
        const query = this.model.findById(id);
        if(selectFields){
            query.select(selectFields); // this is for include eg:"name email" (notice exclude eg: "-name -id")
        }
        return await query;
    }
    
    async findOne(filter: QueryFilter<T>, selectFields?: string): Promise<T | null> {
        const query = this.model.findOne(filter);
        if(selectFields){
            query.select(selectFields);
        }
        return await query;
    }

    async find(filter: QueryFilter<T>, selectFields?: string, options?: QueryOptions): Promise<T[]> {
        const query = this.model.find(filter, null, options);
        if(selectFields){
            query.select(selectFields);
        }
        return await query;
    }

    async create(doc: Partial<T>):Promise<T>{ // doc create 
        return await this.model.create(doc);
    }

    async update(id: string, updateData: UpdateQuery<T>): Promise<T | null> {
        return await this.model.findByIdAndUpdate(id, updateData,{
            new: true, // new updated data. not in-memory modified data.
            runValidators: true
        })
    }

    async delete(id: string): Promise<boolean> {
        const result  = await this.model.findByIdAndDelete(id); // return doc or null
        return !!result; // implicit conversion - boolean without , explicit - Boolean()
    }

}



