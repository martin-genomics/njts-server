import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'ProductController.index') // List all products
  Route.get('/:id', 'ProductController.show')
  Route.get('/tag:tag', 'ProductController.tags') // Show a specific product // Show a specific product
  Route.post('/add', 'ProductController.add')
  Route.get('/search', 'ProductController.search') // Create a new product
  Route.put('/:id', 'ProductController.update') // Update a specific product
  Route.get('/featured', 'ProductController.featured') //Add to featured to product
  Route.delete('/:id', 'ProductController.destroy') // Delete a specific product
}).prefix('api/v1/products')

Route.group(() => {
  Route.get('/', 'ProductController.search') // Create a new product
}).prefix('api/v1/search')
Route.group(() => {
  Route.get('/:id', 'ReviewController.show')
  Route.post('/add', 'ReviewController.add')
  Route.patch('/', 'ReviewController.update')
  Route.delete('/', 'ReviewController.destroy')
}).prefix('api/v1/review')
Route.group(() => {
  Route.get('/', 'ProductController.featured')
  Route.post('/', 'ProductController.featuredProducts')
}).prefix('api/v1/featured')

Route.group(() => {
  Route.get('/', 'WishlistController.index') // List all products
  Route.get('/:id', 'WishlistController.show') // Show a specific product
  Route.post('/add', 'WishlistController.add')
  //Route.post('/:id', 'WishlistController.wishlist') // Create a new product
  Route.put('/:id', 'WishlistController.update') // Update a specific product
  Route.delete('/:id', 'WishlistController.destroy') // Delete a specific product
}).prefix('api/v1/wishlist')

Route.group(() => {
  Route.get('/', 'ProductController.index') // List all products
  Route.get('/:id', 'ProductController.show') // Show a specific product
  Route.post('/add', 'ProductController.add') // Create a new product
  Route.put('/:id', 'ProductController.update') // Update a specific product
  Route.post('/featured-product', 'ProductController.FeaturedProducts') //Add to featured to product
  Route.get('/featured-products', 'ProductController.fetchFeaturedProducts') //Add to featured to product
  Route.delete('/', 'ProductController.destroy') // Delete a specific product
}).prefix('api/v1/admin/products')

Route.group(() => {
  Route.get('/', 'UserController.index') // get single user by id
  Route.post('/signup', 'UserController.signup') //create a new user
  Route.put('/update', 'UserController.update') //create a new user
  Route.post('/set-profile-photo', 'UserController.signup')
  Route.get('/test', 'UserController.signup') //create a new user
  Route.post('/signin', 'UserController.signin') //sign in user
  Route.post('/get-otp', 'UserController.generateOTP') //get otp
  Route.post('/verify-otp', 'UserController.verifyOTP') //verify user
}).prefix('api/v1/user')

Route.group(() => {
  Route.get('/', 'ManagementController.index') // get single user by id
  Route.post('/remove-user', 'ManagementController.removeuser') //create a new user
  Route.put('/update', 'ManagementController.update') //create a new user
  Route.post('/set-profile-photo', 'ManagementController.signup')
  Route.get('/test', 'ManagementController.signup') //create a new user
  Route.post('/signin', 'ManagementController.signin') //sign in user
  Route.patch('/order/delivered', 'ManagementController.delivered')
  Route.delete('/order/remove', 'ManagementController.removeOrder')
  Route.delete('/order', 'ManagementController.singleOrder')
  Route.get('/order', 'ManagementController.orderIndex')
  Route.patch('/order/delivering', 'ManagementController.delivering')
}).prefix('api/v1/management')

Route.group(() => {
  Route.get('/', 'AdminController.index') // get single user by id
  Route.post('/signup', 'AdminController.signup') //create a new user
  Route.put('/update', 'AdminController.update') //Update user
  Route.post('/set-profile-photo', 'AdminController.signup')
  Route.get('/test', 'AdminController.signup') // Testing different routes
  Route.post('/signin', 'AdminController.signin') //sign in user
}).prefix('api/v1/admin')

Route.group(() => {
  Route.get('/', 'ModeratorController.index') // get single user by id
  Route.post('/signup', 'ModeratorController.signup') //create a new user
  Route.put('/update', 'ModeratorController.update') //Update user
  Route.post('/set-profile-photo', 'ModeratorController.signup')
  Route.get('/test', 'ModeratorController.signup') // Testing different routes
  Route.post('/signin', 'ModeratorController.signin') //sign in user
}).prefix('api/v1/moderator')
