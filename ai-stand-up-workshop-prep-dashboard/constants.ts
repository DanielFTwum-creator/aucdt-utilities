import { Tab, TeamMember, TechConcept, TeamMemberId } from './types';

export const TABS: Tab[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'status', label: 'Team Status' },
    { id: 'workshop', label: 'AI Workshop Deep Dive' },
    { id: 'concepts', label: 'Tech Concepts' },
    { id: 'admin', label: 'Admin' },
    { id: 'selftest', label: 'Puppeteer Self-Test' },
];

export const TEAM_MEMBERS: Record<TeamMemberId, TeamMember> = {
    daniel: {
        id: 'daniel',
        name: 'Daniel Twum',
        update: 'Preparing for the AI workshop on Monday. Also dealing with a YouTube copyright flag on a new video due to background music. Highlighted that the AI detection is "getting amazingly better."',
        blocker: {
            text: 'No technical blockers, but facing a strategic challenge with faculty skepticism towards AI adoption.',
            isCritical: false,
        },
        quote: '"Think of judgment day when you are doing these things. Judgment Day, they will see this guy unknowingly reduce the volume... to hide the fact that he stole that the lumbers music."'
    },
    mandela: {
        id: 'mandela',
        name: 'Mandela Vudugah',
        update: 'Successfully pulled the dev front-end (Angular UI) into SQA. Working on the pipeline YAML file, which he identifies as part of "Infrastructure via code" (CI/CD).',
        blocker: {
            text: 'The SQA environment uses `pnpm`, which is incompatible with some old packages in the Angular project. He is currently working on removing these old packages to achieve compatibility.',
            isCritical: true,
        },
    },
    jerry: {
        id: 'jerry',
        name: 'Jerry',
        update: 'Completed some uploads and uploaded one new item this morning. Also responsible for taking student attendance. Daniel noted his job is "not easy" due to distractions.',
        blocker: {
            text: 'Progress is "slowing down" because he has only one tablet. He must use this single device to both take attendance for incoming students and perform the upload of results.',
            isCritical: true,
        },
    }
};

export const TECH_CONCEPTS: TechConcept[] = [
    {
        title: 'YouTube Copyright AI',
        description: 'A sophisticated system YouTube uses to automatically detect copyrighted material (especially music) in uploaded videos. It can flag a video immediately upon posting, as Daniel experienced. Mandela suggested lowering the volume and talking over it, but Daniel noted the AI is "getting amazingly better" at catching such tricks.'
    },
    {
        title: 'CI/CD (Infrastructure via Code)',
        description: 'Stands for Continuous Integration / Continuous Deployment. Daniel referred to this as "coding infrastructure via code." In this context, Mandela\'s `pipeline.yaml` file is the "code" that defines the "infrastructure." This file tells the system (Bitbucket) how to automatically take the application code, build it, and deploy it (e.g., as WAR files) to the correct servers (like SQA).'
    },
    {
        title: '`pnpm` (Performant npm)',
        description: 'A package manager for JavaScript (like `npm` or `yarn`). Mandela\'s blocker is that the SQA server uses `pnpm`, but the Angular project has older packages that are not compatible with it. He must remove or update these packages before the automated CI/CD pipeline will work.'
    },
    {
        title: 'Green Screen (Chroma Key)',
        description: 'A "trick used in Hollywood" where a subject is filmed against a solid-colored (usually bright green) background. In post-production, a video editor (like CapCut) can digitally remove the green color and replace it with any other image or video. Daniel\'s demo will use AI to *generate* an image that already includes a green screen, ready for this process.'
    }
];