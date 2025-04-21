export const techStackList = [
    // Programming Languages
    "JavaScript", 
    "TypeScript", 
    "Python", 
    "Java", 
    "C++", 
    "C", 
    "Ruby", 
    "PHP", 
    "Go", 
    "Rust", 
    "Swift", 
    "Kotlin", 
    "Objective-C", 
    "Dart", 
    "R", 
    "Shell", 
    "Scala", 
    "Lua", 
    "Perl", 
    "Haskell", 
    "Elixir", 

    // Frontend
    "React", 
    "Next.js", 
    "Vue.js", 
    "Angular", 
    "Svelte", 
    "HTML", 
    "CSS", 
    "Tailwind CSS", 
    "Bootstrap", 
    "Material-UI", 
    "Chakra UI", 
    "Styled Components", 
    "SASS", 
    "JQuery", 
    "Web Components",

    // Backend
    "Node.js", 
    "Express", 
    "NestJS", 
    "Django", 
    "Flask", 
    "Ruby on Rails", 
    "Spring Boot", 
    "ASP.NET Core", 
    "Laravel", 
    "FastAPI", 
    "Koa.js", 
    "Hapi.js",

    // Databases
    "MongoDB", 
    "MySQL", 
    "PostgreSQL", 
    "SQLite", 
    "OracleDB", 
    "Firebase", 
    "Redis", 
    "Cassandra", 
    "MariaDB", 
    "CouchDB", 
    "DynamoDB", 

    // Version Control
    "Git", 
    "GitHub", 
    "GitLab", 
    "Bitbucket", 
    "SVN", 

    // DevOps & Containerization
    "Docker", 
    "Kubernetes", 
    "CI/CD", 
    "Jenkins", 
    "Travis CI", 
    "CircleCI", 
    "Terraform", 
    "Ansible", 
    "Nginx", 
    "Apache", 
    "AWS", 
    "Google Cloud Platform (GCP)", 
    "Azure", 
    "Heroku", 
    "Vercel", 

    // Cloud & Storage
    "AWS S3", 
    "Cloudinary", 
    "Firebase Storage", 
    "Azure Blob Storage", 

    // API & GraphQL
    "REST API", 
    "GraphQL", 
    "Apollo Client", 
    "Apollo Server", 
    "Axios", 
    "Swagger", 
    "Postman",

    // Testing
    "Jest", 
    "Mocha", 
    "Chai", 
    "Cypress", 
    "Jasmine", 
    "Enzyme", 
    "React Testing Library", 
    "Supertest",

    // Authentication & Security
    "JWT", 
    "OAuth", 
    "Passport.js", 
    "Bcrypt", 
    "Argon2", 
    "JWT Authentication", 
    "OAuth2", 

    // Mobile Development
    "React Native", 
    "Flutter", 
    "Ionic", 
    "Xamarin", 

    // Machine Learning & AI
    "TensorFlow", 
    "Keras", 
    "PyTorch", 
    "Scikit-learn", 
    "OpenCV", 
    "NLTK", 
    "spaCy", 
    "HuggingFace Transformers", 

    // Data Science & Analytics
    "Pandas", 
    "NumPy", 
    "Matplotlib", 
    "Seaborn", 
    "SciPy", 
    "Jupyter Notebooks", 
    "Tableau", 
    "Power BI", 

    // Blockchain
    "Solidity", 
    "Ethereum", 
    "Web3.js", 
    "Truffle", 
    "Ganache", 
    "IPFS", 

    // Other
    "WebAssembly", 
    "GraphQL Subscriptions", 
    "Elasticsearch", 
    "Vim", 
    "VSCode", 
    "Sublime Text", 
    "Figma", 
    "Sketch", 
    "Adobe XD", 
    "PostCSS", 
    "CSS Grid", 
    "CSS Flexbox",
];
export function formatTimeAgo(input: string | Date): string {
    const date = typeof input === 'string' ? new Date(input) : input;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return `just now`;
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
    if (diffDay === 1) return `yesterday`;
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }); // e.g., Apr 21, 2025
}