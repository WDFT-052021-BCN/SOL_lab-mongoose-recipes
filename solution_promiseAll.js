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
	.then((self) => {
		console.log(`Connected to the database: "${self.connection.name}"`);
		// Before adding any recipes to the database, let's remove all existing ones
		return Recipe.deleteMany();
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

		let recipeCreatePromise = Recipe.create(newRecipe);

		let dataInsertPromise = Recipe.insertMany(data);

		Promise.all([recipeCreatePromise, dataInsertPromise])
			.then((result) => {
				console.log(`The recipe is saved and its title is: ${result[0].title}`);
				console.log(result[1]);
				result[1].forEach((item) => {
					console.log(`recipe for ${item.title} inserted successfully`);
				});

				let recipeUpdate = Recipe.updateOne(
					{ title: 'Rigatoni alla Genovese' },
					{ duration: 100 }
				);

				let recipeRemove = Recipe.deleteOne({ title: 'Carrot Cake' });

				Promise.all([recipeUpdate, recipeRemove])
					.then((result) => {
						console.log(result);
						console.log(`The recipe is updated`);
						console.log(`The recipe  is deleted.`);
						mongoose.connection
							.close()
							.then(() => console.log(`connection closed`))
							.catch((err) => console.log(`an error has occurred: ${err}`));
					})
					.catch((err) => console.log(`an error has occurred: ${err}`));
			})
			.catch((err) => console.log(`an error has occurred: ${err}`));
	})
	.catch((error) => {
		console.error('Error connecting to the database', error);
	});
