import { Module, Global } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { FirebaseService } from './firebase.service';

@Global()
@Module({
    controllers: [NotificationsController],
    providers: [NotificationsService, FirebaseService],
    exports: [NotificationsService],
})
export class NotificationsModule {}
