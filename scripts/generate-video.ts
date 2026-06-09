import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Setup basic environment
dotenv.config({ path: '.env.local' });
dotenv.config(); // fallback

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!ELEVENLABS_API_KEY) {
  console.error("❌ Missing ELEVENLABS_API_KEY in .env.local");
  process.exit(1);
}

// Initialize Firebase Client SDK
const firebaseConfig = {
  apiKey: "AIzaSyDdWuwH2BAz9nSWVLXyC2uE8qoxl5QU3lY",
  projectId: "greybrainer",
  appId: "1:334602682761:web:a8cc82bd81a753a3392158"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getArticle(id: string) {
  console.log(`\n🔍 Fetching article ${id} from Firebase...`);
  const snap = await getDoc(doc(db, "published_research", id));
  if (!snap.exists()) {
    throw new Error(`Article ${id} not found.`);
  }
  return snap.data();
}


async function generateAudio(script: string, outputFilename: string) {
  console.log(`\n🎙️ Generating voiceover via ElevenLabs...`);
  // Voice ID for a generic professional voice (e.g. Adam)
  const VOICE_ID = "pNInz6obpgDQGcFmaJcg"; 

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'xi-api-key': ELEVENLABS_API_KEY!,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: script,
      model_id: "eleven_monolingual_v1",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75
      }
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs API Error: ${res.status} ${err}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(outputFilename, Buffer.from(arrayBuffer));
  console.log(`✅ Audio saved to ${outputFilename}`);
}

async function prepareHyperFramesProject(article: any, scriptText: string, audioFile: string) {
  console.log(`\n🎬 Assembling HyperFrames project...`);
  const projectDir = path.join(__dirname, '..', '.video-build');
  
  // Clean / Create build dir
  if (fs.existsSync(projectDir)) {
    fs.rmSync(projectDir, { recursive: true, force: true });
  }
  fs.mkdirSync(projectDir, { recursive: true });

  // 1. Copy the HTML template
  const templateHtml = fs.readFileSync(path.join(__dirname, '..', 'video-templates', 'default', 'index.html'), 'utf-8');
  
  // Replace the placeholder title with the actual movie title
  const finalHtml = templateHtml.replace('{{MOVIE_TITLE}}', article.title || 'Movie Analysis');
  fs.writeFileSync(path.join(projectDir, 'index.html'), finalHtml);

  // 2. Write the images
  let ringsPath = '';
  let morphoPath = '';
  
  if (article.images?.rings) {
    const ringsBuffer = Buffer.from(article.images.rings, 'base64');
    fs.writeFileSync(path.join(projectDir, 'rings.png'), ringsBuffer);
    ringsPath = 'rings.png';
  }

  if (article.images?.morpho) {
    const morphoBuffer = Buffer.from(article.images.morpho, 'base64');
    fs.writeFileSync(path.join(projectDir, 'morpho.png'), morphoBuffer);
    morphoPath = 'morpho.png';
  }

  // 3. Move the audio
  fs.copyFileSync(audioFile, path.join(projectDir, 'voiceover.mp3'));

  return projectDir;
}

async function renderVideo(projectDir: string) {
  console.log(`\n🚀 Rendering MP4 via HyperFrames... This will take a moment.`);
  
  // Using hyperframes CLI to render the index.html inside the project dir
  try {
    execSync('npx hyperframes render index.html --output final.mp4 --width 1920 --height 1080', {
      cwd: projectDir,
      stdio: 'inherit'
    });
    console.log(`\n🎉 Success! Video saved to ${path.join(projectDir, 'final.mp4')}`);
  } catch (error) {
    console.error("❌ Failed to render video with HyperFrames.");
    console.error(error);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const idArg = args.find(a => a.startsWith('--id='));
  if (!idArg) {
    console.error("❌ Usage: npx tsx scripts/generate-video.ts --id=<ARTICLE_ID>");
    process.exit(1);
  }

  const articleId = idArg.split('=')[1];
  
  try {
    const article = await getArticle(articleId);
    
    // Check if we have images
    if (!article.images?.rings && !article.images?.morpho) {
      console.warn("⚠️ Warning: No chart images found in this article. Visuals will be blank.");
    }

    const script = article.youtubeScript;
    if (!script) {
      console.error("❌ Error: No youtubeScript found in this article. Please generate or write one in the Hub UI first.");
      process.exit(1);
    }
    console.log(`\n--- SCRIPT PREVIEW ---\n${script}\n----------------------`);

    const tempAudio = path.join(__dirname, '..', 'temp_voiceover.mp3');
    await generateAudio(script, tempAudio);

    const projectDir = await prepareHyperFramesProject(article, script, tempAudio);
    
    // Clean up temp audio outside project dir
    if (fs.existsSync(tempAudio)) fs.unlinkSync(tempAudio);

    await renderVideo(projectDir);

    console.log(`\n✨ Pipeline complete.`);
    process.exit(0);

  } catch (error) {
    console.error("\n❌ Pipeline failed:", error);
    process.exit(1);
  }
}

main();
