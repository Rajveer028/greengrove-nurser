// scripts/seed.js
// Seed 5 owners, 5 customers, and ~1000 plants per owner

const { PrismaClient, Role } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 2) {
	const val = Math.random() * (max - min) + min;
	return parseFloat(val.toFixed(decimals));
}

const CATEGORIES = [
	"Indoor",
	"Outdoor",
	"Succulent",
	"Flowering",
	"Herb",
	"Cactus",
	"Tree",
	"Fern",
];

async function upsertUser(email, displayName, role) {
	const existing = await prisma.user.findUnique({ where: { email } });
	const passwordHash = await bcrypt.hash("Password@123", 10);
	if (existing) return existing;
	return prisma.user.create({
		data: {
			stackUserId: crypto.randomUUID(),
			displayName,
			email,
			passwordHash,
			role,
		},
	});
}

function generatePlant(index, userId) {
	const category = CATEGORIES[randomInt(0, CATEGORIES.length - 1)];
	const baseName = ["Aloe", "Ficus", "Monstera", "Pothos", "Dracaena", "Peperomia", "Citrus", "Lavender"][randomInt(0,7)];
	const name = `${baseName} ${index}`;
	const price = randomFloat(99, 4999, 2);
	const stock = randomInt(0, 250);
	const difficulty = ["Easy", "Medium", "Hard"][randomInt(0,2)];
	return {
		name,
		description: `Healthy ${name} perfect for home and garden. Batch #${index}.`,
		category,
		stock,
		price,
		imageUrl: "/616pW-u9fxL._AC_UF1000,1000_QL80_.jpg",
		scientificName: `${baseName} scientia ${index}`,
		careInstructions: "Water when top inch of soil is dry. Provide bright indirect light.",
		wateringFrequency: ["Daily", "Weekly", "Bi-weekly", "Monthly"][randomInt(0,3)],
		sunlightRequirement: ["Low", "Medium", "High"][randomInt(0,2)],
		soilType: ["Loam", "Sandy", "Clay", "Peat"][randomInt(0,3)],
		matureSize: `${randomInt(10, 200)} cm`,
		bloomTime: ["Spring", "Summer", "Autumn", "Winter"][randomInt(0,3)],
		isIndoor: Math.random() < 0.7,
		isToxicToPets: Math.random() < 0.2,
		difficultyLevel: difficulty,
		userId,
	};
}

async function seed() {
	console.log("Seeding users...");
	const owners = [];
	for (let i = 1; i <= 5; i++) {
		owners.push(
			await upsertUser(`owner${i}@greengrove.test`, `Owner ${i}`, Role.OWNER)
		);
	}
	const customers = [];
	for (let i = 1; i <= 5; i++) {
		customers.push(
			await upsertUser(`customer${i}@greengrove.test`, `Customer ${i}`, Role.CUSTOMER)
		);
	}
	console.log("Owners:", owners.map(o => o.email));
	console.log("Customers:", customers.map(c => c.email));

	console.log("Seeding plants (~1000 per owner) if needed...");
	for (const owner of owners) {
		const existingCount = await prisma.plants.count({ where: { userId: owner.id } });
		if (existingCount < 1000) {
			const toCreate = 1000 - existingCount;
			const chunkSize = 200;
			for (let start = 0; start < toCreate; start += chunkSize) {
				const batch = [];
				for (let idx = start; idx < Math.min(start + chunkSize, toCreate); idx++) {
					batch.push(generatePlant(existingCount + idx + 1, owner.id));
				}
				await prisma.plants.createMany({ data: batch });
				console.log(`Owner ${owner.email}: inserted ${Math.min(start + chunkSize, toCreate)} / ${toCreate}`);
			}
		} else {
			console.log(`Owner ${owner.email}: already has ${existingCount} plants, skipping.`);
		}
	}

	console.log("Seeding owner customers, orders, and care schedules if missing...");
	for (const owner of owners) {
		// customers per owner
		const ownerCustomerCount = await prisma.customer.count({ where: { userId: owner.id } });
		if (ownerCustomerCount === 0) {
			const custBatch = [];
			for (let i = 1; i <= 50; i++) {
				custBatch.push({
					firstName: `Buyer${i}`,
					lastName: `Owner${owner.displayName.replace(/\s+/g,'')}`,
					email: `buyer${i}.${owner.id}@example.test`,
					phone: `+1-555-01${(i+'').padStart(2,'0')}`,
					address: `${randomInt(10,999)} Green Lane`,
					city: "Pune",
					state: "MH",
					zipCode: `4110${randomInt(0,99).toString().padStart(2,'0')}`,
					userId: owner.id,
				});
			}
			await prisma.customer.createMany({ data: custBatch });
			console.log(`Owner ${owner.email}: seeded 50 customers`);
		}

		// care schedules
		const careCount = await prisma.careSchedule.count({ where: { userId: owner.id } });
		if (careCount === 0) {
			const ownerPlants = await prisma.plants.findMany({ where: { userId: owner.id }, select: { id: true }, take: 300 });
			const careBatch = [];
			for (let i = 0; i < 100 && i < ownerPlants.length; i++) {
				const p = ownerPlants[i];
				const now = Date.now();
				careBatch.push({
					plantId: p.id,
					taskType: ["watering","fertilizing","pruning","repotting"][randomInt(0,3)],
					frequency: ["Daily","Weekly","Bi-weekly","Monthly"][randomInt(0,3)],
					lastPerformed: new Date(now - randomInt(1,20)*24*60*60*1000),
					nextDue: new Date(now + randomInt(1,14)*24*60*60*1000),
					isCompleted: Math.random() < 0.3,
					notes: "Auto-seeded schedule",
					userId: owner.id,
				});
			}
			await prisma.careSchedule.createMany({ data: careBatch });
			console.log(`Owner ${owner.email}: seeded 100 care schedules`);
		}

		// orders with items
		const orderCount = await prisma.order.count({ where: { userId: owner.id } });
		if (orderCount === 0) {
			const ownerCustomers = await prisma.customer.findMany({ where: { userId: owner.id }, select: { id: true } });
			const plantList = await prisma.plants.findMany({ where: { userId: owner.id }, select: { id: true, price: true }, take: 500 });
			for (let i = 0; i < 50; i++) {
				const cust = ownerCustomers[randomInt(0, ownerCustomers.length - 1)];
				const numItems = randomInt(1,3);
				const items = [];
				let totalAmount = 0;
				for (let k = 0; k < numItems; k++) {
					const pl = plantList[randomInt(0, plantList.length - 1)];
					const quantity = randomInt(1, 5);
					const price = Number(pl.price) || randomFloat(99, 999, 2);
					totalAmount += price * quantity;
					items.push({ plantId: pl.id, quantity, price, userId: owner.id });
				}
				const buyerUser = customers[randomInt(0, customers.length - 1)];
				await prisma.order.create({
					data: {
						orderNumber: `ORD-${owner.id.slice(0,4)}-${Date.now()}-${i}`,
						customerId: cust.id,
						status: ["Pending","Processing","Delivered"][randomInt(0,2)],
						totalAmount,
						orderDate: new Date(Date.now() - randomInt(1,60)*24*60*60*1000),
						deliveryDate: Math.random() < 0.5 ? new Date(Date.now() - randomInt(1,30)*24*60*60*1000) : null,
						notes: "Auto-seeded order",
						userId: owner.id,
						buyerUserId: buyerUser.id,
						shippingAddress: `${randomInt(10,999)} Seed Street`,
						shippingCity: "Pune",
						shippingState: "MH",
						shippingZip: `4110${randomInt(0,99).toString().padStart(2,'0')}`,
						orderItems: { create: items },
					}
				});
			}
			console.log(`Owner ${owner.email}: seeded 50 orders with items`);
		}
	}

	console.log("Done seeding.");
}

seed()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
