import { User as PrismaUser } from '@prisma/client';

declare global {
	namespace Express {
		// Required as the user object received by passport.serializeUser is of type
		// Express.User
		interface User extends PrismaUser {}
	}
}
