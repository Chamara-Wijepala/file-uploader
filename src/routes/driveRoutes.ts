import express from 'express';
import multer from 'multer';
import driveController from '../controllers/driveController';
import validateFolder from '../validators/validateFolder';

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname + '-' + Date.now());
	},
});
const upload = multer({ storage });

const router = express.Router();

router.get('/', driveController.getDrivePage);
router.post('/', upload.single('file'), driveController.uploadFile);
router.post('/folder', validateFolder.FolderName, driveController.createFolder);
router.post(
	'/folder/update/:id',
	validateFolder.NewFolderName,
	driveController.renameFolder
);

export default router;
