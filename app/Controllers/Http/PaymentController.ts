import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Payment from 'App/Models/Payment'

export default class WishlistController {
  public async index({ auth, response }: HttpContextContract) {}
  public async show({ auth, params, response }: HttpContextContract) {
    await auth.use('user').authenticate()

    //console.log(wishlist)
    return response.json([])
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
