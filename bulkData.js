import fs from 'fs';

const technologies = ["ReactJS", "ExpressJS", "JavaScript", "Docker", "NodeJS", "MongoDB", "TypeScript", "GraphQL", "Redis", "Kubernetes"];
const data = [];

const now = new Date();

for (let i = 0; i < 500; i++) {
  const tech = technologies[i % technologies.length];
  const timestamp = new Date(now.getTime() - i * 60000).toISOString(); // subtract i minutes
  data.push({
    name: tech,
    completed: Math.random() < 0.5,
    createdAt: timestamp,
    updatedAt: timestamp
  });
}

fs.writeFileSync('sampleData.json', JSON.stringify(data, null, 2));
console.log('✅ 500 records with staggered timestamps generated');
