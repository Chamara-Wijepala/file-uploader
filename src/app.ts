import express from 'express';
import errorHandler from './middleware/errorHandler';
import signupRoutes from './routes/signupRoutes';

import prisma from './db/client';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

app.set('views', './src/views');
app.set('view engine', 'ejs');

// DEV ONLY. REMOVE LATER
(async () => {
	const users = await prisma.user.findMany();
	console.log(users);
})();

app.get('/', (req, res) => {
	res.render('index');
});
app.use('/signup', signupRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log('Server running'));
