import { BaseEntity } from '../../common/entities/base.entity';
import { Company } from '../../companies/entities/company.entity';

export class CompanyOwner extends BaseEntity {
  name!: string;
  email!: string;
  contact!: string;
  companies?: Company[];
}
