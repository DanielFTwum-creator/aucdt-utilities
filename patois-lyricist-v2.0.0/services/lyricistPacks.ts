// Lyricist v1 — data-driven genre-pack model (TUC-ICT-SRS-2026-017).
// The generation engine (services/geminiService.ts) is genre-agnostic: it owns the
// shared 6R scaffolding, self-audit, two-pass critique and cross-song memory. All the
// per-culture content lives here as swappable packs, so adding a genre is a data-only
// change. Personas are framed as ARCHETYPE + LINEAGE ("in the tradition of ..."),
// never impersonation of a named artist.
//
// v1.0 ships four flagship packs authored to depth (Reggae/Patois ported, Highlife,
// Afrobeats, Ghanaian Gospel). v1.1 will add Hiplife, Amapiano, Hip-Hop and Pop as
// additional GenrePack objects with no engine change.

export interface Persona {
  id: string;
  /** Selectable archetype label, e.g. "The Sweet Balladeer". */
  label: string;
  /** Lineage line woven into the prompt, e.g. "in the Highlife tradition of Daddy Lumba". */
  lineage: string;
  /** Vocal / method-acting direction for this archetype. */
  direction: string;
}

export interface GenrePack {
  id: string;
  label: string;
  /** "You are a ___ producer ..." — the opening framing. */
  producerFraming: string;
  /** One-line SCENE cue for the track brief. */
  sceneFraming: string;
  /** R1 anti-cliché firewall — phrases that read as touristy/stereotyped for this idiom. */
  bannedPhrases: string[];
  /** R2 regional reality — a random subset is drawn per call. */
  regionalPlaces: string[];
  regionalItems: string[];
  /** R3 rotating sensory registers (domain key -> guidance block). */
  metaphorDomains: Record<string, string>;
  /** R4 flow/rhythm law for the idiom. */
  rhythmRules: string;
  /** R5 performance direction + alias examples. */
  stageRules: string;
  /** R6 hook guidance (short per-genre note; the shared engine adds the crowd-test rule). */
  hookNote: string;
  /** Lexicon / slang / idioms block. */
  lexicon: string;
  /** Diction / grammar notes for the idiom. */
  grammar: string;
  /** Culturally-grounded proverbs — a random subset is offered per call, exactly one to be woven in. */
  proverbs: string[];
  personas: Persona[];
}

export interface LanguagePack {
  id: string;
  label: string;
  dictionGuidance: string;
}

// ════════════════════════════════════════════════════════════════════════════
// REGGAE / DANCEHALL (Patois) — ported from the original engine
// ════════════════════════════════════════════════════════════════════════════
const REGGAE: GenrePack = {
  id: 'reggae',
  label: 'Reggae / Dancehall (Patois)',
  producerFraming:
    `You are a Grammy-winning Reggae Producer and Screenwriter (The "Teacha"). Your job is not just to write lyrics — script a sonic experience. We are filming a movie about Kingston nightlife; write the hit song for the climax scene.`,
  sceneFraming: `SCENE: High-stakes recording session, Kingston. Night.`,
  bannedPhrases: [
    '"Yeah mon"', '"One Love" (as filler)', '"Irie" (generic)', '"Jammin"',
    '"Island vibes"', '"Feeling irie"', '"Everything is alright"', '"No worries mon"',
    '"time longer dan rope"', '"zinc fence"',
  ],
  regionalPlaces: [
    'Half Way Tree', 'Papine', 'Portmore Causeway', 'Red Hills Road', 'Tivoli Gardens',
    'Jungle', 'St. Thomas', 'August Town', 'Seaview Gardens', 'Spanish Town',
    'Cross Roads', 'Trench Town', 'Rae Town', 'Vineyard Town',
  ],
  regionalItems: [
    'Coaster bus', 'Honda Fit', 'Route taxi', 'Magnum', 'Box food', 'Zinc fence',
    'Craven A', 'Supligen', 'Digicel top-up card', 'Corned beef tin', 'Bag juice',
    'Nine-night gathering',
  ],
  metaphorDomains: {
    urban_decay: `✗ WEAK: "It was very hot." ✓ STRONG: "Sun hot like zinc roof in August — di road a shimmer."
✗ WEAK: "I haven't eaten." ✓ STRONG: "Belly a growl like duppy inna empty house."
SOUND CUES: (Lighter flicks), (Bass drop), (Crowd a bawl), (Selector rewind).`,
    biblical_spiritual: `✗ WEAK: "It was very hot." ✓ STRONG: "Sun beat down like judgment pon di wicked."
✗ WEAK: "I haven't eaten." ✓ STRONG: "Spirit hungry like desert forty days an' night."
SOUND CUES: (Chalice bubbles), (Nyabinghi drum), (Chant rise up), (Psalm whispered low).`,
    marine_coastal: `✗ WEAK: "It was very hot." ✓ STRONG: "Sun bun down like tar pon di jetty plank."
✗ WEAK: "I haven't eaten." ✓ STRONG: "Belly hollow like conch shell washed up dry."
SOUND CUES: (Waves a lash rock), (Fish net a drag), (Gull a screech), (Boat engine sputter).`,
  },
  rhythmRules: `RHYTHM LAW — the offbeat chop lives on the upstroke.
✗ FORBIDDEN (AABB tourist flow): "Come to Jamaica, the island is bright / Feel the warm sunshine from morning to night".
✓ REQUIRED (syncopated, staccato / long-run alternation): "Mi lef di yard — (Tires screech) — six a clock sharp. / Red Hills Road stretch out like a scar pon di face of di morning."
Mix short staccato lines (3–5 words) with long melodic runs (10–15 words). Break the line. Breathe. Break again.`,
  stageRules: `Minimum 5 [Stage Direction] blocks per song (e.g. [Voice drops to gravel], [DJ spins the selector back], [Sips from chalice], [Engineer turns up the reverb]).
For any [Guitar Solo], describe virtuosic electric playing ([Fingers flying, wah-wah pedal dancing]).
Do NOT use a real artist's name. Invent a DJ alias: "Rankin' Dagger", "Empress Volta", "General Blaze", "Sister Onyx". Commit to the persona fully.`,
  hookNote: `The chorus is the reason the crowd paid entry. Repeatably singable, 2–4 lines, one central image; repeat the anchor phrase, vary the surrounding melody.`,
  lexicon: `NICHE SLANG: "Duppy" (ghost/threat), "Pagans" (haters), "Badmind" (envious), "Choppa" (hustler), "Gyalist" (ladies man), "Dan" (boss), "Bredrin" (brother), "Gully" (street).
IYARIC: "I and I" (we/God in all), "Ital" (pure), "Zion" (paradise), "Babylon" (corrupt system), "Livity" (righteous life), "Chalice" (pipe), "Fyah" (fire).
IDIOMS: "Deh pon a mission", "Shell down", "Run the place", "Lick a shot", "Gwaan bad", "Tun up".`,
  grammar: `- No "is": "She nice" not "She is nice". - Plural "Dem": "Di man dem". - Pronouns: "Wi", "Unnu", "Mi", "Im".
- Ad-libs: (Brap! Brap!), (A woi!), (Jah know!), (Pull up!), (Zeen!).`,
  proverbs: [
    'Wha sweet nanny goat a go run him belly.', 'Every hoe have dem stick a bush.',
    'Sorry fi mawga dog, him tun round bite yuh.', 'New broom sweep clean, but old broom know di corner.',
    'Trouble nuh set like rain.', 'One one coco full basket.', 'Coward man keep sound bone.',
    'Puss and dog nuh have di same luck.',
  ],
  personas: [
    { id: 'prophet', label: 'The Prophet', lineage: 'in the roots-reggae tradition of Bob Marley', direction: 'Redemptive, unifying, prophetic. Speaks to the sufferer and the system in one breath.' },
    { id: 'fire-chanter', label: 'The Fire Chanter', lineage: 'in the tradition of Burning Spear', direction: 'Deep, meditative, Rastafari fire. Long incantatory phrasing, historical memory.' },
    { id: 'deejay-don', label: 'The Deejay Don', lineage: 'in the dancehall tradition of Buju Banton', direction: 'Gruff, commanding, street authority. Punchlines land like gun salutes.' },
    { id: 'new-roots', label: 'The New Roots', lineage: 'in the contemporary tradition of Chronixx', direction: 'Youthful, conscious, melodic. Bridges old-roots gravity with a modern glide.' },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// HIGHLIFE — Ghana (Akan / Ga guitar-band & dance-band highlife)
// ════════════════════════════════════════════════════════════════════════════
const HIGHLIFE: GenrePack = {
  id: 'highlife',
  label: 'Highlife',
  producerFraming:
    `You are a master Highlife bandleader and producer in the lineage of the Ghanaian guitar-band and dance-band tradition. Script a song with the warmth of palm-wine guitar, horn stabs and talking-drum conversation — music that carries wisdom to the dancefloor.`,
  sceneFraming: `SCENE: A packed dance-band night in Accra/Kumasi — horns warming, the guitarist teasing the riff, elders and youth on the same floor.`,
  bannedPhrases: [
    '"Africa unite" (as filler)', '"motherland vibes"', '"tribal rhythm"', '"jungle beat"',
    '"exotic"', '"safari"', '"the beat of Africa"',
  ],
  regionalPlaces: [
    'Kejetia', 'Makola', 'Osu', 'Kaneshie', 'Kumasi', 'Cape Coast Castle', 'Labadi Beach',
    'Adum', 'Circle', 'Tema Station', 'Manhyia', 'Jamestown', 'Kwame Nkrumah Circle',
  ],
  regionalItems: [
    'trotro', 'palm wine', 'kelewele', 'kente cloth', 'apateshie', 'fufu and light soup',
    'talking drum', 'sekere', 'waakye', 'adinkra symbol', 'chop bar', 'GTP wax print',
  ],
  metaphorDomains: {
    palm_wine_grove: `✗ WEAK: "Life is hard." ✓ STRONG: "Life ferment slow like palm wine — bitter first, then it sing."
✗ WEAK: "She left me." ✓ STRONG: "She waak away like the last trotro — I stand for Circle, hand empty."
SOUND CUES: (Palm-wine guitar rings), (Bottle-and-spoon clink), (Elder clears throat), (Sekere shakes).`,
    market_town: `✗ WEAK: "I am tired." ✓ STRONG: "Tired like Makola trader wey the sun no gree cool."
✗ WEAK: "Money finished." ✓ STRONG: "Pocket dry like harmattan riverbed — dust for where water used dey."
SOUND CUES: (Trotro mate calls "Circle-Circle"), (Coins on a tray), (Horn stab), (Market bell).`,
    ancestral_courtyard: `✗ WEAK: "Remember the past." ✓ STRONG: "Sankofa — the bird turn him neck, pick the egg wey drop for yesterday."
✗ WEAK: "Family matters." ✓ STRONG: "Blood thick like the fufu wey pound for one mortar, plenty hands."
SOUND CUES: (Talking drum answers), (Libation poured), (Ancestor named), (Kete drum roll).`,
  },
  rhythmRules: `RHYTHM LAW — Highlife breathes in a rolling 4/4 with the guitar on the offbeat and horns answering the voice.
✓ Let the guitar "talk" back to the line; leave a bar for the band to reply. Alternate a sung, proverb-weighted line with a short danceable refrain.
Avoid rigid AABB nursery rhyme. The groove is conversational, not marched.`,
  stageRules: `Minimum 4 [Stage Direction] blocks (e.g. [Guitarist teases the riff], [Horns answer], [Talking drum converses], [Elder nods on the dancefloor]).
Do NOT use a real artist's name — invent a bandleader alias ("Kofi Mensah & the Sunset Band", "Ama Serwaa", "Nana Kwaku Bonsam of the strings").
Highlife is warm and communal even when it grieves: keep dignity in the delivery.`,
  hookNote: `The refrain should be a proverb-flavoured phrase the whole floor can sing — call it (Chorus) — with a call-and-response feel between voice and band.`,
  lexicon: `PIDGIN/TWI FLAVOUR (use lightly, meaningfully): "chaley" (friend), "ei!" (surprise), "saa?" (is that so), "medaase" (thank you), "aane" (yes), "yoo" (okay), "abeg" (please), "wahala" (trouble).
IMAGERY: Sankofa (return and fetch it), Ananse (the trickster spider), the linguist's staff, the talking drum as messenger.`,
  grammar: `Blend clear English with light Ghanaian-Pidgin and occasional Twi/Ga interjections — never a wall of untranslated text. Keep it singable and warm; wisdom over slang.`,
  proverbs: [
    'Se wo were fi na wosankofa a yenkyi — it is not taboo to return for what you forgot.',
    'Obi nkyere abofra Nyame — no one shows a child the Supreme Being; some truths are known.',
    'Tiri nko agyina — one head does not hold a council; seek counsel.',
    'Praye, wote baako a, ebu; woka bom a, emmu — a broom straw alone breaks; bound together it holds.',
    'Nsa baako nkura adesoa — one hand cannot lift the load.',
    'Aboa bi bekawo a, na ofiri wo ntoma mu — the insect that bites you is in your own cloth.',
  ],
  personas: [
    { id: 'originator', label: 'The Originator', lineage: 'in the dance-band Highlife tradition of E.T. Mensah', direction: 'Elegant, big-band swing, statesmanlike. The founding-father poise — horns and horns and courtesy.' },
    { id: 'sweet-balladeer', label: 'The Sweet Balladeer', lineage: 'in the Highlife tradition of Daddy Lumba', direction: 'Tender, aching, romantic and philosophical. Melody that makes the dancefloor sigh and sway.' },
    { id: 'elder', label: 'The Elder', lineage: 'in the tradition of Amakye Dede', direction: 'Weathered, soulful, proverb-heavy. The voice of hard-won experience, gravel and grace.' },
    { id: 'simigwa-man', label: 'The Simigwa Man', lineage: 'in the tradition of Gyedu-Blay Ambolley', direction: 'Playful, funky, rap-before-rap cadence. Witty street-poetry over a strutting groove.' },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// AFROBEATS — pan-African / Lagos-Accra corridor (Fela's Afrobeat -> modern Afrobeats)
// ════════════════════════════════════════════════════════════════════════════
const AFROBEATS: GenrePack = {
  id: 'afrobeats',
  label: 'Afrobeats',
  producerFraming:
    `You are a hit Afrobeats producer working the Lagos–Accra corridor, rooted in Fela's Afrobeat conscience and fluent in the modern global sound. Script a track that grooves the body and carries a sting of truth under the sweetness.`,
  sceneFraming: `SCENE: Detty December, the Lagos–Accra corridor. The log drum of the diaspora is home; the dancefloor is full and the streets are listening.`,
  bannedPhrases: [
    '"Africa to the world" (as filler)', '"vibes and inshallah" (as cliché)', '"jungle"',
    '"tribal"', '"exotic queen"', '"motherland calling"', '"the rhythm is in my blood"',
  ],
  regionalPlaces: [
    'Lekki', 'Surulere', 'Balogun Market', 'Oshodi', 'Accra', 'Osu', 'East Legon',
    'Ikeja', 'Victoria Island', 'Labone', 'Ojuelegba', 'Tema',
  ],
  regionalItems: [
    'okada', 'danfo', 'jollof rice', 'agbada', 'suya', 'shaku shaku', 'Gulder',
    'keke napep', 'ankara', 'pepper soup', 'Alomo', 'small-small',
  ],
  metaphorDomains: {
    street_hustle: `✗ WEAK: "Life is tough." ✓ STRONG: "Life dey hustle me like Oshodi at rush hour — na who fast dey chop."
✗ WEAK: "I made it." ✓ STRONG: "From danfo conductor money to agbada wey sweep the floor."
SOUND CUES: (Okada horn weaves), (Log drum knocks), (Market haggling), (Gen-set hums).`,
    love_and_shine: `✗ WEAK: "She is beautiful." ✓ STRONG: "She shine pass the jewellery for Balogun — I no fit look straight."
✗ WEAK: "I miss you." ✓ STRONG: "My phone dey empty like danfo wey the mate no full — come back, my dear."
SOUND CUES: (Shaker rides the pocket), (Auto-tune glides), (Bottle pops), (Crowd sings back).`,
    conscious_fire: `✗ WEAK: "The leaders are corrupt." ✓ STRONG: "Suffering and smiling — dem chop the jollof, we chop the smoke."
✗ WEAK: "We must rise." ✓ STRONG: "Zombie no go turn unless dem tell am — but the street don wake."
SOUND CUES: (Saxophone bites), (Call-and-response chorus), (Kalabash rattle), (Chant rises).`,
  },
  rhythmRules: `RHYTHM LAW — Afrobeats rides a syncopated log-drum pocket; the vocal floats, slides and repeats catchy short phrases.
✓ Melody and groove first: earworm refrains, playful pidgin, space in the pocket. A little Fela-conscience under the sweetness earns its keep.
Avoid stiff bar-for-bar rhyme; let phrases swing lazily behind the beat.`,
  stageRules: `Minimum 4 [Stage Direction] blocks (e.g. [Log drum drops], [Sax answers Fela-style], [Auto-tune glide], [Crowd sings the response]).
Do NOT use a real artist's name — invent a stage alias ("Baba Groove", "Ama Diaspora", "General Yanos").
Sweetness on top, truth underneath — the best Afrobeats smiles and stings.`,
  hookNote: `A short, sticky, sing-back refrain — call it (Chorus) — built on one repeatable phrase and a lot of pocket. It should survive with no instrument but a clap.`,
  lexicon: `PIDGIN CORE: "no wahala" (no trouble), "abi?" (right?), "chop" (eat/enjoy/embezzle), "gbese/gbedu" (money/big deal), "japa" (flee/emigrate), "soft life", "small-small", "sabi" (know), "ginger" (energise), "wahala".
FELA MEMORY: "suffering and smiling", "zombie", "colomentality", "shakara".`,
  grammar: `Write in warm West-African Pidgin English with light Yoruba/Twi seasoning; keep it globally singable. Repetition of the sweet phrase is a feature, not a bug.`,
  proverbs: [
    'Monkey no fine but him mama like am — worth is not the market\'s to decide.',
    'When the music changes, the dance changes too.',
    'A single bracelet does not jingle — we rise together.',
    'The river that forgets its source will dry up.',
    'No matter how hot your anger, it cannot cook yam.',
    'Wetin dey worry blind man, na wetin dey worry the one wey lead am.',
  ],
  personas: [
    { id: 'pioneer', label: 'The Pioneer', lineage: 'in the Afrobeat conscience of Fela Kuti', direction: 'Political, brass-driven, unflinching. Long grooves, call-and-response, "suffering and smiling" truth.' },
    { id: 'griot', label: 'The Griot', lineage: 'in the tradition of Burna Boy', direction: 'Swaggering yet rooted; diaspora storyteller who braids grievance and celebration.' },
    { id: 'melodist', label: 'The Melodist', lineage: 'in the tradition of Wizkid', direction: 'Effortless, breezy, pocket-perfect. Understated melody, maximum vibe, minimal words.' },
    { id: 'queen-mother', label: 'The Queen Mother', lineage: 'in the pan-African tradition of Angélique Kidjo', direction: 'Regal, multilingual, ancestral. Power and grace, chant and choir behind the lead.' },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// GHANAIAN GOSPEL — worship & praise (reverent register)
// ════════════════════════════════════════════════════════════════════════════
const GOSPEL: GenrePack = {
  id: 'gospel',
  label: 'Ghanaian Gospel',
  producerFraming:
    `You are a Ghanaian Gospel music director shaping worship that lifts a congregation — highlife-inflected praise and tender worship, rooted in scripture and Akan spirituality. Write to edify, not to boast; the star is the message, not the singer.`,
  sceneFraming: `SCENE: A full church at praise-and-worship — the choir robed, the keyboardist modulating, hands lifting across the auditorium.`,
  bannedPhrases: [
    '"blessed and highly favoured" (as filler)', '"God is good all the time" (as filler)',
    '"clichéd hallelujah"', '"prosperity name-drop"', '"empty repetition"',
  ],
  regionalPlaces: [
    'the sanctuary', 'the altar', 'the crusade ground', 'the prayer camp', 'the choir stand',
    'the village chapel', 'the all-night vigil', 'Accra Sports Stadium crusade',
  ],
  regionalItems: [
    'the hymn book', 'the talking drum in praise', 'the offering basket', 'anointing oil',
    'the choir robe', 'the keyboard modulation', 'the tambourine', 'kente sash',
  ],
  metaphorDomains: {
    deliverance: `✗ WEAK: "God helped me." ✓ STRONG: "I was Kejetia at midnight — no trotro, no light — then Mercy find me a way."
✗ WEAK: "I was sad." ✓ STRONG: "My night was harmattan-long, but Morning has a Name I can call."
SOUND CUES: (Choir swells), (Organ rises), (Congregation answers "Amen"), (Tambourine lifts).`,
    covenant_gratitude: `✗ WEAK: "Thank you God." ✓ STRONG: "Ebenezer — this far the Hand has carried; I pour libation of praise."
✗ WEAK: "You are great." ✓ STRONG: "Bigger than Kilimanjaro, gentler than the palm-wine evening breeze."
SOUND CUES: (Key modulation up), (Praise break tempo), (Clapping in 6/8), (Ululation).`,
    quiet_worship: `✗ WEAK: "I love you Lord." ✓ STRONG: "In the still, I hear You — softer than dawn on the Volta water."
✗ WEAK: "I trust You." ✓ STRONG: "I lay my burden like a headload set down at the compound gate."
SOUND CUES: (Single piano note held), (Whispered adoration), (Strings breathe), (Silence honoured).`,
  },
  rhythmRules: `RHYTHM LAW — move between two modes: a joyful highlife/6-8 praise groove (call-and-response, danceable) and a tender worship ballad (spacious, reverent).
✓ Let the congregation have a phrase to sing back. Reverence over flash; a modulation can carry more than a run.
Avoid nursery AABB; keep the language dignified and scripturally literate.`,
  stageRules: `Minimum 4 [Stage Direction] blocks (e.g. [Choir answers], [Key modulates up], [Congregation lifts hands], [Praise break tempo], [Soft, eyes closed]).
No boasting and no real-artist name-drop; the worshipper is a vessel, not a celebrity. Keep the delivery humble and sincere.`,
  hookNote: `A congregational refrain — call it (Chorus) — simple, scriptural, singable by a whole auditorium on first hearing; repeatable in call-and-response.`,
  lexicon: `WORSHIP FLAVOUR: "Awurade" (Lord, Twi), "Nyame" (God), "Onyankopɔn" (Supreme God), "Ebenezer" (thus far the Lord has helped), "medaase" (thank you), "Yesu" (Jesus).
SCRIPTURE-ROOTED IMAGERY: the potter and clay, the rock and shelter, the shepherd, first-fruits, the anchor, morning after weeping.`,
  grammar: `Reverent, clear English with Twi worship-words woven in (translate in-line where needed). No street slang, no vanity; sincerity is the whole aesthetic.`,
  proverbs: [
    'Obi nkyere abofra Nyame — no one shows a child God; He reveals Himself.',
    'Nyame adom nti — by the grace of God, nothing is impossible.',
    'Onyame na ɔma yɛ didi — it is God who provides the meal.',
    'Wope asem a, wobɔ mpae — if you want a matter settled, you pray.',
    'Adiyifoɔ nkasa hunu — the prophet does not speak in vain.',
  ],
  personas: [
    { id: 'praise-leaders', label: 'The Praise Leaders', lineage: 'in the tradition of the Tagoe Sisters', direction: 'Exuberant highlife praise, tight harmony, call-and-response joy that fills a stadium.' },
    { id: 'worshipper', label: 'The Worshipper', lineage: 'in the tradition of Cwesi Oteng', direction: 'Contemporary, intimate, testimony-driven worship — tender verses building to surrender.' },
    { id: 'anthemist', label: 'The Anthemist', lineage: 'in the tradition of Diana Hamilton', direction: 'Rich, hymn-like gratitude; the "Ebenezer" register — dignified, thankful, congregational.' },
  ],
};

// ─── Language packs ──────────────────────────────────────────────────────────
export const LANGUAGE_PACKS: LanguagePack[] = [
  { id: 'en', label: 'English', dictionGuidance: `Primary language: English (West-African inflected where the genre calls for it). Any local-language phrase must be translated or made obvious in context.` },
  { id: 'tw', label: 'Twi', dictionGuidance: `Weave Akan (Twi) meaningfully — greetings, proverbs, exclamations, key emotional lines — but code-switch with English so a non-Twi listener still follows the story. Do not output a wall of untranslated Twi.` },
  { id: 'ga', label: 'Ga', dictionGuidance: `Season with Ga (Accra) phrasing and interjections; code-switch with English for clarity. Honour Ga cadence in the hook where it fits.` },
  { id: 'ee', label: 'Ewe', dictionGuidance: `Season with Ewe phrasing and interjections; code-switch with English for clarity. Let Ewe carry the most heartfelt lines.` },
  { id: 'pcm', label: 'Pidgin', dictionGuidance: `Write primarily in warm West-African Pidgin English — natural, rhythmic, globally readable. This is the everyday street-poetry register, not broken English.` },
];

// ─── Registry + helpers ──────────────────────────────────────────────────────
export const GENRE_PACKS: GenrePack[] = [REGGAE, HIGHLIFE, AFROBEATS, GOSPEL];

export const DEFAULT_GENRE_ID = 'highlife';   // Ghana-forward default
export const DEFAULT_LANGUAGE_ID = 'en';

export const getGenrePack = (id: string): GenrePack =>
  GENRE_PACKS.find(g => g.id === id) ?? GENRE_PACKS[0];

export const getLanguagePack = (id: string): LanguagePack =>
  LANGUAGE_PACKS.find(l => l.id === id) ?? LANGUAGE_PACKS[0];

export const getPersona = (genreId: string, personaId: string): Persona => {
  const pack = getGenrePack(genreId);
  return pack.personas.find(p => p.id === personaId) ?? pack.personas[0];
};
