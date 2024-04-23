import { Injectable, NotFoundException } from '@nestjs/common'
import { v4 as uuid } from 'uuid'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { Product } from './entities/product.entity'

@Injectable()
export class ProductsService {
  private products: Product[] = []

  create(createProductDto: CreateProductDto) {
    const { name, description, price } = createProductDto

    const newProduct = new Product(uuid(), name, description, price)

    this.products.push(newProduct)
    return newProduct
  }

  findAll() {
    return this.products
  }

  findOne(id: string): Product {
    const product = this.products.find(product => product.id === id) // prettier-ignore

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`)
    }

    return product
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    const { name, description, price } = updateProductDto
    const product = this.findOne(id)

    product.updateWith({ name, description, price })

    return product
  }

  remove(id: string) {
    const productIndex = this.products.findIndex(product => product.id === id) // prettier-ignore

    if (productIndex === -1) {
      throw new NotFoundException(`Product with ID ${id} not found`)
    }

    this.products.splice(productIndex, 1)
  }
}
