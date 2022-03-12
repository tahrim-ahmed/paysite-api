import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleService } from '../services/role.service';
import { RoleDto } from '../../../package/dto/role.dto';

@ApiTags('Role')
@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Post('create')
    async create(
        @Body(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
            }),
        )
        roleDto: RoleDto,
    ) {
        return await this.roleService.create(roleDto);
    }
}
