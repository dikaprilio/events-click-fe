// Test getImageUrl function
import { getImageUrl } from '../src/lib/utils';

console.log('Testing getImageUrl:\n');

const testPaths = [
  'posts/080c7159-5684-41a9-a006-d5e1c9bf2ee8.jpg',
  'equipments/cl5.jpg',
  'clients/yamaha.jpg',
  'uploads/posts/test.jpg',  // Should handle uploads/ prefix
];

for (const path of testPaths) {
  const url = getImageUrl(path);
  console.log(`Input: "${path}"`);
  console.log(`Output: "${url}"`);
  console.log('');
}
