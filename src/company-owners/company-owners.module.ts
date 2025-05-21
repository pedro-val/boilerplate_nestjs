import { Module } from '@nestjs/common';
import { CompanyOwnersService } from './company-owners.service';
import { CompanyOwnersController } from './company-owners.controller';

@Module({
  controllers: [CompanyOwnersController],
  providers: [CompanyOwnersService],
  exports: [CompanyOwnersService],
})
export class CompanyOwnersModule {}
