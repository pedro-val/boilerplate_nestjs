import { BaseEntity } from '../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';

export class Product extends BaseEntity {
  name!: string;
  price!: number;
  description!: string;
  company?: Company;
  companyId!: number;
}
