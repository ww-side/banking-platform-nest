import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AccountsModule } from '~/core/accounts/accounts.module';
import { DatabaseModule } from '~/core/database/database.module';
import { UsersModule } from '~/core/users/users.module';

import { AuthModule } from '~/modules/auth/auth.module';
import { LedgerEntryModule } from '~/modules/ledger-entry/ledger-entry.module';
import { TransactionsModule } from '~/modules/transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    AccountsModule,
    TransactionsModule,
    LedgerEntryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
