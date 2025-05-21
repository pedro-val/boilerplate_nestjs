import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors } from '@nestjs/common';
import { CompanyOwnersService } from './company-owners.service';
import { CreateCompanyOwnerDto } from './dto/create-company-owner.dto';
import { UpdateCompanyOwnerDto } from './dto/update-company-owner.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransformResponseInterceptor } from '../common/interceptors/transform-response.interceptor';

@ApiTags('company-owners')
@Controller('company-owners')
@UseInterceptors(TransformResponseInterceptor)
export class CompanyOwnersController {
  constructor(private readonly companyOwnersService: CompanyOwnersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new company owner' })
  @ApiResponse({
    status: 201,
    description: 'The company owner has been successfully created.',
    schema: {
      example: {
        pid: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Owner Example',
        email: 'owner@example.com',
        contact: '+1234567890',
        companies: [],
      },
    },
  })
  create(@Body() createCompanyOwnerDto: CreateCompanyOwnerDto) {
    return this.companyOwnersService.create(createCompanyOwnerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all company owners' })
  @ApiResponse({
    status: 200,
    description: 'Return all company owners.',
    schema: {
      type: 'array',
      items: {
        properties: {
          pid: {
            type: 'string',
            example: '550e8400-e29b-41d4-a716-446655440002',
          },
          name: {
            type: 'string',
            example: 'Owner Example',
          },
          email: {
            type: 'string',
            example: 'owner@example.com',
          },
          contact: {
            type: 'string',
            example: '+1234567890',
          },
          companies: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                pid: {
                  type: 'string',
                  example: '550e8400-e29b-41d4-a716-446655440001',
                },
                name: {
                  type: 'string',
                  example: 'Company Example',
                },
              },
            },
          },
        },
      },
    },
  })
  findAll() {
    return this.companyOwnersService.findAll();
  }

  @Get(':pid')
  @ApiOperation({ summary: 'Get a company owner by pid' })
  @ApiParam({
    name: 'pid',
    description: 'The pid of the company owner',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @ApiResponse({
    status: 200,
    description: 'Return the found company owner.',
    schema: {
      properties: {
        pid: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440002',
        },
        name: {
          type: 'string',
          example: 'Owner Example',
        },
        email: {
          type: 'string',
          example: 'owner@example.com',
        },
        contact: {
          type: 'string',
          example: '+1234567890',
        },
        companies: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              pid: {
                type: 'string',
                example: '550e8400-e29b-41d4-a716-446655440001',
              },
              name: {
                type: 'string',
                example: 'Company Example',
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Company owner not found.' })
  findOne(@Param('pid') pid: string) {
    return this.companyOwnersService.findOne(pid);
  }

  @Put(':pid')
  @ApiOperation({ summary: 'Update a company owner by pid' })
  @ApiParam({
    name: 'pid',
    description: 'The pid of the company owner',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @ApiResponse({
    status: 200,
    description: 'The company owner has been successfully updated.',
    schema: {
      properties: {
        pid: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440002',
        },
        name: {
          type: 'string',
          example: 'Updated Owner',
        },
        email: {
          type: 'string',
          example: 'updated@example.com',
        },
        contact: {
          type: 'string',
          example: '+0987654321',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Company owner not found.' })
  update(@Param('pid') pid: string, @Body() updateCompanyOwnerDto: UpdateCompanyOwnerDto) {
    return this.companyOwnersService.update(pid, updateCompanyOwnerDto);
  }

  @Delete(':pid')
  @ApiOperation({ summary: 'Delete a company owner by pid' })
  @ApiParam({
    name: 'pid',
    description: 'The pid of the company owner',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @ApiResponse({
    status: 200,
    description: 'The company owner has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Company owner not found.' })
  remove(@Param('pid') pid: string) {
    return this.companyOwnersService.remove(pid);
  }
}
