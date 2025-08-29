import { PrismaClient, ReservationStatus, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	await prisma.comment.deleteMany();
	await prisma.blocked.deleteMany();
	await prisma.reservation.deleteMany();
	await prisma.availability.deleteMany();
	await prisma.resource.deleteMany();
	await prisma.user.deleteMany();
	const user1 = await prisma.user.create({
		data: {
			email: "usuario1@mail.com",
			password: "senha1",
		},
	});
	const user2 = await prisma.user.create({
		data: {
			email: "usuario2@mail.com",
			password: "senha2",
			role: UserRole.ADMIN,
		},
	});
	const user3 = await prisma.user.create({
		data: {
			email: "usuario3@mail.com",
			password: "senha3",
			name: "Usuario 3",
		},
	});
	const resource1 = await prisma.resource.create({
		data: {
			ownerId: user1.id,
			name: "Recurso 1",
			description: "Descricao 1",
		},
	});
	const resource2 = await prisma.resource.create({
		data: {
			ownerId: user1.id,
			name: "Recurso 2",
			description: "Descricao 2",
		},
	});
	const resource3 = await prisma.resource.create({
		data: {
			ownerId: user2.id,
			name: "Recurso 3",
			description: "Descricao 3",
		},
	});
	const resource4 = await prisma.resource.create({
		data: {
			ownerId: user2.id,
			name: "Recurso 4",
			description: "Descricao 4",
		},
	});
	const resource5 = await prisma.resource.create({
		data: {
			ownerId: user3.id,
			name: "Recurso 5",
			description: "Descricao 5",
		},
	});
	const availability1 = await prisma.availability.create({
		data: {
			resourceId: resource1.id,
			startTime: new Date("2025-08-30T14:00:00Z"),
			endTime: new Date("2025-08-30T16:00:00Z"),
		},
	});
	const availability2 = await prisma.availability.create({
		data: {
			resourceId: resource2.id,
			startTime: new Date("2025-09-30T14:00:00Z"),
			endTime: new Date("2025-09-30T16:00:00Z"),
		},
	});
	const availability3 = await prisma.availability.create({
		data: {
			resourceId: resource3.id,
			startTime: new Date("2025-10-30T18:00:00Z"),
			endTime: new Date("2025-10-30T20:00:00Z"),
		},
	});
	const availability4 = await prisma.availability.create({
		data: {
			resourceId: resource4.id,
			startTime: new Date("2026-08-30T14:00:00Z"),
			endTime: new Date("2026-08-30T16:00:00Z"),
		},
	});
	const availability5 = await prisma.availability.create({
		data: {
			resourceId: resource5.id,
			startTime: new Date("2027-08-30T14:00:00Z"),
			endTime: new Date("2027-08-30T16:00:00Z"),
		},
	});
	const reservation1 = await prisma.reservation.create({
		data: {
			userId: user1.id,
			resourceId: resource1.id,
			startTime: new Date("2025-08-30T14:00:00Z"),
			endTime: new Date("2025-08-30T16:00:00Z"),
			status: ReservationStatus.PENDENTE,
		},
	});
	const reservation2 = await prisma.reservation.create({
		data: {
			userId: user2.id,
			resourceId: resource2.id,
			startTime: new Date("2025-09-30T14:00:00Z"),
			endTime: new Date("2025-09-30T16:00:00Z"),
			status: ReservationStatus.CONFIRMADO,
		},
	});
	const reservation3 = await prisma.reservation.create({
		data: {
			userId: user3.id,
			resourceId: resource3.id,
			startTime: new Date("2025-10-30T18:00:00Z"),
			endTime: new Date("2025-10-30T20:00:00Z"),
			status: ReservationStatus.CANCELADO,
		},
	});
	const reservation4 = await prisma.reservation.create({
		data: {
			userId: user3.id,
			resourceId: resource4.id,
			startTime: new Date("2026-08-30T14:00:00Z"),
			endTime: new Date("2026-08-30T16:00:00Z"),
			status: ReservationStatus.FINALIZADO,
		},
	});
	const reservation5 = await prisma.reservation.create({
		data: {
			userId: user3.id,
			resourceId: resource5.id,
			startTime: new Date("2027-08-30T14:00:00Z"),
			endTime: new Date("2027-08-30T16:00:00Z"),
			status: ReservationStatus.PENDENTE,
		},
	});
	const findUser1AndResources = await prisma.user.findUnique({
		where: {
			email: "usuario1@mail.com",
		},
		include: {
			resources: true,
		},
	});
	console.log(findUser1AndResources);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
