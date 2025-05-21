import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransformResponseInterceptor } from '../common/interceptors/transform-response.interceptor';

@ApiTags('companies')
@Controller('companies')
@UseInterceptors(TransformResponseInterceptor)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({
    status: 201,
    description: 'The company has been successfully created.',
    schema: {
      example: {
        pid: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Company Example',
        owner: {
          pid: '550e8400-e29b-41d4-a716-446655440002',
          name: 'Owner Example',
          email: 'owner@example.com',
          contact: '+1234567890',
        },
        products: [],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all companies' })
  @ApiResponse({
    status: 200,
    description: 'Return all companies.',
    schema: {
      type: 'array',
      items: {
        properties: {
          pid: {
            type: 'string',
            example: '550e8400-e29b-41d4-a716-446655440001',
          },
          name: {
            type: 'string',
            example: 'Company Example',
          },
          owner: {
            type: 'object',
            properties: {
              pid: {
                type: 'string',
                example: '550e8400-e29b-41d4-a716-446655440002',
              },
              name: {
                type: 'string',
                example: 'Owner Example',
              },
            },
          },
          products: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                pid: {
                  type: 'string',
                  example: '550e8400-e29b-41d4-a716-446655440000',
                },
                name: {
                  type: 'string',
                  example: 'Product Example',
                },
                price: {
                  type: 'number',
                  example: 39.05,
                },
              },
            },
          },
        },
      },
    },
  })
  findAll() {
    return this.companiesService.findAll();
  }

  @Get(':pid')
  @ApiOperation({ summary: 'Get a company by pid' })
  @ApiParam({
    name: 'pid',
    description: 'The pid of the company',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: 200,
    description: 'Return the found company.',
    schema: {
      properties: {
        pid: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440001',
        },
        name: {
          type: 'string',
          example: 'Company Example',
        },
        owner: {
          type: 'object',
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
          },
        },
        products: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              pid: {
                type: 'string',
                example: '550e8400-e29b-41d4-a716-446655440000',
              },
              name: {
                type: 'string',
                example: 'Product Example',
              },
              price: {
                type: 'number',
                example: 39.05,
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Company not found.' })
  findOne(@Param('pid') pid: string) {
    return this.companiesService.findOne(pid);
  }

  @Put(':pid')
  @ApiOperation({ summary: 'Update a company by pid' })
  @ApiParam({
    name: 'pid',
    description: 'The pid of the company',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: 200,
    description: 'The company has been successfully updated.',
    schema: {
      properties: {
        pid: {
          type: 'string',
          example: '550e8400-e29b-41d4-a716-446655440001',
        },
        name: {
          type: 'string',
          example: 'Updated Company',
        },
        owner: {
          type: 'object',
          properties: {
            pid: {
              type: 'string',
              example: '550e8400-e29b-41d4-a716-446655440002',
            },
            name: {
              type: 'string',
              example: 'Owner Example',
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Company not found.' })
  update(@Param('pid') pid: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(pid, updateCompanyDto);
  }

  @Delete(':pid')
  @ApiOperation({ summary: 'Delete a company by pid' })
  @ApiParam({
    name: 'pid',
    description: 'The pid of the company',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: 200,
    description: 'The company has been successfully deleted.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request if the company has products.',
  })
  @ApiResponse({ status: 404, description: 'Company not found.' })
  remove(@Param('pid') pid: string) {
    return this.companiesService.remove(pid);
  }
}
