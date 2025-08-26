import fs from 'fs';

// const technologies = ["ReactJS", "ExpressJS", "JavaScript", "Docker", "NodeJS", "MongoDB", "TypeScript", "GraphQL", "Redis", "Kubernetes"];
const technologies = ["ReactJS", "Vue.js", "Angular", "Svelte", "Next.js", "Nuxt.js", "Gatsby", "Ember.js", "Backbone.js", "jQuery", "ExpressJS", "NestJS", "Koa.js", "Fastify", "Hapi.js", "Django", "Flask", "FastAPI", "Spring Boot", "Laravel", "JavaScript", "TypeScript", "Python", "Java", "C#", "Go", "Rust", "PHP", "Ruby", "Kotlin",
  "MongoDB", "PostgreSQL", "MySQL", "Redis", "Cassandra", "DynamoDB", "SQLite", "MariaDB", "CouchDB", "Neo4j",
  "AWS", "Azure", "Google Cloud", "Heroku", "Vercel", "Netlify", "DigitalOcean", "Linode", "Firebase", "Supabase",
  "Docker", "Kubernetes", "Jenkins", "GitLab CI", "GitHub Actions", "Terraform", "Ansible", "Vagrant", "Helm", "Istio",
  "GraphQL", "REST API", "gRPC", "WebSocket", "Socket.io", "Apollo", "Prisma", "Hasura", "Strapi", "Postman",
  "Jest", "Cypress", "Selenium", "Mocha", "Chai", "Puppeteer", "Playwright", "JUnit", "PyTest", "RSpec",
  "Webpack", "Vite", "Parcel", "Rollup", "Gulp", "Grunt", "Babel", "ESLint", "Prettier", "Husky", "React Native", "Flutter", "Ionic", "Xamarin", "Swift", "Objective-C", "Android Studio", "Expo", "Cordova", "NativeScript"
];
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
