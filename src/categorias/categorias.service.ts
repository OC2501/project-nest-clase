import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Categoria } from './entities/categoria.entity';
import { ManagerError } from 'src/common/errors/managererror';
import { PaginationDto } from 'src/common/dto/paginationDto';

export interface PaginationCategory{
  total: number;
  lastPage: number;
  limit: number;
  page: number;
  categorias: Categoria[]
}

@Injectable()
export class CategoriasService {

  private categoria: Categoria[] = []
  create(createCategoriaDto: CreateCategoriaDto) {
    try{
      const categoria: Categoria ={
        id: 1,
        ...createCategoriaDto,
        isActive: true
      }

      if(!categoria) throw new BadRequestException('categoria no creada')
      this.categoria.push({...categoria,id:this.categoria.length+1})

      return this.categoria;
    } catch(error){
      throw new InternalServerErrorException('chequear la consola');
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginationCategory> {
    try{
      const {limit = 5, page = 0 } = paginationDto
      if(this.categoria.length === 0){
        throw new ManagerError({
          type:'NOT_FOUND',
          message: 'category not found'
        })
      }
      
      const total = this.categoria.filter((categoria)=>categoria.isActive===(true)).length;

      const lastPage = Math.ceil(total/limit)

      const safePages = Math.min(page, lastPage - 1)

      const paginatedCategories = this.categoria.slice(safePages * limit, (safePages + 1) * limit);
     
      return{
        total,
        limit, 
        lastPage,
        page: safePages + 1,
        categorias : paginatedCategories
      }

    } catch(error){
      ManagerError.createSignatureError(error.message);
    }
  }

  async findOne(id: number) {
    try{
      const categoria = this.categoria.find(categoria=> categoria.id === id)
      if(this.categoria.length === 0){
        throw new ManagerError({
          type:'NOT_FOUND',
          message: 'category not found'
        })
      }
      return categoria;
    } catch{
      ManagerError.createSignatureError
    }
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    try{
      let categoriaDB = this.categoria.find(categoria => categoria.id === id)
      if(!categoriaDB){
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'category not found'
        })
      } 
      const updatedCategoria = {
        ...categoriaDB,
        ...updateCategoriaDto,
      }
      this.categoria = this.categoria.map(categoria=>
        categoria.id === id ? updatedCategoria: categoria
      )

      return{
        message: `la categoria con ID ${id} ha sido actualizado exitosamente`,
        updateCategoria: updatedCategoria
      }
    } catch(error){
      ManagerError.createSignatureError(error.message)
    }
  }

  async remove(id: number) {
    try{
      const index = this.categoria.findIndex(categoria => categoria.id === id);
    
      if (index === -1) {
        throw new ManagerError({
          type: 'NOT_FOUND',
          message: 'category not found'
        })
      }
  
      this.categoria[index]={
        ...this.categoria[index],
        isActive:  false
      };

      this.categoria.splice(index, 1);
      
      return {
        message: `Categoria con ID ${id} eliminado exitosamente`,
        remainingCategoria: this.categoria.length
      };

    } catch(error){
      ManagerError.createSignatureError(error.message)
    }
  }
}

