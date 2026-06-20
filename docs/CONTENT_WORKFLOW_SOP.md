# Greybrainer Movies Content Workflow SOP

Last updated: 2026-06-20

## Live Systems

- Website: https://movies.greybrain.in
- Writer Hub: https://movies.greybrain.in/hub
- Engine: https://greybrainer-movie.netlify.app
- Medium: https://medium.com/@GreyBrainer
- LinkedIn: https://www.linkedin.com/company/greybrainer/
- X: https://x.com/Greybrainlens
- Instagram: https://www.instagram.com/greybrainlens/

## Roles

- Writer: owns daily newsletter, final editorial polish, images, SEO review, website publishing, and manual social posting.
- Jr dev: runs Greybrainer Engine analysis based on writer-provided topics and verifies engine output before handoff.
- Admin/tech owner: maintains Firebase, Netlify, R2, domain, and future automation.

## Access

Team members sign into Writer Hub with Google.

Approved Hub accounts:

- `satishskid@gmail.com` - admin
- `skids.social01@gmail.com` - editor
- `saminamishra@gmail.com` - editor
- `saminamisra@gmail.com` - editor alias

If sign-in fails, first check Firebase Authentication authorized domains and the Hub role allowlist.

## Daily Newsletter Flow

1. Writer creates the newsletter outside the Engine and outside Writer Hub.
2. Writer opens https://movies.greybrain.in/hub.
3. Writer creates a new manual draft in Hub.
4. Writer pastes the newsletter content.
5. Writer adds a cover image and any inline images.
6. Writer checks the SEO tab:
   - Search headline.
   - SEO title.
   - SEO description.
   - Verdict or short summary.
   - Tags and related article links where useful.
7. Writer previews the article.
8. Writer publishes to the website.
9. Writer opens the Social tab.
10. Writer manually copies and posts the prepared channel pack from the Hub Social tab to Medium, LinkedIn, X, Instagram, and Facebook.

The daily newsletter is intentionally writer-led. Do not run it through the Engine unless the writer specifically asks for a deep review topic to be analyzed.

## Deep Review Flow

1. Writer identifies review topics from the newsletter or editorial plan.
2. Writer gives the Jr dev a clear title/topic and any specific instruction.
3. Jr dev opens the Greybrainer Engine.
4. Jr dev runs the deep analysis.
5. Jr dev verifies that the report, three-layer rings, and Morphokinetics visuals are generated.
6. Jr dev exports/downloads the output.
7. The Engine auto-archives the review into Firebase `published_research` as a draft.
8. Writer opens Writer Hub Inbox.
9. Writer opens the new engine draft.
10. Writer edits the article into final website format.
11. Writer publishes to the website.
12. Writer manually posts the channel-specific social pack from the Hub Social tab.

## Required Deep Review Format

Every published deep review should include:

- Search-friendly headline.
- SEO title and SEO description.
- 50-word verdict.
- Who should watch.
- Three-layer Greybrainer score:
  - Story/Script.
  - Conceptualization.
  - Performance/Execution.
  - Overall.
- Morphokinetics teaser.
- Producer/director insight written in an inviting way without revealing the internal scoring model.
- FAQs.
- Related links.
- Cover image.
- Relevant inline images.
- Diagnostic visuals when available:
  - Three-Layer Concentric Rings.
  - Morphokinetics Flow.

## Image Rules

- Use R2 uploads from Writer Hub for cover and inline images.
- Engine-generated diagnostic visuals are uploaded through the Engine bridge and stored on R2 when possible.
- The public article page automatically renders diagnostic visuals if the draft includes them.
- The Assets tab in Hub can also add diagnostic visuals into the regular article visuals lane.
- Cloudflare Images is not the canonical storage system right now. It can be added later as an optimization layer in front of R2.

## What Is Manual Today

- Writer newsletter creation.
- Selection of deep review topics from the newsletter.
- Social posting to Medium, LinkedIn, X, Instagram, and Facebook.
- Final editorial judgment before publishing.

## What Is Automated Today

- Published website pages read from Firebase.
- Engine drafts appear in Writer Hub.
- Engine diagnostic images travel into Hub and public articles.
- Hub prepares a channel-specific social pack:
  - LinkedIn insight post.
  - LinkedIn carousel/PDF slide copy.
  - X post.
  - Instagram carousel caption.
  - Instagram Reel script.
  - Facebook discussion post.
  - Medium syndication note.
  - Hashtag set.
  - Image alt text.
  - UTM-tracked links.
- SEO metadata and JSON-LD are generated from article fields.
- Canonicals, Open Graph URLs, robots Host, and sitemap point to `https://movies.greybrain.in`.

## QA Checklist Before Publishing

- Title reads well for search and humans.
- Cover image is present.
- Verdict is short and clear.
- Who should watch is useful.
- Three-layer scores are present for deep reviews.
- Morphokinetics teaser is understandable without exposing internal mechanics.
- Producer/director insight is respectful and useful.
- FAQs are filled.
- Related links are added when available.
- Preview looks clean on article page.
- Social tab channel pack is ready before manual posting.

## Release Notes

Workflow hardening release on 2026-06-20:

- Movies site released at commit `7eae2c4`.
- Engine released at commit `cf3fcad`.
- R2 remains canonical asset storage.
- Cloudflare Images reviewed and deferred as a later optimization layer.
