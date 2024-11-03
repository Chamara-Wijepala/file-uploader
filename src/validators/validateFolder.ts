import { body } from 'express-validator';
import prisma from '../db/client';

const FolderName = [
	body('folder-name')
		.trim()
		.notEmpty()
		.withMessage('Folder name is required.')
		.custom(async (value) => {
			const folder = await prisma.folder.findUnique({
				where: {
					name: value,
				},
			});

			if (folder) {
				throw new Error('This folder already exists.');
			}
		})
		.escape(),
];

const NewFolderName = [
	body('update-name')
		.trim()
		.notEmpty()
		.withMessage('Folder name is required.')
		.escape(),
];

export default {
	FolderName,
	NewFolderName,
};
