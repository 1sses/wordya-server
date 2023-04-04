import { Module } from '@nestjs/common';
import { FiveInARowController } from './five-in-a-row.controller';
import { FiveInARowService } from './five-in-a-row.service';
import { PrismaModule } from '../../lib/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FiveInARowController],
  providers: [FiveInARowService],
})
export class FiveInARowModule {}
