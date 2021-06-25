const mongoose = require('mongoose');

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model');
// Import of the data from './data.json'
const data = require('./data');

const MONGODB_URI = 'mongodb://localhost:27017/recipe-app';

// Connection to the database "recipe-app"
mongoose
  .connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(self => {
    console.log(`Connected to the database: "${self.connection.name}"`);
    // Before adding any recipes to the database, let's remove all existing ones
    return Recipe.deleteMany()
  })
  .then(() => {

    let newRecipe = {
			title: 'miXto quente',
			level: 'Easy Peasy',
			ingredients: ['pão francês', 'queijo', 'presunto'],
			cuisine: 'Brasileira',
			dishType: 'Snack',
			image:
				'http://culinaria.culturamix.com/blog/wp-content/gallery/misto-quente-3/Misto-Quente-6.jpg',
			duration: 5,
			creator: 'JOC'
		};

		Recipe.create(newRecipe)
			.then((result) => console.log(`recipe added: ${result.title}`))
			.catch((err) => console.log(err));

		// iteration 3

		Recipe.insertMany(data)
			.then((result) => {
				result.forEach((item) => {
					console.log(`recipe for ${item.title} inserted successfully`);
				});
			})
			.catch((err) => console.log(err));

		// iteration 4

		Recipe.updateOne({ title: 'Rigatoni alla Genovese' }, { duration: 100 })
			.then(() => console.log(`The recipe is updated`))
			.catch((err) => console.log(err));

		// iteration 5

		Recipe.deleteOne({ title: 'Carrot Cake' })
			.then(() => console.log(`The recipe is deleted`))
			.catch((err) => console.log(err));


    mongoose.connection
			.close()
			.then(() => console.log(`connection closed`))
			.catch((err) =>
				console.log(
					`an error while closing database connection has occurred: ${err}`
				)
			);

  })
  .catch(error => {
    console.error('Error connecting to the database', error);
  });
