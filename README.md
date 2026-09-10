# Too good to be true

Where synthetic video has actually got to. Twenty-five slides for a video
team discussion, 10 September 2026, built from the
[guardian-deck-template](https://github.com/peter-guillam123) (second
edition).

The deck is built to provoke an argument, not to settle one. Its position
is that AI detection is not going to solve this: normal verification -
provenance of the person, corroboration outside the frame, and the
too-good-to-be-true test - is the method, and the tooling is a lead at
best.

## Setting the password

The deck sits behind a light password gate (`gate.js`). It is a deterrent,
not security: the slides are a static site and their text reaches the
browser either way, so treat it as a way of keeping the deck off casual
search rather than as protection. Opening `index.html` straight off disk
skips the gate entirely, so presenting locally is unaffected.

`gate.js` ships with no password set, which means it is **locked to
everyone** until you set one. Run this from the repo root, replacing the
word in quotes, and the password never leaves your machine:

```bash
read -rsp "Deck password: " P && H=$(printf %s "$P" | shasum -a 256 | cut -d" " -f1) && sed -i "" "s/const HASH = '[^']*'/const HASH = '$H'/" gate.js && unset P && git add gate.js && git commit -m "Set deck password" && git push
```

To change it later, run exactly the same command again.

**If a password that should work is rejected**, it is almost certainly the
browser rather than the password. GitHub Pages serves static files with a
ten-minute `max-age`, so a browser that loaded the deck before the password
changed keeps checking against the old hash. `index.html` now loads the gate
with a cache-buster to prevent this, but a page already sitting in the cache
will still be stale: hard-refresh with `Cmd+Shift+R`, or open a private
window. To confirm which problem you have, this compares a password against
what is actually deployed, without the password leaving your machine:

```bash
read -rsp "Password to test: " P; H=$(printf %s "$P" | shasum -a 256 | cut -d" " -f1); unset P; L=$(curl -sL "https://peter-guillam123.github.io/synthetic-video-deck/gate.js?cb=$(date +%s)" | sed -n "s/.*const HASH = '\([^']*\)'.*/\1/p"); echo; [ "$H" = "$L" ] && echo "Matches the live deck. Hard-refresh the page." || echo "Does not match. Set the password again."
```

## Running it

Open `index.html` in a browser. Arrow keys or space to advance, `R` to
reset, `G` to draw the underlying Müller-Brockmann grid. `Cmd-P` then
Save as PDF gives a one-slide-per-page export at 1920×1080; the print CSS
forces final animation states so nothing exports half-drawn.

- `index.html` — the twenty-five slides. Markup only.
- `about.html` — the public About / changelog page.
- `styles.css` — the shared Guardian design system, plus this deck's four
  new components appended at the bottom (section 40).
- `deck-stage.js` — the `<deck-stage>` web component. Untouched.
- `motion.js` — the choreography engine. One addition, below.
- `grid-overlay.js` — the grid instrument. Untouched.

## Structure

| Slides | Part | What it does |
| --- | --- | --- |
| 1–3 | Opening | Cover, the three propositions, epigraph |
| 4–9 | Milestones | Four unlocks, the dated ledger, the tells they cost us, world models, the leaderboard |
| 10–13 | Weaknesses | Live tells and dead tells, the five-fingers story, the detection scoreboard |
| 14–18 | Provenance | SynthID / C2PA / Apple compared, Apple in detail, the four holes, the AI Act |
| 19–23 | What we do | The method in two halves, the liar's dividend, six provocations |
| 24–25 | Close | Optional draft house rules, close |

**If the session runs short**, slides 9 (the leaderboard) and 18 (the AI
Act) can both go without breaking the arc. Slide 23 is the point of the
session and should never be the thing that gets cut for time.

**Slide 24** is optional and nobody asked for it: a five-line draft
verification protocol, included because a discussion that ends without
anything written down tends to just end.

## Changes to the shared kit

Three, all worth knowing about because they affect every deck built from
the template:

1. **`styles.css` — fixed the body font URL.** The template points at
   `GuardianTextEgyptian-Reg.woff2`, which returns 403. The correct
   filename is `GuardianTextEgyptian-Regular.woff2`. The regular weight of
   the body font has been silently falling back to Georgia while the bold
   and italic loaded correctly. **The Vibecoding and Board and Trust decks
   have the same line and need the same one-word change.**
2. **`motion.js` — count-ups can now hold decimals.** A new
   `data-count-dp` attribute sets the decimal places, so `92.5%` ticks up
   through decimals and lands on 92.5 rather than rounding to 93. Without
   the attribute the behaviour is exactly as before.
3. **`styles.css` — content slides now clear the folio.** `.slide-foot` is
   absolutely positioned and its rule lands exactly on the type-area
   bottom, so a full `.slide-body` (which is `flex: 1` inside the 80px
   padding) finished flush against that rule with no breathing space. Dense
   slides read as though they were bleeding off the bottom. Content slides
   now reserve a 38px band above the rule; the cover, section openers,
   epigraph and quote slides run their own vertical rhythm and are
   untouched. **This is the fix most worth porting to the other decks.**

New components appended to `styles.css` as sections 40 and 41: `.era` (the
rising milestone track), `.mstones` (the dated ledger), `.score` (the
count-up scoreboard), `.tellgrid` (live tells vs dead tells),
`.slide--caveats` (a 2×2 variant of the preshare list, four accents rather
than two), `.slide--ways-tight` (three `.way` rows plus a closing note) and
an inline `.slide a` link style, which the kit did not have.

## Sources are in the slides

Every specific example links to its source as anchor text in the running
copy: the NewsGuard study from the scoreboard subhead, Apple's newsroom
post from the Reference Image slide, the Genie 3, Marble and Atlas
announcements from the ledger's accent words, and so on. Twenty targets in
all, each checked for a 200 before it went in. The full list below is the
same set with the context spelled out.

## Sources

Every figure on a slide, in slide order.

**Part 1 — milestones**

- Veo 3 native audio (May 2025), Veo 3.1 vertical + 4K (Jan 2026), model
  comparison and the Kling 3 leaderboard position:
  [aimlapi model comparison](https://aimlapi.com/blog/best-ai-video-generators-2026-veo-3-1-kling-sora-2-seedance-more-compared),
  [llm-stats blind-vote leaderboard](https://llm-stats.com/leaderboards/best-ai-for-video-creation)
- Genie 3, 720p / 24fps / real-time / minutes of consistency:
  [Google DeepMind](https://deepmind.google/blog/genie-3-a-new-frontier-for-world-models/)
- Sora 2, the "GPT-3.5 moment", and the shutdown (app 26 April 2026, API
  24 September 2026, ~$1m/day):
  [OpenAI](https://openai.com/index/sora-2/),
  [Wikipedia](https://en.wikipedia.org/wiki/Sora_(text-to-video_model))
- Marble (Nov 2025) and the World API (Jan 2026):
  [TechCrunch](https://techcrunch.com/2025/11/12/fei-fei-lis-world-labs-speeds-up-the-world-model-race-with-marble-its-first-commercial-product/),
  [World Labs](https://www.worldlabs.ai/blog/announcing-the-world-api)
- Atlas, 1 September 2026, omni world model, a minute of camera-controlled
  1440p: [howaiworks](https://howaiworks.ai/blog/world-labs-atlas-world-model-2026)
- Duration decay past 20–25s, contact and crowd failures, text rendering,
  water and cloth: [is4.ai state of the art](https://is4.ai/blog/our-blog-1/ai-video-generation-2026-what-works-what-doesnt-340)

**Part 2 — weaknesses**

- The dead tells (fingers, ears, teeth, symmetry) and why visual forensics
  stopped working:
  [outthink](https://outthink.io/community/thought-leadership/blog/how-to-tell-if-a-video-is-ai-generated/)
- Netanyahu's proof-of-life video and the five-fingered hand, March 2026:
  [The American Prospect](https://prospect.org/2026/04/17/american-politics-inundated-with-ai-deepfakes/)
- Detection failure rates (Grok 95%, ChatGPT 92.5%, Gemini 78%
  unwatermarked; Grok 30% / ChatGPT 7.5% / Gemini 0% watermarked), and the
  Niko Felix quote:
  [NewsGuard, 22 January 2026](https://www.newsguardtech.com/special-reports/top-ai-chatbots-dont-recognize-ai-generated-videos/)
- The human 24.5% correct-identification figure (inverted to 75.5% on the
  slide) is separate research on a different task. **Read it as an order
  of magnitude, not a like-for-like.** Flagged as such in the slide's own
  method note, and that hedge should stay.

**Part 3 — provenance**

- SynthID and video. It is not still-image checking bolted onto video:
  every frame is marked, the marks are coordinated across frames to survive
  compression and frame interpolation, and watermark strength varies with
  motion (stronger in static regions, subtler in high motion):
  [Google DeepMind](https://deepmind.google/blog/watermarking-ai-generated-text-and-video-with-synthid/)
- SynthID generally: adoption by OpenAI, Nvidia, ElevenLabs and Kakao;
  30% crop + compression robustness and its limits:
  [textsight](https://www.textsight.ai/blog/google-synthid-watermarking-explained/),
  [buildmvpfast](https://www.buildmvpfast.com/blog/synthid-content-provenance-c2pa-watermarking-ai-2026)
- **C2PA video capture signing exists.** Sony was first: Alpha 1 II, Alpha
  9 III, FX3, FX30 and the PXW-Z300 camcorder from October 2025, with the
  Alpha 7R V, Alpha 7 IV and Alpha 1 following from November 2025 and the
  Alpha 7S III from 2026. It runs through Sony's Camera Authenticity
  Solution on a one-year licence, and the verification site can trim a long
  file and keep the signature valid on the extract, which is the part a
  video desk would actually use. Pixel 8, 9 and 10 gained Content
  Credentials on video captures by July 2026:
  [Sony](https://alphauniverse.com/stories/sony-launches-first-video-ready-camera-authenticity-solution-for-newsrooms/),
  [c2paviewer supported devices](https://c2paviewer.com/supported-devices)
- C2PA stills capture (Leica, Nikon, Canon EOS R1 / R5 II, Samsung) and
  TikTok joining the steering committee, 28 July 2026:
  [C2PA announcements](https://c2pa.org/news/)
- OpenAI joining the C2PA steering committee and committing to SynthID,
  19 May 2026:
  [c2paviewer](https://c2paviewer.com/articles/openai-google-c2pa-synthid-2026)
- **Apple Reference Image**, announced 9 September 2026. Sensor-level
  pixel signing, Private Cloud Compute, "like a digital negative", third
  party APIs in iOS/iPadOS/macOS 27, SynthID support later in 2026, no
  capture at launch in China or the EU, ships 18 September:
  [Apple Newsroom](https://www.apple.com/newsroom/2026/09/apple-debuts-iphone-18-pro-and-iphone-18-pro-max/),
  [MacRumors](https://www.macrumors.com/2026/09/09/apple-reference-image/)
- EU AI Act Article 50 applying from 2 August 2026, Commission guidelines
  20 July 2026, penalties to €15m or 3% of turnover:
  [artificialintelligenceact.eu](https://artificialintelligenceact.eu/transparency-rules-article-50/),
  [European Commission](https://digital-strategy.ec.europa.eu/en/policies/guidelines-ai-transparency-obligations)

**Part 4 — what we do**

- Venezuela, January 2026: AI celebration footage, Fox News presenting one
  as real in a piece it later removed, Musk reposting another, and the
  Hancock and Hobbs quotes:
  [CNBC](https://www.cnbc.com/2026/01/06/ai-generated-deepfake-videos-venezuelan-viral-us-military-maduro-misinformation.html),
  [NBC News](https://www.nbcnews.com/tech/tech-news/experts-warn-collapse-trust-online-ai-deepfakes-venezuela-rcna252472)
  *The Fox News detail comes from the CNBC piece via a search summary; the
  page itself 403s to automated fetching, so check it before repeating it
  from a stage.*
- The Ghanaian vice-presidential candidate's real video dismissed as a
  deepfake, and the other detection failures:
  [Tech Policy Press](https://www.techpolicy.press/five-real-world-failures-expose-need-for-effective-detection-of-ai-generated-media/)
- The liar's dividend, coined by Chesney and Citron in 2018, and the Trump
  White House window example:
  [Wikipedia](https://en.wikipedia.org/wiki/Liar%27s_dividend),
  [Brennan Center](https://www.brennancenter.org/our-work/research-reports/deepfakes-elections-and-shrinking-liars-dividend)
- The BBC's line on audiences never feeling misled about AI use:
  [Broadcast](https://www.broadcastnow.co.uk/production-and-post/bbc-sets-protocol-for-generative-ai-content/5200816.article)

## Changelog

### 10 September 2026 — Corrected the video claim

The deck had been asserting that the provenance systems are all "strongest
on stills" and that video is "the poor relation". That was wrong, and it
was wrong in the one area the audience knows best.

SynthID handles video properly rather than by accident: every frame is
marked, the marks are coordinated across frames to survive compression and
frame interpolation, and watermark strength varies with motion. And C2PA
video capture signing exists, which the deck had missed entirely: Sony has
been signing video in camera since October 2025 on a specific list of
bodies, under a one-year licence, with a verification site that can trim a
long file and keep the signature valid on the extract.

So the corrected proposition is narrower and more useful. Provenance for
video works; what it describes is the tool rather than the truth, and it
only ever covers those who opt in. Apple Reference Image really is
photographs only, which now reads as a fact about Apple rather than as a
fact about the whole field, and slide 16 points at Sony as the video
equivalent instead of asking an open question.

Fixed in five places: the cover, the third proposition on slide 2, the
subtitle and two of the three cards on slide 15, and the first caveat on
slide 16.

### 10 September 2026 — "Three propositions" as the headline

Slide 2's standfirst was doing two jobs and neither well. It is now a
proper slide title, which also makes slide 2 consistent with every other
content slide in the deck. Removing it left 222px of slack, so the three
columns took on the weight the standfirst had: larger type, a thicker rule
and real air between rule and text.

### 10 September 2026 — Presentation pass

Read back as though standing in front of the room and found the register
wrong in places: too conversational, and written more for the presenter
than for an audience. Rewrote the body copy throughout into presentation
register. The rule applied was that the slide carries the claim and the
presenter carries the detail, so most glosses came down to a single line.

That fixed the layout problem at the same time. The ledger, the world
models slide and the leaderboard had all been crowding the bottom rule,
and shorter copy plus the `.slide-body` clearance fix cleared all
twenty-five slides with room to spare.

Also added inline source links, so a claim can be checked from the slide
rather than from a footnote, and dropped the Veo 3.1 row from the ledger:
its point about vertical output being a commercial rather than a technical
tell is already carried by the leaderboard slide, and six rows pace better
than seven.

### 10 September 2026 — Built

Twenty-five slides, written the morning of the session. Apple's Reference
Image announcement the previous evening set the shape: it's the most
serious provenance work anyone has shipped, and Apple's is for photographs, so
it sits as the fourth beat of Part 3 rather than the headline, with the
"not a feature for us" caveat first.

Three structural decisions worth recording. Automated detection got its
own slide with four counting figures on it rather than an assertion that
detectors don't work, because the numbers are more uncomfortable than any
sentence would be. The method slide became two slides, which the overflow
forced and which turned out to be better - the ordering (people first,
tools last) is the argument, and a slide break makes it impossible to skim
past. And slide 22, on the liar's dividend, exists because every
conversation about this defaults to the fake we might publish, when the
failure happening more often is the real thing being waved away.

Slide 24 is an optional draft of five house rules. Nobody asked for it.

Also fixed the template's broken body-font URL and taught `motion.js` to
count up through decimals; both noted under "Changes to the shared kit"
above.
