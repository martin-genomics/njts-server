import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Wishlist from 'App/Models/Wishlist'
import Product from 'App/Models/Product'

export default class WishlistController {
  public async index({ auth, response }: HttpContextContract) {
    const user = await auth.use('user').authenticate()
    const wishlist = await Wishlist.query().where('user_id', user.id)
    let myWishlist: Product[] = []
    for (let i = 0; i < wishlist.length; i++) {
      let product = await Product.find(wishlist[i].product_id)
      if (product !== null) {
        myWishlist.push(product)
      }
    }
    console.log(myWishlist.length)
    return response.json(myWishlist)
  }
  public async show({ auth, params, response }: HttpContextContract) {
    await auth.use('user').authenticate()
    const wishlist = await Wishlist.findOrFail(params.id)
    const product = await Product.findOrFail(wishlist.product_id)
    //console.log(wishlist)
    return response.json(product)
  }

  public async add({ auth, params, response, request }: HttpContextContract) {
    const { id } = request.only(['id'])

    const user = await auth.use('user').authenticate()
    try {
      const result = await user.related('wishlist').updateOrCreate(
        {
          product_id: id,
          userId: user.id,
        },
        {
          product_id: id,
          active: true,
          userId: user.id,
          variant: {
            name: '',
            variation: '',
          },
        }
      )

      const product = await Product.find(id)

      if (!result) {
        return response.status(424).json({
          status: false,
          message: 'Failed to add to wishlist',
        })
      }

      return response.json({
        message: 'Item has been added to wishlist',
        product: product,
      })
    } catch (error) {
      if (error.sqlMessage.includes('Duplicate')) {
        return response.status(409).send('Item already in wishlist.')
      } else {
        console.log(error)
        return response.status(500).send('Something went wrong')
      }
    }
  }
  public async update({ auth, params, request, response }: HttpContextContract) {
    let user = await auth.use('user').authenticate()
    const wishlistData = request.only(['productId', 'active', 'variant'])
    await user.related('wishlist').updateOrCreate(
      {
        product_id: wishlistData.productId,
      },
      wishlistData
    )
    let result = await user.save()
    return response.json(result)
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    const user = await auth.use('user').authenticate()

    const wishlist = await Wishlist.query().where('user_id', user.id)

    wishlist.forEach(async (item) => {
      if (item.product_id === Number(params.id)) {
        console.log(item.toJSON())
        const myItem = await Wishlist.findOrFail(item.id)
        await myItem?.delete()
      }
    })

    return response.json({ message: 'Item deleted successfully from wishlist.' })
  }
}
