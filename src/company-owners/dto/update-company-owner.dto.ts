import { PartialType } from '@nestjs/swagger';
import { CreateCompanyOwnerDto } from './create-company-owner.dto';

export class UpdateCompanyOwnerDto extends PartialType(CreateCompanyOwnerDto) {}
