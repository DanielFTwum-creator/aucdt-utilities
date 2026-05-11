import { Stage } from './types';
import {
    BrainIcon,
    PencilIcon,
    DocumentTextIcon,
    EyeIcon,
    CubeIcon,
    PhotographIcon,
    DevicePhoneMobileIcon,
    ViewfinderCircleIcon,
    CodeBracketIcon,
    ChatBubbleLeftRightIcon
} from './components/icons';

export const STAGES: Stage[] = [
    {
        id: 1,
        icon: BrainIcon,
        title: 'Stage 1: Conceptualization',
        subtitle: 'From Abstract Idea to Initial Vision',
        content: {
            description: 'Product conceptualization is the foundational stage where an abstract idea is given initial form. The "initial vision" defines how a product will look, feel, and function before detailed engineering begins. This phase is not just about a single idea but is a strategic blend of creativity and analysis.',
            points: [
                { title: 'Problem Definition', description: 'Clearly identifying the user\'s problem that the product will solve.', details: 'This is the cornerstone of successful product design. It involves user interviews, surveys, and empathy mapping to move beyond surface-level assumptions and uncover the core, unmet needs of the target audience. A well-defined problem statement acts as a north star for the entire project.' },
                { title: 'Market Research', description: 'Analyzing competitors, identifying target user demographics, and understanding market needs.', details: 'Effective market research involves a SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) of competitors, defining user personas to represent the target audience, and identifying gaps in the market that the new product can fill. This data-driven approach minimizes risk and aligns the product with market realities.' },
                { title: 'Ideation', description: 'Brainstorming a wide range of potential solutions using techniques like mind mapping and SCAMPER.', details: 'The goal of ideation is quantity over quality initially. Techniques like SCAMPER encourage thinking from different angles: Substitute components, Combine features, Adapt existing ideas, Modify functionality, Put to another use, Eliminate unnecessary parts, and Reverse the process. This structured creativity helps break conventional thinking patterns.' },
                { title: 'Concept Validation', description: 'Narrowing down ideas and vetting them against business goals, technical feasibility, and market demand.', details: 'Once a pool of ideas is generated, they are filtered through a validation matrix. Each concept is scored on criteria like potential ROI, alignment with brand strategy, required resources, and technical complexity. The highest-scoring concepts proceed to the next stage.' }
            ]
        },
        imageUrl: 'https://picsum.photos/1200/800?random=1'
    },
    {
        id: 2,
        icon: PencilIcon,
        title: 'Stage 2: Sketching',
        subtitle: 'Translating Concepts into Tangible Visuals',
        content: {
            description: 'Sketching is the fundamental tool for translating abstract concepts into tangible, visual forms. It is a rapid, iterative, and low-cost method for exploring and communicating ideas.',
            points: [
                { title: 'Ideation Sketches', description: 'Simple, quick doodles to capture the essence of many different ideas, focusing on quantity and speed.', details: 'Also known as "thumbnail sketches," these are not meant to be pretty. They are about exploring variations in form, layout, and flow with maximum speed. A designer might create dozens of these in a single session to exhaust all possibilities before settling on a direction.' },
                { title: 'Explanatory Sketches', description: 'More refined drawings used to explain a specific function, shape, or interaction to team members.', details: 'These sketches often include annotations, callouts, and cross-sections to clarify complex details. They serve as a visual language that bridges the gap between designers, engineers, and product managers, ensuring everyone shares the same understanding of a specific feature.' },
                { title: 'Persuasive Sketches', description: 'High-quality, detailed renderings designed to sell an idea to a client or manager, focusing on visual appeal.', details: 'These are the most polished form of sketches, often created with digital tools like tablets or rendered with markers to add color, shadow, and material texture. Their purpose is emotional impact—to make the concept feel real, desirable, and worth investing in.' },
                { title: 'Techniques', description: 'Using correct perspective, line weight, and shading to define form and hierarchy in 3D space.', details: 'Proper technique is crucial. Using varied line weights (thicker lines for outlines, thinner for details) creates visual depth. Basic shading indicates light sources and gives the 2D sketch a sense of volume and form, making it easier to interpret as a three-dimensional object.' }
            ]
        },
        imageUrl: 'https://picsum.photos/1200/800?random=2'
    },
    {
        id: 3,
        icon: DocumentTextIcon,
        title: 'Stage 3: Specification',
        subtitle: 'The Master Document for Production',
        content: {
            description: 'A product specification sheet (or "spec sheet") is the master document that defines the product for manufacturers and engineers. It must be clear, precise, and comprehensive to avoid errors in production.',
            points: [
                { title: 'Product Requirements', description: 'Defining exact dimensions, tolerances (e.g., 25mm +/- 0.1mm), and performance metrics (e.g., "withstand 50kg of force").', details: 'This section translates design goals into measurable engineering targets. It includes everything from the product\'s weight and center of gravity to its expected battery life and data processing speed. Every claim made by marketing must be backed by a specific requirement here.' },
                { title: 'Material Sourcing & Selection', description: 'Specifying exact material types (e.g., ABS, Grade MG94), physical/chemical properties, and compliance certifications (e.g., RoHS, FDA).', details: 'This is a highly detailed process. For a plastic part, this includes specifying the resin manufacturer, color code (e.g., Pantone 285C), texture (e.g., MT-11010), and any required additives like UV inhibitors. For electronics, it specifies exact component part numbers. This precision is vital for supply chain management and quality control.' },
                { title: 'Packaging & Labeling', description: 'Detailing how the product should be packed for shipping and what information labels must contain (e.g., batch numbers).', details: 'Packaging specifications include the type of cardboard, foam inserts, and protective bags to be used, along with drop-test requirements to ensure the product survives transit. Labeling requirements cover legal necessities like serial numbers, country of origin, and regulatory marks (CE, FCC), ensuring global compliance.' }
            ]
        },
        imageUrl: 'https://picsum.photos/1200/800?random=3'
    },
    {
        id: 4,
        icon: EyeIcon,
        title: 'Stage 4: Visualization & Presentation',
        subtitle: 'Creating Compelling Product Representations',
        content: {
            description: 'This stage involves creating visual representations of the final product for marketing, stakeholder approval, or internal review. The goal is to present the product appealingly and understandably.',
            points: [
                { title: '2D Visualization', description: 'Includes professional photography, graphic design, and persuasive sketches.', details: 'This encompasses everything from creating the product\'s logo and branding guide to shooting hero images for websites and print ads. Graphic design elements are used to create infographics that explain key features in a visually digestible format.' },
                { title: '3D Visualization', description: 'Creating photorealistic 3D models and renderings to show the product from any angle, color, or setting.', details: 'Using advanced software like KeyShot or V-Ray, 3D artists can create images that are often indistinguishable from real photographs. This allows for perfect lighting and environment control, and enables the creation of marketing materials long before the first physical product is ready.' },
                { title: 'Video', description: 'Product videos to demonstrate functionality, show the product in use, and tell a compelling story.', details: 'A well-produced video can significantly boost conversion rates. This can range from a 30-second social media ad to a detailed tutorial or an emotional brand story. Motion graphics are often used to highlight features that are difficult to show in live-action footage.' },
                { title: 'Extended Reality (XR)', description: 'Using AR and VR to offer immersive ways to experience the product before it exists physically.', details: 'XR is a powerful sales and training tool. For example, a medical device company can use VR to train surgeons on a new instrument, or an automotive brand can use AR to let customers see a new car in their own driveway and configure its colors and options in real-time.' }
            ]
        },
        imageUrl: 'https://picsum.photos/1200/800?random=4'
    },
    {
        id: 5,
        icon: CubeIcon,
        title: 'Stage 5: 3D Model Generation',
        subtitle: 'Digital Representation for Design and Manufacturing',
        content: {
            description: 'A 3D model is a mathematical, digital representation of a product\'s surface. This is a critical asset used for design validation, simulation, marketing, and manufacturing (e.g., 3D printing or CNC machining).',
            points: [
                { title: 'Traditional Methods', description: 'Historically required expert-level skills in complex CAD (Computer-Aided Design) software.', details: 'CAD software like SolidWorks, CATIA, or Autodesk Fusion 360 are the industry standard. They allow engineers to create precise, "parametric" models where dimensions can be updated, and the entire model intelligently rebuilds itself. This precision is essential for manufacturing.' },
                { title: 'AI-Powered Revolution', description: 'New AI tools can create 3D models from simple text prompts or 2D images, dramatically speeding up the early design and prototyping process.', details: 'While not yet as precise as traditional CAD for final engineering, generative AI is a game-changer for conceptual design. It allows designers to rapidly generate and iterate on 3D forms, textures, and styles in minutes instead of hours, freeing up more time for creative exploration.' }
            ]
        },
        imageUrl: 'https://picsum.photos/1200/800?random=5'
    },
    {
        id: 6,
        icon: PhotographIcon,
        title: 'Stage 6: Product Marketing',
        subtitle: 'High-Resolution Lifestyle Images',
        content: {
            description: 'This marketing strategy focuses on creating high-resolution images that show the product being used in a real-world context, or "lifestyle." The goal is to show how it fits into the customer\'s life, not just what it is.',
            points: [
                { title: 'Contextual Storytelling', description: 'Carefully staged images to be authentic, well-lit, and aspirational, helping customers visualize themselves owning the product.', details: 'A great lifestyle photo tells a story. An image of a high-tech coffee maker isn\'t just about the machine; it\'s about the peaceful morning ritual, the beautifully lit kitchen, and the feeling of starting the day right. Every prop, color, and element in the frame is chosen to support this narrative.' },
                { title: 'Persuasive Design', description: 'Far more persuasive than simple product photos on a white background.', details: 'Product-on-white (or "packshot") images are essential for e-commerce listings, but they appeal to the logical brain. Lifestyle images appeal to the emotional brain. They create a connection and a desire that is critical for building a premium brand and justifying a higher price point.' },
                { title: 'Marketing Ready', description: 'Images are often designed with "negative space" to allow for the placement of marketing copy, logos, and branding.', details: 'This is a key technical consideration during the photoshoot. The photographer and art director will compose shots with intentionally "empty" areas (like a clean wall or a blurred background) where a graphic designer can later add a headline, a call-to-action, or a company logo without cluttering the image.' }
            ]
        },
        imageUrl: 'https://picsum.photos/1200/800?random=6'
    },
    {
        id: 7,
        icon: DevicePhoneMobileIcon,
        title: 'Stage 7: Augmented Reality (AR)',
        subtitle: 'Bridging the Imagination Gap',
        content: {
            description: 'Augmented Reality overlays a 3D model onto your view of the real world through a smartphone camera. Below, you can try an interactive preview to place a model in your room.',
            points: [
                { title: 'Virtual Try-Ons', description: 'Allowing users to virtually try on makeup, hair color, shoes, watches, or glasses.', details: 'Using advanced facial or body tracking, AR apps can accurately place a digital product on the user. This is incredibly effective for high-consideration purchases where fit and style are crucial, as it provides a personalized and interactive preview.' },
                { title: 'Product Placement', description: 'Apps like IKEA\'s "Place" allow customers to place true-to-scale 3D models of furniture in their own rooms.', details: 'This application of AR solves the question, "Will it fit?" By using a smartphone\'s camera and sensors, the app can measure the real-world space and place a 3D model with accurate dimensions, letting the user walk around it and see it from all angles.' },
                { title: 'Key Benefits', description: 'This interactive experience has been shown to significantly increase conversion rates and reduce product return rates.', details: 'By giving customers a better understanding of the product before they buy, AR builds confidence and manages expectations. This leads to more satisfied customers and fewer costly returns, which is a major logistical and financial benefit for any e-commerce business.' }
            ]
        },
        imageUrl: 'https://picsum.photos/1200/800?random=7'
    },
    {
        id: 8,
        icon: ViewfinderCircleIcon,
        title: 'Stage 8: Virtual Reality (VR)',
        subtitle: 'Immersive Simulation for Design and Review',
        content: {
            description: 'Virtual Reality immerses you in a fully virtual environment using a headset. Use the interactive preview below to enter a VR space and inspect the product model at full scale.',
            points: [
                { title: 'Immersive Design Review', description: 'Engineers and designers can "stand next to" a full-scale virtual model of a car, machinery, or building.', details: 'This is known as 1:1 scale immersion. In VR, you can walk around a virtual car, sit in the driver\'s seat, and check sightlines. This provides a sense of scale and presence that is impossible to achieve on a flat computer screen, leading to better, more human-centric design decisions.' },
                { title: 'Flaw Identification', description: 'Immersion makes it easier to spot ergonomic issues, design flaws, or assembly problems that are difficult to see on a 2D screen.', details: 'For example, a factory planner can use VR to simulate an assembly line. They can physically "walk" the line and perform tasks to check if a worker has enough clearance for a tool or if a control panel is positioned at an uncomfortable height. This can prevent costly real-world mistakes.' },
                { title: 'Global Team Collaboration', description: 'Teams can meet in a shared virtual space to interact with and review the same product model in real-time.', details: 'VR platforms like NVIDIA Omniverse allow engineers from Germany, designers from California, and marketers from Japan to all meet as avatars in the same virtual space. They can collectively inspect, annotate, and even disassemble a 3D product model, streamlining communication and accelerating decision-making.' }
            ]
        },
        imageUrl: 'https://picsum.photos/1200/800?random=8'
    },
    {
        id: 9,
        icon: CodeBracketIcon,
        title: 'Stage 9: AI for Software Integration',
        subtitle: 'Automating the Development Pipeline',
        content: {
            description: 'Complex 3D and graphic design software (like Unity or Blender) is highly extensible and can be automated using custom scripts. AI is now making this accessible to non-programmers.',
            points: [
                { title: 'Natural Language to Code', description: 'A designer can type a command like, "write a script to make all selected objects rotate," and the AI generates the code.', details: 'AI models trained on vast libraries of code can understand the user\'s intent from plain English and translate it into syntactically correct code in languages like Python or C#. This empowers artists and designers to create custom tools without needing to become expert programmers.' },
                { title: 'Automate Tedious Tasks', description: 'AI can automate repetitive actions, such as renaming hundreds of objects, optimizing assets, or batch-processing files.', details: 'In game development or visual effects, an artist might have to manually process hundreds of texture files. An AI-generated script can automate this entire workflow—resizing images, converting formats, and applying compression—saving hours of manual labor and reducing human error.' },
                { title: 'Debug Errors', description: 'AI can analyze error messages and suggest code fixes, lowering the technical barrier for artists and designers.', details: 'When a script fails, the resulting error messages can be cryptic to non-programmers. Modern AI can analyze the error log, cross-reference it with the code, and provide a clear explanation of what went wrong and how to fix it, acting as an instant, on-demand programming tutor.' }
            ]
        },
        imageUrl: 'https://picsum.photos/1200/800?random=9'
    },
    {
        id: 10,
        icon: ChatBubbleLeftRightIcon,
        title: 'Stage 10: AI for Feedback & Criticism',
        subtitle: 'The AI as a Collaborative Partner',
        content: {
            description: 'This is one of the most transformative uses of AI, moving it from a simple tool to a collaborative partner for product refinement.',
            points: [
                { title: 'User Feedback Analysis', description: 'AI tools can analyze thousands of user reviews and support tickets to identify trends, sentiment, and common pain points at scale.', details: 'Natural Language Processing (NLP) allows AI to read and understand human language. It can scan thousands of app reviews and categorize feedback into buckets like "feature requests," "bugs," or "pricing complaints." It can also perform sentiment analysis to gauge whether customer feedback is generally positive, negative, or neutral.' },
                { title: 'Constructive Design Criticism', description: 'Generative AI can act as a direct feedback mechanism, providing rapid, iterative, and objective criticism to help designers refine their products.', details: 'A designer can upload a product image and ask the AI, "Critique the ergonomics of this handle." The AI, trained on design principles, can provide instant feedback like, "The handle appears too thin for a comfortable grip, and the sharp edges could cause pressure points during prolonged use." This allows for rapid design iteration.' },
                { title: 'Superior Feedback', description: 'A 2024 Cambridge study found AI-generated feedback was perceived as more supportive, inspiring, and coherent than feedback from human educators.', details: 'The study suggests that AI can deliver criticism in a way that is objective and non-judgmental, which recipients find less threatening and more actionable. Because the AI has no personal ego, its feedback is focused purely on improving the product, fostering a more positive and productive design cycle.' }
            ]
        },
        imageUrl: 'https://picsum.photos/1200/800?random=10'
    }
];