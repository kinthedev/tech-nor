import { PrismaClient } from "@prisma/client/extension"

const prisma = new PrismaClient()

interface User {
	email: string
	password: string
}

const authRepository = async (email: string): Promise<User> => {
	const user = await prisma.user.findUnique({
		where: { email: `$email` },
	})
	return user
}
