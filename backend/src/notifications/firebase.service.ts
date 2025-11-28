import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

export interface FcmMessage {
    token: string;
    title: string;
    body: string;
    data?: Record<string, string>;
}

export interface FcmMulticastMessage {
    tokens: string[];
    title: string;
    body: string;
    data?: Record<string, string>;
}

@Injectable()
export class FirebaseService implements OnModuleInit {
    private readonly logger = new Logger(FirebaseService.name);
    private isInitialized = false;

    constructor(private readonly configService: ConfigService) {}

    onModuleInit() {
        this.initializeFirebase();
    }

    private initializeFirebase() {
        const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
        const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');
        const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY');

        if (!projectId || !clientEmail || !privateKey) {
            this.logger.warn('Firebase credentials not configured. FCM push notifications will be disabled.');
            return;
        }

        try {
            if (admin.apps.length === 0) {
                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId,
                        clientEmail,
                        privateKey: privateKey.replace(/\\n/g, '\n'),
                    }),
                });
            }
            this.isInitialized = true;
            this.logger.log('Firebase Admin SDK initialized successfully');
        } catch (error) {
            this.logger.error('Failed to initialize Firebase Admin SDK', error);
        }
    }

    async sendPushNotification(message: FcmMessage): Promise<string | null> {
        if (!this.isInitialized) {
            this.logger.warn('Firebase not initialized, skipping push notification');
            return null;
        }

        try {
            const response = await admin.messaging().send({
                token: message.token,
                notification: {
                    title: message.title,
                    body: message.body,
                },
                data: message.data,
                webpush: {
                    notification: {
                        icon: '/icon.png',
                        badge: '/badge.png',
                    },
                    fcmOptions: {
                        link: '/',
                    },
                },
                android: {
                    notification: {
                        icon: 'ic_notification',
                        color: '#4F46E5',
                    },
                },
            });

            this.logger.log(`Push notification sent successfully: ${response}`);
            return response;
        } catch (error) {
            this.logger.error(`Failed to send push notification: ${error.message}`);
            return null;
        }
    }

    async sendMulticastNotification(message: FcmMulticastMessage): Promise<admin.messaging.BatchResponse | null> {
        if (!this.isInitialized) {
            this.logger.warn('Firebase not initialized, skipping multicast notification');
            return null;
        }

        if (message.tokens.length === 0) {
            this.logger.warn('No tokens provided for multicast notification');
            return null;
        }

        try {
            const response = await admin.messaging().sendEachForMulticast({
                tokens: message.tokens,
                notification: {
                    title: message.title,
                    body: message.body,
                },
                data: message.data,
                webpush: {
                    notification: {
                        icon: '/icon.png',
                        badge: '/badge.png',
                    },
                },
                android: {
                    notification: {
                        icon: 'ic_notification',
                        color: '#4F46E5',
                    },
                },
            });

            this.logger.log(
                `Multicast notification sent: ${response.successCount} success, ${response.failureCount} failed`,
            );
            return response;
        } catch (error) {
            this.logger.error(`Failed to send multicast notification: ${error.message}`);
            return null;
        }
    }

    isReady(): boolean {
        return this.isInitialized;
    }
}
