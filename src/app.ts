import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import expressSession from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import passport from 'passport';
import errorHandler from './middleware/errorHandler';
import signupRoutes from './routes/signupRoutes';
import loginRoutes from './routes/loginRoutes';

import prisma from './db/client';

import './config/passport';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(
	expressSession({
		cookie: {
			maxAge: 1000 * 60 * 60 * 24, // 1 day
		},
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: true,
		store: new PrismaSessionStore(prisma, {
			checkPeriod: 2 * 60 * 1000,
			dbRecordIdIsSessionId: true,
			dbRecordIdFunction: undefined,
		}),
	})
);
app.use(passport.session());

// Custom middleware to add the user to the locals object.
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

app.set('views', './src/views');
app.set('view engine', 'ejs');

// DEV ONLY. REMOVE LATER
// (async () => {
// 	const users = await prisma.user.findMany();
// 	console.log(users);
// })();

app.get('/', (req, res) => {
	res.render('index');
});
app.use('/signup', signupRoutes);
app.use('/login', loginRoutes);
app.use('/logout', (req, res, next) => {
	req.logout((err) => {
		if (err) return next(err);
		res.redirect('/');
	});
});

app.use(errorHandler);

app.listen(PORT, () => console.log('Server running'));
