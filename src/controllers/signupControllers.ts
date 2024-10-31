import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../db/client';

const getSignupPage = (req: Request, res: Response) => {
	res.render('signup');
};

const createUser = (req: Request, res: Response, next: NextFunction) => {
	const { username, password } = req.body;

	bcrypt.hash(password, 10, async (err, hash) => {
		if (err) return next(err);

		const newUser = await prisma.user.create({
			data: {
				username: username,
				password: hash,
			},
		});

		req.login(newUser, (err) => {
			if (err) return next(err);

			res.redirect('/');
		});
	});
};

export default {
	getSignupPage,
	createUser,
};
