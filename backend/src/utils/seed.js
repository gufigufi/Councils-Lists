import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create default admin user
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123';

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { username }
    });

    if (existingAdmin) {
        console.log('✅ Admin user already exists');
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        });

        console.log(`✅ Created admin user: ${username}`);
        console.log(`🔑 Password: ${password}`);
        console.log('⚠️  Please change the default password in production!');
    }

    // Optional: Add sample councils
    const councilCount = await prisma.council.count();

    if (councilCount === 0) {
        console.log('📍 Adding sample councils...');

        await prisma.council.createMany({
            data: [
                {
                    purchaseDate: new Date('2024-01-15'),
                    endDate: new Date('2024-12-31'),
                    name: 'John Doe',
                    email: 'john@example.com',
                    address: '1600 Amphitheatre Parkway',
                    zipCode: '94043',
                    state: 'CA',
                    latitude: 37.4220,
                    longitude: -122.0841
                },
                {
                    purchaseDate: new Date('2024-02-01'),
                    endDate: new Date('2024-12-31'),
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    address: '1 Apple Park Way',
                    zipCode: '95014',
                    state: 'CA',
                    latitude: 37.3349,
                    longitude: -122.0090
                },
                {
                    purchaseDate: new Date('2024-03-10'),
                    endDate: new Date('2024-12-31'),
                    name: 'Bob Johnson',
                    email: 'bob@example.com',
                    address: 'Times Square',
                    zipCode: '10036',
                    state: 'NY',
                    latitude: 40.7580,
                    longitude: -73.9855
                }
            ]
        });

        console.log('✅ Sample councils added');
    } else {
        console.log(`✅ Database already contains ${councilCount} councils`);
    }

    console.log('🎉 Seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
