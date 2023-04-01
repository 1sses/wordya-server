import { Module } from '@nestjs/common';
import { FiveInARowController } from './five-in-a-row.controller';
import { FiveInARowService } from './five-in-a-row.service';

@Module({
  imports: [],
  controllers: [FiveInARowController],
  providers: [FiveInARowService],
})
export class FiveInARowModule {}
