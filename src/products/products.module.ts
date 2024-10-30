import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { CategoriasService } from 'src/categorias/categorias.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, CategoriasService],
})
export class ProductsModule {}
