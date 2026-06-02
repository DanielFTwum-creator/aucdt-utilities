import { StoryScene, MusicalConcept, FoundObjectInstrument, CASELMapping } from '../types';

export const STORY_SCENES: StoryScene[] = [
  {
    id: 1,
    title: "The Opening",
    narrative: "This story is about active listening and group rhythmic expression. We begin by grabbing our children’s full attention.",
    visualFocus: 'opening',
    cues: [
      { id: "s1-c1", type: "facilitator", text: "Ask the group: 'Do you like stories?'" },
      { id: "s1-c2", type: "children", text: "\"YES!!!\"" },
      { id: "s1-c3", type: "facilitator", text: "Ask: 'Do you want to hear a story?'" },
      { id: "s1-c4", type: "children", text: "\"YESSS!!!\"" },
      { id: "s1-c5", type: "facilitator", text: "\"OK — but you have to listen very carefully. If you listen carefully you’ll know what to say and when to say it. And if you listen carefully you’ll know what to play on your drum and when to play it.\"" },
      { id: "s1-c6", type: "facilitator", text: "Pause. Make sure all eyes are on you.", subText: "Establish complete sensory presence before any instrument is touched." }
    ],
    musicalElements: [
      { term: "Call & Response", description: "You call, the children respond. This pattern primes them for participatory music-making before a single drum is played." }
    ],
    selFocus: {
      competency: "Self-Management",
      description: "Sustaining focus and self-regulating impulses in anticipation of a shared story."
    }
  },
  {
    id: 2,
    title: "Far, Far Away",
    narrative: "\"This story takes place far, far away from here — in a place that is very hot, has lots of big animals, and has lots of Djembe drums. A place called...\"",
    visualFocus: 'map',
    cues: [
      { id: "s2-c1", type: "facilitator", text: "Pause dramatically. Let the children answer." },
      { id: "s2-c2", type: "children", text: "\"AFRICA!!!\"" }
    ],
    musicalElements: [
      { term: "Call & Response", description: "The facilitator’s voice is the call; the children’s answer is the response, reinforcing rhythmic dialog." }
    ],
    selFocus: {
      competency: "Social Awareness",
      description: "Developing cultural awareness and identifying with a global geographic musical hub."
    }
  },
  {
    id: 3,
    title: "The Biggest Animal",
    narrative: "\"And on this day in Africa, one of the biggest animals...\"",
    visualFocus: 'elephant_normal',
    cues: [
      { id: "s3-c1", type: "facilitator", text: "Stand up. Bow your head and swing one arm slowly in front of your face like a trunk. Wait for the children to respond." },
      { id: "s3-c2", type: "children", text: "\"AN ELEPHANT!!!\"" },
      { id: "s3-c3", type: "facilitator", text: "\"When the elephant woke up, she looked around and said...\"" },
      { id: "s3-c4", type: "facilitator", text: "Wet your lips. Make a long, slow elephant trumpet sound while lifting and lowering your trunk-arm." },
      { id: "s3-c5", type: "facilitator", text: "\"Oh, what a HOT day! I think I’ll take a walk to the big shade tree.\"" }
    ],
    musicalElements: [
      { term: "Timbre", description: "The vocalized elephant sound introduces the concept of distinct, recognizable tonal textures produced by different sources." }
    ],
    selFocus: {
      competency: "Self-Awareness",
      description: "Using body language and expressive vocal play to overcome physical self-consciousness."
    }
  },
  {
    id: 4,
    title: "The Elephant Walks",
    narrative: "\"And she started to walk...\"",
    visualFocus: 'elephant_slow',
    cues: [
      { id: "s4-c1", type: "facilitator", text: "Begin playing slow, heavy Bass notes in a steady walking rhythm: 1, 2, 3, 4. Children will naturally join in." },
      { id: "s4-c2", type: "drum_cue", text: "● BASS... BASS... BASS... BASS...", subText: "Slow, heavy, steady walking tempo (approx. 60-70 BPM)" },
      { id: "s4-c3", type: "facilitator", text: "If children are not playing in unison, stop them and ask: 'Wait — how many elephants are walking?'" },
      { id: "s4-c4", type: "children", text: "\"ONE!\"" },
      { id: "s4-c5", type: "facilitator", text: "Begin modeling the slow Bass beat again. Children will fall into unison." },
      { id: "s4-c6", type: "drum_cue", text: "● BASS... BASS... BASS... BASS...", subText: "Everyone together in steady sync!" },
      { id: "s4-c7", type: "facilitator", text: "\"She walked, and she walked, and she walked...\"" },
      { id: "s4-c8", type: "facilitator", text: "Begin slowing your playing and your speech together. Draw out the final words." },
      { id: "s4-c9", type: "facilitator", text: "\" ...until she... couldn’t... walk...... any.......... more! \"" },
      { id: "s4-c10", type: "drum_cue", text: "● BASS...... BASS........ BASS..........", subText: "Slow down gradually (decelerando) and stop completely on \"more\"" }
    ],
    musicalElements: [
      { term: "Bass Note", description: "The foundational deep, resonant sound of the Djembe." },
      { term: "Pulse & Beat", description: "The underlying heartbeat established organically through footsteps, not dry instruction." },
      { term: "Unison", description: "Everyone matching the same tempo seamlessly through story alignment." },
      { term: "Decelerando", description: "Gradually slowing down the speed, conducted naturally via your vocal cadence." },
      { term: "Fermata & Grand Pause", description: "A unified moment of lingering suspension leading to absolute, shared silence." }
    ],
    selFocus: {
      competency: "Self-Management",
      description: "Regulating kinetic energy to slow down and halt playing precisely with the group on the cue word \"more\"."
    }
  },
  {
    id: 5,
    title: "The Big Shade Tree",
    narrative: "\"When she looked up — she was at the big shade tree! And her friends who live in the shade tree...\"",
    visualFocus: 'monkeys_chattering',
    cues: [
      { id: "s5-c1", type: "facilitator", text: "Raise one arm, scratch under it with your other hand, and open your mouth wide. Wait for the children." },
      { id: "s5-c2", type: "children", text: "\"MONKEYS!!!\"" },
      { id: "s5-c3", type: "facilitator", text: "\"The monkeys were SO excited to see their friend — they started chattering!\"" },
      { id: "s5-c4", type: "facilitator", text: "Begin playing excited, rapid Tone bursts on the edge of the Djembe. Let children join in freely — this is improvisation. Let the chatter go on for a good moment." },
      { id: "s5-c5", type: "drum_cue", text: "● TAK TAK TAK TAK-TAK TAK TAK TAK!", subText: "Excited, free, improvised Open Tone bursts near the edge" },
      { id: "s5-c6", type: "facilitator", text: "Then — slap the drum loud once and stop completely." },
      { id: "s5-c7", type: "facilitator", text: "\"Suddenly — they all stopped to listen.\"" },
      { id: "s5-c8", type: "facilitator", text: "Pick up the shaker. Play a fast, steady rattle. Say nothing. Let the children identify the sound." },
      { id: "s5-c9", type: "children", text: "\"SNAKES!!!\"" },
      { id: "s5-c10", type: "facilitator", text: "\"What KIND of snakes?\"" },
      { id: "s5-c11", type: "children", text: "\"RATTLESNAKES!!!\"" }
    ],
    musicalElements: [
      { term: "Open Tone", description: "The bright, piercing, high-pitch tone struck on the rim of the Djembe." },
      { term: "Improvisation", description: "Structured free-play enabling exploration of rhythm and sound without wrong answers." },
      { term: "Leitmotif", description: "The shaker becomes a recurring musical cue directly associated with the rattlesnakes." },
      { term: "Dynamic Contrast", description: "The sudden shift between loud, chaotic monkey chatter and the soft, tense hiss of the shaker." }
    ],
    selFocus: {
      competency: "Responsible Decision-Making",
      description: "Evaluating consequences of acoustic actions—playing too fast or loud blocks out the shaker cue."
    }
  },
  {
    id: 6,
    title: "She Ran!",
    narrative: "\"Do you think elephants like rattlesnakes? No!!! What do you think she did? SHE RAN!!!\"",
    visualFocus: 'elephant_running',
    cues: [
      { id: "s6-c1", type: "facilitator", text: "Everyone begins drumming fast. Add your voice to the music." },
      { id: "s6-c2", type: "drum_cue", text: "● BUMBUMBUMBUMBUMBUMBUMBUM", subText: "Fast, driving Bass roll — everyone running!" },
      { id: "s6-c3", type: "facilitator", text: "While everyone drums fast and hard, vocalize over the drumming:" },
      { id: "s6-c4", type: "facilitator", text: "\"And she ran as fast as she could run! And she ran, and she ran, and she ran...\"" },
      { id: "s6-c5", type: "facilitator", text: "Begin slowing your voice and your playing together." },
      { id: "s6-c6", type: "facilitator", text: "\" ...until she... couldn’t... run...... any.......... more! \"" },
      { id: "s6-c7", type: "drum_cue", text: "● BUMBUM...BUM......BUM..........", subText: "Slow down together and stop on \"more\"" }
    ],
    musicalElements: [
      { term: "Accelerando", description: "A sudden, dramatic increase in tempo to mirror the narrative panic." },
      { term: "Vocal Conductor", description: "Using your speech tempo and body movement directly as the visual metric for the ensemble's volume and speed." },
      { term: "Fermata", description: "The second iteration of the Grand Pause, strengthening the group's impulse control." }
    ],
    selFocus: {
      competency: "Relationship Skills",
      description: "Playing collaboratively at high speeds requires deep trust, listening safety, and shared timing."
    }
  },
  {
    id: 7,
    title: "The Pond",
    narrative: "\"She was so hot. And so dusty. And so tired. And so thirsty. When she heard...\"",
    visualFocus: 'pond_frogs',
    cues: [
      { id: "s7-c1", type: "facilitator", text: "Pick up the wooden frog and play a ribbit-ribbit sound. Say nothing." },
      { id: "s7-c2", type: "children", text: "\"FROGS!!!\"" },
      { id: "s7-c3", type: "facilitator", text: "\"Where do frogs live?\"" },
      { id: "s7-c4", type: "children", text: "\"IN THE POND!!!\"" },
      { id: "s7-c5", type: "facilitator", text: "\"Yes! She was so happy to see the water. She walked into the pond and sprayed cool water all over her back. She washed the dust away. She cooled off. And then she took a long, long drink of water.\"" },
      { id: "s7-c6", type: "facilitator", text: "Pause. Let the children feel the relief of this moment. No drumming here — the silence is part of the story." },
      { id: "s7-c7", type: "facilitator", text: "\"And she felt SO much better.\"" },
      { id: "s7-c8", type: "facilitator", text: "\"So she got out of the pond and was just about to lie down to rest — when she heard...\"" },
      { id: "s7-c9", type: "facilitator", text: "Pick up the shaker. Play the rattling sound again." },
      { id: "s7-c10", type: "children", text: "\"RATTLESNAKES!!!\"" },
      { id: "s7-c11", type: "facilitator", text: "\"What do you think she did?\"" },
      { id: "s7-c12", type: "children", text: "\"SHE RAN AGAIN!!!\"" },
      { id: "s7-c13", type: "drum_cue", text: "● BUMBUMBUMBUMBUMBUMBUMBUM", subText: "Fast Bass roll — running again!" }
    ],
    musicalElements: [
      { term: "Silence as Music", description: "The active absence of drum sound at the pond conveys relief, setting a peaceful atmospheric contrast." },
      { term: "Leitmotif Reprisal", description: "Re-introducing the Shaker and the Frog, fostering instant memory recall and reaction." }
    ],
    selFocus: {
      competency: "Self-Management",
      description: "Managing emotional energy—shifting rapidly from hyper-focused silence to ecstatic drumming."
    }
  },
  {
    id: 8,
    title: "Back to the Shade Tree",
    narrative: "Running has brought the elephant right back to where she began, but she has a big tale to tell.",
    visualFocus: 'monkeys_chattering',
    cues: [
      { id: "s8-c1", type: "facilitator", text: "Vocalize over the drumming again." },
      { id: "s8-c2", type: "facilitator", text: "\"And she ran, and she ran, and she ran...\"" },
      { id: "s8-c3", type: "facilitator", text: "Slow down together." },
      { id: "s8-c4", type: "facilitator", text: "\" ...until she... couldn’t... run...... any.......... more! \"" },
      { id: "s8-c5", type: "drum_cue", text: "● BUMBUM...BUM......BUM..........", subText: "Stop on \"more\"" },
      { id: "s8-c6", type: "facilitator", text: "\"When she looked up — she was back at the big shade tree.\"" },
      { id: "s8-c7", type: "facilitator", text: "\"Well, the monkeys were SO curious about what had happened. They started asking all kinds of questions!\"" },
      { id: "s8-c8", type: "facilitator", text: "Begin playing rapid Tone bursts again — many questions from many monkeys at once. Let children join in freely — this is improvisation. Let the chatter go on for a good moment." },
      { id: "s8-c9", type: "drum_cue", text: "● TAK TAK TAK? TAK-TAK TAK? TAK TAK TAK TAK?", subText: "Questioning Tone bursts — free improvisation!" },
      { id: "s8-c10", type: "facilitator", text: "\"So she told them the whole story — about running until she couldn't run any more, and hearing the frogs, and getting water to cool off, and then hearing the snakes again, and running until she couldn't run any more — and ending up right back here at the big shade tree.\"" }
    ],
    musicalElements: [
      { term: "Recapitulation", description: "Bringing back previous musical themes (monkeys chattering) to mark a narrative homecoming." },
      { term: "Musical Stamina", description: "Children sustain their third intense drumming bout, building somatic endurance while fully engaged in the lore." }
    ],
    selFocus: {
      competency: "Self-Awareness",
      description: "Recognizing physical progression, feeling a proud sense of accomplishment as a musical storyteller."
    }
  },
  {
    id: 9,
    title: "The End",
    narrative: "\"And then they all stopped to listen...\"",
    visualFocus: 'nap',
    cues: [
      { id: "s9-c1", type: "facilitator", text: "Pick up the shaker. Hold it out visibly. Do NOT shake it. Wait. Let the silence stretch." },
      { id: "s9-c2", type: "facilitator", text: "After a long pause, put the shaker down slowly." },
      { id: "s9-c3", type: "facilitator", text: "\"...they didn’t hear any more snakes.\"" },
      { id: "s9-c4", type: "facilitator", text: "\"So they all decided to take a nice...\"" },
      { id: "s9-c5", type: "facilitator", text: "Put both hands together, rest them against your tilted head, and close your eyes. Wait for the children." },
      { id: "s9-c6", type: "children", text: "\"A NAP!!!\"" }
    ],
    musicalElements: [
      { term: "Negative Space", description: "The absolute silence of an unshaken instrument holds narrative power, leaving tension unresolved until the shaker is laid down." },
      { term: "Resolution", description: "The final verbal release 'A NAP' melts the musical and story tension in unison." }
    ],
    selFocus: {
      competency: "Self-Management",
      description: "Restoring physiological balance, transitioning from high-tempo movement to deep, somatic calmness."
    }
  }
];

export const MUSICAL_CONCEPTS: MusicalConcept[] = [
  {
    term: "Bass Note",
    definition: "The deep, resonant tone produced by striking the flat center of the Djembe.",
    dfsApplication: "Experienced as the heavy, steady walking steps of the big elephant (Scene 4).",
    hasAudioDemo: true,
    demoType: "pulse"
  },
  {
    term: "Open Tone",
    definition: "The brighter, ringing sound produced by striking the edge of the drum shell with flat fingers.",
    dfsApplication: "Brought to life during the happy, chaotic monkey chatter (Scene 5 & 8).",
    hasAudioDemo: true,
    demoType: "improvisation"
  },
  {
    term: "Timbre",
    definition: "The unique acoustic color or 'texture' of a sound that separates it from standard pitches.",
    dfsApplication: "Taught through contrasting the heavy drum, the wooden ribbit frog, and the metallic shaker.",
    hasAudioDemo: true,
    demoType: "timbre"
  },
  {
    term: "Pulse / Beat",
    definition: "The underlying, steady heartbeat of a piece of music.",
    dfsApplication: "Choreographed through the elephant's slow, unwavering 1-2-3-4 step tempo.",
    hasAudioDemo: true,
    demoType: "pulse"
  },
  {
    term: "Unison",
    definition: "All performers executing the exact same rhythmic pattern at the exact same moment.",
    dfsApplication: "Prompted naturally by asking 'How many elephants are walking?', urging kids to match the single step template.",
    hasAudioDemo: true,
    demoType: "unison"
  },
  {
    term: "Decelerando",
    definition: "A gradual, controlled slowing down of the musical tempo.",
    dfsApplication: "Triggered whenever the elephant gets tired: 'until she... couldn't... walk... any... more!'",
    hasAudioDemo: true,
    demoType: "decelerando"
  },
  {
    term: "Accelerando",
    definition: "A gradual, exciting speeding up of the rhythm velocity.",
    dfsApplication: "Instigated during the snake encounters when the elephant runs for her life (Scene 6).",
    hasAudioDemo: true,
    demoType: "accelerando"
  },
  {
    term: "Fermata & Grand Pause",
    definition: "A held, suspended pause (Fermata) followed by an intentional period of total, shared silence (Grand Pause).",
    dfsApplication: "Landing perfectly on 'more!', training kids' focus to halt their energy instantly on call.",
    hasAudioDemo: true,
    demoType: "fermata"
  }
];

export const FOUND_OBJECTS: FoundObjectInstrument[] = [
  {
    id: "tabletop",
    category: "drum",
    name: "Tabletop or Desk",
    realAlternative: "Bass & Open Djembe",
    description: "Strike the exact center with a flat palm for a deep Bass notes; snap fingertips on the edge for a crisp Open Tone.",
    soundType: "Thud"
  },
  {
    id: "cardboard_box",
    category: "drum",
    name: "Cardboard Box",
    realAlternative: "Djembe / Bass Drum",
    description: "A sturdy taped shipping box. Striking the side hollow provides a remarkably deep and resonant acoustic bass echo.",
    soundType: "Hollow Boom"
  },
  {
    id: "plastic_bin",
    category: "drum",
    name: "Plastic Storage Bin",
    realAlternative: "Congas / Bongos",
    description: "Turned upside down and held off the floor. Produces both a distinct resonant low-end and a glossy high-pitch rim slap.",
    soundType: "Plasticky Pop"
  },
  {
    id: "hardcover_book",
    category: "drum",
    name: "Hardcover Book",
    realAlternative: "Hand Drum",
    description: "A thick university textbook or atlas. Slapping the hard cover plate with a relaxed open palm creates a satisfyingly dry smack.",
    soundType: "Dry Snap"
  },
  {
    id: "plastic_bottle_rice",
    category: "shaker",
    name: "Bottle with Rice or Beans",
    realAlternative: "Metal Shaker / Maraca",
    description: "An empty water bottle filled 1/3 of the way with dry uncooked rice, lentils, or beans. Shake horizontally for snake rattles.",
    soundType: "Grainy Hiss"
  },
  {
    id: "jar_of_coins",
    category: "shaker",
    name: "Jar of Coins",
    realAlternative: "Heavy Cabasa / Shaker",
    description: "A small jar containing coins or washers. Shake with rapid wrist snaps to generate a heavy, urgent rattling alarm.",
    soundType: "Metallic Clink"
  },
  {
    id: "keys_keyring",
    category: "shaker",
    name: "Keys on Keyring",
    realAlternative: "Tambourine Jingle",
    description: "A ring of house keys shaken in quick bursts. Emits high-frequency metal-on-metal claps that sound highly convincing.",
    soundType: "High Jangle"
  },
  {
    id: "comb_teeth",
    category: "frog",
    name: "Pencil & Comb Teeth",
    realAlternative: "Wooden Guiro Frog",
    description: "Dragging a wooden pencil tip firmly along the tips of a pocket comb. Replicates the rapid click-rattle of a real frog scraper.",
    soundType: "Ribbit Scrape"
  },
  {
    id: "bottle_ridges",
    category: "frog",
    name: "Ridged Water Bottle",
    realAlternative: "Standard Guiro Scraper",
    description: "Rubbing a fingernail, pen cap, or coin fast across the parallel ridges of an empty plastic bottle for organic scratching sounds.",
    soundType: "Acoustic Scratch"
  },
  {
    id: "pencils_clicked",
    category: "frog",
    name: "Two Clicking Pencils",
    realAlternative: "Woodblocks / Claves",
    description: "Clicking two wooden pencils or chopsticks together rhythmically. Creates a light, crisp, high-pitched percussion woodblock accent.",
    soundType: "Woody Clack"
  }
];

export const CASEL_CHART: CASELMapping[] = [
  {
    competency: "Self-Awareness",
    description: "Identifying personal strengths and emotional states.",
    drummingConnection: "Children discover their internal capacity to make music of their own accord. Producing safe bass and open tones establishes deep self-confidence as an active music-maker.",
    examples: [
      "Realizing their hands can make two completely different, beautiful sounds.",
      "Finding an emotional release during the hyper-improvisation monkey chatter sessions.",
      "Developing a sense of somatic pride by drumming on beat."
    ]
  },
  {
    competency: "Self-Management",
    description: "Regulating impulses, managing stress, and practicing focus.",
    drummingConnection: "The drum circle requires intense, active motor-regulation. Children must listen before they strike, halt their dynamic energy instantly on 'more', and slow down their bodies to align with decelerandos.",
    examples: [
      "Quieting their hands immediately when the facilitator holds up the stop hand gesture.",
      "Restraining the impulse to speed up during the slow, heavy elephant steps.",
      "Transitioning from high-intensity 'running' to completely quiet meditation at the pond."
    ]
  },
  {
    competency: "Social Awareness",
    description: "Practicing empathy, perspective-taking, and active listenting.",
    drummingConnection: "To play together effectively, children must listen outwards. They move beyond their individual bubbles to adapt their physical timing to their peers, becoming part of 'one big drummer'.",
    examples: [
      "Listening closely to hear if their neighbors are in unison, adjusting their hit timing organically.",
      "Identifying narrative emotions (the elephant's heat, exhaustion, fear, and relief) and expressing them acoustically.",
      "Respecting the silent pauses as expressive spaces that are part of the story."
    ]
  },
  {
    competency: "Relationship Skills",
    description: "Communicating, cooperating, and building collective bonds.",
    drummingConnection: "Drumming establishes immediate, non-verbal communities. Children share space, exchange Call & Response 'echoes', and cooperate in a flat group layout where every individual is heard and valued.",
    examples: [
      "Achieving synchronous unison without verbal instruction through cooperative rhythmic syncing.",
      "Participating in mutual Call & Response dialogues with the teacher.",
      "Recognizing that their sound is essential to the collective beauty of the ensemble."
    ]
  },
  {
    competency: "Responsible Decision-Making",
    description: "Making constructive choices regarding personal and group behavior.",
    drummingConnection: "Improvisation invites real-time choices. Children realize that playing too loudly or selfishly breaks the collaborative soundscape, learning to make musical calls that serve the group's story flow.",
    examples: [
      "Choosing a moderate volume in the monkey chatter scene so they can still hear the snake warning shaker.",
      "Selecting appropriate expressive speeds that follow the narrative conductor's body signals.",
      "Deciding to stop playing when they recognize that silence represents the peaceful story outcome."
    ]
  }
];
