import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Wishlist from 'App/Models/Wishlist'
import Moderator from 'App/Models/Moderator'
import Product from 'App/Models/Product'
import Deletion from 'App/Models/Deletion'
import PurchaseHistory from 'App/Models/PurchaseHistory'
import Review from 'App/Models/Review'
import Order from 'App/Models/Order'

export default class WishlistController {
  public async index({ auth, params, response }: HttpContextContract) {
    const user = await auth.use('api').authenticate()
    return response.json({})
  }
  public async removeuser({ auth, params, response }: HttpContextContract) {
    await auth.use('user').authenticate()
    //const wishlist = await Wishlist.findOrFail(params.id)
    //console.log(wishlist)
    return response.json({})
  }

  public async a({ auth, params, response, request }: HttpContextContract) {
    const { id } = request.only(['id'])

    const user = await auth.use('api').authenticate()
  }
  public async update({ auth, params, request, response }: HttpContextContract) {
    let user = await auth.use('api').authenticate()

    return response.json({})
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    await auth.use('api').authenticate()
    //await wishlistItem?.delete()
    return response.json({ message: 'Product deleted successfully' })
  }

  /***
   * ORDER MANAGEMENT ROUTES
   */
  public async delivered({ auth, response, request }: HttpContextContract) {
    const { orderId, moderator } = request.only(['orderId', 'moderator'])
    if (moderator) {
      const account = await auth.use('moderator').authenticate()
      const order = await Order.findOrFail(orderId)
      //const user = await User.find(order.userId)
      order.delivered = true
      order.delivering = false
      order.canceled = false
      order.active = true
      order.collected = false
      await order.save()
      return response.json({
        fullname: `${account.firstname} ${account.lastname}`,
        name: order.name,
        orderId: order.id,
      })
    } else {
      const account = await auth.use('api').authenticate()
      const order = await Order.findOrFail(orderId)
      //const user = await User.find(order.userId)
      order.delivered = true
      order.delivering = false
      order.canceled = false
      order.active = true
      order.collected = false
      await order.save()
      return response.json({
        fullname: `${account.firstname} ${account.lastname}`,
        name: order.name,
        orderId: order.id,
      })
    }
  }
  public async removeOrder({ auth, response, request }: HttpContextContract) {
    const { orderId, moderator } = request.only(['orderId', 'moderator'])
    if (moderator) {
      const account = await auth.use('moderator').authenticate()
      const order = await Order.findOrFail(orderId)
      //const user = await User.find(order.userId)
      await order.delete()
      await order.save()
      return response.json({
        fullname: `${account.firstname} ${account.lastname}`,
        name: order.name,
        orderId: order.id,
        message: 'Order removed',
      })
    } else {
      const account = await auth.use('api').authenticate()
      const order = await Order.findOrFail(orderId)

      await order.delete()

      return response.json({
        fullname: `${account.firstname} ${account.lastname}`,
        name: order.name,
        orderId: order.id,
        message: 'Order removed',
      })
    }
  }
  public async singleOrder({ auth, response, request }: HttpContextContract) {
    const { orderId, moderator } = request.only(['orderId', 'moderator'])
    if (moderator) {
      const account = await auth.use('moderator').authenticate()
      const order = await Order.findOrFail(orderId)
      //const user = await User.find(order.userId)

      return response.json({
        fullname: `${account.firstname} ${account.lastname}`,
        name: order.name,
        orderId: order.id,
        message: 'Order removed',
        order: order,
      })
    } else {
      const account = await auth.use('api').authenticate()
      const order = await Order.findOrFail(orderId)

      return response.json({
        fullname: `${account.firstname} ${account.lastname}`,
        name: order.name,
        orderId: order.id,
        message: 'Order removed',
      })
    }
  }
  // END OF ROUTES
}
