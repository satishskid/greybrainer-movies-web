import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, limit, query } from 'firebase/firestore';

const app = initializeApp({
  apiKey: "AIzaSyDdWuwH2BAz9nSWVLXyC2uE8qoxl5QU3lY",
  projectId: "greybrainer"
});
const db = getFirestore(app);

async function run() {
  const q = query(collection(db, "published_research"), limit(1));
  const snaps = await getDocs(q);
  snaps.forEach(doc => console.log("ID:", doc.id));
  process.exit(0);
}
run();
