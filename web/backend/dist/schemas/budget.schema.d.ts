import { Document, Types } from 'mongoose';
export declare class Budget extends Document {
    limitAmount: number;
    period: string;
    alertThreshold: number;
    amount: number;
    userId: Types.ObjectId;
}
export declare const BudgetSchema: import("mongoose").Schema<Budget, import("mongoose").Model<Budget, any, any, any, (Document<unknown, any, Budget, any, import("mongoose").DefaultSchemaOptions> & Budget & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Budget, any, import("mongoose").DefaultSchemaOptions> & Budget & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}), any, Budget>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Budget, Document<unknown, {}, Budget, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Budget & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Budget, Document<unknown, {}, Budget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Budget & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    limitAmount?: import("mongoose").SchemaDefinitionProperty<number, Budget, Document<unknown, {}, Budget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Budget & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    period?: import("mongoose").SchemaDefinitionProperty<string, Budget, Document<unknown, {}, Budget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Budget & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    alertThreshold?: import("mongoose").SchemaDefinitionProperty<number, Budget, Document<unknown, {}, Budget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Budget & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    amount?: import("mongoose").SchemaDefinitionProperty<number, Budget, Document<unknown, {}, Budget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Budget & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Budget, Document<unknown, {}, Budget, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Budget & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Budget>;
