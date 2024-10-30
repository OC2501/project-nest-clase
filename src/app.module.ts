import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { CategoriasModule } from './categorias/categorias.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.development`,
      isGlobal: true,
    }),
    UsersModule,
    ProductsModule,
    CategoriasModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
