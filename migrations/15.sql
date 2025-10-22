
-- Insert completed tasks into Done column (column_id = 15) with simpler approach
-- Just insert a few sample tasks to start fresh
INSERT INTO tasks (column_id, title, description, priority, task_type, city, requester_name, requester_email, project_link, position, created_at) VALUES
(15, 'academic calendar and key dates', 'Academic calendar and key dates management', 'medium', 'Update/Technical', 'Stirling Schools', 'Ibrahim', 'ibrahimyousif.0098@gmail.com', 'https://stirlingschools.sharepoint.com/:f:/s/educationoffice/ErYt4tl1AxFAgqaGQvXXjRYBOxJZ7bo3wa516Xxqbee32w?e=OqRDR0', 0, '2025-10-01 05:38:39'),
(15, 'Wezary Champions Campaign in Stirling Schools', 'Wezary Champions Campaign design and materials', 'medium', 'Design', 'Stirling Schools', 'Samar', 'samar.ahmed@stirlingschools.co.uk', 'https://stirlingschools.sharepoint.com/:f:/s/MarketingTEAM/ElJ4tMYIxnRDt6rfB6z9-dABZrLjX1mMcjXvuz3Xsu_3AA?e=lnl9ok', 1, '2025-10-01 07:14:53'),
(15, 'World Teachers Day (Facebook)', 'World Teachers Day Facebook celebration post', 'high', 'Social Media', 'Stirling Schools', 'Mohammed', 'mohammed.yousif@stirlingschools.co.uk', 'https://facebook.com/523543736455941/posts/1229210962555878', 2, '2025-10-05 10:29:31');

-- Insert task in progress
INSERT INTO tasks (column_id, title, description, priority, task_type, city, requester_name, requester_email, position, created_at) VALUES
(13, 'RAISE TANITIM VIDEO FOTO', 'Rise promotional video and photo content', 'high', 'Video/Photo', 'Erbil', 'Ahmed', 'ahmed.ekrem@stirlingschools.co.uk', 0, '2025-10-20 05:51:58');

-- Insert tasks in backlog
INSERT INTO tasks (column_id, title, description, priority, task_type, city, requester_name, requester_email, position, created_at) VALUES
(12, 'Stirling Schools Guide Handbook', 'Stirling Schools guidance handbook design', 'medium', 'Design', 'Stirling Schools', 'Samar', 'samar.ahmed@stirlingschools.co.uk', 0, '2025-10-13 08:32:53'),
(12, 'USIS Video Content', 'USIS video content creation', 'medium', 'Video/Photo', 'Erbil', 'Erhan', 'erhan.bedri@stirlingschools.co.uk', 1, '2025-10-13 08:54:57'),
(12, 'BASRA REELS VIDEO OUTRO UPDATE', 'Basra reels video outro update', 'medium', 'Video/Photo', 'Basra', 'Ahmed', 'ahmed.ekrem@stirlingschools.co.uk', 2, '2025-10-20 05:53:01');
