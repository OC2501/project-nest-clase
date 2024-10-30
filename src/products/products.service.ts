import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dto/paginationDto'
import { CategoriasService } from 'src/categorias/categorias.service';
import { Categoria } from 'src/categorias/entities/categoria.entity';

export interface Pagination{
  total: number;
  lastPage: number;
  limit: number;
  page: number;
  products: Product[]
}
@Injectable()
export class ProductsService {
  private products: Product[] = [
    { id: 1, name: "product1", description: "desc1", photo: [], price: 12, stock: 5, isActive: true, categoryId: 1 },
    { id: 2, name: "product2", description: "desc2", photo: [], price: 12, stock: 5, isActive: true, categoryId: 1 },
    { id: 3, name: "product3", description: "desc3", photo: [], price: 12, stock: 5, isActive: true, categoryId: 1 },
    { id: 4, name: "product4", description: "desc4", photo: [], price: 12, stock: 5, isActive: true, categoryId: 1 },
  ]
  constructor(
    private readonly categoriasServices: CategoriasService
  ){}

  create(createProductDto: CreateProductDto) {
    try{
      const product:Product = {
        ...createProductDto,
        id: 1,
        isActive: true,
      }

      if(!product) throw new BadRequestException("PRODUCTO NO CREADO")

      this.products.push({...product, id: this.products.length+1})

      return this.products;

    }catch(error){
      throw new InternalServerErrorException("chequear la consola")
    };
  }

  async findAll(paginationDto: PaginationDto): Promise<Pagination> {
    try{
      const {limit = 5, page = 0 } = paginationDto
      if( this.products.length === 0) throw new NotFoundException("no hay productos")
      
      const total = this.products.filter((product)=>product.isActive===(true)).length;

      const lastPage = Math.ceil(total/limit)

      const safePages = Math.min(page, lastPage - 1)

      const paginatedProducts = this.products.slice(safePages * limit, (safePages + 1) * limit);
     
      
      return {
        total,
        limit, 
        lastPage,
        page: safePages + 1,
        products: paginatedProducts,
      }


    }catch(error){
      throw new InternalServerErrorException("chequear la consola");
    }
  }

  async findOne(id: number) {
    try{
      const product = this.products.find(product => product.id === id);
      if(!product) throw new NotFoundException("no se encuentra el producto")
      const category = this.categoriasServices.findOne(product.categoryId)
      return {
        product,
        category
      };
    }catch(error){
      throw new InternalServerErrorException("chequear la consola");
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try{
      let productDB = this.products.find(product=> product.id === id); 

      if(!productDB) throw new NotFoundException("no se encuentra el producto")

    const updatedProduct = {
      ...productDB,
      ...updateProductDto
    };

    this.products = this.products.map(product => 
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
      const index = this.products.findIndex(product => product.id === id);
    
      if (index === -1) {
        throw new NotFoundException(`No se encontró un producto con el ID ${id}`);
      }
  
      this.products.splice(index, 1);
      
      return {
        message: `Producto con ID ${id} eliminado exitosamente`,
        remainingProducts: this.products.length
      };

    } catch(error){
      throw new InternalServerErrorException("chequear la consola")
    }
  }
}
