import { ContentItem, MediaAsset, ClubEvent, AnalyticsData, User } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Asante',
  email: 'alex.a@techbridge.edu.gh',
  role: 'Editor',
  avatar: 'https://picsum.photos/seed/alex/100/100'
};

export const MOCK_CONTENT: ContentItem[] = [
  {
    id: 'c1',
    title: 'The Future of AI in African Tech',
    type: 'Article',
    author: 'Sarah Mensah',
    status: 'Published',
    dateCreated: '2026-02-10',
    datePublished: '2026-02-15',
    views: 1250,
    thumbnail: 'https://picsum.photos/seed/tech/400/300'
  },
  {
    id: 'c2',
    title: 'Campus Gala 2026 Highlights',
    type: 'Video',
    author: 'Kwame Osei',
    status: 'In Review',
    dateCreated: '2026-02-16',
    thumbnail: 'https://picsum.photos/seed/gala/400/300'
  },
  {
    id: 'c3',
    title: 'Techbridge Podcast Ep. 4: Startups',
    type: 'Podcast',
    author: 'Emmanuel Darko',
    status: 'Draft',
    dateCreated: '2026-02-17',
    thumbnail: 'https://picsum.photos/seed/pod/400/300'
  },
  {
    id: 'c4',
    title: 'Design Principles for 2026',
    type: 'Graphic',
    author: 'Ama Boateng',
    status: 'Approved',
    dateCreated: '2026-02-14',
    thumbnail: 'https://picsum.photos/seed/design/400/300'
  }
];

export const MOCK_ASSETS: MediaAsset[] = [
  { id: 'a1', name: 'Campus_Drone_Shot.mp4', type: 'Video', size: '120 MB', uploadedBy: 'Kwame Osei', dateUploaded: '2026-02-01', url: 'https://picsum.photos/seed/drone/300/200' },
  { id: 'a2', name: 'Gala_Banner_V2.png', type: 'Image', size: '2.4 MB', uploadedBy: 'Ama Boateng', dateUploaded: '2026-02-12', url: 'https://picsum.photos/seed/banner/300/200' },
  { id: 'a3', name: 'Interview_Audio_Raw.wav', type: 'Audio', size: '45 MB', uploadedBy: 'Emmanuel Darko', dateUploaded: '2026-02-15', url: 'https://picsum.photos/seed/audio/300/200' },
  { id: 'a4', name: 'Press_Release_Feb.pdf', type: 'Document', size: '1.1 MB', uploadedBy: 'Alex Asante', dateUploaded: '2026-02-10', url: 'https://picsum.photos/seed/doc/300/200' },
];

export const MOCK_EVENTS: ClubEvent[] = [
  { id: 'e1', title: 'Digital Media Workshop', date: '2026-03-05T14:00:00', location: 'Lecture Hall B', attendees: 45, description: 'Learn the basics of digital editing.', status: 'Upcoming' },
  { id: 'e2', title: 'Techbridge Hackathon Media Coverage', date: '2026-03-20T09:00:00', location: 'Innovation Hub', attendees: 120, description: 'Live reporting of the annual hackathon.', status: 'Upcoming' },
  { id: 'e3', title: 'January Monthly Meeting', date: '2026-01-25T16:00:00', location: 'Room 304', attendees: 32, description: 'General assembly and planning.', status: 'Completed' },
];

export const ANALYTICS_DATA: AnalyticsData[] = [
  { name: 'Mon', views: 400, engagement: 240, shares: 24 },
  { name: 'Tue', views: 300, engagement: 139, shares: 18 },
  { name: 'Wed', views: 550, engagement: 380, shares: 45 },
  { name: 'Thu', views: 480, engagement: 290, shares: 30 },
  { name: 'Fri', views: 800, engagement: 580, shares: 75 },
  { name: 'Sat', views: 600, engagement: 400, shares: 50 },
  { name: 'Sun', views: 700, engagement: 430, shares: 60 },
];