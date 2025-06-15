
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@avpacademy.com' },
    update: {},
    create: {
      email: 'admin@avpacademy.com',
      name: 'AVP Admin',
      password: adminPassword,
      role: 'ADMIN',
      phone: '+91-9876543210'
    }
  });

  // Create sample course
  const course = await prisma.course.upsert({
    where: { id: 'course-1' },
    update: {},
    create: {
      id: 'course-1',
      name: 'NEET Preparation Course',
      description: 'Complete NEET preparation with Physics, Chemistry, and Biology',
      duration: '12 months',
      fees: 50000,
      status: 'ACTIVE',
      subjects: ['Physics', 'Chemistry', 'Biology']
    }
  });

  // Create sample batch
  const batch = await prisma.batch.upsert({
    where: { id: 'batch-1' },
    update: {},
    create: {
      id: 'batch-1',
      name: 'Morning Batch',
      timing: '9:00 AM - 12:00 PM',
      capacity: 50,
      courseId: course.id
    }
  });

  // Create sample student
  const studentPassword = await hash('student123', 12);
  await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      name: 'John Doe',
      password: studentPassword,
      role: 'STUDENT',
      phone: '+91-9876543211',
      studentProfile: {
        create: {
          courseId: course.id,
          batchId: batch.id,
          address: '123 Main Street, City',
          emergencyContact: '+91-9876543212'
        }
      }
    }
  });

  console.log('Seed data created successfully');
  console.log(`Admin: admin@avpacademy.com / admin123`);
  console.log(`Student: student@example.com / student123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
