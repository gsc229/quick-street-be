# Market avenue App v1.0

![](images/quickstlogo.png)

##### Backend delpoyed at https://quickstlabs.herokuapp.com/

## Getting started

To get the server running locally:

- Clone this repo
- **npm install** to install all required dependencies
- **npm run server** to start the local server
- **npm run test** to start server using testing environment

### Backend Framework **Express**

Using Express...

- made it fast and easy to set up
- allowed us to create Restful API
- made it easy to connect to mongooseDB
- made it easy to incorporate middleware

## Endpoints
#### Online API documentation: https://quickstlabs.herokuapp.com/

#### Base URL for endpoints: https://quickstlabs.herokuapp.com/api/v1.0
#### Token usage: 
 - If tokens are sent in headers, concatenate the word 'Bearer ' to the front
    -> example:
     Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlMTc3MWRmNzY1YTZiNmU1YTU4Mzc
 - If tokens are sent in a url parameter don't concatentate 'Bearer '


#### Authentication Routes

| Method | Endpoint                | Access Control      | Description                                        |
| ------ | ----------------------- | ------------------- | -------------------------------------------------- |
| POST    | `/auth/register`        | public           | Register a vendor               |
| POST    | `/auth/login`    | public| Vendor login             |
| GET    | `/auth/me`        | token | Returns info for a single user.                    |
| POST   | `/auth/forgotpassword` | registered email                | Sends password-reset token to a registered email |
| PUT    | `/auth/resetpassword/:token`| requires token |     Allows a vendor to reset passoword                                               |
| PUT    | `/auth/updatedetails`| requires token | Allows a vendor to update details |
| PUT    | `/auth/updatepassword`| requires token | Allows a vendor to update password |


#### Vendor Routes

| Method | Endpoint                | Access Control | Description                                  |
| ------ | ----------------------- | -------------- | -------------------------------------------- |
| GET    | `/vendors` | public      | Returns the public information for a vendor |
| GET    | `/vendors/:vendorId` | public       | Returns public info. of a single vendor|
| GET | `/vendors/radius/:zipcode/:distance` | public | Returns public info. of vendors within a specified radius (in miles) of a specified zipcode |
| GET    | `/vendors/:vendorId/products`| public | Returns product info of all of a single vendor's products |
| GET    | `/vendors/:userId/posts` | public | Returns all posts of a single vendor |
| PUT    | `/vendors/:vendorId`        | token | Update vendor's info    |
| DELETE | `/vendors/:vendorId`        | token | Delete a vendor. Cascades to all of a vendor's products and images |

#### Product Routes

| Method | Endpoint                | Access Control      | Description                                        |
| ------ | ----------------------- | ------------------- | -------------------------------------------------- |
| GET    | `/products`        | public | Returns info for all products |
| GET    | `/products/:productId`    | public | Returns infor for a single product             |
| GET    | `/vendors/:vendorId/products`| public | Returns product info of all of a single vendor's products |
| POST   | `/vendors/:vendorId/products` | token | Creates a new product for a vendor|
| PUT    | `/products/:productId` | token | Edits a product of a vendor|
| DELETE | `/products/:userId`    | token |   Deletes a product of a vendor. Cascades to all images attached to a product | 

#### Product Images Routes

| Method | Endpoint                | Access Control | Description                                  |
| ------ | ----------------------- | -------------- | -------------------------------------------- |
| GET    | `/product-images` | public | Returns all product images of all vendors |
| GET    | `/products/:productId/product-images` | public | Returns all the images connected to a product |
| GET | `/vendors/:vendorId/product-images` | public | Returns all the images connected to a vendor |
| POST    | `/products/:productId/product-images` | token | Creates a new image returned from a Cloudinary upload widget (see image management for more details |
| DELETE | `/product-images/:imageId`    | token | Deletes an image |

#### Bulletin Post Routes

| Method | Endpoint                | Access Control      | Description                                        |
| ------ | ----------------------- | ------------------- | -------------------------------------------------- |
| GET    | `/posts`        | public | Returns all posts |
| GET    | `/posts/:postId` | public | Returns a post by its id |
| GET    | `/vendors/:userId/posts` | public | Returns all posts of a single vendor |
| POST   | `/vendors/:vendorId/posts` | token | Creates a new vendor post |
| PUT    | `/posts/:postId`        | token | Edit a post |
| DELETE | `/posts/:postId`        | token | Delete a post |   

#### Advanced Filtering
 Advanced filtering is available on GET /vendors, GET /products & GET /product-images endpoints. The examples below will mostly refer to the Vendor resource, however, the all filtering methods are availible on the Products and ProductImages resources as well. Refer to the **Data Model** section of this documentation to know which fileds you can filter on a resource.  

 | Method | Endpoint                | Access Control | Description                                  |
| ------ | ----------------------- | -------------- | -------------------------------------------- |
| GET    | `/vendors?location.state=PA` | public | Returns all vedors from Pennsylvania |
| GET    | `/vendors?vendor_category[in]=Spreads` | public      | Some fileds in Mongoose Schema objects are 'enumerated', meaning the possible values of the field are predefined.If the field is an 'enum' field, you need to add field[in]=some-pre-defined-value Look at the Data Models to see which fields are 'enum'|
| GET    | `/vendors?location.state=PA&vendor_category[in]=Spreads` | public | Use the '&' operator to chain queries together. Returns all vedors from Pennsylvania who sell spreads |
| GET    | `/vendors?vendor_category[in]=Spreads&location.state=PA&select=business_name,avatar` | public      | Rather than returning an entire object, 'select' alows you to specify which fields you want returned. This query returns only the business name and avatar of all vendors selling spreads in Pennsylvania |
| GET    | `/vendors?sort=business_name&select=business_name` | public | Return a query that is sorted by using the 'sort' method. By default sorting is done in ascending (A-Z, 0-9). However, if you want to sort descending, simply prepend a '-' (minus sign) to the field--in this example _sort=-business\_name_  |
| GET    | `/vendors?select=business_name&limit=5&page=2` | public | Queried responses are returned with a pagination object. You can specify the limit per page and the page number of the results. Retruns the five vendors' business names on page 2 (the 6th-10th result)  |
| GET    | `/products?select=name,price&price[gt]=500` | public | Comparison operators: **[gt]** (greater than), **[gte]** (greater than or equal to), **[lt]** (less than), **[lte]** (less than or equal to). Returns products with prices greater than 500, selecting only name and price fields   |


 

# Data Model (Mongoose Schemas)



#### 2️⃣ VENDORS

---

```
{
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    phone: {
      type: String
    },
    business_name: {
      type: String,
      unique: true
    },
    hours: {
      type: String,
      default: 'n/a'
    },
    days_of_week: {
      type: String,
      default: 'n/a'
    },
    slug: String,
    description: {
      type: String
    },
    avatar: {
      type: String,
      default: 'no-photo.jpg'
    },
    vendor_banner: {
      type: String,
      default: 'no-photo.jpg'
    },
    vendor_category: {
      type: [String],
      enum: [
        'Vegetables',
        'Fruits',
        'Breads',
        'Baked goods',
        'Beverages',
        'Spreads',
        'Other'
      ]
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    address: {
      type: String
    },
    //vendor location
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String
    }
}

```

#### PRODUCTS

---

```
{
    name: {
        type: String,
        trim: true,
        required: [true, 'Please add a product name']
    },
    description: {
        type: String,
    },
    category: {
        type: String,
    },
    diet: {
        type: [String],
        enum: ['Gluten Free', 'Vegetarian', 'Vegan', 'Keto', 'Dairy Free']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price for this product']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    vendor: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vendor',
        required: true
    }
}
```

#### PRODUCT_IMAGES

---

```
{
  public_id: String,
  version: Number,
  signature: String,
  width: Number,
  height: Number,
  format: String,
  resource_type: String,
  created_at: String,
  tags: [String],
  bytes: Number,
  type: String,
  etag: String,
  placeholder: Boolean,
  url: String,
  secure_url: String,
  access_mode: String,
  original_filename: String,
  path: String,
  thumbnail_url: String,
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  vendor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Vendor',
    required: true
  }
}

```

#### POSTS

---

```
{
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a title to your post']
    },
    description: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    vendor: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vendor',
        required: true
    }
}

```

## 2️⃣ Actions

🚫 This is an example, replace this with the actions that pertain to your backend

`getOrgs()` -> Returns all organizations

`getOrg(orgId)` -> Returns a single organization by ID

`addOrg(org)` -> Returns the created org

`updateOrg(orgId)` -> Update an organization by ID

`deleteOrg(orgId)` -> Delete an organization by ID
<br>
<br>
<br>
`getUsers(orgId)` -> if no param all users

`getUser(userId)` -> Returns a single user by user ID

`addUser(user object)` --> Creates a new user and returns that user. Also creates 7 availabilities defaulted to hours of operation for their organization.

`updateUser(userId, changes object)` -> Updates a single user by ID.

`deleteUser(userId)` -> deletes everything dependent on the user

## 3️⃣ Environment Variables

In order for the app to function correctly, the user must set up their own environment variables.

create a .env file that includes the following:

🚫 These are just examples, replace them with the specifics for your app

_ STAGING_DB - optional development db for using functionality not available in SQLite
_ NODE\*ENV - set to "development" until ready for "production"

- JWT*SECRET - you can generate this by using a python shell and running import random''.join([random.SystemRandom().choice('abcdefghijklmnopqrstuvwxyz0123456789!@#\$%^&amp;*(-_=+)') for i in range(50)])
  _ SENDGRID_API_KEY - this is generated in your Sendgrid account \* stripe_secret - this is generated in the Stripe dashboard

## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](./code_of_conduct.md). Please follow it in all your interactions with the project.

### Issue/Bug Request

**If you are having an issue with the existing project code, please submit a bug report under the following guidelines:**

- Check first to see if your issue has already been reported.
- Check to see if the issue has recently been fixed by attempting to reproduce the issue using the latest master branch in the repository.
- Create a live example of the problem.
- Submit a detailed bug report including your environment & browser, steps to reproduce the issue, actual and expected outcomes, where you believe the issue is originating from, and any potential solutions you have considered.

### Feature Requests

We would love to hear from you about new features which would improve this app and further the aims of our project. Please provide as much detail and information as possible to show us why you think your new feature should be implemented.

### Pull Requests

If you have developed a patch, bug fix, or new feature that would improve this app, please submit a pull request. It is best to communicate your ideas with the developers first before investing a great deal of time into a pull request to ensure that it will mesh smoothly with the project.

Remember that this project is licensed under the MIT license, and by submitting a pull request, you agree that your work will be, too.

#### Pull Request Guidelines

- Ensure any install or build dependencies are removed before the end of the layer when doing a build.
- Update the README.md with details of changes to the interface, including new plist variables, exposed ports, useful file locations and container parameters.
- Ensure that your code conforms to our existing code conventions and test coverage.
- Include the relevant issue number, if applicable.
- You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

### Attribution

These contribution guidelines have been adapted from [this good-Contributing.md-template](https://gist.github.com/PurpleBooth/b24679402957c63ec426).

## Documentation

See [Frontend Documentation](https://github.com/Lambda-School-Labs/quick-street-fe/blob/master/README.md) for details on the fronend of our project.
🚫 Add DS iOS and/or Andriod links here if applicable.
