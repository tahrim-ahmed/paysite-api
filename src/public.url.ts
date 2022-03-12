import { RequestMethod } from '@nestjs/common';

export const publicUrls = [
    { path: '/api/v1/user/login', method: RequestMethod.POST },
    { path: '/api/v1/user/register', method: RequestMethod.POST },
    { path: '/api/v1/role/create', method: RequestMethod.POST },
];
