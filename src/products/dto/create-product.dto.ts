import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { priceToCents } from '../../common/transformers/price.transformer';

export class CreateProductDto {
  @ApiProperty({ description: 'The name of the product', example: 'Product 1' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string = '';

  @ApiProperty({
    description: 'The price of the product in reais',
    example: 39.05,
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(
    ({ value }) => {
      if (typeof value === 'number') {
        return priceToCents(value);
      }
      return 0;
    },
    { toClassOnly: true },
  )
  price: number = 0;

  @ApiProperty({
    description: 'The description of the product',
    example: 'A detailed description of the product',
  })
  @IsString()
  @IsNotEmpty()
  description: string = '';

  @ApiProperty({
    description: 'The pid of the company this product belongs to',
    example: 'company-pid-uuid',
  })
  @IsString()
  @IsNotEmpty()
  companyPid: string = '';
}
