import passport from 'passport';
import local from 'passport-local';
import bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import prisma from '../db/client';

type UserId = User['id'];

const LocalStrategy = local.Strategy;

passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			const user = await prisma.user.findUnique({
				where: {
					username,
				},
			});

			if (!user) {
				return done(null, false, { message: 'Incorrect username.' });
			}

			const match = await bcrypt.compare(password, user.password);
			if (!match) {
				return done(null, false, { message: 'Incorrect password.' });
			}

			return done(null, user);
		} catch (error) {
			return done(error);
		}
	})
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id: UserId, done) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: id },
		});

		done(null, user);
	} catch (error) {
		done(error);
	}
});
