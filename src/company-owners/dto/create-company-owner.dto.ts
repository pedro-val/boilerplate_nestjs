import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyOwnerDto {
  @ApiProperty({
    description: 'The name of the company owner',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string = '';

  @ApiProperty({
    description: 'The email of the company owner',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string = '';

  @ApiProperty({
    description: 'The contact information of the company owner',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  contact: string = '';
}
