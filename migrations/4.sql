
-- Insert migration data for all tasks from previous system
-- First, let's insert tasks for the main board (assuming board_id = 1)

-- Insert all completed tasks into the Done column (assuming column_id = 4 for Done)
INSERT INTO tasks (column_id, title, task_type, city, requester_name, requester_email, priority, project_link, position, created_at, updated_at) VALUES
(4, 'academic calendar and key dates', 'Update/Technical', 'Stirling Schools/All Cities', 'Ibrahim', 'ibrahimyousif.0098@gmail.com', 'medium', 'https://stirlingschools.sharepoint.com/:f:/s/educationoffice/ErYt4tl1AxFAgqaGQvXXjRYBOxJZ7bo3wa516Xxqbee32w?e=OqRDR0', 0, '2025-10-01 05:38:39', '2025-10-01 08:11:16'),
(4, 'American Service, Baloon, exam paper, Medal inpo, paper temp a5 - a4', 'Design', 'Stirling Schools/All Cities', 'Samar', 'samar.ahmed@stirlingschools.co.uk', 'medium', 'https://stirlingschools.sharepoint.com/:f:/s/MarketingTEAM/EpfUNEiTdjNLp8KJxt1Bwf0Be7_f54PlTSN0wQdYAIDorw?e=UTCmiT', 1, '2025-10-01 05:50:49', '2025-10-01 05:54:06'),
(4, 'Wezary Champions Campaign in Stirling Schools', 'Design', 'Stirling Schools/All Cities', 'Samar', 'samar.ahmed@stirlingschools.co.uk', 'medium', 'https://stirlingschools.sharepoint.com/:f:/s/MarketingTEAM/ElJ4tMYIxnRDt6rfB6z9-dABZrLjX1mMcjXvuz3Xsu_3AA?e=lnl9ok', 2, '2025-10-01 07:14:53', '2025-10-13 08:08:57'),
(4, 'rise mewlid nabi program', 'Video/Photo', 'Stirling Schools/All Cities', 'Erhan', 'erhan.bedri@stirlingschools.co.uk', 'medium', 'https://www.facebook.com/reel/1252524983345424', 3, '2025-10-01 12:08:30', '2025-10-01 12:08:53'),
(4, 'ishik secondary soyınlanması cience etkinliği', 'Video/Photo', '', 'Erhan', '', 'medium', 'https://www.facebook.com/reel/3547805645361509', 4, '2025-10-01 12:10:14', '2025-10-01 12:10:32'),
(4, 'ishik secondary öğrenci toplantı', 'Video/Photo', '', 'Erhan', '', 'medium', 'https://www.facebook.com/photo/?fbid=1211581561002053&set=pcb.1211582687668607', 5, '2025-10-01 12:11:33', '2025-10-01 12:11:53'),
(4, 'slemani primary 1 librarry', 'Video/Photo', '', 'Erhan', '', 'medium', 'https://www.facebook.com/reel/1325469629375087', 6, '2025-10-01 12:13:08', '2025-10-01 12:13:29'),
(4, 'us girls highi school veli toplantı', 'Video/Photo', '', 'Erhan', '', 'medium', 'https://www.facebook.com/photo/?fbid=785334694128038&set=pcb.785335440794630', 7, '2025-10-01 12:16:54', '2025-10-01 12:17:19'),
(4, 'bagdad ana okul', 'Video/Photo', 'Stirling Schools/All Cities', 'Ahmed', 'ahmed.ekrem@stirlingschools.co.uk', 'medium', 'https://stirlingschools.sharepoint.com/:f:/s/MarketingArchive/EjHSp0GHiipKijeHHlQRCwQBhAoV6gMXmytJhpwZH4KSQw?e=HoLvhZ', 8, '2025-10-05 06:37:28', '2025-10-06 05:51:33'),
(4, 'soran video montaj', 'Video/Photo', '', 'Ahmed', '', 'medium', 'https://stirlingschools.sharepoint.com/:f:/s/MarketingArchive/EqlBZNCfXXZKhdQY1W3NvNoB-qmKQPkwjafse1CUBmvMew?e=SgG5lL', 9, '2025-10-05 06:38:09', '2025-10-06 11:37:27'),
(4, 'kral gunu icin video loop', 'Video/Photo', '', 'Ahmed', '', 'medium', 'https://stirlingschools.sharepoint.com/:f:/s/MarketingArchive/En6jpP8CnfRAgZpvOK9DOwMBxbfNVhTQbz9dFTQd9LuGLw?e=N11hXe', 10, '2025-10-05 06:39:04', '2025-10-07 09:54:05'),
(4, 'suleymaniye foto cekim', 'Video/Photo', '', 'Ahmed', '', 'medium', 'https://stirlingschools.sharepoint.com/:f:/s/MarketingArchive/EgPkDhEhxzBOgMP4JW5JkssBBB5LUhjVQFD8E8eCLiJ5Nw?e=Mqub61', 11, '2025-10-05 06:40:00', '2025-10-05 06:42:49'),
(4, 'International Translation Day (Facebook)', 'Social Media', 'Stirling Schools/All Cities', 'Mohammed', 'mohammed.yousif@stirlingschools.co.uk', 'medium', 'https://www.facebook.com/523543736455941/posts/1224688573008117', 12, '2025-10-05 06:53:52', '2025-10-05 06:57:15'),
(4, 'International Translation Day (Instagram)', 'Social Media', '', 'Mohammed', '', 'medium', 'https://www.instagram.com/p/DPN6FbjEabq/', 13, '2025-10-05 06:54:11', '2025-10-05 06:57:25'),
(4, 'International Translation Day (Linkedin)', 'Social Media', '', 'Mohammed', '', 'medium', 'https://linkedin.com/feed/update/urn:li:share:7378685847912599552', 14, '2025-10-05 06:54:30', '2025-10-05 06:57:47'),
(4, 'International Translation Day (Twitter)', 'Social Media', '', 'Mohammed', '', 'medium', 'https://twitter.com/a/status/1972920063146578125', 15, '2025-10-05 06:54:54', '2025-10-05 06:57:59'),
(4, 'Back To School Kirkuk (Facebook)', 'Social Media', '', 'Mohammed', '', 'medium', 'https://facebook.com/523543736455941/posts/1224949872981987', 16, '2025-10-05 06:59:18', '2025-10-05 07:02:07'),
(4, 'Back To School Kirkuk (Instagram)', 'Social Media', '', 'Mohammed', '', 'medium', 'https://www.instagram.com/p/DPOjdmhER_w/', 17, '2025-10-05 06:59:34', '2025-10-05 07:02:16'),
(4, 'Back To School Kirkuk (Linkedin)', 'Social Media', '', 'Mohammed', '', 'medium', 'https://linkedin.com/feed/update/urn:li:ugcPost:7378776962020040704', 18, '2025-10-05 06:59:54', '2025-10-05 07:02:31'),
(4, 'Back To School Kirkuk (Twitter)', 'Social Media', '', 'Mohammed', '', 'medium', 'https://twitter.com/a/status/1973011607396438229', 19, '2025-10-05 07:00:09', '2025-10-05 07:03:05'),
(4, 'Back To School Basra (Facebook)', 'Social Media', 'Stirling Schools/All Cities', 'Mohammed', 'mohammed.yousif@stirlingschools.co.uk', 'medium', 'https://facebook.com/523543736455941/posts/1609839959979988', 20, '2025-10-05 08:44:01', '2025-10-05 08:48:51'),
(4, 'Back To School Basra (Instagram)', 'Social Media', '', 'Mohammed', '', 'medium', 'https://www.instagram.com/reel/DPO0mujj09g/', 21, '2025-10-05 08:44:17', '2025-10-05 08:48:58'),
(4, 'Back To School Basra (Twitter)', 'Social Media', '', 'Mohammed', '', 'medium', 'https://twitter.com/a/status/1973048157605863763', 22, '2025-10-05 08:44:53', '2025-10-05 08:49:10'),
(4, 'Back To School Basra (YouTube)', 'Social Media', '', 'Mohammed', '', 'medium', 'https://www.youtube.com/watch?v=XbPycs3ROJg', 23, '2025-10-05 08:46:02', '2025-10-05 08:49:22'),
(4, 'Back To School Basra (TikTok)', 'Social Media', '', 'Mohammed', '', 'medium', 'https://www.tiktok.com/@stirlingschools/video/7555906285275712780', 24, '2025-10-05 08:46:35', '2025-10-05 08:49:36'),
(4, 'Visit of CEO Mr. Green to Kirkuk (Facebook)', 'Social Media', 'Stirling Schools/All Cities', 'Mohammed', 'mohammed.yousif@stirlingschools.co.uk', 'medium', 'https://facebook.com/523543736455941/posts/1225672659576375', 25, '2025-10-05 10:15:11', '2025-10-05 10:18:06');

-- Insert more completed tasks (continuing with smaller batches due to SQL limits)
INSERT INTO tasks (column_id, title, task_type, city, requester_name, requester_email, priority, project_link, position, created_at, updated_at) VALUES
(4, 'Visit of CEO Mr. Green to Kirkuk (Instagram)', 'Social Media', '', 'Mohammed', '', 'medium', 'https://www.instagram.com/p/DPQl4GoEX8a/', 26, '2025-10-05 10:15:39', '2025-10-05 10:18:16'),
(4, 'Visit of CEO Mr. Green to Kirkuk (Linkedin)', 'Social Media', '', 'Mohammed', '', 'medium', 'https://linkedin.com/feed/update/urn:li:ugcPost:7379063701192097792', 27, '2025-10-05 10:16:10', '2025-10-05 10:18:25'),
(4, 'Visit of CEO Mr. Green to Kirkuk (Twitter)', 'Social Media', '', 'Mohammed', '', 'medium', 'https://twitter.com/a/status/1973298344140079295', 28, '2025-10-05 10:16:28', '2025-10-05 10:18:42'),
(4, 'International Day of Older Persons (Facebook)', 'Social Media', '', 'Mohammed', '', 'medium', 'https://facebook.com/523543736455941/posts/1225754882901486', 29, '2025-10-05 10:20:18', '2025-10-05 10:22:11'),
(4, 'International Day of Older Persons (Instagram)', 'Social Media', '', 'Mohammed', '', 'medium', 'https://www.instagram.com/p/DPQzwozEUkt/', 30, '2025-10-05 10:20:35', '2025-10-05 10:22:25'),
(4, 'International Day of Older Persons (Linkedin)', 'Social Media', '', 'Mohammed', '', 'medium', 'https://linkedin.com/feed/update/urn:li:share:7379094151759335424', 31, '2025-10-05 10:20:51', '2025-10-05 10:22:37'),
(4, 'International Day of Older Persons (Twitter)', 'Social Media', '', 'Mohammed', '', 'medium', 'https://twitter.com/a/status/1973328381199482946', 32, '2025-10-05 10:21:06', '2025-10-05 10:22:50'),
(4, 'Wezary Award and Honoring Ceremony (Instagram)', 'Social Media', '', 'Mohammed', '', 'medium', 'https://www.instagram.com/p/DPTqi63kayN/', 33, '2025-10-05 10:24:43', '2025-10-05 10:27:51'),
(4, 'Wezary Award and Honoring Ceremony Slemani (Facebook)', 'Social Media', '', 'Mohammed', '', 'medium', 'https://facebook.com/523543736455941/posts/1226760696134238', 34, '2025-10-05 10:25:06', '2025-10-05 10:27:44'),
(4, 'Wezary Award and Honoring Ceremony Slemani (Linkedin)', 'Social Media', '', 'Mohammed', '', 'medium', 'https://linkedin.com/feed/update/urn:li:ugcPost:7379496023037014016', 35, '2025-10-05 10:25:27', '2025-10-05 10:28:03'),
(4, 'Wezary Award and Honoring Ceremony Slemani (Twitter)', 'Social Media', '', 'Mohammed', '', 'medium', 'https://twitter.com/a/status/1973730613799669928', 36, '2025-10-05 10:25:47', '2025-10-05 10:28:11'),
(4, 'World Teachers Day (Facebook)', 'Social Media', '', 'Mohammed', '', 'medium', 'https://facebook.com/523543736455941/posts/1229210962555878', 37, '2025-10-05 10:29:31', '2025-10-05 10:35:16'),
(4, 'World Teachers Day (Instagram)', 'Social Media', 'Stirling Schools/All Cities', 'Mohammed', 'mohammed.yousif@stirlingschools.co.uk', 'medium', 'https://www.instagram.com/p/DParGfSEdlj/', 38, '2025-10-05 10:31:02', '2025-10-05 10:35:25'),
(4, 'World Teachers Day (Linkedin)', 'Social Media', '', 'Mohammed', '', 'medium', 'https://linkedin.com/feed/update/urn:li:share:7380482488453734400', 39, '2025-10-05 10:31:48', '2025-10-05 10:35:33'),
(4, 'World Teachers Day (Twitter)', 'Social Media', 'Stirling Schools/All Cities', 'Mohammed', 'mohammed.yousif@stirlingschools.co.uk', 'medium', 'https://twitter.com/a/status/1974716722608226351', 40, '2025-10-05 10:33:36', '2025-10-05 10:35:44');

-- Insert active tasks (In Progress)
INSERT INTO tasks (column_id, title, task_type, city, requester_name, requester_email, priority, position, created_at, updated_at) VALUES
(2, 'RAISE TANITIM VIDEO FOTO', 'Video/Photo', '', 'Ahmed', '', 'medium', 0, '2025-10-20 05:51:58', '2025-10-20 07:33:11');

-- Insert backlog tasks (Queue status from original data)
INSERT INTO tasks (column_id, title, task_type, city, requester_name, requester_email, priority, position, created_at, updated_at) VALUES
(1, 'bagdad erkek okul video montaj', 'Video/Photo', '', 'N/A', '', 'medium', 0, '2025-10-05 06:38:34', '2025-10-05 06:38:34'),
(1, 'Stirling Schools Guid Handbook', 'Design', '', 'N/A', '', 'medium', 1, '2025-10-13 08:32:53', '2025-10-13 08:32:53'),
(1, 'USIS', 'Video/Photo', 'Stirling Schools/All Cities', 'Erhan', 'erhan.bedri@stirlingschools.co.uk', 'medium', 2, '2025-10-13 08:54:57', '2025-10-13 08:54:57'),
(1, 'international special day November', 'Update/Technical', '', 'N/A', '', 'medium', 3, '2025-10-19 07:35:13', '2025-10-19 07:35:13'),
(1, 'BASRA RELLS VIDEO OUTRO ABDATE', 'Video/Photo', '', 'N/A', '', 'medium', 4, '2025-10-20 05:53:01', '2025-10-20 05:53:01');
