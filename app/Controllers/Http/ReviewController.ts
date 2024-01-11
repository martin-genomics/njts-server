import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Wishlist from 'App/Models/Wishlist'
import Product from 'App/Models/Product'
import Review from 'App/Models/Review'

export default class ReviewController {
  public async index({ auth, response }: HttpContextContract) {
    const user = await auth.use('user').authenticate()
    const products = await Product.all()
    let reviews: Review[] = []
    for (let i = 0; i < products.length; i++) {
      let review = await Product.find(products[i].review_id)
      if (review !== null) {
        //reviews.push(review)
      }
    }
    //console.log(myWishlist.length)
    return response.json(reviews)
  }
  public async show({ auth, params, response }: HttpContextContract) {
    //await auth.use('user').authenticate()
    const product = await Product.query().preload('review_id').where('id', params.id)
    console.log(product)
    return response.json(product)
  }

  public async add({ auth, response, request }: HttpContextContract) {
    const { productId, body, rating } = request.only(['productId', 'body', 'rating'])

    const user = await auth.use('user').authenticate()
    try {
      const product = await Product.find(productId)
      product?.related('review_id').create({
        name: `${user.firstname} ${user.lastname}`,
        email: user.email,
        body: body,
        rating: rating,
      })

      let results = await product?.save()

      if (results) {
        return response.json({
          status: true,
          message: 'Review added',
          fullname: `${user.firstname} ${user.lastname}`,
        })
      }

      return response.status(424).json({
        status: false,
        message: 'Failed to add to item review',
      })
    } catch (error) {
      console.log(error)
      return response.status(500).send('Something went wrong')
    }
  }
  public async update({ auth, request, response }: HttpContextContract) {
    const user = await auth.use('user').authenticate()

    const { reviewId, productId, body, rating } = request.only(['productId', 'reviewId', 'body', 'rating'])
    const product = await Product.findOrFail(productId)
    await product.related('review_id').updateOrCreate(
      {
        id: reviewId,
      },
      {
        name: `${user.firstname} ${user.lastname}`,
        email: user.email,
        rating:rating, 
        body: body,
      }
    )
    return response.json({ message: 'Updated successfully' })
  }

  public async destroy({ auth, params, response, request }: HttpContextContract) {
    await auth.use('user').authenticate()
    const { reviewId } = request.only(['reviewId'])
    const review = await Review.findOrFail(reviewId)
    await review.delete()
    //const review = product.related('review_id').query().where('id', reviewId)

    return response.json({ message: 'Review deleted successfully.' })
  }
}
