import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FiveInARowModule } from './domains/five-in-a-row/five-in-a-row.module';
import { AuthModule } from './domains/auth/auth.module';
import { UsersModule } from './domains/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    FiveInARowModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
