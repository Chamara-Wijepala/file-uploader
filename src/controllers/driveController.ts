import { NextFunction, Request, Response } from 'express';
import prisma from '../db/client';

const getDrivePage = async (req: Request, res: Response) => {
	res.render('drive');
};

const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
	console.log(req.file);
	const { file } = req;

	if (!file) {
		const err = new Error('There was an error when uploading the file.');
		return next(err);
	}
	// TS thinks req.user could possibly be undefined even though it was checked
	// earlier in the custom middleware in app.ts
	if (!req.isAuthenticated()) {
		return res.redirect('/login');
	}

	try {
		await prisma.file.create({
			data: {
				name: file.filename,
				sizeBytes: file.size,
				ownerId: req.user.id,
			},
		});

		res.redirect('/drive');
	} catch (err) {
		next(err);
	}
};

export default {
	getDrivePage,
	uploadFile,
};
