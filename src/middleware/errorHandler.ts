import { Request, Response, NextFunction } from 'express';

type ValidationError = {
	type: string;
	value: string;
	msg: string;
	path: string;
	location: string;
};

const errorHandler = (
	err: Error | ValidationError[],
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// express-validator errors
	if (Array.isArray(err)) {
		res.status(422).send(err);
	}

	next(err);
};

export default errorHandler;
