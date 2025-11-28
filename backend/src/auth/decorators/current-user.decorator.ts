import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUserDto } from '../dto';

export const CurrentUser = createParamDecorator(
    (data: keyof AuthUserDto | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user: AuthUserDto = request.user;

        if (data) {
            return user?.[data];
        }

        return user;
    },
);

