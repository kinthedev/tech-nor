import { prisma } from "./lib/prisma"

async function main() {
	const user = await prisma.user.create({
		data: {
			email: "alice@prisma.io",
			password: "12345",
			name: "Alice",
			address: "",
		},
	})
	console.log("Created user:", user)

	// Fetch all users with their posts
	const allUsers = await prisma.user.findMany({
		where: { email: "alice@prisma.io" },
	})
	console.log("All users:", JSON.stringify(allUsers, null, 2))
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
