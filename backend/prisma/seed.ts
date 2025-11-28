import { PrismaClient, UserRole, MemberStatus, Prisma } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as argon2 from 'argon2';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Starting database seeding...');

    await prisma.$queryRaw(Prisma.sql`TRUNCATE TABLE "users", "members", "packages" RESTART IDENTITY CASCADE;`);

    console.log('🧹 Cleaned existing data');

    const members = await prisma.member.createManyAndReturn({
        data: [
            { name: 'John Doe', phoneNumber: '+1234567001', status: MemberStatus.approved },
            { name: 'Jane Smith', phoneNumber: '+1234567002', status: MemberStatus.approved },
            { name: 'Mike Johnson', phoneNumber: '+1234567003', status: MemberStatus.pending },
        ],
    });

    console.log(`✅ Created ${members.length} members`);

    const memberPassword = await argon2.hash('password123');
    const adminPassword = await argon2.hash('admin123');

    const users = await prisma.user.createManyAndReturn({
        data: [
            { email: 'john@example.com', passwordHash: memberPassword, role: UserRole.member, memberId: members[0].id },
            { email: 'jane@example.com', passwordHash: memberPassword, role: UserRole.member, memberId: members[1].id },
            { email: 'mike@example.com', passwordHash: memberPassword, role: UserRole.member, memberId: members[2].id },
            { email: 'admin@gymly.com', passwordHash: adminPassword, role: UserRole.admin },
        ],
    });

    console.log(`✅ Created ${users.length} users (3 members + 1 admin)`);

    const packages = await prisma.package.createManyAndReturn({
        data: [
            {
                name: 'Basic Monthly',
                description: 'Access to gym facilities during regular hours (6AM - 10PM)',
                price: 2999,
                durationDays: 30,
                isActive: true,
            },
            {
                name: 'Premium Quarterly',
                description: 'Full 24/7 access, includes group classes and personal training session',
                price: 7999,
                durationDays: 90,
                isActive: true,
            },
            {
                name: 'Annual Elite',
                description:
                    'All-inclusive membership with unlimited classes, sauna, pool access, and monthly PT sessions',
                price: 24999,
                durationDays: 365,
                isActive: true,
            },
        ],
    });

    console.log(`✅ Created ${packages.length} packages`);

    console.log('\n📋 Seed Summary:');
    console.log('─'.repeat(40));
    console.log('Members:');
    members.forEach((m) => console.log(`  • ${m.name} (${m.status})`));
    console.log('\nUsers:');
    users.forEach((u) => console.log(`  • ${u.email} [${u.role}]`));
    console.log('\nPackages:');
    packages.forEach((p) => console.log(`  • ${p.name} - $${(p.price / 100).toFixed(2)}/${p.durationDays} days`));
    console.log('─'.repeat(40));
    console.log('\n🎉 Database seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
