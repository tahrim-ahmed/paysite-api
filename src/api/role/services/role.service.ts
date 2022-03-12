import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserTypeDocument, UserTypeEntity } from '../../../package/schema/user-type.schema';
import { RoleDto } from '../../../package/dto/role.dto';

@Injectable()
export class RoleService {
    private readonly logger = new Logger(RoleService.name);

    constructor(
        @InjectModel(UserTypeEntity.name)
        private readonly roleModel: Model<UserTypeDocument>,
    ) {}

    create = async (roleInput: RoleDto): Promise<UserTypeDocument> => {
        // saving and returning the saved user in mongo db
        try {
            return await this.roleModel.create(roleInput);
        } catch (e) {
            return e;
        }
    };

    /*************** custom () **********/
}
