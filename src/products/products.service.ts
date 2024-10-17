import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dto/paginationDto'

export interface Pagination{
  total: number;
  limit: number;
  page: number;
  products: Product[]
}
@Injectable()
export class ProductsService {

  private product: Product[] = []
  create(createProductDto: CreateProductDto) {
    try{
      const product:Product = {
        ...createProductDto,
        id: 1,
        isActive: true,
      }

      if(!product) throw new BadRequestException("PRODUCTO NO CREADO")

      this.product.push({...product, id: this.product.length+1})

      return this.product;

    }catch(error){
      throw new InternalServerErrorException("chequear la consola")
    };
  }

  async findAll(paginationDto: PaginationDto): Promise<Pagination> {
    try{
      const {limit = 5, page = 0 } = paginationDto
      if( this.product.length === 0) throw new NotFoundException("no hay productos")
      
      const total = this.product.length;

      const totalPages = Math.ceil(total/limit)

      const safePages = Math.min(page, totalPages - 1)

      const paginatedProducts = this.product.slice(safePages * limit, (safePages + 1) * limit);
     
      return {
        total,
        limit, 
        page: safePages,
        products: paginatedProducts
      }


    }catch(error){
      throw new InternalServerErrorException("chequear la consola");
    }
  }

  async findOne(id: number) {
    try{
      const product = this.product.find(product => product.id === id);
      if(!product) throw new NotFoundException("no se encuentra el producto")
        return product;
    }catch(error){
      throw new InternalServerErrorException("chequear la consola");
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try{
      let productDB = this.product.find(product=> product.id === id); 

      if(!productDB) throw new NotFoundException("no se encuentra el producto")

    const updatedProduct = {
      ...productDB,
      ...updateProductDto
    };

    this.product = this.product.map(product => 
      product.id === id ? updatedProduct : product
    );

    return {
      message: `El producto con ID ${id} ha sido actualizado exitosamente`,
      updatedProduct: updatedProduct
    };

    }catch(error){
      throw new InternalServerErrorException("chequear la consola");
    }
  }

  async remove(id: number) {
    try{
      const index = this.product.findIndex(product => product.id === id);
    
      if (index === -1) {
        throw new NotFoundException(`No se encontró un producto con el ID ${id}`);
      }
  
      this.product.splice(index, 1);
      
      return {
        message: `Producto con ID ${id} eliminado exitosamente`,
        remainingProducts: this.product.length
      };

    } catch(error){
      throw new InternalServerErrorException("chequear la consola")
    }
  }
}
