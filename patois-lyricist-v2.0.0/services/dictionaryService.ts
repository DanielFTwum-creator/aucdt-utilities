
import { secureGetItem, secureSetItem } from './storageService';

export interface DictionaryEntry {
    term: string;
    definition: string;
}

const STORAGE_KEY = 'patoisLyricistDictionary';

const DEFAULT_ENTRIES: DictionaryEntry[] = [
    { term: "Babylon", definition: "The corrupt system, police, or oppressive authority." },
    { term: "Bashment", definition: "A large party, dance, or exciting event." },
    { term: "Big up", definition: "Expression of respect or praise." },
    { term: "Bredren", definition: "Brother, close friend, or comrade." },
    { term: "Bumboclaat", definition: "Strong expletive expressing shock, anger, or emphasis." },
    { term: "Deh yah", definition: "I am here; I am existing/surviving." },
    { term: "Duppy", definition: "A ghost, spirit, or malevolent entity." },
    { term: "Gaza", definition: "A term popularized by Vybz Kartel, referring to his neighborhood in Portmore." },
    { term: "Gully", definition: "A gutter or drain, often used to refer to a specific neighborhood or social status." },
    { term: "Gyal", definition: "Girl or woman." },
    { term: "Haffi", definition: "Have to; must." },
    { term: "Irie", definition: "Feeling good, excellent, high spirits, or peaceful." },
    { term: "Ital", definition: "Natural, organic, vital food (Rastafarian diet)." },
    { term: "Lickle", definition: "Little." },
    { term: "Livity", definition: "Righteous lifestyle, energy, and existence." },
    { term: "Man dem", definition: "The group of men; the guys." },
    { term: "Massive", definition: "A large group of people; the audience or crowd." },
    { term: "Nyam", definition: "To eat." },
    { term: "Par", definition: "To hang out or associate with." },
    { term: "Pickney", definition: "Child or children." },
    { term: "Rewind", definition: "To play a song back from the start (Pull up)." },
    { term: "Riddim", definition: "The instrumental backing track of a song." },
    { term: "Skank", definition: "The rhythmic dance or off-beat guitar chop in reggae." },
    { term: "Small up yuhself", definition: "Make room, squeeze in, or be humble/unobtrusive." },
    { term: "Soon come", definition: "I will be there eventually (implies flexible time)." },
    { term: "Su-su", definition: "Gossip, whispering, or talking behind backs." },
    { term: "Tall", definition: "Long or tall." },
    { term: "Vex", definition: "Angry, upset, or frustrated." },
    { term: "Walk good", definition: "A parting wish meaning 'take care' or 'have a safe journey'." },
    { term: "Wha gwaan", definition: "What's going on? A common greeting." },
    { term: "Yardie", definition: "A Jamaican person (often used in the UK/US)." },
    { term: "Zeen", definition: "Understand? or 'I understand/agree'." }
];

export const initializeDictionary = () => {
    const existing = secureGetItem<DictionaryEntry[]>(STORAGE_KEY);
    if (!existing || existing.length === 0) {
        secureSetItem(STORAGE_KEY, DEFAULT_ENTRIES.sort((a, b) => a.term.localeCompare(b.term)));
    }
};

export const getEntries = (): DictionaryEntry[] => {
    return secureGetItem<DictionaryEntry[]>(STORAGE_KEY) || [];
};

export const addEntry = (term: string, definition: string): DictionaryEntry[] => {
    const entries = getEntries();
    if (entries.some(e => e.term.toLowerCase() === term.toLowerCase())) {
        throw new Error("Term already exists.");
    }
    const newEntries = [...entries, { term, definition }].sort((a, b) => a.term.localeCompare(b.term));
    secureSetItem(STORAGE_KEY, newEntries);
    return newEntries;
};

export const searchEntries = (query: string): DictionaryEntry[] => {
    const entries = getEntries();
    if (!query) return entries;
    const lowerQ = query.toLowerCase();
    return entries.filter(e => 
        e.term.toLowerCase().includes(lowerQ) || 
        e.definition.toLowerCase().includes(lowerQ)
    );
};
