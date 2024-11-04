import express from 'express';
import multer from 'multer';
import driveController from '../controllers/driveController';
import validateFolder from '../validators/validateFolder';

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();

router.get('/', driveController.getDrivePage);
router.get('/folder/:id', driveController.getFolder);
router.get('/file/:id', driveController.getFile);

router.post('/', upload.single('file'), driveController.uploadFile);
router.post('/:id', upload.single('file'), driveController.uploadFile);
router.post('/folder', validateFolder.FolderName, driveController.createFolder);
router.post(
	'/folder/update/:id',
	validateFolder.NewFolderName,
	driveController.renameFolder
);
router.post('/folder/delete/:id', driveController.deleteFolder);

export default router;
