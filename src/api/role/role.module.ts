import { MongooseModule } from '@nestjs/mongoose';
import { CollectionEnum } from '../../package/enum/collection.enum';
import { Module } from '@nestjs/common';
import { RoleController } from './controller/role.controller';
import { RoleService } from './services/role.service';
import { NotFoundService } from '../../package/service/not-found.service';
import UserTypeSchema, { UserTypeEntity } from '../../package/schema/user-type.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: UserTypeEntity.name,
                schema: UserTypeSchema,
                collection: CollectionEnum.ROLES,
            },
        ]),
    ],
    controllers: [RoleController],
    providers: [RoleService, NotFoundService],
})
export class RoleModule {}
