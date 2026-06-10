import fetch from 'node-fetch';

async function test() {
  const res = await fetch('https://movies.greybrain.in/api/generate-youtube-script', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: "This is a test movie review." })
  });
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text);
}
test();
