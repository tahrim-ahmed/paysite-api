import { BaseDto } from './core/base.dto';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RoleDto extends BaseDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString({ message: 'Must be a string' })
    @MaxLength(65, { message: 'Maximum 65 character supported' })
    name: string;
}
