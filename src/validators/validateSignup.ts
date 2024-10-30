import { body } from 'express-validator';
import prisma from '../db/client';

const validateSignup = [
	body('username')
		.trim()
		.notEmpty()
		.withMessage('Username is required.')
		.escape()
		.custom(async (value) => {
			const user = await prisma.user.findUnique({
				where: {
					username: value,
				},
			});

			if (user) {
				throw new Error('This username already exists.');
			}
		}),

	body('password').trim().notEmpty().withMessage('Password is required.'),

	body('confirm-password')
		.trim()
		.notEmpty()
		.withMessage('Confirm password is required.')
		.custom((value, { req }) => {
			return value === req.body.password;
		})
		.withMessage('Passwords do not match.'),
];

export default validateSignup;
