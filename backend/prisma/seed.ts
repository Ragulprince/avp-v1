
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await hash('admin123', 12);
  const admin = await prisma.user.upsert({
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
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
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
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Morning Batch',
      timing: '9:00 AM - 12:00 PM',
      capacity: 50,
      courseId: course.id
    }
  });

  // Create sample student
  const studentPassword = await hash('student123', 12);
  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      name: 'John Doe',
      password: studentPassword,
      role: 'STUDENT',
      phone: '+91-9876543211',
    }
  });

  // Create student profile
  await prisma.studentProfile.upsert({
    where: { userId: student.id },
    update: {},
    create: {
      userId: student.id,
      courseId: course.id,
      batchId: batch.id,
      address: '123 Main Street, City',
      emergencyContact: '+91-9876543212'
    }
  });

  // Create sample videos
  await prisma.video.createMany({
    data: [
      {
        title: 'Physics - Mechanics Fundamentals',
        description: 'Introduction to mechanics and motion',
        subject: 'Physics',
        topic: 'Mechanics',
        duration: '45 minutes',
        videoUrl: 'https://example.com/video1.mp4',
        courseId: course.id,
        isPublished: true
      },
      {
        title: 'Chemistry - Atomic Structure',
        description: 'Understanding atomic structure and periodic table',
        subject: 'Chemistry',
        topic: 'Atomic Structure',
        duration: '60 minutes',
        videoUrl: 'https://example.com/video2.mp4',
        courseId: course.id,
        isPublished: true
      },
      {
        title: 'Biology - Cell Structure',
        description: 'Detailed study of cell structure and functions',
        subject: 'Biology',
        topic: 'Cell Biology',
        duration: '50 minutes',
        videoUrl: 'https://example.com/video3.mp4',
        courseId: course.id,
        isPublished: true
      }
    ],
    skipDuplicates: true
  });

  // Create sample quiz
  const quiz = await prisma.quiz.create({
    data: {
      title: 'Physics Mock Test 1',
      description: 'Mock test covering basic physics concepts',
      subject: 'Physics',
      type: 'MOCK',
      duration: 180, // 3 hours
      totalMarks: 100,
      passingMarks: 40,
      negativeMarking: true,
      negativeMarks: 0.25,
      courseId: course.id,
      isPublished: true
    }
  });

  // Create sample questions
  const questions = await prisma.question.createMany({
    data: [
      {
        question: 'What is the SI unit of force?',
        type: 'MCQ',
        subject: 'Physics',
        topic: 'Units and Measurements',
        difficulty: 'EASY',
        options: ['Newton', 'Joule', 'Watt', 'Pascal'],
        correctAnswer: 'Newton',
        explanation: 'Newton is the SI unit of force, named after Sir Isaac Newton.',
        marks: 4
      },
      {
        question: 'The acceleration due to gravity on Earth is approximately:',
        type: 'MCQ',
        subject: 'Physics',
        topic: 'Gravitation',
        difficulty: 'EASY',
        options: ['9.8 m/s²', '10 m/s²', '8.9 m/s²', '11 m/s²'],
        correctAnswer: '9.8 m/s²',
        explanation: 'The standard value of acceleration due to gravity is 9.8 m/s².',
        marks: 4
      }
    ],
    skipDuplicates: true
  });

  console.log('Seed data created successfully');
  console.log(`Admin: admin@avpacademy.com / admin123`);
  console.log(`Student: student@example.com / student123`);
  console.log(`Course ID: ${course.id}`);
  console.log(`Batch ID: ${batch.id}`);
  console.log(`Quiz ID: ${quiz.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
