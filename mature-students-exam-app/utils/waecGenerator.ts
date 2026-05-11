const generateWAECSystemInstructions = (subject: string, specificRequirements: any = {}) => {
  // I've escaped the inner backticks on the last line with a backslash (\)
  const baseInstruction = `You are an expert ${subject} exam question generator for WAEC Senior High School examinations. Generate 24 NEW questions that are appropriate for SHS level examinations in ${subject}.\n\nCORE REQUIREMENTS:\n1. Generate exactly 24 questions\n2. Maintain appropriate difficulty level for SHS level\n3. Use diverse content, scenarios, contexts, and examples\n4. Each question should have exactly 5 options (A, B, C, D, E)\n5. Use "None of these" or "All of the above" as option E when contextually appropriate\n6. Follow WAEC examination standards and marking schemes\n7. Ensure cultural relevance to West African context where applicable\n\nSUBJECT-SPECIFIC REQUIREMENTS:\n${specificRequirements.content || 'Maintain subject-specific terminology and concepts'}\n\nFORMATTING REQUIREMENTS:\n- ${specificRequirements.formatting || 'Use proper academic formatting for the subject'}\n- Include diagrams, charts, or visual elements where appropriate\n- Include bonus sections for interesting questions\n- Follow the exact JSON format structure\n\nQUALITY STANDARDS:\n- Questions must be academically rigorous and age-appropriate\n- Avoid ambiguous wording or trick questions\n- Ensure one clearly correct answer per question\n- Make distractors plausible but clearly incorrect\n- Test understanding, not just memorization\n\nCONTENT GUIDELINES:\n- Use diverse examples that reflect West African contexts\n- Include both theoretical and practical applications\n- Maintain progressive difficulty throughout the set\n- Cover broad topic areas within the subject\n\nGenerate 24 new questions following the exact JSON format with properties: id, question, options, correct, and optional diagram/bonus properties. For diagrams, include a \`diagram\` property with \`type\` (e.g., \`chartjs_bar\`, \`mermaid_flowchart\`) and \`data\` (JSON object for Chart.js, Mermaid string for Mermaid) properties.`;

  return baseInstruction;
};

const subjectConfigurations = {
  mathematics: {
    content: `Cover algebra, geometry, statistics, trigonometry, calculus basics, and applied mathematics\n- Use LaTeX formatting with $ delimiters for all mathematical expressions\n- Include coordinate geometry, matrices, and probability questions\n- Maintain computational accuracy in all numerical answers`,
    formatting: `Use LaTeX mathematical notation ($x^2 + 3x - 4 = 0$) for expressions`
  },
  english: {
    content: `Cover comprehension, grammar, literature, composition, and language usage\n- Include passages from West African authors where appropriate\n- Test vocabulary, syntax, literary devices, and critical analysis\n- Maintain standard English conventions`,
    formatting: `Use proper quotation marks for literary excerpts and dialogue`
  },
  integratedScience: {
    content: `Cover physics, chemistry, biology, and environmental science concepts\n- Include practical applications and everyday phenomena\n- Test scientific method, observation, and analysis skills\n- Cover health, technology, and environmental topics`,
    formatting: `Use scientific notation and proper units for measurements`
  },
  socialStudies: {
    content: `Cover history, geography, government, economics, and cultural studies\n- Focus on West African context and global connections\n- Include current affairs and civic education\n- Test critical thinking about social issues`,
    formatting: `Use proper names for places, people, and institutions`
  },
  physics: {
    content: `Cover mechanics, waves, electricity, magnetism, modern physics\n- Include practical applications and real-world problems\n- Use SI units consistently\n- Test both theoretical understanding and problem-solving`,
    formatting: `Use scientific notation and physics symbols (F = ma, E = mc²)`
  },
  chemistry: {
    content: `Cover atomic structure, bonding, reactions, organic/inorganic chemistry\n- Include industrial applications and everyday chemistry\n- Test periodic trends, stoichiometry, and chemical analysis\n- Cover environmental chemistry topics`,
    formatting: `Use chemical formulas (H₂SO₄, CH₃COOH) and balanced equations`
  },
  biology: {
    content: `Cover cell biology, genetics, ecology, human biology, plant biology\n- Include biotechnology and health applications\n- Test classification, evolution, and biodiversity\n- Cover environmental and conservation topics`,
    formatting: `Use proper biological nomenclature and taxonomic names`
  },
  history: {
    content: `Cover ancient civilizations, colonial period, independence movements, modern Africa\n- Focus on West African history and global connections\n- Include social, political, and economic developments\n- Test chronological understanding and cause-effect relationships`,
    formatting: `Use proper historical dates and period names`
  },
  geography: {
    content: `Cover physical geography, human geography, economic geography, map reading\n- Include West African case studies and global examples\n- Test spatial analysis and environmental understanding\n- Cover climate, resources, and development topics`,
    formatting: `Use proper geographical coordinates and map symbols`
  },
  government: {
    content: `Cover political systems, constitution, democracy, international relations\n- Focus on West African political systems and global governance\n- Include civic rights, responsibilities, and participation\n- Test understanding of democratic processes`,
    formatting: `Use proper names of political institutions and offices`
  },
  economics: {
    content: `Cover microeconomics, macroeconomics, development economics, international trade\n- Include West African economic examples and case studies\n- Test economic principles and their applications\n- Cover market systems and economic indicators`,
    formatting: `Use proper economic terminology and notation`
  },
  literature: {
    content: `Cover prose, poetry, drama from African and world literature\n- Include prescribed texts and general literary knowledge\n- Test literary analysis, themes, and techniques\n- Cover oral tradition and written literature`,
    formatting: `Use proper citation format for literary works and authors`
  },
  technicalDrawing: {
    content: `Cover orthographic projection, isometric drawing, development of surfaces\n- Include engineering applications and architectural basics\n- Test spatial visualization and technical accuracy\n- Cover geometric construction and CAD basics`,
    formatting: `Reference standard drawing conventions and symbols`
  },
  foodAndNutrition: {
    content: `Cover nutrition science, food preparation, meal planning, food safety\n- Include West African foods and dietary practices\n- Test nutritional requirements and health applications\n- Cover food preservation and culinary skills`,
    formatting: `Use proper nutritional terminology and measurements`
  },
  visualArts: {
    content: `Cover drawing, painting, sculpture, design, art history\n- Include African art traditions and contemporary practices\n- Test artistic techniques and aesthetic principles\n- Cover art criticism and cultural contexts`,
    formatting: `Use proper art terminology and historical references`
  },
  french: {
    content: `Cover grammar, vocabulary, comprehension, composition, oral communication\n- Include Francophone African contexts\n- Test language skills and cultural understanding\n- Cover practical communication scenarios`,
    formatting: `Use proper French orthography and accents (café, résumé)`
  },
  akan: {
    content: `Cover grammar, oral tradition, literature, cultural expressions\n- Test language proficiency and cultural knowledge\n- Include proverbs, folktales, and traditional practices\n- Cover written and oral communication`,
    formatting: `Use proper Akan orthography and tone marks where applicable`
  }
};

export const generateSubjectInstruction = (subject: string) => {
  const normalizedSubject = subject.toLowerCase().replace(/\s+/g, '');
  const config = subjectConfigurations[normalizedSubject as keyof typeof subjectConfigurations];
  if (!config) {
    throw new Error(`Subject "${subject}" not found. Available subjects: ${Object.keys(subjectConfigurations).join(', ')}`);
  }
  return generateWAECSystemInstructions(subject, config);
};

export const availableSubjects = Object.keys(subjectConfigurations);