import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { BcryptService } from './bcrypt.service';
import { UserDocument, UserEntity } from '../../../package/schema/user.schema';
import { NotFoundService } from '../../../package/service/not-found.service';
import { UserDto } from '../../../package/dto/user.dto';
import { TokenDto } from '../../../package/dto/token.dto';
import { LoginDto } from '../../../package/dto/login.dto';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        @InjectModel(UserEntity.name)
        private readonly userModel: Model<UserDocument>,
        private readonly bcryptService: BcryptService,
        private readonly notFoundService: NotFoundService,
    ) {}

    register = async (userInput: UserDto): Promise<UserDocument> => {
        // saving and returning the saved user in mongo db
        try {
            userInput.password = await this.bcryptService.hashPassword(userInput.password);
            return await this.userModel.create(userInput);
        } catch (e) {
            return e;
        }
    };

    login = async (loginInput: LoginDto): Promise<TokenDto> => {
        const user = await this.validateUser(loginInput);
        try {
            return this.generateToken(loginInput.isRemembered, user);
        } catch (e) {
            return e;
        }
    };

    async pagination(page: number, limit?: number): Promise<UserDocument[]> {
        const query = this.userModel.find().where({ isActive: true });
        if (page && limit) {
            query.skip((page - 1) * limit).limit(limit);
        }
        query.populate('userType', 'name');

        return await query.exec();
    }

    async update(id: string, userDto: UserDto): Promise<UserDocument> {
        if (userDto.password) {
            userDto.password = await this.bcryptService.hashPassword(userDto.password);
        }

        return this.userModel.findByIdAndUpdate(
            id,
            { ...userDto },
            {
                returnOriginal: false,
            },
        );
    }

    /*************** custom () **********/
    validateUser = async (loginInput: LoginDto): Promise<UserDocument> => {
        const users: UserDocument[] = await this.userModel
            .aggregate([
                {
                    $match: {
                        email: loginInput.email,
                    },
                },
            ])
            .exec();

        this.notFoundService.notFound(users, 'No such user found!!');

        await this.validatePassword(loginInput.password, users[0].password);

        return users[0];
    };

    validatePassword = async (givenPassword: string, hashPassword: string): Promise<void> => {
        const isPasswordMatched = await this.bcryptService.comparePassword(givenPassword, hashPassword);

        if (!isPasswordMatched) {
            throw new UnauthorizedException('User password is not valid');
        }
    };

    generateToken = async (isRemembered: number, user: UserDocument): Promise<TokenDto> => {
        const privateKEY = fs.readFileSync('env/jwtRS256.key');

        const token = new TokenDto();

        token.accessToken = jwt.sign({ ...user }, privateKEY, {
            expiresIn: Number(isRemembered) === 1 ? '1d' : '1h',
            algorithm: 'RS256',
        });
        const timeOut = Number(isRemembered) === 1 ? 24 : 1;
        token.timeout = new Date(new Date().getTime() + timeOut * 60 * 60 * 1000);

        const findByEmail = await this.getUserById(user._id);

        token.firstName = findByEmail.firstName;
        token.lastName = findByEmail.lastName;
        token.email = findByEmail.email;
        token.phone = findByEmail.phone;
        token.userType = findByEmail.userType;
        if (token.userType.name === 'Admin') {
            token.isAdmin = true;
        } else {
            token.isUser = true;
        }

        return token;
    };

    getUserById = async (_id: string): Promise<UserDocument> => {
        return this.userModel.findById({ _id: _id }).populate('userType', 'name');
    };
}
