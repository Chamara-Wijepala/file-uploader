import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

const checkValidationErrors = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(errors.array());
	}

	next();
};

export default checkValidationErrors;
