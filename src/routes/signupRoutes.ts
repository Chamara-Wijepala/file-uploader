import express from 'express';
import validateSignup from '../validators/validateSignup';
import checkValidationErrors from '../middleware/checkValidationErrors';
import signupControllers from '../controllers/signupControllers';

const router = express.Router();

router.get('/', signupControllers.getSignupPage);
router.post(
	'/',
	validateSignup,
	checkValidationErrors,
	signupControllers.createUser
);

export default router;
