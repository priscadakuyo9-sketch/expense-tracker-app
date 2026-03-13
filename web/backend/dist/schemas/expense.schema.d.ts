import { Document, Types } from 'mongoose';
export declare class Expense extends Document {
    amount: number;
    description: string;
    date: Date;
    categoryId: Types.ObjectId;
    userId: Types.ObjectId;
    paymentMethod: string;
}
export declare const ExpenseSchema: import("mongoose").Schema<Expense, import("mongoose").Model<Expense, any, any, any, (Document<unknown, any, Expense, any, import("mongoose").DefaultSchemaOptions> & Expense & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Expense, any, import("mongoose").DefaultSchemaOptions> & Expense & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}), any, Expense>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Expense, Document<unknown, {}, Expense, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Expense & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    date?: import("mongoose").SchemaDefinitionProperty<Date, Expense, Document<unknown, {}, Expense, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Expense & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Expense, Document<unknown, {}, Expense, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Expense & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, Expense, Document<unknown, {}, Expense, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Expense & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Expense, Document<unknown, {}, Expense, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Expense & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    amount?: import("mongoose").SchemaDefinitionProperty<number, Expense, Document<unknown, {}, Expense, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Expense & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    categoryId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Expense, Document<unknown, {}, Expense, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Expense & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    paymentMethod?: import("mongoose").SchemaDefinitionProperty<string, Expense, Document<unknown, {}, Expense, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Expense & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Expense>;
