function isObject(value: any): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function valueToString(value: any): string {
  if (Array.isArray(value)) {
    return value.map(valueToString).join(', ');
  }
  if (isObject(value)) {
    return Object.entries(value)
      .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${valueToString(v)}`)
      .join(', ');
  }
  return String(value);
}

export function buildPromptFromScene(scene: any): string {
  const parts: string[] = [];

  if (scene.scene_type) parts.push(scene.scene_type);
  if (scene.location) parts.push(`in a ${scene.location}`);
  if (scene.overall_impression) parts.push(`creating an overall impression of ${scene.overall_impression}`);
  if (scene.mood) parts.push(`the mood is ${scene.mood}`);
  if (scene.atmosphere) parts.push(`with an atmosphere of ${scene.atmosphere}`);
  
  if (isObject(scene.architecture)) {
    parts.push(`The architecture features ${valueToString(scene.architecture)}`);
  }
  
  if (isObject(scene.art_installation)) {
    parts.push(`The main focus is a digital art installation: ${valueToString(scene.art_installation)}`);
  }

  if (isObject(scene.lighting)) {
    parts.push(`Lighting consists of ${valueToString(scene.lighting)}`);
  }

  if (isObject(scene.color_palette)) {
    const { dominant, accents } = scene.color_palette;
    if (dominant && dominant.length > 0) parts.push(`dominant colors are ${dominant.join(', ')}`);
    if (accents && accents.length > 0) parts.push(`accent colors include ${accents.join(', ')}`);
  }
  
  const description = parts.join('. ');

  return `cinematic, ultra-realistic 8k photograph of ${description}. modern, high detail, professional photography, dramatic lighting.`;
}
