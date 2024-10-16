import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from './dto/paginationDto';

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

  async findAll(paginationDto: PaginationDto): Promise<Product[]> {
    try{
      if( this.product.length === 0) throw new NotFoundException("no hay productos")
        return this.product;
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

      this.product = this.product.map(product =>{
        if(product.id === id){
          productDB = {
            ...productDB,
            ...updateProductDto,
          }
          return productDB;
        }
        return product;
      })
    }catch(error){
      throw new InternalServerErrorException("chequear la consola");
    }
  }

  async remove(id: number) {
    try{
      const productDB = this.product.find(product => product.id === id);
      if(!productDB) throw new NotFoundException("no se encuentra ese producto");
      this.product.filter(product => product.id === id)
    } catch(error){
      throw new InternalServerErrorException("chequear la consola")
    }
  }
}
