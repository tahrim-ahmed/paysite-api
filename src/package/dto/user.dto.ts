import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsMongoId, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { BaseDto } from './core/base.dto';
import { Types } from 'mongoose';

export class UserDto extends BaseDto {
    @ApiProperty()
    @IsString({ message: 'Must be a string' })
    @MaxLength(100, { message: 'Maximum 100 characters supported' })
    firstName: string;

    @ApiProperty()
    @IsString({ message: 'Must be a string' })
    @MaxLength(100, { message: 'Maximum 100 characters supported' })
    lastName: string;

    @ApiProperty()
    @IsEmail()
    @MaxLength(100, { message: 'Maximum 100 characters supported' })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Must be non empty' })
    @IsString({ message: 'Must be a string' })
    @MaxLength(100, { message: 'Maximum 100 characters supported' })
    password: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Must be non empty' })
    @IsString({ message: 'Must be a string' })
    @MaxLength(100, { message: 'Maximum 100 characters supported' })
    phone: string;

    @ApiProperty({ default: true })
    @IsBoolean()
    notify: boolean;

    @ApiProperty({ type: Types.ObjectId })
    @IsNotEmpty({ message: 'User type id must not be empty' })
    @IsMongoId()
    userType: Types.ObjectId;
}
