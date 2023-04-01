import { Controller, Get } from '@nestjs/common';
import { FiveInARowService } from './five-in-a-row.service';

@Controller('five-in-a-row')
export class FiveInARowController {
  constructor(private readonly fiveInARowService: FiveInARowService) {}
}
