import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { configEnvironment } from './package/env-config/env-config';
import { configMongo } from './package/mongo-config/mongo.config';
import { UserModule } from './api/user/user.module';
import { AuthMiddleware } from './package/middlewares/auth.middleware';
import { publicUrls } from './public.url';
import { RoleModule } from './api/role/role.module';

@Module({
    imports: [configEnvironment(), configMongo(), RoleModule, UserModule],
    controllers: [],
    providers: [],
    exports: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .exclude(...publicUrls)
            .forRoutes('*');
    }
}
