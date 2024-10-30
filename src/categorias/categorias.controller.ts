import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CategoriasService, PaginationCategory } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { PaginationDto } from 'src/common/dto/paginationDto';
import { Categoria } from './entities/categoria.entity';

interface PaginatedCategoryResponse extends PaginationCategory{
  categorias: Categoria[]
}
@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriasService.create(createCategoriaDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto): Promise<PaginatedCategoryResponse> {
    return this.categoriasService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.categoriasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCategoriaDto: UpdateCategoriaDto) {
    return this.categoriasService.update(+id, updateCategoriaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.categoriasService.remove(+id);
  }
}
