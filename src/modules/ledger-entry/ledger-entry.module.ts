import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LedgerEntry } from './ledger-entry.entity';
import { LedgerEntryService } from './ledger-entry.service';

@Module({
  imports: [TypeOrmModule.forFeature([LedgerEntry])],
  providers: [LedgerEntryService],
  exports: [LedgerEntryService],
})
export class LedgerEntryModule {}
