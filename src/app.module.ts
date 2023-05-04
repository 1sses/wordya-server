import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FiveInARowModule } from './domains/five-in-a-row/five-in-a-row.module';
import { AuthModule } from './domains/auth/auth.module';
import { UsersModule } from './domains/users/users.module';
import { AchievementsModule } from './domains/achievements/achievements.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRoot({
      transport: process.env.SMTP_TRANSPORT,
      defaults: {
        from: `"Wordya" ${process.env.SMTP_USERNAME}`,
      },
      template: {
        dir: __dirname + '/../templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    AuthModule,
    UsersModule,
    AchievementsModule,
    FiveInARowModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
