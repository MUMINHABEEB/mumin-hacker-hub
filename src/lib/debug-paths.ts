// Debug file to test glob patterns
console.log('Current working directory:', process.cwd());
console.log('Import meta URL:', import.meta.url);

// Test different glob patterns
const test1 = import.meta.glob("../posts/*.md", { eager: true, query: '?raw', import: 'default' });
const test2 = import.meta.glob("./posts/*.md", { eager: true, query: '?raw', import: 'default' });
const test3 = import.meta.glob("src/posts/*.md", { eager: true, query: '?raw', import: 'default' });

console.log('Test1 (../posts/*.md):', Object.keys(test1));
console.log('Test2 (./posts/*.md):', Object.keys(test2));
console.log('Test3 (src/posts/*.md):', Object.keys(test3));

export { test1, test2, test3 };
