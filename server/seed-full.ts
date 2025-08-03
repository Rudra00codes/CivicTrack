import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User';
import Issue from './src/models/Issue';
import Flag from './src/models/Flag';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Issue.deleteMany({});
    await Flag.deleteMany({});
    console.log('Cleared existing data');

    // Create test users
    const salt = await bcrypt.genSalt(10);
    
    const users = [
      {
        username: 'admin',
        email: 'admin@civictrack.com',
        password: await bcrypt.hash('password123', salt),
        role: 'admin',
        location: {
          type: 'Point',
          coordinates: [77.2090, 28.6139] // New Delhi coordinates
        },
        is_verified: true
      },
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', salt),
        role: 'citizen',
        location: {
          type: 'Point',
          coordinates: [77.2167, 28.6448] // Delhi coordinates
        },
        is_verified: true
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('password123', salt),
        role: 'municipal_worker',
        location: {
          type: 'Point',
          coordinates: [77.1025, 28.7041] // Delhi coordinates
        },
        is_verified: true
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log('Created test users');

    // Create test issues with correct enum values
    const issues = [
      {
        title: 'Broken Streetlight on Main Road',
        description: 'The streetlight near the bus stop has been broken for over a week, making it dangerous for pedestrians at night.',
        category: 'Street Lighting', // Updated to match frontend
        location: {
          type: 'Point',
          coordinates: [77.2090, 28.6139]
        },
        images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
        status: 'Reported',
        user: createdUsers[1]._id, // john_doe
        is_anonymous: false,
        upvotes: [createdUsers[0]._id, createdUsers[2]._id]
      },
      {
        title: 'Pothole on Highway',
        description: 'Large pothole causing traffic issues and vehicle damage on the main highway.',
        category: 'Roads and Transportation', // Updated to match frontend
        location: {
          type: 'Point',
          coordinates: [77.2167, 28.6448]
        },
        images: [],
        status: 'In Progress',
        user: createdUsers[1]._id,
        is_anonymous: false,
        upvotes: [createdUsers[0]._id, createdUsers[2]._id]
      },
      {
        title: 'Water Leakage in Park',
        description: 'Continuous water leakage from the main pipe in Central Park, wasting water and creating muddy conditions.',
        category: 'Water Supply', // This matches both frontend and backend
        location: {
          type: 'Point',
          coordinates: [77.1025, 28.7041]
        },
        images: ['https://res.cloudinary.com/demo/image/upload/sample.jpg'],
        status: 'Resolved',
        user: createdUsers[2]._id, // jane_smith
        is_anonymous: false,
        upvotes: [createdUsers[0]._id]
      },
      {
        title: 'Garbage Not Collected',
        description: 'Garbage has not been collected from residential area for 3 days, causing hygiene issues.',
        category: 'Waste Management', // Updated to match frontend
        location: {
          type: 'Point',
          coordinates: [77.1945, 28.6139]
        },
        images: [],
        status: 'Reported',
        user: createdUsers[1]._id,
        is_anonymous: false,
        upvotes: [createdUsers[0]._id, createdUsers[2]._id]
      },
      {
        title: 'Suspicious Activity in Park',
        description: 'Reports of suspicious activity in the local park during night hours, residents feeling unsafe.',
        category: 'Public Safety', // This matches both frontend and backend
        location: {
          type: 'Point',
          coordinates: [77.2300, 28.6100]
        },
        images: [],
        status: 'In Progress',
        user: createdUsers[2]._id,
        is_anonymous: true,
        upvotes: [createdUsers[1]._id]
      },
      {
        title: 'Park Maintenance Required',
        description: 'The local park needs maintenance - broken benches, overgrown grass, and damaged playground equipment.',
        category: 'Parks and Recreation', // Updated to match frontend
        location: {
          type: 'Point',
          coordinates: [77.1800, 28.6300]
        },
        images: [],
        status: 'Reported',
        user: createdUsers[1]._id,
        is_anonymous: false,
        upvotes: [createdUsers[0]._id, createdUsers[2]._id]
      }
    ];

    const createdIssues = await Issue.insertMany(issues);
    console.log('Created test issues');

    // Create test flags
    const flags = [
      {
        issue: createdIssues[0]._id,
        flagged_by: createdUsers[2]._id,
        reason: 'Spam',
        description: 'This appears to be a duplicate report',
        status: 'pending'
      },
      {
        issue: createdIssues[3]._id,
        flagged_by: createdUsers[0]._id, // admin
        reason: 'Inappropriate Content',
        description: 'Issue not related to civic matters',
        status: 'approved',
        reviewed_by: createdUsers[0]._id,
        reviewed_at: new Date(),
        review_notes: 'Flag was valid, issue removed'
      }
    ];

    await Flag.insertMany(flags);
    console.log('Created test flags');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📧 Test Credentials:');
    console.log('Admin: admin@civictrack.com / password123');
    console.log('User: john@example.com / password123');
    console.log('Municipal Worker: jane@example.com / password123');
    console.log('\n📊 Test Data Created:');
    console.log(`- ${createdUsers.length} users`);
    console.log(`- ${createdIssues.length} issues`);
    console.log(`- ${flags.length} flags`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

seedDatabase();
