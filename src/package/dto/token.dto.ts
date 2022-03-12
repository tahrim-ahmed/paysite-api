import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class TokenDto {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    timeout: Date;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    isAdmin: boolean;

    @ApiProperty()
    isUser: boolean;

    @ApiProperty()
    @IsNotEmpty({ message: 'Role id must not be empty' })
    @IsMongoId()
    userType: Types.ObjectId;
}
