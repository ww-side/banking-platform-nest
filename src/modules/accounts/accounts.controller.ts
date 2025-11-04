import { Controller, Get, Headers, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';

import { AuthGuard } from '~/shared/guards/auth-guard';
import { TokenService } from '~/shared/services/token.service';

import { AccountResponseDTO } from './account.dto';
import { AccountsService } from './accounts.service';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly tokenService: TokenService,
  ) {}

  @Get()
  @ApiOkResponse({ type: [AccountResponseDTO] })
  findAll(@Headers('Authorization') authHeader: string) {
    const userId = this.tokenService.extractUserId(authHeader);
    return this.accountsService.findByUser(userId);
  }

  @Get(':id/balance')
  @ApiOkResponse({ type: AccountResponseDTO })
  findOne(
    @Param('id') id: string,
    @Headers('Authorization') authHeader: string,
  ) {
    const userId = this.tokenService.extractUserId(authHeader);
    return this.accountsService.findOne(id, userId);
  }
}
