import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const products = [
  {
    name: 'Chicken Momo',
    description: 'Steamed dumplings with minced chicken filling and spices',
    price: 220,
    category: 'non-veg',
    image: 'chicken-momo.jpg',
    rating: 4.8,
    numReviews: 120,
    preparationTime: 15
  },
  {
    name: 'Veg Momo',
    description: 'Steamed dumplings with mixed vegetable filling',
    price: 180,
    category: 'veg',
    image: 'veg-momo.jpg',
    rating: 4.5,
    numReviews: 95,
    preparationTime: 15
  },
  {
    name: 'Dal Bhat',
    description: 'Traditional lentil soup with rice, vegetables, and pickles',
    price: 250,
    category: 'veg',
    image: 'dal-bhat.jpg',
    rating: 4.7,
    numReviews: 80,
    preparationTime: 20
  },
  {
    name: 'Chicken Sekuwa',
    description: 'Grilled chicken marinated in Nepali spices',
    price: 320,
    category: 'non-veg',
    image: 'sekuwa.jpg',
    rating: 4.9,
    numReviews: 65,
    preparationTime: 25
  },
  {
    name: 'Thakali Thali',
    description: 'Complete Nepali meal with multiple dishes',
    price: 350,
    category: 'non-veg',
    image: 'thakali-thali.jpg',
    rating: 4.8,
    numReviews: 50,
    preparationTime: 30
  },
  {
    name: 'Sel Roti',
    description: 'Traditional sweet rice doughnut',
    price: 100,
    category: 'snacks',
    image: 'sel-roti.jpg',
    rating: 4.6,
    numReviews: 45,
    preparationTime: 10
  },
  {
    name: 'Masala Tea',
    description: 'Spiced Nepali tea with ginger and cardamom',
    price: 60,
    category: 'drinks',
    image: 'masala-tea.jpg',
    rating: 4.4,
    numReviews: 200,
    preparationTime: 5
  },
  {
    name: 'Mango Lassi',
    description: 'Refreshing yogurt drink with mango',
    price: 120,
    category: 'drinks',
    image: 'mango-lassi.jpg',
    rating: 4.7,
    numReviews: 85,
    preparationTime: 5
  },
  {
    name:'Dhido',
    description: 'National khana',
    price: 280,
    category: 'veg',
    image: 'dhido.jpg',
    rating: 4.5,
    numReviews: 102,
    preparationTime: 25
  },
  {
    name:'Chatpate',
    description: 'Chatapat hunxau LatPat',
    price: 50,
    category: 'snacks',
    image: 'chatpate.jpg',
    rating: 4.3,
    numReviews: 250,
    preparationTime: 2
  },
  {
    name:'Bara',
    description: 'Newari khana',
    price: 40,
    category: 'snacks',
    image: 'bara.jpg',
    rating: 4.5,
    numReviews: 95,
    preparationTime: 5
  },
  {
    name:'Chicken-Dum-Biryani',
    description: 'chicken khana',
    price: 280,
    category: 'non-veg',
    image: 'nonbir.jpg',
    rating: 4.8,
    numReviews: 99,
    preparationTime: 8
  },
  {
    name:'Veg-Biryani',
    description: 'sada khana',
    price: 250,
    category: 'veg',
    image: 'bir.jpg',
    rating: 4.5,
    numReviews: 102,
    preparationTime: 8
  },
  {
    name:'Paneer Masala',
    description: 'paneer beverage',
    price: 250,
    category: 'veg',
    image: 'panmas.jpg',
    rating: 4.5,
    numReviews: 102,
    preparationTime: 10
  },
  {
    name:'JACK DANIELS - JD',
    description: 'Whiskey',
    price: 8500,
    category: 'bar',
    image: 'jd.jpg',
    rating: 4.5,
    numReviews: 102,
    preparationTime: 1
  },
  {
    name:'Chicken Curry',
    description: 'chicken set',
    price: 255,
    category: 'non-veg',
    image: 'chicurry.jpg',
    rating: 4.5,
    numReviews: 102,
    preparationTime: 12
  },
  {
    name:'Wai Wai Sadeko',
    description: 'sadeko wai wai',
    price: 79,
    category: 'snacks',
    image: 'waiwai.jpg',
    rating: 4.5,
    numReviews: 102,
    preparationTime: 12
  },
  {
    name:'Mushroom Fry',
    description: 'mushroom set',
    price: 119,
    category: 'veg',
    image: 'mushroom.jpg',
    rating: 4.5,
    numReviews: 102,
    preparationTime: 12
  },
  {
    name:'MARPHAK',
    description: 'Brandey',
    price: 999,
    category: 'bar',
    image: 'marphak.jpg',
    rating: 4.5,
    numReviews: 102,
    preparationTime: 1
  },
  {
    name:'Tuborg',
    description: 'Beer Set',
    price: 499,
    category: 'bar',
    image: 'tuborg.jpg',
    rating: 4.5,
    numReviews: 102,
    preparationTime: 1
  },
  {
    name:'Jerry',
    description: 'Desert',
    price: 99,
    category: 'desserts',
    image: 'jerry.jpg',
    rating: 4.5,
    numReviews: 102,
    preparationTime: 8
  },
  {
    name:'Sadeko Peanut',
    description: 'sadeko khaja',
    price: 139,
    category: 'snacks',
    image: 'sadpeanut.jpg',
    rating: 4.5,
    numReviews: 102,
    preparationTime: 4
  },
  {
    name:'Pulao',
    description: 'Rice set with vegetables and sweets.',
    price: 149,
    category: 'veg',
    image: 'pulao.jpg',
    rating: 4.5,
    numReviews: 102,
    preparationTime: 11
  },
  {
    name:'Roti Tarkari',
    description: ' Roti Set.',
    price: 119,
    category: 'veg',
    image: 'roti.jpg',
    rating: 4.5,
    numReviews: 102,
    preparationTime: 7
  },
  {
    name:'DahiCurryChawal',
    description: ' Rice Set.',
    price: 99,
    category: 'veg',
    image: 'dahicurry.jpg',
    rating: 4.3,
    numReviews: 301,
    preparationTime: 13
  },
  {
    name:'Garlic Nan',
    description: ' Roti Set.',
    price: 79,
    category: 'veg',
    image: 'nan.jpg',
    rating: 4.6,
    numReviews: 402,
    preparationTime: 6
  },
  {
    name:'Newari Khaja Set',
    description: ' khaja Set.',
    price: 349,
    category: 'snacks',
    image: 'nekhaja.jpg',
    rating: 4.7,
    numReviews: 502,
    preparationTime: 14
  },
  {
    name:'Yomari',
    description: ' Newari Sweet Set.',
    price: 79,
    category: 'desserts',
    image: 'yomari.jpg',
    rating: 4.2,
    numReviews: 257,
    preparationTime: 15
  },
  {
    name:'Tandoor Panner Tikka',
    description: ' Paneer Set.',
    price: 199,
    category: 'veg',
    image: 'pantik.jpg',
    rating: 4.4,
    numReviews: 220,
    preparationTime: 12
  },

  {
    name:'Hookah',
    description: ' Smoke Flavour Set.',
    price: 349,
    category: 'bar',
    image: 'hookah.jpg',
    rating: 4.5,
    numReviews: 650,
    preparationTime: 5
  },

  {
    name:'Paratha',
    description: 'Roti Set.',
    price: 50,
    category: 'veg',
    image: 'paratha.jpg',
    rating: 4.3,
    numReviews: 449,
    preparationTime: 6
  },

  {
    name:'Mutton Curry',
    description: 'Mutton Set.',
    price: 499,
    category: 'non-veg',
    image: 'muttoncurry.jpg',
    rating: 4.4,
    numReviews: 500,
    preparationTime: 14
  },

  {
    name:'Mutton Masala',
    description: 'Mutton Set.',
    price: 399,
    category: 'non-veg',
    image: 'muttonmasala.jpg',
    rating: 4.4,
    numReviews: 403,
    preparationTime: 12
  },

  {
    name:'Mutton Masala',
    description: 'Mutton Set.',
    price: 399,
    category: 'non-veg',
    image: 'muttonmasala.jpg',
    rating: 4.4,
    numReviews: 403,
    preparationTime: 12
  },
  
  {
    name:'Paneer Swarma',
    description: 'Roti Set.',
    price: 79,
    category: 'snacks',
    image: 'PannerSwarma.jpg',
    rating: 4.3,
    numReviews: 342,
    preparationTime: 9
  },

  {
    name:'Egg Curry',
    description: 'Egg Set.',
    price: 119,
    category: 'non-veg',
    image: 'Eggcurry.jpg',
    rating: 4.2,
    numReviews: 148,
    preparationTime: 14
  },

  {
    name:'Sausage',
    description: 'Meat Set.',
    price: 120,
    category: 'non-veg',
    image: 'sausage.jpg',
    rating: 4.8,
    numReviews: 320,
    preparationTime: 12
  },

  {
    name:'Crispy Fried Chicken',
    description: 'chicken Set.',
    price: 149,
    category: 'non-veg',
    image: 'cripchicken.jpg',
    rating: 4.9,
    numReviews: 750,
    preparationTime: 14
  },

  {
    name:'Thukpa',
    description: 'Noodles Set.',
    price: 149,
    category: 'snacks',
    image: 'thukpa.jpg',
    rating: 4.5,
    numReviews: 359,
    preparationTime: 13
  },

  {
    name:'Samosa',
    description: 'Potato Set.',
    price: 49,
    category: 'snacks',
    image: 'samosa.jpg',
    rating: 4.5,
    numReviews: 359,
    preparationTime: 6
  },

  {
    name:'Newari Tho',
    description: 'Wine',
    price: 199,
    category: 'bar',
    image: 'chyang.jpg',
    rating: 4.5,
    numReviews: 359,
    preparationTime: 2
  },

  {
    name:'Manang',
    description: 'Wine',
    price: 1199,
    category: 'bar',
    image: 'manang.jpg',
    rating: 4.8,
    numReviews: 359,
    preparationTime: 2
  },

  {
    name:'Aalu Tama',
    description: 'Veg Curry',
    price: 40,
    category: 'veg',
    image: 'tama.jpg',
    rating: 4.4,
    numReviews: 349,
    preparationTime: 6
  },

  {
    name:'Butter Chicken',
    description: 'Chicken Butter Curry',
    price: 299,
    category: 'non-veg',
    image: 'butchick.jpg',
    rating: 4.5,
    numReviews: 439,
    preparationTime: 12
  },

  {
    name:'Tandoori Chicken',
    description: 'Chicken Full Grill Set',
    price: 299,
    category: 'non-veg',
    image: 'butchick.jpg',
    rating: 4.5,
    numReviews: 439,
    preparationTime: 12
  },

  {
    name:' Chicken Wings',
    description: 'Chicken Set',
    price: 199,
    category: 'non-veg',
    image: 'wings.jpg',
    rating: 4.5,
    numReviews: 449,
    preparationTime: 12
  },

  {
    name:' Chicken Lolipop',
    description: 'Chicken Set',
    price: 99,
    category: 'non-veg',
    image: 'lolipop.jpg',
    rating: 4.5,
    numReviews: 439,
    preparationTime: 13
  },

  {
    name:' Mutton Seekh Kabaab',
    description: 'Mutton Set',
    price: 499,
    category: 'non-veg',
    image: 'kabab.jpg',
    rating: 4.5,
    numReviews: 509,
    preparationTime: 14
  },

  {
    name:' 8848',
    description: 'Vodka',
    price: 1999,
    category: 'bar',
    image: '8848.jpg',
    rating: 4.9,
    numReviews: 755,
    preparationTime: 2
  },

  {
    name:'Monarch',
    description: 'Wine',
    price: 3499,
    category: 'bar',
    image: 'monarch.jpg',
    rating: 4.9,
    numReviews: 755,
    preparationTime: 2
  },

  {
    name:'Golden Oak',
    description: 'Whisky',
    price: 1199,
    category: 'bar',
    image: 'goak.jpg',
    rating: 4.9,
    numReviews: 755,
    preparationTime: 2
  },

  {
    name:'Black Label',
    description: 'Whisky',
    price: 2999,
    category: 'bar',
    image: 'blacklabel.jpg',
    rating: 4.9,
    numReviews: 755,
    preparationTime: 2
  },

  {
    name:'Imperial Blue',
    description: 'Whisky',
    price: 1199,
    category: 'bar',
    image: 'impblue.jpg',
    rating: 4.9,
    numReviews: 755,
    preparationTime: 2
  },

  {
    name:'Blue Label',
    description: 'Whisky',
    price: 16999,
    category: 'bar',
    image: 'Bluelabel.jpg',
    rating: 5.0,
    numReviews: 74,
    preparationTime: 3
  },

  {
    name:'Highlander',
    description: 'Scotch',
    price: 1100,
    category: 'bar',
    image: 'highlander.jpg',
    rating: 4.8,
    numReviews: 74,
    preparationTime: 3
  },

  {
    name:'Old Monk',
    description: 'Whisky',
    price: 3999,
    category: 'bar',
    image: 'oldmonk.jpg',
    rating: 4.8,
    numReviews: 299,
    preparationTime: 3
  },

  {
    name:'Ruslan Vodka',
    description: 'Vodka',
    price: 2599,
    category: 'bar',
    image: 'ruslanvodka.jpg',
    rating: 4.8,
    numReviews: 299,
    preparationTime: 3
  },

  {
    name:'PaniPuri',
    description: 'Aalu with Sour taste drink.',
    price: 80,
    category: 'snacks',
    image: 'PaniPuri.jpg',
    rating: 4.6,
    numReviews: 1100,
    preparationTime: 5
  },

   {
    name:'Chicken Choila',
    description: 'Chicken Set',
    price: 299,
    category: 'non-veg',
    image: 'chickenchoila.jpg',
    rating: 4.6,
    numReviews: 423,
    preparationTime: 10
  },

  {
    name:'Bread Chop',
    description: 'Bread Set',
    price: 199,
    category: 'snacks',
    image: 'breadchop.jpg',
    rating: 4.6,
    numReviews: 423,
    preparationTime: 10
  },

  {
    name:'Aalu Chop',
    description: 'Potato Set',
    price: 99,
    category: 'snacks',
    image: 'aaluchop.jpg',
    rating: 4.4,
    numReviews: 423,
    preparationTime: 10
  },

  {
    name:'Kheer',
    description: 'Rice Set',
    price: 99,
    category: 'desserts',
    image: 'kheer.jpg',
    rating: 4.3,
    numReviews: 255,
    preparationTime: 10
  },

  {
    name:'Chocolate Milkshake',
    description: ' Milkshake',
    price: 119,
    category: 'drinks',
    image: 'chocmilk.jpg',
    rating: 4.3,
    numReviews: 255,
    preparationTime: 10
  },

  {
    name:'Badam Lassi',
    description: 'Lassi Milk',
    price: 119,
    category: 'drinks',
    image: 'lassi.jpg',
    rating: 4.3,
    numReviews: 255,
    preparationTime: 10
  },

  {
    name:'Orea Milkshake',
    description: ' Milkshake',
    price: 119,
    category: 'drinks',
    image: 'oreomilkshake.jpg',
    rating: 4.3,
    numReviews: 255,
    preparationTime: 10
  },

  {
    name:'Strawberry Milkshake',
    description: 'Milkshake',
    price: 119,
    category: 'drinks',
    image: 'straw.jpg',
    rating: 4.3,
    numReviews: 255,
    preparationTime: 10
  },

  {
    name:'Blueberry Milkshake',
    description: 'Milkshake',
    price: 139,
    category: 'drinks',
    image: 'blueberry.jpg',
    rating: 4.3,
    numReviews: 255,
    preparationTime: 10
  },

  {
    name:'Banana Smoothie',
    description: 'Smoothie',
    price: 119,
    category: 'drinks',
    image: 'blueberry.jpg',
    rating: 4.3,
    numReviews: 255,
    preparationTime: 10
  },


  {
    name:'Coca Cola',
    description: 'Soft Drink',
    price: 50,
    category: 'drinks',
    image: 'cola.jpg',
    rating: 4.5,
    numReviews: 255,
    preparationTime: 2
  },

  {
    name:'Fanta',
    description: 'Soft Drink',
    price: 50,
    category: 'drinks',
    image: 'fanta.jpg',
    rating: 4.3,
    numReviews: 255,
    preparationTime: 2
  },


  {
    name:'Sprite',
    description: 'Soft Drink',
    price: 50,
    category: 'drinks',
    image: 'sprite.jpg',
    rating: 4.3,
    numReviews: 255,
    preparationTime: 2
  },

  {
    name:'Pepsi',
    description: 'Soft Drink',
    price: 50,
    category: 'drinks',
    image: 'pepsi.jpg',
    rating: 4.4,
    numReviews: 255,
    preparationTime: 2
  },

  {
    name:'7up',
    description: 'Soft Drink',
    price: 50,
    category: 'drinks',
    image: '7.jpg',
    rating: 4.4,
    numReviews: 255,
    preparationTime: 2
  },

  {
    name:'Mirinda',
    description: 'Soft Drink',
    price: 50,
    category: 'drinks',
    image: 'mirinda.jpg',
    rating: 4.4,
    numReviews: 255,
    preparationTime: 2
  },

  {
    name:'Red Bull',
    description: 'Energy Drink',
    price: 110,
    category: 'drinks',
    image: 'mirinda.jpg',
    rating: 4.4,
    numReviews: 255,
    preparationTime: 2
  },

  {
    name:'Diet Coke',
    description: 'Soft Drink',
    price: 99,
    category: 'drinks',
    image: 'diet.jpg',
    rating: 4.4,
    numReviews: 255,
    preparationTime: 2
  },


  {
    name:'Mountain DeW',
    description: 'Soft Drink',
    price: 50,
    category: 'drinks',
    image: 'dew.jpg',
    rating: 4.5,
    numReviews: 255,
    preparationTime: 2
  },

  {
    name:'Badam Drink',
    description: 'Energy Drink',
    price: 70,
    category: 'drinks',
    image: 'badam.jpg',
    rating: 4.5,
    numReviews: 255,
    preparationTime: 2
  },

  {
    name:'Fruit Lassi',
    description: 'Lassi',
    price: 70,
    category: 'drinks',
    image: 'fruit.jpg',
    rating: 4.5,
    numReviews: 255,
    preparationTime: 2
  },

  {
    name:'Vanilla Milkshake',
    description: 'Milkshake',
    price: 99,
    category: 'drinks',
    image: 'vanmilk.jpg',
    rating: 4.5,
    numReviews: 255,
    preparationTime: 2
  },


  {
    name:'Butter Scotch',
    description: 'Scotch',
    price: 120,
    category: 'drinks',
    image: 'butscorch.jpg',
    rating: 4.5,
    numReviews: 255,
    preparationTime: 2
  },

 
   {
    name:'Palak Paneer',
    description: 'Paneer Set',
    price: 249,
    category: 'veg',
    image: 'palakpanner.jpg',
    rating: 4.5,
    numReviews: 255,
    preparationTime: 12
  },


  {
    name:'Gobi Manchurian',
    description: 'Gobi Set',
    price: 159,
    category: 'veg',
    image: 'gobimanchurian.jpg',
    rating: 4.5,
    numReviews: 255,
    preparationTime: 10
  },

  {
    name:'Fried Rice',
    description: 'Rice Set',
    price: 159,
    category: 'veg',
    image: 'fryrice.jpg',
    rating: 4.5,
    numReviews: 255,
    preparationTime: 10
  },


  {
    name:'Keema Noodles',
    description: 'Noodles Set',
    price: 159,
    category: 'non-veg',
    image: 'keema.jpg',
    rating: 4.5,
    numReviews: 255,
    preparationTime: 10
  },

  {
    name:'Fry Pasta',
    description: 'Pasta Set',
    price: 130,
    category: 'veg',
    image: 'pasta.jpg',
    rating: 4.5,
    numReviews: 255,
    preparationTime: 10
  },

  {
    name:'Cream Pasta',
    description: 'Pasta Set',
    price: 130,
    category: 'veg',
    image: 'creampasta.jpg',
    rating: 4.5,
    numReviews: 255,
    preparationTime: 10
  },

  {
    name:'Chicken Pizza',
    description: 'Pizza Set',
    price: 250,
    category: 'snacks',
    image: 'pizza.jpg',
    rating: 4.5,
    numReviews: 255,
    preparationTime: 10
  },

  {
    name:'Hot Dog',
    description: 'Bread and Chicken',
    price: 250,
    category: 'non-veg',
    image: 'dog.jpg',
    rating: 4.5,
    numReviews: 255,
    preparationTime: 10
  },

  {
    name:'Veg Pizza',
    description: 'Pasta Set',
    price: 260,
    category: 'veg',
    image: 'pasta1.jpg',
    rating: 4.5,
    numReviews: 255,
    preparationTime: 10
  },


  {
    name:'Chicken Burger',
    description: 'Burger Set',
    price: 150,
    category: 'snacks',
    image: 'burg.jpg',
    rating: 4.5,
    numReviews: 255,
    preparationTime: 10
  },

  {
    name:'Fruit Salad',
    description: 'Fruits Set',
    price: 200,
    category: 'veg',
    image: 'fruitsal.jpg',
    rating: 4.5,
    numReviews: 255,
    preparationTime: 10
  },

  {
    name:'Green Salad',
    description: 'Salad Set',
    price: 150,
    category: 'snacks',
    image: 'greensal.jpg',
    rating: 4.5,
    numReviews: 255,
    preparationTime: 10
  },


  {
    name:'Pepperoni Pizza',
    description: 'Pizza Set',
    price: 349,
    category: 'snacks',
    image: 'pep.jpg',
    rating: 4.5,
    numReviews: 255,
    preparationTime: 12
  },

  {
    name:'Tomato-Mozzarella-Pizza',
    description: 'Pizza Set',
    price: 349,
    category: 'snacks',
    image: 'pepm.jpg',
    rating: 4.5,
    numReviews: 255,
    preparationTime: 12
  },

  {
    name:'Gajar Halwa',
    description: 'Haluwa Set',
    price: 119,
    category: 'desserts',
    image: 'hal.jpg',
    rating: 4.5,
    numReviews: 255,
    preparationTime: 12
  },

  {
    name:'Vanilla Icecream',
    description: 'Icecream Set',
    price: 139,
    category: 'desserts',
    image: 'choc.jpg',
    rating: 4.5,
    numReviews: 255,
    preparationTime: 12
  },


  {
    name:'Chocolate Pastry',
    description: 'Pastry Set',
    price: 149,
    category: 'desserts',
    image: 'pastry.jpg',
    rating: 4.5,
    numReviews: 255,
    preparationTime: 12
  },

  {
    name:'Chocolate Cobbler',
    description: 'Icecream Set',
    price: 179,
    category: 'desserts',
    image: 'cob.jpg',
    rating: 4.5,
    numReviews: 255,
    preparationTime: 12
  },


  {
    name:'Chocolate Puff Pastry ',
    description: 'Pastry Set',
    price: 149,
    category: 'desserts',
    image: 'chp.jpg',
    rating: 4.5,
    numReviews: 255,
    preparationTime: 12
  },
  {
    name:'Chocopie ',
    description: 'Chocolate Set',
    price: 1,
    category: 'desserts',
    image: 'chocopie.jpg',
    rating: 4.5,
    numReviews: 255,
    preparationTime: 12

  }

];






const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    console.log('✅ Cleared existing products');

    // Insert products
    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products`);

    // Create admin user
    const adminUser = await User.findOne({ email: 'admin@kasthamandapghar.com' });
    if (!adminUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await User.create({
        name: 'Admin User',
        email: 'admin@kasthamandapghar.com',
        password: hashedPassword,
        phone: '9800000000',
        address: 'Thamel, Kathmandu',
        role: 'admin'
      });
      console.log('✅ Created admin user');
    }

    console.log('🎉 Database seeding completed!');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();