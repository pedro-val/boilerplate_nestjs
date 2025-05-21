import { BaseEntity } from '../../common/entities/base.entity';
import { CompanyOwner } from '../../company-owners/entities/company-owner.entity';
import { Product } from '../../products/entities/product.entity';

export class Company extends BaseEntity {
  name!: string;
  ownerId!: number;
  owner?: CompanyOwner;
  products?: Product[];
}
