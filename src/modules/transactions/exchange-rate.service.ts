import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class ExchangeRateService {
  private readonly rates = {
    USD_EUR: 0.92,
    EUR_USD: 1 / 0.92,
  } as const;

  getRate(from: string, to: string): number {
    const key = `${from}_${to}` as keyof typeof this.rates;
    const rate = this.rates[key];

    if (!rate) {
      throw new BadRequestException(`Invalid currency pair: ${from} -> ${to}`);
    }

    return rate;
  }
}
