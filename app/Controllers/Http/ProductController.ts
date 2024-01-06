import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FeaturedProduct from 'App/Models/FeaturedProduct'
import Product from 'App/Models/Product'
import { randomBytes } from 'crypto'
//import { DateTime } from 'luxon'
export default class ProductsController {
  public async index({ response, request }: HttpContextContract) {
    const { page } = request.only(['page'])
    const totalPages = (await Product.all()).length / 12
    const products = (await Product.query().paginate(Number(page), 12)).all()
    return response.json({ page: Number(page), pages: totalPages, products: products })
  }

  public async show({ params, response }: HttpContextContract) {
    const product = await Product.query().preload('review_id').where('id', params.id)
    return response.json(product)
  }

  public async getByCategory({ request, response }: HttpContextContract) {
    const { category, page } = request.only(['category', 'page'])

    const totalPages = (await Product.query().where('category', category)).length / 12
    const allProducts = await Product.query().paginate(Number(page), 12)
    const products = allProducts.filter((product) => product.category === category)

    return response.json({
      success: true,
      message: 'Category products have been fetched.',
      data: {
        totalPages: totalPages,
        category: category,
        products: Array.from(products),
      },
    })
  }
  public async getByTag({ request, response }: HttpContextContract) {
    const { tag, page } = request.only(['tag', 'page'])
    const totalPages = (await Product.all()).length / 12
    const allProducts = await Product.query().paginate(Number(page), 12)
    const products = allProducts.filter((product) => product.tags.includes(tag))

    return response.json({
      success: true,
      message: 'Products with the given category have been fetched.',
      data: {
        totalPages: totalPages,
        tag: tag,
        products: Array.from(products),
      },
    })
  }

  public async getRelated({ request, response }: HttpContextContract) {
    const { category, page } = request.only(['category', 'page'])
    const totalPages = (await Product.query().where('category', category)).length / 12
    const allProducts = await Product.query().paginate(Number(page), 12)
    const products = allProducts.filter((product) => product.category === category)

    return response.json({
      success: true,
      message: 'Category products have been fetched.',
      data: {
        totalPages: totalPages,
        category: category,
        products: Array.from(products),
      },
    })
  }

  public async add({ request, response, auth }: HttpContextContract) {
    const {
      barcode,
      sku,
      variants,
      supplier,
      SEARCH_STATUS,
      name,
      description,
      status,
      price,
      quantity,
      category,
      sizes,
      tax,
      vat,
      currency,
      discount,
      tags,
      shipping,
      media,
    } = request.body()
    //console.log(request.body())
    const images = request.files('images')
    images.forEach((image) => {
      console.log(image.clientName)
    })
    //const {discount} = request.body()
    //console.log(currency)
    console.log(name)
    try {
      const admin = await auth.use('api').authenticate()
      console.log('ADMIN- ', admin.firstname)
      const result = admin.related('products').create({
        name: name,
        product_id: randomBytes(30).toLocaleString(),
        category: category,
        tags: JSON.stringify(tags),
        default_currency: currency,
        tax: tax,
        vat: vat,
        shipping: shipping,
        sku: sku,
        sizes: sizes,
        quantity: quantity,
        supplier: supplier,
        search_status: SEARCH_STATUS,
        barcode: barcode,
        media: media,
        discount: discount,
        description: description,
        price: price,
        variants: variants,
        status: status,
      })

      const result2 = await (await result).save()

      if (result2) {
        const { name, id } = result2

        return response.json({
          admin: `${admin.firstname} ${admin.lastname}`,
          adminId: admin.id,
          product_name: name,
          product_id: id,
        })
      } else {
        //
        return response.status(500).json({
          message: 'Failed to to create product',
        })
      }
    } catch (error) {
      //console.log(error)
      const moderator = auth.use('moderator').authenticate()
      const result = (await moderator).related('products').create({
        name: name,
        product_id: randomBytes(30).toLocaleString(),
        category: category,
        tags: JSON.stringify(tags),
        default_currency: currency,
        tax: tax,
        vat: vat,
        shipping: shipping,
        sku: sku,
        sizes: sizes,
        quantity: quantity,
        supplier: supplier,
        search_status: SEARCH_STATUS,
        barcode: barcode,
        media: media,
        discount: discount,
        description: description,
        price: price,
        variants: variants,
        status: status,
      })
      const result2 = await (await result).save()
      if (result2) {
        const { name, id } = result2
        return {
          moderator: `${(await moderator).firstname} ${(await moderator).lastname}`,
          moderatorId: (await moderator).id,
          product_name: name,
          product_id: id,
        }
      } else {
        //
        return response.status(500).json({
          message: 'Failed to to create product',
        })
      }
    }
  }

  public async search({ params, response, request }: HttpContextContract) {
    const { query } = request.only(['query'])

    const items = await Product.query()
      .where('name', 'like', `%${query}%`) // Basic like operator for simple substring matching
      .orWhere('name', 'regexp', '^' + query + '$') // Using regexp for more advanced regex matching

    return response.json(items)
  }

  public async featured({ response }: HttpContextContract) {
    console.log('-----------------')
    const featuredProducts = await FeaturedProduct.all()
    //console.log('hi', featuredProducts)
    let myFeaturedProduct: Product[] = []
    for (let i = 0; i < featuredProducts.length; i++) {
      let product = await Product.find(featuredProducts[i].product_id)
      if (product !== null) {
        myFeaturedProduct.push(product)
      }
    }
    //console.log(myFeaturedProduct)
    return response.json(myFeaturedProduct)
  }

  public async featuredProducts({ auth, params, response, request }: HttpContextContract) {
    //const admin = await auth.use('api').authenticate()
    const { productId, moderator } = request.only(['productId', 'moderator'])
    if (moderator) {
      const account = await auth.use('moderator').authenticate()
      const product = await Product.find(productId)
      account.related('featuredProducts').updateOrCreate(
        {
          product_id: productId,
        },
        {
          product_id: productId,
          adminId: account.id,
        }
      )
      return response.json({
        fullname: `${account.firstname} ${account.lastname}`,
        product: product?.name,
        product_id: product?.id,
      })
    } else {
      const account = await auth.use('api').authenticate()
      const product = await Product.find(productId)
      account.related('featuredProducts').updateOrCreate(
        {
          product_id: productId,
        },
        {
          adminId: account.id,
          product_id: productId,
        }
      )

      return response.json({
        fullname: `${account.firstname} ${account.lastname}`,
        product: product?.name,
        product_id: product?.id,
      })
    }
  }

  //public async fetchByTag({ params, response }: HttpContextContract) {}
  public async update({ params, request, response }: HttpContextContract) {
    const productData = request.only(['name', 'description', 'price'])
    const product = await Product.findOrFail(params.id)
    product.merge(productData)
    await product.save()
    return response.json(product)
  }

  public async destroy({ auth, response, request }: HttpContextContract) {
    const { moderator, productId, reasons, deletionDate } = request.only([
      'moderator',
      'productId',
      'reasons',
      'deletionDate',
    ])
    const product = await Product.findOrFail(productId)

    if (moderator) {
      const moderatorAccount = await auth.use('moderator').authenticate()
      await product.delete()
    } else {
      const admin = await auth.use('api').authenticate()
      admin.related('deletions').create({
        table_name: 'products',
        resource_id: Number(productId),
        reasons: reasons,
        deletionDate: deletionDate,
      })

      await product.delete()
    }

    return response.json({ message: 'Product deleted successfully' })
  }
}
