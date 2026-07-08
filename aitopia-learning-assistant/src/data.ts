import { CourseModule, SupportSystem, AccessibilityFeature, QAStructure } from "./types";

export const COURSE_OVERVIEW = {
  duration: "14 weeks (extended from 12 weeks)",
  prerequisites: [
    "Programming: Proficiency in Python basics (variables, functions, loops, data structures)",
    "Mathematics: Linear algebra fundamentals, basic statistics, introductory calculus",
    "Pre-course assessment and optional brush-up sessions available"
  ],
  format: "Blended theory-practice with 60% hands-on work",
  assessment: "Portfolio-based with continuous formative feedback"
};

export const LEARNING_OUTCOMES = [
  "Conceptualize AI fundamentals and distinguish between different AI paradigms",
  "Implement basic machine learning algorithms using modern tools and frameworks",
  "Evaluate AI model performance using appropriate metrics and identify common pitfalls",
  "Analyze ethical implications of AI systems and apply responsible AI principles",
  "Create a functional AI application addressing a real-world problem",
  "Communicate AI concepts clearly to both technical and non-technical audiences"
];

export const COURSE_MODULES: CourseModule[] = [
  {
    title: "Module 1: AI Foundations & Searching (Weeks 1-2)",
    description: "Build an understanding of intelligent agents, bimodal architectures, and basic state-space heuristics and pathfinding search algorithms.",
    weeks: [
      {
        weekNum: 1,
        title: "Foundations of Intelligent Agents & Bimodal Environments",
        theory: [
          "AI classification models: Narrow vs. General intelligence",
          "Rationality metrics and agent-environment feedback loops",
          "Symbolic representations and mathematical states space",
          "Bimodal learning architectures: Grounding theory in acoustics"
        ],
        practice: [
          "🛠️ Academic Workshop: Build a deterministic state-machine simulation of an autonomous Atɛntɛbɛn performance agent, mapping acoustic sensor inputs to musical action policies.",
          "📝 Practical Exercise: Formulate mathematical utility equations U(a) for finger-hole adjustments under varied ambient acoustic noise thresholds."
        ],
        assessment: "Functional state-machine script with rationality performance analysis metrics."
      },
      {
        weekNum: 2,
        title: "Advanced Search & Spatial Pitch Navigation",
        theory: [
          "State space representations of musical pitches",
          "Blind vs. heuristic searching paradigms",
          "BFS, DFS, and A* search optimization algorithms applied to transition paths"
        ],
        practice: [
          "🛠️ Academic Workshop: Create a spatial search visualizer applying BFS, DFS, and A* to pathfinding through a labyrinth representing West African polyrhythmic drum metrics.",
          "📝 Practical Exercise: Implement the heuristic cost calculation f(n) = g(n) + h(n) simulating finger-movement friction and pitch transition distances."
        ],
        assessment: "Working A* algorithm visualization showing step-by-step state search expansions."
      }
    ]
  },
  {
    title: "Module 2: Machine Learning Pipelines & Regression (Weeks 3-8)",
    description: "Get to the heart of traditional Machine Learning: from data integrity and preprocessing pipelines to parametric, non-parametric, ensemble models, and statistical validation.",
    weeks: [
      {
        weekNum: 3,
        title: "Data Integrity, Outlier Filtering & Feature Pipelines",
        theory: [
          "Data cleaning, missing value imputations, and pipeline integrity",
          "Feature scaling, normalization, and standardizing methodologies",
          "Acoustic signal feature extraction (spectral centroid, pitch frequencies)"
        ],
        practice: [
          "🛠️ Academic Workshop: Engineer an audio feature extraction pipeline converting raw wav signals from flute recordings into numerical pitch and moisture metrics using discrete frequency bins.",
          "📝 Practical Exercise: Implement statistical anomaly detection routines using standard deviation thresholds to prune outliers caused by breath distortion."
        ],
        assessment: "Audio feature pipeline script with robust outlier filtering validation."
      },
      {
        weekNum: 4,
        title: "Supervised Learning – Parametric Regression Models",
        theory: [
          "Univariate and multivariate Linear Regression mathematical formulations",
          "Gradient descent mechanics, learning rates, and cost optimization",
          "Predictive modeling constraints and parametric assumptions"
        ],
        practice: [
          "🛠️ Academic Workshop: Program a script calculating univariate linear regression coefficients to predict traditional bamboo wood decay rates as a function of cumulative daily play cycles.",
          "📝 Practical Exercise: Derive and compute gradient descent weight updates manually for a miniature dataset of 5 distinct woodwind density ratings."
        ],
        assessment: "Gradient descent mathematical proof and completed predictive regression module."
      },
      {
        weekNum: 5,
        title: "Inductive Decision Trees & Entropy Metrics",
        theory: [
          "Entropy and Information Gain calculation formulas",
          "Gini Impurity metrics and node-splitting optimization",
          "Decision tree pruning techniques to mitigate model overfitting"
        ],
        practice: [
          "🛠️ Academic Workshop: Design a binary classification system that classifies an acoustic recording into 'Wet/Moist Tone' vs. 'Brittle/Dry Tone' based on harmonic energy ratios.",
          "📝 Practical Exercise: Calculate the Gini Impurity and Information Gain metrics manually for a splitting tree node representing high-frequency audio bands (>1200 Hz)."
        ],
        assessment: "Decision tree model classifying dry/moist wood tones with detailed nodes explanation."
      },
      {
        weekNum: 6,
        title: "Ensemble Architectures & Bootstrap Aggregating",
        theory: [
          "Ensemble theory: Bagging, Boosting, and Voting classifiers",
          "Random Forest decision pools and feature randomness mechanics",
          "Out-of-bag (OOB) error estimation and boosting introduction"
        ],
        practice: [
          "🛠️ Academic Workshop: Construct a random forest classification pool to distinguish authentic hand-crafted Ghanaian Atɛntɛbɛn flutes from industrial plastic replicas using high-frequency resonance profiles.",
          "📝 Practical Exercise: Implement bootstrap aggregating (bagging) logic from scratch in TypeScript and compute out-of-bag (OOB) error margins."
        ],
        assessment: "Ensemble classifier model achieving >90% precision on resonance validation sets."
      },
      {
        weekNum: 7,
        title: "Unsupervised Clustering & Spectral Dimensionality Reduction",
        theory: [
          "K-Means clustering formulations and centroid updating mechanics",
          "Principal Component Analysis (PCA) eigenvectors and eigenvalues",
          "Cluster evaluation metrics and the Silhouette coefficient"
        ],
        practice: [
          "🛠️ Academic Workshop: Analyze high-dimensional spectral acoustic data using Principal Component Analysis (PCA) and visualize spectral clusters using Recharts.",
          "📝 Practical Exercise: Compute the covariance matrix and determine the eigenvectors for a 2-dimensional vector of pitch resonance and blowing pressure."
        ],
        assessment: "PCA projection report showing dimension compression of acoustic spectra."
      },
      {
        weekNum: 8,
        title: "Statistical Diagnostics, Bias-Variance & Cross-Validation",
        theory: [
          "Bias-Variance trade-off mathematical diagnostics",
          "K-fold cross-validation pipelines and significance testing",
          "Regularization techniques (L1 Lasso, L2 Ridge) to bound model weights"
        ],
        practice: [
          "🛠️ Academic Workshop: Build a modular validation suite that splits acoustic data into k-folds to evaluate pitch detection robustly under high-noise simulation environments.",
          "📝 Practical Exercise: Diagnose high-variance overfitting in a simulated model and formulate L1 and L2 regularization constraints to bound weights."
        ],
        assessment: "Regularized model diagnostic portfolio comparing train/validation loss curves."
      }
    ]
  },
  {
    title: "Module 3: Deep Learning & Representation (Weeks 9-10)",
    description: "Dive into Deep Learning structures: from backpropagation mathematics and computation graphs to sequence neural networks.",
    weeks: [
      {
        weekNum: 9,
        title: "Backpropagation Mathematics & Computation Graphs",
        theory: [
          "Neural network layers, weights, biases, and activation functions",
          "Computation graphs and forward-mode vs. reverse-mode differentiation",
          "Chain-rule calculus for derivative propagation through neural layers"
        ],
        practice: [
          "🛠️ Academic Workshop: Implement a reverse-mode automatic differentiation engine in TypeScript representing simple neuron weights and bias adjustments.",
          "📝 Practical Exercise: Derive partial derivatives of loss with respect to weights for a simple 3-layer neural network with Sigmoid activation functions."
        ],
        assessment: "Working differentiation engine proving derivative parity with standard frameworks."
      },
      {
        weekNum: 10,
        title: "Advanced Computer Vision & Melodic Sequence Models",
        theory: [
          "Convolutional filters, strides, padding, and pooling layers",
          "Recurrent Neural Networks (RNN) and LSTM gated cell architectures",
          "Sequence modeling for acoustic pitch and temporal notes prediction"
        ],
        practice: [
          "🛠️ Academic Workshop: Construct a sequence model (simulated LSTM) designed to predict the next note in a traditional Ghanaian melody (e.g., 'Yaa Amponsah').",
          "📝 Practical Exercise: Implement convolutional 1D kernel operations on a frequency spectrum array to detect rapid note transitions (trills)."
        ],
        assessment: "Sequence predictor model generating plausible traditional Ghanaian melody completions."
      }
    ]
  },
  {
    title: "Module 4: Text Representation, Attention & LLMs (Weeks 11-12)",
    description: "Explore Natural Language Processing: from TF-IDF indexing pipelines to self-attention mechanisms and Large Language Models.",
    weeks: [
      {
        weekNum: 11,
        title: "NLP Pipelines & Vector Embeddings",
        theory: [
          "TF-IDF weighting matrices and text tokenization pipelines",
          "Word2Vec neural embedding models and skip-gram architecture",
          "Cosine similarity and high-dimensional semantic spaces"
        ],
        practice: [
          "🛠️ Academic Workshop: Formulate a TF-IDF term-document weighting system to index ethnomusicological oral history archives from central Ghana.",
          "📝 Practical Exercise: Calculate cosine similarities between semantic embeddings of flute techniques like 'Kudjo Moisture Trick' and 'Acoustic Low-Pass'."
        ],
        assessment: "Text search engine indexing oral archives and return semantically relevant references."
      },
      {
        weekNum: 12,
        title: "Transformers & Large Language Models",
        theory: [
          "Scaled dot-product self-attention mechanisms",
          "Multi-head attention blocks and positional encoding structures",
          "Instruction fine-tuning, RLHF, and structured JSON generation prompts"
        ],
        practice: [
          "🛠️ Academic Workshop: Prototype a multi-head self-attention module in TypeScript that processes tokens of traditional flute tablature and scores musical correlation.",
          "📝 Practical Exercise: Trace the matrix multiplication of Query, Key, and Value vectors for a sequence length of 4 notes manually."
        ],
        assessment: "TypeScript-based self-attention block with matrix mathematical walkthrough."
      }
    ]
  },
  {
    title: "Module 5: Responsible AI & Capstones (Weeks 13-14)",
    description: "Apply your competence to a comprehensive capstone development, audited under inclusive ethnomusicological ethics and policy rules.",
    weeks: [
      {
        weekNum: 13,
        title: "Socio-Technical Ethics & Bias Audits",
        theory: [
          "Demographic parity, equal opportunity, and algorithmic fairness metrics",
          "Data privacy, surveillance risk, and algorithmic audit standards",
          "Non-Western ethical paradigms: Ubuntu-centric data ethics"
        ],
        practice: [
          "🛠️ Academic Workshop: Audit an automatic grading algorithm trained on European flute metrics to identify demographic parity bias against traditional African blowing dynamics.",
          "📝 Practical Exercise: Design a data governance framework incorporating Ghanaian 'Ubuntu' philosophical concepts regarding collective data ownership."
        ],
        assessment: "Socio-technical audit report outlining model disparity metrics and mitigation plan."
      },
      {
        weekNum: 14,
        title: "Portfolio Engineering, Showcase & Defence",
        theory: [
          "Academic defence protocols and system presentation standards",
          "Continuous testing pipelines, containerized packaging, and JSDoc guidelines"
        ],
        practice: [
          "🛠️ Academic Workshop: Host a live, containerized deployment simulation of the AITOPIA full-stack suite, defending the system topology and AI-video synchronization to academic evaluators.",
          "📝 Practical Exercise: Document codebases with strict JSDoc structures, execute linter checks, and establish a release readiness blueprint."
        ],
        assessment: "Portfolio compilation with clean lint scores, complete documentation, and system defence."
      }
    ]
  }
];

export const SUPPORT_SYSTEMS: SupportSystem[] = [
  {
    category: "Technology Integration",
    items: [
      "Development Environment: VS Code/Cursor with AI coding assistants and extensions",
      "Version Control: GitHub Desktop with collaborative workflows",
      "Cloud Computing: AWS/Google Cloud credits for larger projects",
      "Collaboration: Slack workspace for real-time communication and resource sharing",
      "Hardware Access: GPU clusters for deep learning experiments"
    ]
  },
  {
    category: "Learning Support Structure",
    items: [
      "Teaching Assistants: Dedicated TAs for hands-on session support",
      "Study Groups: Facilitated peer learning communities with structured activities",
      "Office Hours: Enhanced weekly technical and conceptual support",
      "Mentorship Program: Industry professional mentors for capstone projects",
      "Adaptive Pathways: Multiple difficulty levels and support tracks"
    ]
  },
  {
    category: "Industry Integration",
    items: [
      "Monthly Guest Speakers: AI practitioners from diverse industries and roles",
      "Company Partnership Program: Real project collaborations with local organizations",
      "Career Development: Technical interview preparation and portfolio development",
      "Current Events Integration: Weekly AI news discussions and trend analysis",
      "Certification Pathways: Optional preparation for industry certifications"
    ]
  },
  {
    category: "Assessment Strategy Enhancements",
    items: [
      "Weekly Concept Checks: Low-stakes quizzes and interactive polls",
      "Peer Code Reviews: Structured collaborative learning processes",
      "Learning Journals: Reflective practice and metacognitive development",
      "Progress Portfolios: Cumulative project collection with self-assessment"
    ]
  }
];

export const ACCESSIBILITY_FEATURES: AccessibilityFeature[] = [
  {
    category: "Learning Differences Support",
    items: [
      "Multiple Format Options: Visual, auditory, and kinesthetic learning materials",
      "Flexible Pacing: Self-paced modules with extension options",
      "Alternative Assessments: Project-based alternatives to traditional exams",
      "Assistive Technology: Screen readers, voice recognition, and accessibility tools"
    ]
  },
  {
    category: "Cultural and Global Perspectives",
    items: [
      "Diverse Case Studies: Examples from various cultural and economic contexts",
      "Global Ethics Discussion: Non-Western approaches to AI development",
      "Inclusive Datasets: Representation across demographics and geographies",
      "Multilingual Resources: Key materials available in multiple languages"
    ]
  }
];

export const QUALITY_ASSURANCE: QAStructure = {
  process: [
    "Mid-Course Surveys: Regular student feedback with immediate adjustments",
    "External Industry Advisory Board: Quarterly curriculum review with practitioners",
    "Learning Analytics: Data-driven identification of learning bottlenecks",
    "Instructor Development: Ongoing training in AI education best practices"
  ],
  metrics: [
    "Student Portfolio Quality: Standardized rubrics for project assessment",
    "Career Progression Tracking: 6-month and 1-year post-course follow-up",
    "Industry Partner Feedback: Employer satisfaction with graduate capabilities",
    "Long-term Retention: Knowledge and skill retention assessments"
  ],
  roadmap: [
    {
      phase: "Phase 1: Foundation (Months 1-3)",
      details: [
        "Implement enhanced prerequisite system and pre-course support",
        "Develop comprehensive assessment rubrics and feedback mechanisms",
        "Establish industry partnerships and guest speaker network",
        "Create adaptive learning pathways and support materials"
      ]
    },
    {
      phase: "Phase 2: Enhancement (Months 4-6)",
      details: [
        "Launch extended capstone timeline with industry projects",
        "Implement comprehensive mentorship and TA support programs",
        "Develop advanced learning analytics and progress tracking",
        "Establish quality assurance and continuous improvement processes"
      ]
    },
    {
      phase: "Phase 3: Excellence (Months 7-12)",
      details: [
        "Create advanced follow-up courses and specialization tracks",
        "Establish comprehensive instructor training and certification program",
        "Develop research partnerships and publication opportunities",
        "Launch alumni network and continuing education programs"
      ]
    }
  ]
};

export const PRESET_VIDEOS = [
  {
    id: "atenteben-dirge",
    title: "Atɛntɛbɛn Flute Dirge Secrets - Kudjo's Masterclass",
    description: "Kudjo teaches how to play the traditional Ashanti Funeral Dirge on the Ghanaian Atɛntɛbɛn bamboo flute.",
    transcript: `Hello! I am Kudjo.
I have been playing Atɛntɛbɛn a bamboo flute from Ghana since 1972. 

In this video tutorial series, I will finally be revealing the Dirge Secrets, on how to play the Atɛntɛbɛn part for the Ashanti Funeral Dirge.
There have been a lot of requests for the notes played in the Ashanti Funeral Dirge on this channel.

Let me be clear - the Ashanti Funeral Dirge is one of the sacred flute songs passed down to each generation using the Oral Tradition method. 
Students spend time with a Master Atɛntɛbɛnist, over a period of time picking up the musical techniques needed to play the funeral Dirge.
Instead, I will show you how to play the flute and gradually bring the playing of the dirge to the forefront.

#1 - Love the drums
The flute speaks the language with the help of the drums.
There are many secrets and tips to learn when it comes to playing the flute part of the funeral dirge. First, let me start by showing the first Dirge Secret.
Number 1 Love the drums!
Drumming and dancing have been part of Ghanaian culture for the longest time. 
All my friends played drums as kids.
Interlude 1 with [ Djembe ]

#2 - Love the flutes
As a teenager, I fell in love with playing drums and discovered very quickly that they went very well with the Atɛntɛbɛn.  
Adding drums to the flute always adds more body and substance to a performance.

#3 - Moisturize with Water!
Yes, soaking the flute in water for a good 10 minutes before a performance can produce a nice moist and warm tone instead of a dry one.
Getting even a bigger and deeper bucket filled with water, and holding the flute completely immersed also works to moisturize the Atɛntɛbɛn.
Leave comments below if you have other moisturizer ideas.

#4 - Flute Length
The length of the Atɛntɛbɛn makes a difference to the sound of the root note.
Here are three flutes I have to illustrate this secret.
When planning to play in a group the length of the flutes needs to be the same.  
So the shorter flute will be good for a solo performance.

#5 - Know Thy Flute
Let’s take a closer look at some of my flutes.  
There are 6 holes in the front, 1 hole in the back.   
Note that the front holes are grouped into 3 sets of 2.
Covering all the holes except for the last hole and blowing softly gets you the Root note used to start the dirge.
Interlude 2 with [ Djembe ]

#6 - Basic 8 note scale
Doh Ray Me Fah Soh La Te Doh - Ascending
Doh Te La So Fah Me Ray Doh - Descending

#7 - Descending & Ascending
Doh Ray Me Fah Soh La Te Doh
Doh Ray Me Fah Soh La Te Doh

#8 - Practice Speed
Doh Ray Me Fah Soh La Te Doh
Doh Te La So Fah Me Ray Doh
Interlude 3 with [ Djembe ]

In the next tutorial, we will learn a few more secrets by putting multiple notes together, all part of the dirge patterns.

-- Contents of this video --
00:00:00:00 - Wild Turkey Studios presents
00:00:13:20 - Hello, I am Kudjo
00:01:35:26 - Love the drums
00:02:02:00 - Interlude 1 with Djembe
00:02:10:00 - Love the flutes
00:02:27:00 - Moisturize with Water!
00:03:09:00 - Flute Length
00:03:29:00 - Interlude 2 with Djembe
00:03:38:00 - Know Thy Flute
00:04:50:00 - Basic 8 Note Scale
00:05:27:00 - Descending and Ascending Scales
00:06:09:00 - Practice Speed Play
00:06:57:00 - Interlude with Djembe`
  }
];
