const pizzas = [
  {
    name: 'Margherita',
    description: 'Tomato sauce, mozzarella, and oregano',
    base: 'Classic',
    sauces: ['Tomato'],
    cheeses: ['Mozzarella'],
    veggies: ['Oregano'],
    price: 6.95,
    size: 'small',
    imageUrl: '/images/margherita.jpg',
  },
  {
    name: 'Marinara',
    description: 'Tomato sauce, garlic and basil',
    base: 'Classic',
    sauces: ['Tomato'],
    cheeses: [],
    veggies: ['Garlic', 'Basil'],
    price: 6.95,
    size: 'small',
    imageUrl: '/images/marinara.jpg',
  },
  {
    name: 'Quattro Formaggi',
    description:
      'Tomato sauce, mozzarella, parmesan, gorgonzola cheese, artichokes and basil',
    base: 'Classic',
    sauces: ['Tomato'],
    cheeses: ['Mozzarella', 'Parmesan', 'Gorgonzola'],
    veggies: ['Artichokes', 'Basil'],
    price: 8.95,
    size: 'small',
    imageUrl: '/images/quattro-formaggi.jpg',
  },
  {
    name: 'Carbonara',
    description: 'Tomato sauce, mozzarella, parmesan, eggs, and bacon',
    base: 'Classic',
    sauces: ['Tomato'],
    cheeses: ['Mozzarella', 'Parmesan'],
    veggies: ['Eggs', 'Bacon'],
    price: 8.95,
    size: 'small',
    imageUrl: '/images/carbonara.jpg',
  },
];

module.exports = pizzas;
