// Made a simple template for form, we will use multiple times now wherever it requires

//this will represent in what formate we have to get data

//registration form requirement
export const registerFormControls = [
  {
    name: 'username',
    label: 'Username',
    placeholder: 'Enter Your User Name',
    componentType: 'input',
    type: 'text'
  },

  {
    name: 'email',
    label: 'Email',
    placeholder: 'Enter Your Email',
    componentType: 'input',
    type: 'email'
  },

  {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter Your Password',
    componentType: 'input',
    type: 'password'
  }
]



//login form requirement
export const loginFormControls = [
  {
    name: 'email',
    label: 'Email',
    placeholder: 'Enter Your Email',
    componentType: 'input',
    type: 'email'
  },

  {
    name: 'password',
    label: 'Password',
    placeholder: 'Enter Your Password',
    componentType: 'input',
    type: 'password'
  }
]


//Requirement for adding any products
export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "accessories", label: "Accessories" },
      { id: "footwear", label: "Footwear" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "nike", label: "Nike" },
      { id: "adidas", label: "Adidas" },
      { id: "puma", label: "Puma" },
      { id: "levi", label: "Levi's" },
      { id: "zara", label: "Zara" },
      { id: "h&m", label: "H&M" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];


//Menu Item Required Fields
export const shoppingPageHeaderMenuItem = [
  {
    id: 'home',
    label: 'Home',
    path: '/shop/home'
  },
  {
    id: 'products',
    label: 'Products',
    path: '/shop/listing'
  },
  {
    id: 'men',
    label: 'Men',
    path: '/shop/listing'
  },
  {
    id: 'women',
    label: 'Women',
    path: '/shop/listing'
  },
  {
    id: 'kids',
    label: 'Kids',
    path: '/shop/listing'
  },
  {
    id: 'footwear',
    label: 'Footwear',
    path: '/shop/listing'
  },
  {
    id: 'accessories',
    label: 'Accessories',
    path: '/shop/listing'
  },
    {
    id: 'search',
    label: 'Search',
    path: '/shop/search'
  }
]


//Passing below configuration id details into Uppercase because it is getting in lowercase
export const categoryOptionsMap = {
  'men': "Men",
  'women': 'Women',
  'kids': 'Kids',
  'accessories': 'Accessories',
  'footwear': 'Footwear'
}

export const brandOptionsMap = {
  'nike': "Nike",
  'adidas': 'Adidas',
  'puma': 'Puma',
  'levi': 'Levi',
  'zara': 'Zara',
  'h&m': 'H&M'
}

//Filter options required field
export const filterOptions = {
  category: [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
    { id: "accessories", label: "Accessories" },
    { id: "footwear", label: "Footwear" },
  ],
  brand: [
    { id: "nike", label: "Nike" },
    { id: "adidas", label: "Adidas" },
    { id: "puma", label: "Puma" },
    { id: "levi", label: "Levi's" },
    { id: "zara", label: "Zara" },
    { id: "h&m", label: "H&M" },
  ]
}


//Sort Options required filed such as price and demand
export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];


//Required field for Address's Form
export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];