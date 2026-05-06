CREATE DATABASE IF NOT EXISTS newsfeed;
USE newsfeed;

INSERT INTO feeds (id, title, source, category, is_active) VALUES
('feed_001', 'TechBridge News', 'internal', 'technology', true),
('feed_002', 'Education Updates', 'external', 'education', true),
('feed_003', 'Industry Reports', 'external', 'general', true);

INSERT INTO articles (id, feed_id, headline, summary, author, published_at, views) VALUES
('art_001', 'feed_001', 'AI Integration in Education', 'Latest developments in EdTech', 'John Smith', '2026-02-24 10:00:00', 145),
('art_002', 'feed_002', 'New Curriculum Framework', 'Updates to academic standards', 'Jane Doe', '2026-02-23 14:30:00', 82),
('art_003', 'feed_003', 'Digital Transformation', 'Industry shift towards cloud', 'Mike Johnson', '2026-02-22 09:15:00', 203);
