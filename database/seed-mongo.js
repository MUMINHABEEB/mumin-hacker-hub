// MongoDB Seed Script for Portfolio
// Run via: node database/seed-mongo.js

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://muminhabeeb3_db_user:hHfdSLKPIfqQTlur@cluster0.evtxgfa.mongodb.net/portfolio?retryWrites=true&w=majority";

async function seed() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI, { dbName: 'portfolio' });
  console.log('Connected to portfolio database.');

  const db = mongoose.connection.db;

  // Projects seed
  const projects = [
    {
      title: "Hacker Hub Platform",
      description: "An advanced cybersecurity hub and portfolio platform featuring interactive tools, threat analysis dashboard, and educational resources.",
      technologies: ["React", "TypeScript", "Tailwind CSS", "MongoDB", "Node.js"],
      features: ["Interactive Terminal", "Security Blog", "Project Portfolio", "Dark Mode UI"],
      github_url: "https://github.com/MUMINHABEEB/mumin-hacker-hub",
      demo_url: "https://mumin-hacker-hub.netlify.app",
      category: "Cybersecurity",
      status: "Active",
      featured: true,
      published: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ];

  await db.collection('projects').deleteMany({});
  await db.collection('projects').insertMany(projects);
  console.log('Successfully seeded projects collection.');

  await mongoose.disconnect();
  console.log('Done!');
}

seed().catch(console.error);
