import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ description: 'The name of the company', example: 'Company 1' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string = '';

  @ApiProperty({
    description: 'The pid of the company owner',
    example: 'owner-pid-uuid',
  })
  @IsString()
  @IsNotEmpty()
  ownerPid: string = '';
}
