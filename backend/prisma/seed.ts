import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('password123', 10);

 // Clear existing data (optional - uncomment if needed)
  // await prisma.userAnswer.deleteMany();
  // await prisma.quizAttempt.deleteMany();
  // await prisma.quizQuestion.deleteMany();
  // await prisma.question.deleteMany();
  // await prisma.quiz.deleteMany();
  // await prisma.userMaterialProgress.deleteMany();
  // await prisma.studyMaterial.deleteMany();
  // await prisma.videoDownload.deleteMany();
  // await prisma.userVideoProgress.deleteMany();
  // await prisma.video.deleteMany();
  // await prisma.chapter.deleteMany();
  // await prisma.subject.deleteMany();
  // await prisma.userBatch.deleteMany();
  // await prisma.studentProfile.deleteMany();
  // await prisma.staff.deleteMany();
  // await prisma.batch.deleteMany();
  // await prisma.course.deleteMany();
  // await prisma.notification.deleteMany();
  // await prisma.leaderboard.deleteMany();
  // await prisma.user.deleteMany();

  // Create Users
  console.log('👥 Creating users...');
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      username: 'admin',
      password: hashedPassword,
      full_name: 'Admin User',
      phone_number: '+1234567890',
      role: 'ADMIN',
      email_verified: true,
      phone_verified: true,
      date_of_birth: new Date('1985-01-15'),
      gender: 'Male',
      address: '123 Admin Street',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      pincode: '600001',
    },
  });
  console.log(adminUser)
  const teacherUser = await prisma.user.create({
    data: {
      email: 'teacher@example.com',
      username: 'teacher1',
      password: hashedPassword,
      full_name: 'John Teacher',
      phone_number: '+1234567891',
      role: 'TEACHER',
      email_verified: true,
      phone_verified: true,
      date_of_birth: new Date('1980-05-20'),
      gender: 'Male',
      address: '456 Teacher Lane',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      pincode: '600002',
    },
  });

  const students = await Promise.all([
    prisma.user.create({
      data: {
        email: 'student1@example.com',
        username: 'student1',
        password: hashedPassword,
        full_name: 'Alice Student',
        phone_number: '+1234567892',
        role: 'STUDENT',
        email_verified: true,
        date_of_birth: new Date('2000-03-10'),
        gender: 'Female',
        address: '789 Student Road',
        city: 'Chennai',
        state: 'Tamil Nadu',
        country: 'India',
        pincode: '600003',
      },
    }),
    prisma.user.create({
      data: {
        email: 'student2@example.com',
        username: 'student2',
        password: hashedPassword,
        full_name: 'Bob Student',
        phone_number: '+1234567893',
        role: 'STUDENT',
        email_verified: true,
        date_of_birth: new Date('1999-07-25'),
        gender: 'Male',
        address: '321 Learning Avenue',
        city: 'Chennai',
        state: 'Tamil Nadu',
        country: 'India',
        pincode: '600004',
      },
    }),
    prisma.user.create({
      data: {
        email: 'student3@example.com',
        username: 'student3',
        password: hashedPassword,
        full_name: 'Carol Student',
        phone_number: '+1234567894',
        role: 'STUDENT',
        email_verified: true,
        date_of_birth: new Date('2001-11-12'),
        gender: 'Female',
        address: '654 Study Street',
        city: 'Chennai',
        state: 'Tamil Nadu',
        country: 'India',
        pincode: '600005',
      },
    }),
  ]);

  // Create Staff Profile
  console.log('👨‍🏫 Creating staff profile...');
  await prisma.staff.create({
    data: {
      user_id: teacherUser.user_id,
      department: 'Computer Science',
      designation: 'Senior Lecturer',
      hire_date: new Date('2020-01-15'),
      qualifications: ['M.Tech', 'PhD'],
      years_of_experience: 8,
      specialization: ['Data Structures', 'Algorithms', 'Database Systems'],
      subjects: ['Computer Science', 'Mathematics'],
      salary: 75000.00,
      bank_details: {
        bank_name: 'State Bank of India',
        account_number: '1234567890',
        ifsc_code: 'SBIN0001234'
      },
      emergency_contact: '+9876543210',
      blood_group: 'O+',
      achievements: {
        awards: ['Best Teacher Award 2023'],
        publications: 5
      },
      performance_rating: 4.8,
      office_location: 'Room 201, CS Block',
      working_hours: {
        monday: '9:00-17:00',
        tuesday: '9:00-17:00',
        wednesday: '9:00-17:00',
        thursday: '9:00-17:00',
        friday: '9:00-17:00'
      },
      leaves_remaining: 25,
    },
  });

  // Create Courses
  console.log('📚 Creating courses...');

  const fswdSubjectNames = ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Database'];
  const dsSubjectNames = ['Statistics', 'Python', 'Machine Learning', 'Data Visualization'];
  const madSubjectNames = ['React Native', 'Flutter', 'UI/UX Design'];

  const fswdSubjects = await Promise.all(
    fswdSubjectNames.map(name => prisma.subject.upsert({
      where: { name },
      update: {},
      create: { name, description: '' },
    }))
  );

  const dsSubjects = await Promise.all(
    dsSubjectNames.map(name => prisma.subject.upsert({
      where: { name },
      update: {},
      create: { name, description: '' },
    }))
  );

  const madSubjects = await Promise.all(
    madSubjectNames.map(name => prisma.subject.upsert({
      where: { name },
      update: {},
      create: { name, description: '' },
    }))
  );

  const courses = await Promise.all([
    prisma.course.create({
      data: {
        name: 'Full Stack Web Development',
        description: 'Complete course covering frontend and backend development',
        duration: '6 months',
        fees: 50000,
        status: 'ACTIVE',
        subjects: {
          connect: fswdSubjects.map(s => ({ subject_id: s.subject_id })),
        },
      },
    }),
    prisma.course.create({
      data: {
        name: 'Data Science & Analytics',
        description: 'Comprehensive data science course with practical projects',
        duration: '8 months',
        fees: 75000,
        status: 'ACTIVE',
        subjects: {
          connect: dsSubjects.map(s => ({ subject_id: s.subject_id })),
        },
      },
    }),
    prisma.course.create({
      data: {
        name: 'Mobile App Development',
        description: 'Learn to build mobile applications for iOS and Android',
        duration: '4 months',
        fees: 40000,
        status: 'DRAFT',
        subjects: {
          connect: madSubjects.map(s => ({ subject_id: s.subject_id })),
        },
      },
    }),
  ]);

  // Create Batches
  console.log('👥 Creating batches...');
  const batches = await Promise.all([
    prisma.batch.create({
      data: {
        batch_name: 'FSWD-2024-01',
        timing: '9:00 AM - 12:00 PM',
        capacity: 30,
        course_id: courses[0].course_id,
        start_date: new Date('2024-01-15'),
        end_date: new Date('2024-07-15'),
        description: 'Morning batch for Full Stack Web Development',
      },
    }),
    prisma.batch.create({
      data: {
        batch_name: 'DS-2024-01',
        timing: '2:00 PM - 6:00 PM',
        capacity: 25,
        course_id: courses[1].course_id,
        start_date: new Date('2024-02-01'),
        end_date: new Date('2024-09-30'),
        description: 'Afternoon batch for Data Science',
      },
    }),
  ]);

  // Create Student Profiles
  console.log('👨‍🎓 Creating student profiles...');
  const studentProfiles = await Promise.all([
    prisma.studentProfile.create({
      data: {
        user_id: students[0].user_id,
        adhaar_num: '123456789012',
        enrollment_number: 'ENR2024001',
        qualification: 'B.Tech Computer Science',
        guardian_name: 'John Doe',
        guardian_contact: '+9876543211',
        guardian_email: 'john.doe@example.com',
        guardian_relation: 'Father',
        mobile_number: students[0].phone_number,
        batch_id: batches[0].batch_id,
        course_id: courses[0].course_id,
        bio: 'Passionate about web development and creating user-friendly applications',
        total_score: 85,
        rank: 1,
        videos_watched: 45,
        tests_completed: 12,
        attendance_percentage: 92.5,
        emergency_contact: '+9876543211',
        blood_group: 'A+',
        achievements: {
          certificates: ['HTML/CSS Basics', 'JavaScript Fundamentals'],
          projects: ['E-commerce Website', 'Todo App']
        },
      },
    }),
    prisma.studentProfile.create({
      data: {
        user_id: students[1].user_id,
        adhaar_num: '123456789013',
        enrollment_number: 'ENR2024002',
        qualification: 'B.Sc Mathematics',
        guardian_name: 'Jane Smith',
        guardian_contact: '+9876543212',
        guardian_email: 'jane.smith@example.com',
        guardian_relation: 'Mother',
        mobile_number: students[1].phone_number,
        batch_id: batches[1].batch_id,
        course_id: courses[1].course_id,
        bio: 'Data enthusiast with strong mathematical background',
        total_score: 78,
        rank: 2,
        videos_watched: 32,
        tests_completed: 8,
        attendance_percentage: 88.0,
        emergency_contact: '+9876543212',
        blood_group: 'B+',
        achievements: {
          certificates: ['Statistics Fundamentals', 'Python Basics'],
          projects: ['Sales Analysis Dashboard', 'Customer Segmentation']
        },
      },
    }),
    prisma.studentProfile.create({
      data: {
        user_id: students[2].user_id,
        adhaar_num: '123456789014',
        enrollment_number: 'ENR2024003',
        qualification: 'BCA',
        guardian_name: 'Robert Johnson',
        guardian_contact: '+9876543213',
        guardian_email: 'robert.johnson@example.com',
        guardian_relation: 'Father',
        mobile_number: students[2].phone_number,
        batch_id: batches[0].batch_id,
        course_id: courses[0].course_id,
        bio: 'Creative problem solver interested in full-stack development',
        total_score: 82,
        rank: 3,
        videos_watched: 38,
        tests_completed: 10,
        attendance_percentage: 90.0,
        emergency_contact: '+9876543213',
        blood_group: 'O-',
        achievements: {
          certificates: ['React Basics', 'Node.js Introduction'],
          projects: ['Portfolio Website', 'Chat Application']
        },
      },
    }),
  ]);
console.log(studentProfiles)
  // Create UserBatch relationships
  console.log('🔗 Creating user-batch relationships...');
  await Promise.all([
    prisma.userBatch.create({
      data: {
        user_id: students[0].user_id,
        batch_id: batches[0].batch_id,
      },
    }),
    prisma.userBatch.create({
      data: {
        user_id: students[1].user_id,
        batch_id: batches[1].batch_id,
      },
    }),
    prisma.userBatch.create({
      data: {
        user_id: students[2].user_id,
        batch_id: batches[0].batch_id,
      },
    }),
  ]);

  // Create Subjects
  console.log('📖 Creating subjects...');
  const subjects = await Promise.all([
    prisma.subject.create({
      data: {
        name: 'JavaScript Fundamentals',
        description: 'Core JavaScript concepts and programming fundamentals',
      },
    }),
    prisma.subject.create({
      data: {
        name: 'React Development',
        description: 'Modern React development with hooks and state management',
      },
    }),
    prisma.subject.create({
      data: {
        name: 'Node.js & Backend',
        description: 'Server-side development with Node.js and Express',
      },
    }),
    prisma.subject.create({
      data: {
        name: 'Database Management',
        description: 'SQL and NoSQL database concepts and operations',
      },
    }),
    prisma.subject.create({
      data: {
        name: 'Python Programming',
        description: 'Python programming for data science and analysis',
      },
    }),
  ]);

  // Create Chapters
  console.log('📝 Creating chapters...');
  const chapters = await Promise.all([
    // JavaScript chapters
    prisma.chapter.create({
      data: {
        subject_id: subjects[0].subject_id,
        name: 'Variables and Data Types',
        description: 'Understanding JavaScript variables, data types, and scope',
        order_index: 1,
      },
    }),
    prisma.chapter.create({
      data: {
        subject_id: subjects[0].subject_id,
        name: 'Functions and Control Flow',
        description: 'JavaScript functions, conditionals, and loops',
        order_index: 2,
      },
    }),
    // React chapters
    prisma.chapter.create({
      data: {
        subject_id: subjects[1].subject_id,
        name: 'React Components',
        description: 'Creating and managing React components',
        order_index: 1,
      },
    }),
    prisma.chapter.create({
      data: {
        subject_id: subjects[1].subject_id,
        name: 'State and Props',
        description: 'Managing component state and passing props',
        order_index: 2,
      },
    }),
    // Python chapters
    prisma.chapter.create({
      data: {
        subject_id: subjects[4].subject_id,
        name: 'Python Basics',
        description: 'Python syntax, variables, and basic operations',
        order_index: 1,
      },
    }),
  ]);

  // Create Videos
  console.log('🎥 Creating videos...');
  const videos = await Promise.all([
    prisma.video.create({
      data: {
        chapter_id: chapters[0].chapter_id,
        subject_id: subjects[0].subject_id,
        course_id: courses[0].course_id,
        title: 'Introduction to JavaScript Variables',
        description: 'Learn about var, let, and const in JavaScript',
        video_url: 'https://example.com/videos/js-variables.mp4',
        thumbnail_url: 'https://example.com/thumbnails/js-variables.jpg',
        duration: '15:30',
        allow_download: true,
        download_validity_days: 7,
        is_published: true,
        views: 156,
      },
    }),
    prisma.video.create({
      data: {
        chapter_id: chapters[1].chapter_id,
        subject_id: subjects[0].subject_id,
        course_id: courses[0].course_id,
        title: 'JavaScript Functions Deep Dive',
        description: 'Understanding function declarations, expressions, and arrow functions',
        video_url: 'https://example.com/videos/js-functions.mp4',
        thumbnail_url: 'https://example.com/thumbnails/js-functions.jpg',
        duration: '22:45',
        allow_download: true,
        download_validity_days: 7,
        is_published: true,
        views: 134,
      },
    }),
    prisma.video.create({
      data: {
        chapter_id: chapters[2].chapter_id,
        subject_id: subjects[1].subject_id,
        course_id: courses[0].course_id,
        title: 'Your First React Component',
        description: 'Creating functional and class components in React',
        video_url: 'https://example.com/videos/react-components.mp4',
        thumbnail_url: 'https://example.com/thumbnails/react-components.jpg',
        duration: '18:20',
        allow_download: false,
        is_published: true,
        views: 98,
      },
    }),
    prisma.video.create({
      data: {
        subject_id: subjects[4].subject_id,
        course_id: courses[1].course_id,
        title: 'Python Installation and Setup',
        description: 'Setting up Python development environment',
        video_url: 'https://example.com/videos/python-setup.mp4',
        thumbnail_url: 'https://example.com/thumbnails/python-setup.jpg',
        duration: '12:15',
        is_motivational: true,
        is_published: true,
        views: 87,
      },
    }),
  ]);

  // Create Study Materials
  console.log('📄 Creating study materials...');
  const studyMaterials = await Promise.all([
    prisma.studyMaterial.create({
      data: {
        title: 'JavaScript ES6+ Features Guide',
        description: 'Comprehensive guide to modern JavaScript features',
        file_url: 'https://example.com/materials/js-es6-guide.pdf',
        file_type: 'PDF',
        file_name: 'js-es6-guide.pdf',
        file_size: '2.5 MB',
        subject_id: subjects[0].subject_id,
        course_id: courses[0].course_id,
        is_published: true,
        views: 89,
      },
    }),
    prisma.studyMaterial.create({
      data: {
        title: 'React Hooks Cheat Sheet',
        description: 'Quick reference for React hooks usage',
        file_url: 'https://example.com/materials/react-hooks-cheatsheet.pdf',
        file_type: 'PDF',
        file_name: 'react-hooks-cheatsheet.pdf',
        file_size: '1.2 MB',
        subject_id: subjects[1].subject_id,
        course_id: courses[0].course_id,
        is_published: true,
        views: 67,
      },
    }),
    prisma.studyMaterial.create({
      data: {
        title: 'Database Design Principles',
        description: 'Fundamentals of database design and normalization',
        file_url: 'https://example.com/materials/db-design.ppt',
        file_type: 'PPT',
        file_name: 'db-design.pptx',
        file_size: '4.1 MB',
        subject_id: subjects[3].subject_id,
        course_id: courses[0].course_id,
        is_published: true,
        views: 45,
      },
    }),
  ]);

  // Create Questions
  console.log('❓ Creating questions...');
  const questions = await Promise.all([
    prisma.question.create({
      data: {
        question_text: 'Which of the following is the correct way to declare a variable in JavaScript?',
        type: 'MCQ',
        subject_id: subjects[0].subject_id,
        topic: 'Variables',
        difficulty: 'EASY',
        options: {
          a: 'variable myVar = 5;',
          b: 'let myVar = 5;',
          c: 'v myVar = 5;',
          d: 'declare myVar = 5;'
        },
        correct_answer: 'b',
        explanation: 'The let keyword is used to declare variables in modern JavaScript.',
        marks: 1,
      },
    }),
    prisma.question.create({
      data: {
        question_text: 'What does JSX stand for?',
        type: 'MCQ',
        subject_id: subjects[1].subject_id,
        topic: 'React Basics',
        difficulty: 'MEDIUM',
        options: {
          a: 'JavaScript XML',
          b: 'Java Syntax Extension',
          c: 'JavaScript eXtension',
          d: 'JSON XML'
        },
        correct_answer: 'a',
        explanation: 'JSX stands for JavaScript XML and allows us to write HTML in React.',
        marks: 2,
      },
    }),
    prisma.question.create({
      data: {
        question_text: 'Node.js is built on which JavaScript engine?',
        type: 'MCQ',
        subject_id: subjects[2].subject_id,
        topic: 'Node.js Fundamentals',
        difficulty: 'MEDIUM',
        options: {
          a: 'SpiderMonkey',
          b: 'V8',
          c: 'Chakra',
          d: 'JavaScriptCore'
        },
        correct_answer: 'b',
        explanation: 'Node.js is built on Chrome\'s V8 JavaScript engine.',
        marks: 2,
      },
    }),
    prisma.question.create({
      data: {
        question_text: 'Python is an interpreted language.',
        type: 'TRUE_FALSE',
        subject_id: subjects[4].subject_id,
        topic: 'Python Basics',
        difficulty: 'EASY',
        correct_answer: 'true',
        explanation: 'Python is indeed an interpreted language, meaning code is executed line by line.',
        marks: 1,
      },
    }),
    prisma.question.create({
      data: {
        question_text: 'The _______ method is used to add an element to the end of an array in JavaScript.',
        type: 'FILL_IN_THE_BLANK',
        subject_id: subjects[0].subject_id,
        topic: 'Arrays',
        difficulty: 'EASY',
        correct_answer: 'push',
        explanation: 'The push() method adds one or more elements to the end of an array.',
        marks: 1,
      },
    }),
  ]);

  // Create Quizzes
  console.log('📝 Creating quizzes...');
  const quizzes = await Promise.all([
    prisma.quiz.create({
      data: {
        course_id: courses[0].course_id,
        subject_id: subjects[0].subject_id,
        batch_id: batches[0].batch_id,
        title: 'JavaScript Fundamentals Quiz',
        description: 'Test your knowledge of JavaScript basics',
        type: 'PRACTICE',
        time_limit_minutes: 30,
        total_marks: 10,
        passing_marks: 6,
        has_negative_marking: false,
        is_published: true,
        start_time: new Date('2024-01-20T09:00:00Z'),
        end_time: new Date('2024-12-31T23:59:59Z'),
      },
    }),
    prisma.quiz.create({
      data: {
        course_id: courses[0].course_id,
        subject_id: subjects[1].subject_id,
        batch_id: batches[0].batch_id,
        title: 'React Components Assessment',
        description: 'Assessment on React components and JSX',
        type: 'MOCK',
        time_limit_minutes: 45,
        total_marks: 20,
        passing_marks: 12,
        has_negative_marking: true,
        negative_marks: 0.25,
        is_published: true,
        scheduled_at: new Date('2024-02-15T14:00:00Z'),
        start_time: new Date('2024-02-15T14:00:00Z'),
        end_time: new Date('2024-02-15T16:00:00Z'),
      },
    }),
    prisma.quiz.create({
      data: {
        course_id: courses[1].course_id,
        subject_id: subjects[4].subject_id,
        batch_id: batches[1].batch_id,
        title: 'Python Basics Quiz',
        description: 'Basic Python programming concepts',
        type: 'DAILY',
        time_limit_minutes: 20,
        total_marks: 5,
        passing_marks: 3,
        is_published: true,
        start_time: new Date('2024-02-01T10:00:00Z'),
        end_time: new Date('2024-02-01T23:59:59Z'),
      },
    }),
  ]);

  // Create Quiz Questions (linking questions to quizzes)
  console.log('🔗 Creating quiz-question relationships...');
  await Promise.all([
    // JavaScript Quiz
    prisma.quizQuestion.create({
      data: {
        quiz_id: quizzes[0].quiz_id,
        question_id: questions[0].question_id,
        order: 1,
      },
    }),
    prisma.quizQuestion.create({
      data: {
        quiz_id: quizzes[0].quiz_id,
        question_id: questions[4].question_id,
        order: 2,
      },
    }),
    // React Quiz
    prisma.quizQuestion.create({
      data: {
        quiz_id: quizzes[1].quiz_id,
        question_id: questions[1].question_id,
        order: 1,
      },
    }),
    // Python Quiz
    prisma.quizQuestion.create({
      data: {
        quiz_id: quizzes[2].quiz_id,
        question_id: questions[3].question_id,
        order: 1,
      },
    }),
  ]);

  // Create User Video Progress
  console.log('📊 Creating user progress data...');
  await Promise.all([
    prisma.userVideoProgress.create({
      data: {
        user_id: students[0].user_id,
        video_id: videos[0].video_id,
        watch_progress: 100.0,
        last_watched: new Date('2024-01-25T10:30:00Z'),
      },
    }),
    prisma.userVideoProgress.create({
      data: {
        user_id: students[0].user_id,
        video_id: videos[1].video_id,
        watch_progress: 75.5,
        last_watched: new Date('2024-01-26T11:15:00Z'),
      },
    }),
    prisma.userVideoProgress.create({
      data: {
        user_id: students[1].user_id,
        video_id: videos[3].video_id,
        watch_progress: 100.0,
        last_watched: new Date('2024-02-05T15:20:00Z'),
      },
    }),
  ]);

  // Create User Material Progress
  await Promise.all([
    prisma.userMaterialProgress.create({
      data: {
        user_id: students[0].user_id,
        material_id: studyMaterials[0].material_id,
        is_completed: true,
        last_accessed: new Date('2024-01-27T14:00:00Z'),
      },
    }),
    prisma.userMaterialProgress.create({
      data: {
        user_id: students[1].user_id,
        material_id: studyMaterials[0].material_id,
        is_completed: false,
        last_accessed: new Date('2024-02-01T09:30:00Z'),
      },
    }),
  ]);

  // Create Quiz Attempts
  console.log('🎯 Creating quiz attempts...');
  const quizAttempts = await Promise.all([
    prisma.quizAttempt.create({
      data: {
        user_id: students[0].user_id,
        quiz_id: quizzes[0].quiz_id,
        answers: {
          '1': 'b',
          '2': 'push'
        },
        score: 8,
        total_questions: 2,
        correct_answers: 2,
        wrong_answers: 0,
        unattempted: 0,
        accuracy: 100.0,
        rank: 1,
        time_taken: 25,
        is_completed: true,
        submit_time: new Date('2024-01-28T10:25:00Z'),
      },
    }),
    prisma.quizAttempt.create({
      data: {
        user_id: students[2].user_id,
        quiz_id: quizzes[0].quiz_id,
        answers: {
          '1': 'a',
          '2': 'push'
        },
        score: 6,
        total_questions: 2,
        correct_answers: 1,
        wrong_answers: 1,
        unattempted: 0,
        accuracy: 50.0,
        rank: 2,
        time_taken: 28,
        is_completed: true,
        submit_time: new Date('2024-01-28T10:28:00Z'),
      },
    }),
  ]);

  // Create User Answers
  await Promise.all([
    prisma.userAnswer.create({
      data: {
        attempt_id: quizAttempts[0].attempt_id,
        question_id: questions[0].question_id,
        answer_text: 'b',
        is_correct: true,
        marks_obtained: 1.0,
      },
    }),
    prisma.userAnswer.create({
      data: {
        attempt_id: quizAttempts[0].attempt_id,
        question_id: questions[4].question_id,
        answer_text: 'push',
        is_correct: true,
        marks_obtained: 1.0,
      },
    }),
    prisma.userAnswer.create({
      data: {
        attempt_id: quizAttempts[1].attempt_id,
        question_id: questions[0].question_id,
        answer_text: 'a',
        is_correct: false,
        marks_obtained: 0.0,
      },
    }) ])

  }

  main()