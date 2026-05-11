
import { PanelDetail } from './types';

export const sceneData = {
    shot: {
        composition: "sushi flying mid-air in freeze-frame, ingredients slicing through slow-mo then slamming into a box layout",
        frame_rate: "1500fps during slicing and drops, 60fps tracking",
        camera_movement: "whip pans, snap zoom on impact, bullet-time swirl around salmon cut"
    },
    subject: {
        description: "exploding sushi assortment - salmon, maki, ebi, avocado, rice burst",
        props: "dripping soy, flying ginger, vapor mist, kinetic chopsticks"
    },
    scene: {
        location: "black void with glowing grid, floating sushi elements",
        environment: "mist, air swirls, kinetic chop platform"
    },
    visual_details: {
        action: "sashimi slices in air, rice explodes into shape, box slams shut in final impact burst, chopsticks cross like a seal",
        special_effects: "rice shockwave, soy splash trails, steam blast on drop"
    },
    cinematography: {
        tone: "premium, aggressive, ultra-fresh"
    }
};

export const variationOptions = {
    lighting: [
        "dramatic side light, gloss shimmer pulses on fish",
        "soft, ethereal backlighting with volumetric rays",
        "hard, high-contrast top-down lighting, creating sharp shadows",
        "neon-noir moody lighting with vibrant, colourful reflections",
        "bright, clean, high-key studio lighting"
    ],
    color_palette: [
        "lava orange, sea green, high-gloss black, neon edges",
        "ice blue, electric pink, polished chrome, holographic shimmers",
        "deep indigo, gold leaf, crimson red, and stark white",
        "monochromatic with varying shades of a single color",
        "cyberpunk-inspired palette with magenta, cyan, and yellow"
    ],
    lens: [
        "35mm with fast rack focus",
        "85mm portrait lens with a very shallow depth of field",
        "24mm wide-angle lens, creating a sense of scale and distortion",
        "100mm macro lens for extreme close-ups",
        "anamorphic lens with characteristic lens flares"
    ]
};

export const imageFileNames = ["wide-shot.png", "detail-shot.png", "atmospheric-shot.png"];

export const panelDetails: PanelDetail[] = [
    {
        title: "The Wide Shot",
        description: "Captures the overall scene and action, establishing the environment and dynamic composition.",
    },
    {
        title: "The Detail Shot",
        description: "Zooms in on a high-impact moment, focusing on special effects and intricate textures.",
    },
    {
        title: "The Atmospheric Shot",
        description: "Focuses on mood, colour, and abstract elements to convey the tone and feeling of the scene.",
    }
];
