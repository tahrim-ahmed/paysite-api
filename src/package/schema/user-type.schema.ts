import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';

@Schema({
    timestamps: true,
})
export class UserTypeEntity {
    @Transform(({ value }) => value.toString())
    _id: any;

    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: Boolean, default: true })
    isActive: boolean;
}

const UserTypeSchema = SchemaFactory.createForClass(UserTypeEntity);

UserTypeSchema.index({ name: 1 });

UserTypeSchema.path('name').validate({
    validator: async function (value) {
        const count = await this.model(UserTypeEntity.name).countDocuments({
            name: value,
        });
        return !count;
    },
    message: (props) => {
        return `'${props.value}' already exist`;
    },
});

export type UserTypeDocument = UserTypeEntity & mongoose.Document;

export default UserTypeSchema;
