import express from 'express';
import multer from 'multer';
import driveController from '../controllers/driveController';

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

export default router;
