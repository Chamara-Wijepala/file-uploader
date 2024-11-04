import { NextFunction, Request, Response } from 'express';
import prisma from '../db/client';
import cloudinary from '../config/cloudinary';

const getDrivePage = async (req: Request, res: Response) => {
	// TS thinks req.user could possibly be undefined even though it was checked
	// earlier in the custom middleware in app.ts
	if (!req.isAuthenticated()) {
		return res.redirect('/login');
	}

	const folders = await prisma.folder.findMany({
		where: {
			ownerId: req.user.id,
		},
		select: {
			id: true,
			name: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	const files = await prisma.file.findMany({
		where: {
			ownerId: req.user.id,
			folderId: null,
		},
		select: {
			id: true,
			name: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	res.render('drive', { folders, files });
};

const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
	const { file } = req;
	const folderId = req.params.id;

	if (!file) {
		const err = new Error('There was an error when uploading the file.');
		return next(err);
	}
	// TS thinks req.user could possibly be undefined even though it was checked
	// earlier in the custom middleware in app.ts
	if (!req.isAuthenticated()) {
		return res.redirect('/login');
	}

	// Convert buffer to base64
	const b64 = Buffer.from(file.buffer).toString('base64');
	const dataURI = 'data:' + file.mimetype + ';base64,' + b64;

	try {
		const result = await cloudinary.uploader.upload(dataURI, {
			folder: 'uploads',
			resource_type: 'auto',
		});

		await prisma.file.create({
			data: {
				name: file.originalname,
				url: result.secure_url,
				sizeBytes: file.size,
				ownerId: req.user.id,
				folderId,
			},
		});

		folderId
			? res.redirect(`/drive/folder/${folderId}`)
			: res.redirect('/drive');
	} catch (err) {
		next(err);
	}
};

const createFolder = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const folderName = req.body['folder-name'];

	// TS thinks req.user could possibly be undefined even though it was checked
	// earlier in the custom middleware in app.ts
	if (!req.isAuthenticated()) {
		return res.redirect('/login');
	}

	try {
		await prisma.folder.create({
			data: {
				name: folderName,
				ownerId: req.user.id,
			},
		});

		res.redirect('/drive');
	} catch (err) {
		next(err);
	}
};

const getFolder = async (req: Request, res: Response, next: NextFunction) => {
	const folderId = req.params.id;

	if (!req.isAuthenticated()) {
		return res.redirect('/login');
	}

	try {
		const folder = await prisma.folder.findUnique({
			where: {
				id: folderId,
			},
		});

		const files = await prisma.file.findMany({
			where: {
				ownerId: req.user.id,
				folderId,
			},
			select: {
				id: true,
				name: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		res.render('folder-page', { folder, files });
	} catch (err) {
		next(err);
	}
};

const renameFolder = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const newName = req.body['update-name'];
	const folderId = req.params.id;

	try {
		await prisma.folder.update({
			where: {
				id: folderId,
			},
			data: {
				name: newName,
			},
		});

		res.redirect('/drive');
	} catch (err) {
		next(err);
	}
};

const deleteFolder = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const folderId = req.params.id;

	try {
		await prisma.folder.delete({
			where: {
				id: folderId,
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
	createFolder,
	getFolder,
	renameFolder,
	deleteFolder,
};
