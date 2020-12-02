import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import AppError from '@shared/errors/AppError';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    // TODO
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    // TODO
    const findProduct = await this.ormRepository.findOne({
      where: {
        name,
      },
    });

    return findProduct;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    // TODO
    const listProducts = await this.ormRepository.findByIds(products);

    return listProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    // TODO
    const productsIds = products.map(product => ({ id: product.id }));
    const findProducts = await this.ormRepository.findByIds(productsIds);

    const updatedProducts = findProducts.map(product => {
      const findProductQuantity = products.find(
        findProduct => findProduct.id === product.id,
      );

      if (!findProductQuantity) {
        throw new AppError('Product not found');
      }

      return {
        ...product,
        quantity: product.quantity - findProductQuantity?.quantity || 0,
      };
    });

    const productSave = await this.ormRepository.save(updatedProducts);

    return productSave;
  }
}

export default ProductsRepository;
