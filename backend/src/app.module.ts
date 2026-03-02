import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LobbyModule } from './modules/lobby/lobby.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RedisModule } from './modules/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI!, {
      onConnectionCreate: (connection: Connection) => {
        connection.on('connected', () => console.log('Connected to MongoDB!!'));

        connection.on('disconnected', () =>
          console.log('MongoDB disconnected'),
        );

        connection.on('error', (err) => console.log('MongoDB Error: ', err));
      },
    }),
    JwtModule.register({ global: true }),
    RedisModule,
    LobbyModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
