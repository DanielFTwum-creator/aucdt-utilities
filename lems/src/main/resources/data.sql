-- Enhanced Seed Data for LEMS
-- Source: GTEC Curriculum Documents — Techbridge University College / AsanSka University College
-- Updated: 2026-06-13

USE lems;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE evaluation_ratings;
TRUNCATE TABLE lecturer_evaluations;
TRUNCATE TABLE course_lecturers;
TRUNCATE TABLE courses;
TRUNCATE TABLE lecturers;
TRUNCATE TABLE programmes;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- PROGRAMMES (9 total: 7 Design, 2 Engineering)
-- ============================================================
INSERT INTO programmes (id, name, code, description, level, total_credits, mentor_institution) VALUES
(1, 'B.Tech Digital Media and Communication Design', 'DMCD', 'B.Tech Digital Media and Communication Design', 'B.Tech', 120, NULL),
(2, 'B.Tech Fashion Design Technology', 'FDT', 'B.Tech Fashion Design Technology', 'B.Tech', 120, NULL),
(3, 'Certificate Fashion Design Technology', 'CFDT', 'Certificate Fashion Design Technology', 'Certificate', 60, NULL),
(4, 'B.A. Jewellery Design Technology', 'JDT', 'B.A. Jewellery Design Technology', 'B.A.', 120, NULL),
(5, 'Diploma Jewellery Design Technology', 'DJDT', 'Diploma Jewellery Design Technology', 'Diploma', 90, NULL),
(6, 'B.A. Product Design & Entrepreneurship', 'PDE', 'B.A. Product Design & Entrepreneurship', 'B.A.', 120, NULL),
(7, 'Diploma Product Design', 'DPD', 'Diploma Product Design', 'Diploma', 90, NULL);

-- ============================================================
-- LECTURERS (24 total, with qualifications and departments)
-- ============================================================
INSERT INTO lecturers (id, first_name, last_name, email, department, qualification) VALUES
(1,  'Dr.',   'Addo',           'addo@techbridge.edu.gh',          'Design & Technology',       'PhD'),
(2,  'Mr.',   'Daitey',         'daitey@techbridge.edu.gh',        'Design & Technology',       'M.Sc.'),
(3,  'Mr.',   'Boateng',        'boateng@techbridge.edu.gh',       'Communication & Languages', 'M.A.'),
(4,  'Mr.',   'Agbosu',         'agbosu@techbridge.edu.gh',        'Information Technology',    'M.Sc.'),
(5,  'Mr.',   'Ahiabu',         'ahiabu@techbridge.edu.gh',        'Design & Technology',       'M.Sc.'),
(6,  'Mr.',   'Wellington',     'wellington@techbridge.edu.gh',    'Digital Media',             'B.Sc.'),
(7,  'Mr.',   'Buchag',         'buchag@techbridge.edu.gh',        'Design & Technology',       'M.Sc.'),
(8,  'Ms.',   'Kushitor',       'kushitor@techbridge.edu.gh',      'Fashion Design',            'M.Sc.'),
(9,  'Ms.',   'Oduro',          'oduro@techbridge.edu.gh',         'Fashion Design',            'M.Sc.'),
(10, 'Mr.',   'Nutifafa',       'nutifafa@techbridge.edu.gh',      'Textile Design',            'M.A.'),
(11, 'Ms.',   'Takyi',          'takyi@techbridge.edu.gh',         'Fashion Design',            'B.Sc.'),
(12, 'Ms.',   'Honu',           'honu@techbridge.edu.gh',          'Fashion Design',            'M.Sc.'),
(13, 'Mr.',   'Adjacodjoe',     'adjacodjoe@techbridge.edu.gh',   'CAD & Technology',          'M.Sc.'),
(14, 'Mr.',   'Ntim Pipim',     'ntim_pipim@techbridge.edu.gh',   'Entrepreneurship & Business', 'M.B.A.'),
(15, 'Mr.',   'Morrison',       'morrison@techbridge.edu.gh',      'Pattern Technology',        'M.Sc.'),
(16, 'Mr.',   'Ofori',          'ofori@techbridge.edu.gh',         'Jewellery & Metalwork',     'B.Sc.'),
(17, 'Dr.',   'Sackey',         'sackey@techbridge.edu.gh',        'Research Methods',          'PhD'),
(18, 'Mr.',   'Tattah',         'tattah@techbridge.edu.gh',        'Product Design',            'M.Sc.'),
(19, 'Mr.',   'Amevor',         'amevor@techbridge.edu.gh',        'Technical Drawing',         'M.Sc.'),
(20, 'Ms.',   'Vivian Yeboah',  'vivian_yeboah@techbridge.edu.gh', 'Fashion Design',           'B.Sc.'),
(21, 'Mr.',   'Owusu',          'owusu@techbridge.edu.gh',         'Metallurgy & Materials',   'M.Sc.'),
(22, 'Mrs.',  'Elsie Mills',    'mills@techbridge.edu.gh',         'Communication & Languages', 'M.Ed.'),
(23, 'Ms.',   'Doris Boakyewaa','boakyewaa@techbridge.edu.gh',    'Design & Technology',       'B.Sc.'),
(24, 'Mr.',   'Obeng',          'obeng@techbridge.edu.gh',         'Digital Media',             'M.Sc.');

-- ============================================================
-- COURSES — B.TECH DIGITAL MEDIA AND COMMUNICATION DESIGN (1–47)
-- ============================================================
INSERT INTO courses (id, name, code, description, semester, credits, type, programme_id) VALUES
(1,  'AUCDT 115 - Intro to African Art & Culture',      'aucdt_115',       'Introduction to African art forms, cultural heritage, and their influence on contemporary design.',                             1, 3, 'Core',      1),
(2,  'AUCDT 116 - Intro to Communication Skills',       'aucdt_116',       'Development of communication skills including presentation, writing, and interpersonal skills.',                                1, 3, 'Core',      1),
(3,  'DMCD 112 - Basic Design',                         'dmcd_112',        'Fundamentals of design including principles, elements, color theory, and composition.',                                         1, 3, 'Core',      1),
(4,  'AUCDT 114 - Basic Drawing',                       'aucdt_114',       'Foundational drawing techniques including perspective, proportion, shading, and observation.',                                   1, 3, 'Core',      1),
(5,  'AUCDT 117 - Intro to Info & Comm Tech',           'aucdt_117',       'Introduction to information technology tools and communication platforms.',                                                      1, 3, 'Core',      1),
(6,  'DMCD 113 - Intro to Communication Design',        'dmcd_113',        'Principles and practices of communication design for visual media.',                                                             1, 3, 'Core',      1),
(7,  'DMCD 111 - Intro to Digital Media',               'dmcd_111',        'Overview of digital media technologies, formats, and applications in contemporary design.',                                      1, 3, 'Core',      1),
(8,  'DMCD 114 - Intro to Comp Graphics Apps',          'dmcd_114_graph',  'Introduction to computer graphics software including Adobe Creative Suite and design applications.',                            1, 3, 'Core',      1),
(9,  'DMCD 122 - Idea Development Techniques',          'dmcd_122',        'Methods and techniques for generating, developing, and refining creative design ideas.',                                         2, 3, 'Core',      1),
(10, 'DMCD 121 - Basic Programming',                    'dmcd_121',        'Introduction to programming concepts and languages relevant to digital media.',                                                  2, 3, 'Core',      1),
(11, 'DMCD 125 - Intro to Typography',                  'dmcd_125',        'Principles of typography, typeface selection, and type composition for design.',                                                 2, 3, 'Core',      1),
(12, 'DMCD 126 - Image Manipulation',                   'dmcd_126',        'Techniques for digital image editing, manipulation, and enhancement.',                                                           2, 3, 'Core',      1),
(13, 'DMCD 123 - Basic Rendering Techniques',           'dmcd_123',        'Fundamentals of 2D and 3D rendering techniques for visual communication.',                                                      2, 3, 'Core',      1),
(14, 'DMCD 124 - Design History',                       'dmcd_124',        'History of design movements, styles, and influential designers from past to present.',                                           2, 3, 'Core',      1),
(15, 'AUCDT 126 - Communication Skills',                'aucdt_126',       'Advanced communication skills for professional and academic contexts.',                                                           2, 3, 'Core',      1),
(16, 'AUCDT 127 - Info & Comm Tech',                    'aucdt_127',       'Advanced information and communication technologies for design practitioners.',                                                  2, 3, 'Core',      1),
(17, 'DMCD 236 - Intro to Animation',                   'dmcd_236',        'Principles of animation including motion, timing, and animation software.',                                                      3, 3, 'Core',      1),
(18, 'DMCD 231 - Corporate Identity',                   'dmcd_231',        'Design and development of comprehensive corporate identity systems and branding.',                                               3, 3, 'Core',      1),
(19, 'DMCD 232 - Print Design',                         'dmcd_232',        'Design principles and production techniques for print media.',                                                                    3, 3, 'Core',      1),
(20, 'DMCD 233 - Typography & Basic Layout',            'dmcd_233',        'Advanced typography and layout composition for print and digital media.',                                                        3, 3, 'Core',      1),
(21, 'DMCD 235 - Print Production',                     'dmcd_235',        'Print production processes, prepress, and quality control.',                                                                      3, 3, 'Core',      1),
(22, 'DMCD 234 - Fundamentals of Photography',          'dmcd_234',        'Photography fundamentals including composition, lighting, exposure, and editing.',                                               3, 3, 'Core',      1),
(23, 'DMCD 237 - Intro to Production Mgmt',             'dmcd_237',        'Introduction to project and production management in creative industries.',                                                      3, 3, 'Core',      1),
(24, 'DMCD 242 - Digital Print Technology',             'dmcd_242',        'Digital printing technologies and their applications in design production.',                                                     4, 3, 'Core',      1),
(25, 'DMCD 244 - Digital Photography',                  'dmcd_244',        'Advanced digital photography techniques for design and editorial use.',                                                          4, 3, 'Core',      1),
(26, 'DMCD 241 - Brand and Identity Systems',           'dmcd_241',        'Comprehensive brand and identity system design and implementation.',                                                              4, 3, 'Core',      1),
(27, 'DMCD 245 - Digital Print Production',             'dmcd_245',        'Digital production workflow and quality standards for print media.',                                                              4, 3, 'Core',      1),
(28, 'DMCD 246 - Video Production & Motion',            'dmcd_246',        'Video production, editing, and motion graphics design.',                                                                         4, 3, 'Core',      1),
(29, 'DMCD 243 - Web Design',                           'dmcd_243',        'Web design principles, user experience, and responsive design.',                                                                 4, 3, 'Core',      1),
(30, 'DMCD 353 - Online Media Technology',              'dmcd_353',        'Online media technologies, streaming, and digital distribution.',                                                                5, 3, 'Core',      1),
(31, 'DMCD 352 - Advertising Design',                   'dmcd_352',        'Advertising design, copywriting, and campaign development.',                                                                      5, 3, 'Core',      1),
(32, 'DMCD 351 - Book & Magazine Design',               'dmcd_351',        'Book and magazine design including layout, typography, and production.',                                                         5, 3, 'Core',      1),
(33, 'DMCD 354 - Animation',                            'dmcd_354',        'Advanced animation techniques and character animation.',                                                                          5, 3, 'Core',      1),
(34, 'DMCD 355 - Copywriting',                          'dmcd_355',        'Copywriting for advertising, web, and multimedia applications.',                                                                  5, 3, 'Core',      1),
(35, 'DMCD 357 - Motion Graphics',                      'dmcd_357',        'Motion graphics design and animation for broadcast and digital media.',                                                          5, 3, 'Core',      1),
(36, 'DMCD 356 - Video Production',                     'dmcd_356',        'Professional video production including cinematography and post-production.',                                                     5, 3, 'Core',      1),
(37, 'AUCDT 352 - Seminar in DMCD',                     'aucdt_352',       'Seminar exploring contemporary issues and research in digital media and communication design.',                                  5, 2, 'Mandatory', 1),
(38, 'AUCDT 351 - Intro to Entrepreneurship',           'aucdt_351',       'Entrepreneurship principles and business planning for creative professionals.',                                                  5, 3, 'Elective',  1),
(39, 'ACDT 352 - Research Methods',                     'acdt_352',        'Research methodologies and design inquiry approaches.',                                                                           5, 3, 'Core',      1),
(40, 'ACDT 351 - Industrial Attachment',                'acdt_351',        'Supervised practical experience in professional design practice.',                                                               6, 6, 'Practical', 1),
(41, 'DMCD 471 - Sound Production',                     'dmcd_471',        'Audio design, sound editing, and sound production for multimedia.',                                                              7, 3, 'Core',      1),
(42, 'DMCD 352 - Interactive Animation',                'dmcd_352_anim',   'Interactive animation and interactive multimedia design.',                                                                       7, 3, 'Core',      1),
(43, 'DMCD 472 - Portfolio Development',                'dmcd_472',        'Professional portfolio development and presentation for employment.',                                                             7, 3, 'Core',      1),
(44, 'DMCD 473 - Video Post Production',                'dmcd_473',        'Advanced video post-production, color grading, and visual effects.',                                                             7, 3, 'Core',      1),
(45, 'DMCD 475 - Advertising Design Technology',        'dmcd_475',        'Advanced advertising design and advertising technology integration.',                                                             8, 3, 'Core',      1),
(46, 'AUCDT 472 - Thesis / Project',                    'aucdt_472',       'Capstone design thesis project demonstrating advanced knowledge and skills.',                                                    8, 6, 'Research',  1),
(47, 'AUCDT 471 - Entrepreneurship',                    'aucdt_471',       'Advanced entrepreneurship and business development for design ventures.',                                                        8, 3, 'Core',      1),

-- ============================================================
-- COURSES — B.TECH FASHION DESIGN TECHNOLOGY (48–91)
-- ============================================================
(48, 'ACDT 115 - Intro to African Art & Culture',       'acdt_115_fdt',    'Introduction to African art and cultural heritage in fashion design.',                                                           1, 3, 'Core',      2),
(49, 'ACDT 116 - Communication Skills I',               'acdt_116_fdt',    'Communication skills for fashion design professionals.',                                                                          1, 3, 'Core',      2),
(50, 'FDT 114 - Sewing Techniques',                     'fdt_114',         'Fundamental sewing techniques and machine operation for garment construction.',                                                  1, 3, 'Core',      2),
(51, 'ACDT 114 - Basic Drawing',                        'acdt_114_fdt',    'Drawing fundamentals for fashion design including figure and garment sketching.',                                                1, 3, 'Core',      2),
(52, 'FDT 111 - Introduction to Fashion',               'fdt_111',         'History, trends, and fundamentals of fashion design and the fashion industry.',                                                  1, 3, 'Core',      2),
(53, 'ACDT 117 - Info & Comm Tech I',                   'acdt_117_fdt',    'Information and communication technology tools for fashion design.',                                                              1, 3, 'Core',      2),
(54, 'FDT 113 - Basic Pattern Technology',              'fdt_113',         'Pattern drafting fundamentals and basic pattern grading.',                                                                        1, 3, 'Core',      2),
(55, 'FDT 112 - Introduction to Textiles',              'fdt_112',         'Textile fibers, yarns, weaves, and fabric properties for fashion.',                                                              1, 3, 'Core',      2),
(56, 'FDT 122 - Textile Design',                        'fdt_122',         'Textile pattern design, printing, and dyeing techniques.',                                                                        2, 3, 'Core',      2),
(57, 'FDT 123 - Pattern Adaptation',                    'fdt_123',         'Adapting and modifying existing patterns for different silhouettes.',                                                             2, 3, 'Core',      2),
(58, 'FDT 124 - Garment Construction',                  'fdt_124',         'Advanced garment construction techniques and finishing methods.',                                                                 2, 3, 'Core',      2),
(59, 'ACDT 126 - Communication Skills II',              'acdt_126_fdt',    'Advanced communication skills for fashion presentations and marketing.',                                                          2, 3, 'Core',      2),
(60, 'FDT 125 - Freehand Cutting',                      'fdt_125',         'Freehand pattern cutting and draping techniques.',                                                                                2, 3, 'Core',      2),
(61, 'FDT 126 - Basic Design',                          'fdt_126_fdt',     'Design principles applied to fashion design and garment aesthetics.',                                                            2, 3, 'Core',      2),
(62, 'ACDT 127 - Info & Comm Tech II',                  'acdt_127_fdt',    'Advanced ICT applications in fashion design and production.',                                                                    2, 3, 'Core',      2),
(63, 'FDT 121 - Intro to Creative Design in Fashion',   'fdt_121_fdt',     'Creative design principles and conceptualization for fashion.',                                                                   2, 3, 'Core',      2),
(64, 'FDT 237 - Basic Computer Aided Design',           'fdt_237_fdt',     'CAD software for fashion design and pattern grading.',                                                                           3, 3, 'Core',      2),
(65, 'FDT 235 - Introduction to Fabric Studies',        'fdt_235_fdt',     'In-depth study of fabric characteristics and performance.',                                                                      3, 3, 'Core',      2),
(66, 'FDT 234 - Garment Technology I',                  'fdt_234',         'Garment construction technology and quality control.',                                                                            3, 3, 'Core',      2),
(67, 'FDT 232 - Printed Textile Design Application',    'fdt_232_fdt',     'Application of printed textile designs in fashion garments.',                                                                    3, 3, 'Core',      2),
(68, 'FDT 231 - Creative Design in Fashion',            'fdt_231_fdt',     'Advanced creative design concepts and innovative garment design.',                                                               3, 3, 'Core',      2),
(69, 'FDT 233 - Pattern Technology I',                  'fdt_233_fdt',     'Advanced pattern grading and marker making.',                                                                                    3, 3, 'Core',      2),
(70, 'FDT 239 - Intro to Production Management',        'fdt_239',         'Fashion production planning and management.',                                                                                     3, 3, 'Core',      2),
(71, 'FDT 238 - Introduction to Fashion Accessories',   'fdt_238',         'Design and production of fashion accessories.',                                                                                   3, 3, 'Core',      2),
(72, 'FDT 236 - Fashion Illustration',                  'fdt_236_fdt',     'Fashion illustration techniques and presentation.',                                                                               3, 3, 'Core',      2),
(73, 'FDT 241 - Basic Fashion Design and Illustration', 'fdt_241_fdt',     'Fashion design development and professional illustration.',                                                                      4, 3, 'Core',      2),
(74, 'FDT 245 - Millinery Design and Production',       'fdt_245',         'Design and production of hats and millinery accessories.',                                                                       4, 3, 'Elective',  2),
(75, 'FDT 244 - Fabric Studies',                        'fdt_244',         'Advanced fabric science and performance testing.',                                                                                4, 3, 'Core',      2),
(76, 'FDT 246 - Computer-Aided Design',                 'fdt_246',         'Advanced CAD applications for fashion design and production.',                                                                   4, 3, 'Core',      2),
(77, 'FDT 242 - Pattern Technology II',                 'fdt_242',         'Advanced pattern technology and grading systems.',                                                                                4, 3, 'Core',      2),
(78, 'FDT 243 - Garment Technology II',                 'fdt_243',         'Advanced garment construction and finishing techniques.',                                                                         4, 3, 'Core',      2),
(79, 'FDT 248 - Production Management',                 'fdt_248',         'Fashion production management and supply chain.',                                                                                  4, 3, 'Core',      2),
(80, 'FDT 247 - Fashion Marketing',                     'fdt_247_fdt',     'Fashion marketing and brand development.',                                                                                        4, 3, 'Core',      2),
(81, 'FDT 352 - Garment Decoration Techniques',         'fdt_352',         'Embellishment and decoration techniques for fashion garments.',                                                                   5, 3, 'Core',      2),
(82, 'FDT 351 - Design and Illustration',               'fdt_351_fdt',     'Advanced fashion design and illustration skills.',                                                                                5, 3, 'Core',      2),
(83, 'FDT 355 - Design & Production of Bags & Slippers','fdt_355',         'Design and production of leather goods and footwear.',                                                                           5, 3, 'Elective',  2),
(84, 'FDT 354 - Fashion Draping',                       'fdt_354',         'Garment draping techniques and three-dimensional design.',                                                                       5, 3, 'Core',      2),
(85, 'FDT 353 - Pattern Alteration',                    'fdt_353_fdt',     'Advanced pattern alteration and modification techniques.',                                                                       5, 3, 'Core',      2),
(86, 'FDT 357 - Seminar in Fashion',                    'fdt_357',         'Seminar exploring contemporary issues in fashion design and industry.',                                                           5, 2, 'Mandatory', 2),
(87, 'FDT 356 - Entrepreneurship I',                    'fdt_356',         'Entrepreneurship for fashion designers and fashion business.',                                                                    5, 3, 'Elective',  2),
(88, 'ACDT 352 - Research Methods',                     'acdt_352_fdt',    'Research methodologies in fashion design and industry.',                                                                          5, 3, 'Core',      2),
(89, 'ACDT 351 - Industrial Attachment',                'acdt_351_fdt',    'Supervised practical experience in fashion industry.',                                                                            6, 6, 'Practical', 2),
(90, 'FDT 471 - Collection Development',                'fdt_471',         'Development of cohesive fashion collections and line planning.',                                                                  7, 3, 'Core',      2),
(91, 'FDT 473 - Beauty Culture',                        'fdt_473',         'Beauty, grooming, and personal styling in fashion context.',                                                                      8, 3, 'Elective',  2),

-- ============================================================
-- COURSES — CERTIFICATE FASHION DESIGN TECHNOLOGY (92–98)
-- ============================================================
(92, 'CFDT 235 - Intro to Fabric Studies',              'cfdt_235',        'Introduction to fabric types and characteristics.',                                                                               1, 3, 'Core',      3),
(93, 'CFDT 114 - Garment Construction',                 'cfdt_114',        'Basic garment construction techniques.',                                                                                          1, 3, 'Core',      3),
(94, 'CFDT 247 - Fashion Marketing',                    'cfdt_247',        'Marketing strategies for fashion products.',                                                                                       2, 3, 'Core',      3),
(95, 'CFDT 113 - Basic Pattern Technology',             'cfdt_113',        'Pattern drafting basics for fashion.',                                                                                            1, 3, 'Core',      3),
(96, 'CFDT 236 - Fashion Illustration',                 'cfdt_236',        'Basic fashion illustration techniques.',                                                                                          2, 3, 'Core',      3),
(97, 'CFDT 233 - Pattern Technology I',                 'cfdt_233',        'Intermediate pattern technology.',                                                                                                2, 3, 'Core',      3),
(98, 'CFDT 234 - Garment Technology I',                 'cfdt_234',        'Intermediate garment construction technology.',                                                                                   2, 3, 'Core',      3),

-- ============================================================
-- COURSES — B.A. JEWELLERY DESIGN TECHNOLOGY (99–127)
-- ============================================================
(99,  'ACDT 115 - Intro to African Art & Culture',      'acdt_115_jdt',    'Introduction to African art forms and their cultural significance in jewellery design.',                                         1, 3, 'Core',      4),
(100, 'ACDT 116 - Communication Skills I',              'acdt_116_jdt',    'Communication skills for design professionals.',                                                                                  1, 3, 'Core',      4),
(101, 'ACDT 113 - Foundations in Technical Drawing',    'acdt_113_jdt',    'Foundational technical drawing for jewellery design.',                                                                            1, 3, 'Core',      4),
(102, 'ACDT 114 - Basic Drawing',                       'acdt_114_jdt',    'Basic drawing techniques and observational skills.',                                                                              1, 3, 'Core',      4),
(103, 'BJDT 111 - Intro to Jewellery Design',           'bjdt_111',        'Exposes students to metal as principal material in jewellery making, reviews history of jewellery making worldwide.',           1, 3, 'Core',      4),
(104, 'ACDT 117 - Info & Comm Tech I',                  'acdt_117_jdt',    'Information and communication technology basics.',                                                                                1, 3, 'Core',      4),
(105, 'ACDT 112 - Workshop Safety Practices',           'acdt_112_jdt',    'Safety protocols and practices for jewellery workshop.',                                                                          1, 2, 'Mandatory', 4),
(106, 'ACDT 231 - Intro to Entrepreneurship',           'acdt_231_jdt',    'Entrepreneurship for jewellery designers and makers.',                                                                            3, 3, 'Core',      4),
(107, 'BJDT 232 - Basic Fabrication and Finishing',     'bjdt_232',        'Introduction to basic jewellery fabrication techniques emphasising hand techniques for single piece jewellery.',               3, 3, 'Core',      4),
(108, 'BJDT 236 - 3D Modelling in Computer',            'bjdt_236',        '3D CAD modelling for jewellery design.',                                                                                         3, 3, 'Core',      4),
(109, 'BJDT 233 - Alloy Calculation, Measuring and Marking', 'bjdt_233',   'Teaches use of measuring tools including steel rules, callipers, micrometres, and metal gauge tools.',                         3, 3, 'Core',      4),
(110, 'BJDT 234 - Intro to Metallurgy',                 'bjdt_234',        'Introduces fundamental principles of metallurgy relevant to jewellery making.',                                                  3, 3, 'Core',      4),
(111, 'BJDT 231 - Concept Design and Modelling',        'bjdt_231_concept','Concept development and design modelling for jewellery.',                                                                        3, 3, 'Core',      4),
(112, 'BJDT 235 - Refining, Assaying & Hallmarking',   'bjdt_235',        'Covers assaying, refining and hallmarking processes in jewellery manufacturing.',                                               3, 3, 'Core',      4),
(113, 'BJDT 245 - Metallurgy',                          'bjdt_245',        'Covers advanced metallurgical principles and applications in jewellery making.',                                                  4, 3, 'Core',      4),
(114, 'BJDT 241 - Practical Design and Modelling Processes', 'bjdt_241',   'Practical design processes and 3D modelling techniques.',                                                                       4, 3, 'Core',      4),
(115, 'BJDT 246 - Advanced Computer Application',       'bjdt_246',        'Advanced CAD and computer applications for jewellery.',                                                                          4, 3, 'Core',      4),
(116, 'BJDT 244 - Jewellery Surface Coating Methods',   'bjdt_244',        'Covers surface coating and finishing methods for jewellery pieces.',                                                             4, 3, 'Core',      4),
(117, 'BJDT 242 - Fabrication and Finishing Techniques','bjdt_242',        'Advanced fabrication and finishing techniques.',                                                                                  4, 3, 'Core',      4),
(118, 'BJDT 243 - Jewellery Casting Methods',           'bjdt_243',        'Teaches various casting methods used in jewellery production.',                                                                   4, 3, 'Core',      4),
(119, 'ACDT 247 - Developing a New Venture',            'acdt_247_jdt',    'Business planning and new venture development.',                                                                                  4, 3, 'Core',      4),
(120, 'BJDT 352 - Fabrication and Finishing Practices', 'bjdt_352_jdt',    'Advanced practicum in fabrication and finishing techniques for jewellery.',                                                      5, 3, 'Core',      4),
(121, 'BJDT 353 - Intro to Gemmology',                  'bjdt_353',        'Introduces fundamental principles and practices of gemstone identification and grading.',                                        5, 3, 'Core',      4),
(122, 'BJDT 354 - Intro to Gem Setting',                'bjdt_354',        'Introduces techniques and practices for setting gemstones in jewellery.',                                                        5, 3, 'Core',      4),
(123, 'BJDT 351 - Advanced Designs and Modelling Techniques', 'bjdt_351',  'Advanced design and modelling for complex jewellery.',                                                                          5, 3, 'Core',      4),
(124, 'ACDT 356 - Business Management and Sustainability', 'acdt_356_jdt', 'Business management and sustainable practices in jewellery industry.',                                                           5, 3, 'Core',      4),
(125, 'BJDT 355 - Seminar in Jewellery',                'bjdt_355',        'Seminar presentations covering contemporary issues and research in jewellery design.',                                           5, 2, 'Mandatory', 4),
(126, 'ACDT 352 - Research Methods',                    'acdt_352_jdt',    'Research methodologies for jewellery design.',                                                                                    5, 3, 'Core',      4),
(127, 'ACDT 351 - Industrial Attachment',               'acdt_351_jdt',    'Supervised practical experience in jewellery industry.',                                                                         6, 6, 'Practical', 4),

-- ============================================================
-- COURSES — DIPLOMA JEWELLERY DESIGN TECHNOLOGY (128–139)
-- ============================================================
(128, 'ACDT 115 - Intro to African Art & Culture',      'acdt_115_jdt_dip','Introduction to African art in jewellery context.',                                                                             1, 3, 'Core',      5),
(129, 'ACDT 116 - Communication Skills I',              'acdt_116_jdt_dip','Communication skills for jewellery professionals.',                                                                              1, 3, 'Core',      5),
(130, 'ACDT 113 - Foundations in Technical Drawing',    'acdt_113_jdt_dip','Technical drawing for jewellery.',                                                                                               1, 3, 'Core',      5),
(131, 'ACDT 114 - Basic Drawing',                       'acdt_114_jdt_dip','Basic drawing and sketching.',                                                                                                   1, 3, 'Core',      5),
(132, 'BJDT 111 - Intro to Jewellery Design',           'bjdt_111_dip',    'Introduction to jewellery design.',                                                                                              1, 3, 'Core',      5),
(133, 'ACDT 117 - Info & Comm Tech I',                  'acdt_117_jdt_dip','Information technology basics.',                                                                                                 1, 3, 'Core',      5),
(134, 'ACDT 112 - Workshop Safety Practices',           'acdt_112_dip',    'Workshop safety and practices.',                                                                                                  1, 2, 'Mandatory', 5),
(135, 'DJDT 231 - Fabrication and Finishing Practices', 'djdt_231',        'Jewellery fabrication and finishing.',                                                                                            2, 3, 'Core',      5),
(136, 'ACDT 236 - Advanced Computer Application in Jewellery', 'acdt_236_jdt_dip', 'CAD applications in jewellery design.',                                                                                2, 3, 'Core',      5),
(137, 'DJDT 232 - Alloy Calculation, Measuring and Marking', 'djdt_232',   'Alloy work and measurement.',                                                                                                    2, 3, 'Core',      5),
(138, 'DJDT 233 - Intro to Metallurgy',                 'djdt_233',        'Metal properties and metallurgy.',                                                                                               2, 3, 'Core',      5),
(139, 'ACDT 237 - Research Methodology',                'acdt_237_jdt_dip','Research methods for jewellery studies.',                                                                                        3, 3, 'Core',      5),

-- ============================================================
-- COURSES — B.A. PRODUCT DESIGN & ENTREPRENEURSHIP (140–172)
-- ============================================================
(140, 'ACDT 115 - Intro to African Art & Culture',      'acdt_115_pde',    'African art and cultural influences on product design.',                                                                         1, 3, 'Core',      6),
(141, 'ACDT 116 - Communication Skills I',              'acdt_116_pde',    'Professional communication skills.',                                                                                              1, 3, 'Core',      6),
(142, 'ACDT 113 - Technical Drawing',                   'acdt_113_pde',    'Technical drawing and CAD basics.',                                                                                              1, 3, 'Core',      6),
(143, 'ACDT 114 - Basic Drawing',                       'acdt_114_pde',    'Basic drawing skills for product design.',                                                                                       1, 3, 'Core',      6),
(144, 'BPDE 111 - Intro to Industrial/Product Design',  'bpde_111',        'Introduction to product design and industrial design principles.',                                                               1, 3, 'Core',      6),
(145, 'ACDT 117 - Info & Comm Tech I',                  'acdt_117_pde',    'Information technology for designers.',                                                                                          1, 3, 'Core',      6),
(146, 'ACDT 112 - Safety in Workshop Practices',        'acdt_112_pde',    'Workshop safety protocols.',                                                                                                      1, 2, 'Mandatory', 6),
(147, 'ACDT 125 - Intro to Computer-Aided-Design',      'acdt_125_pde',    'Introduction to CAD software for product design.',                                                                               1, 3, 'Core',      6),
(148, 'BPDE 122 - Workshop Practices',                  'bpde_122',        'Workshop practices and hand tool skills.',                                                                                        2, 3, 'Core',      6),
(149, 'BPDE 123 - Orthographic and Isometric Projections', 'bpde_123',     'Technical drawing projections for product design.',                                                                              2, 3, 'Core',      6),
(150, 'ACDT 126 - Communication Skills II',             'acdt_126_pde',    'Advanced professional communication.',                                                                                            2, 3, 'Core',      6),
(151, 'BPDE 124 - Freehand Drawing Techniques',         'bpde_124',        'Freehand sketching and visualization.',                                                                                          2, 3, 'Core',      6),
(152, 'BPDE 121 - Idea Development and Design Processes','bpde_121',       'Design ideation and creative problem-solving.',                                                                                  2, 3, 'Core',      6),
(153, 'ACDT 127 - Info & Comm Tech II',                 'acdt_127_pde',    'Advanced ICT applications for design.',                                                                                          2, 3, 'Core',      6),
(154, 'BPDE 235 - Manufacturing Processes 1',           'bpde_235_pde',    'Manufacturing processes and materials for products.',                                                                             3, 3, 'Core',      6),
(155, 'BPDE 231 - Intro to Modelling',                  'bpde_231_pde',    'Introduction to physical and digital modelling.',                                                                                3, 3, 'Core',      6),
(156, 'BPDE 236 - Three-Dimensional in Computing',      'bpde_236_pde',    '3D CAD modelling and visualization.',                                                                                           3, 3, 'Core',      6),
(157, 'BPDE 234 - Nature of Materials & Processes',     'bpde_234',        'Material science and manufacturing processes.',                                                                                   3, 3, 'Core',      6),
(158, 'BPDE 233 - Perspective Drawing',                 'bpde_233_pde',    'Perspective drawing for product visualization.',                                                                                  3, 3, 'Core',      6),
(159, 'ACDT 231 - Intro to Entrepreneurship',           'acdt_231_pde',    'Entrepreneurship fundamentals for designers.',                                                                                    3, 3, 'Core',      6),
(160, 'BPDE 232 - Product Design Methods',              'bpde_232_pde',    'Systematic product design methodologies.',                                                                                        3, 3, 'Core',      6),
(161, 'BPDE 241 - Design for Use',                      'bpde_241_pde',    'User-centered product design and ergonomics.',                                                                                   4, 3, 'Core',      6),
(162, 'BPDE 245 - Objects and Impacts',                 'bpde_245_pde',    'Societal and environmental impacts of product design.',                                                                          4, 3, 'Core',      6),
(163, 'BPDE 246 - Advanced Computer Application',       'bpde_246_pde',    'Advanced CAD and rendering for product design.',                                                                                 4, 3, 'Core',      6),
(164, 'BPDE 242 - Visual Communication and Package Design', 'bpde_242',    'Packaging design and visual communication.',                                                                                     4, 3, 'Core',      6),
(165, 'BPDE 244 - Contextual Nature of Products',       'bpde_244_pde',    'Cultural and contextual aspects of product design.',                                                                             4, 3, 'Core',      6),
(166, 'BPDE 243 - Ergonomics and Human Factors Applications', 'bpde_243_pde', 'Ergonomic design and human factors in product design.',                                                                     4, 3, 'Core',      6),
(167, 'BPDE 247 - New Venture Creation',                'bpde_247_pde',    'Business planning and product commercialization.',                                                                                4, 3, 'Core',      6),
(168, 'BPDE 354 - Design and Development',              'bpde_354_pde',    'Advanced product design development and iteration.',                                                                              5, 3, 'Core',      6),
(169, 'BPDE 351 - Practical Model Making Techniques',   'bpde_351_pde',    'Model making and prototype development.',                                                                                        5, 3, 'Core',      6),
(170, 'BPDE 352 - Product Interface Design',            'bpde_352_pde',    'Interface design and user experience for products.',                                                                             5, 3, 'Core',      6),
(171, 'ACDT 356 - Business Management and Sustainability', 'acdt_356_pde', 'Business management and sustainable product design.',                                                                            5, 3, 'Core',      6),
(172, 'BPDE 353 - Workshop Practice I',                 'bpde_353_pde',    'Advanced workshop practice and fabrication.',                                                                                    5, 3, 'Core',      6),

-- ============================================================
-- COURSES — DIPLOMA PRODUCT DESIGN (173–179)
-- ============================================================
(173, 'ACDT 115 - Intro to African Art & Culture',      'acdt_115_pde_dip','African influences on product design.',                                                                                         1, 3, 'Core',      7),
(174, 'ACDT 116 - Communication Skills I',              'acdt_116_pde_dip','Communication fundamentals.',                                                                                                    1, 3, 'Core',      7),
(175, 'DPD 113 - Foundations in Technical Drawing',     'dpd_113',         'Technical drawing basics.',                                                                                                       1, 3, 'Core',      7),
(176, 'DPD 114 - Idea Development and Design Processes','dpd_114',         'Design thinking and ideation.',                                                                                                   1, 3, 'Core',      7),
(177, 'DPD 111 - Intro to Industrial/Product Design',   'dpd_111',         'Introduction to product design discipline.',                                                                                      1, 3, 'Core',      7),
(178, 'ACDT 117 - Info & Comm Tech I',                  'acdt_117_pde_dip','IT fundamentals.',                                                                                                               1, 3, 'Core',      7),
(179, 'ACDT 112 - Safety in Workshop Practices',        'acdt_112_pde_dip','Safety in workshops.',                                                                                                           1, 2, 'Mandatory', 7);

-- ============================================================
-- COURSE–LECTURER ASSIGNMENTS
-- ============================================================
INSERT INTO course_lecturers (course_id, lecturer_id) VALUES
-- DMCD
(1, 1), (2, 3), (3, 2), (4, 2), (5, 4), (6, 5), (7, 6), (8, 7),
(9, 5), (10, 6), (11, 5), (12, 7), (13, 6), (14, 6), (15, 3), (16, 4),
(17, 6), (18, 5), (19, 7), (20, 5), (21, 7), (22, 6), (23, 5),
(24, 7), (25, 6), (26, 5), (27, 7), (28, 5), (29, 4),
(30, 4), (31, 5), (32, 7), (33, 6), (34, 4), (35, 5), (36, 16),
(37, 1), (38, 14), (39, 1),
-- ID 40 (Industrial Attachment) — no lecturer
(41, 16), (42, 16), (43, 4), (44, 16),
(45, 5), (46, 7), (47, 14),
-- FDT
(48, 1), (49, 3), (50, 8), (51, 2), (52, 9), (53, 4), (54, 11), (55, 10),
(56, 10), (57, 9), (58, 9), (59, 3), (60, 12), (61, 11), (62, 4), (63, 12),
(64, 13), (65, 9), (66, 9), (67, 10), (68, 11), (69, 9), (70, 14), (71, 11), (72, 10),
(73, 11), (74, 11), (75, 10), (76, 13), (77, 15), (78, 15), (79, 14), (80, 14),
(81, 12), (82, 10), (83, 11), (84, 8), (85, 9), (86, 1), (87, 14), (88, 1),
-- ID 89 (Industrial Attachment) — no lecturer
(90, 12), (91, 11),
-- Certificate FDT
(92, 10), (93, 20), (94, 14), (95, 20), (96, 10), (97, 20), (98, 20),
-- JDT BA
(99, 1), (100, 3), (101, 19), (102, 2), (103, 1), (104, 4), (105, 16),
(106, 14), (107, 16), (108, 13), (109, 21), (110, 21), (111, 16), (112, 1),
(113, 21), (114, 16), (115, 13), (116, 16), (117, 16), (118, 21), (119, 14),
(120, 16), (121, 21), (122, 1), (123, 21), (124, 14),
(125, 1), (125, 16), (125, 21),  -- BJDT 355 Seminar (3 lecturers)
(126, 1),
-- ID 127 (Industrial Attachment) — no lecturer
-- Diploma JDT
(128, 1), (129, 3), (130, 19), (131, 2), (132, 1), (133, 4), (134, 16),
(135, 16), (136, 13), (137, 21), (138, 21), (139, 17),
-- PDE BA
(140, 1), (141, 3), (142, 19), (143, 2), (144, 13), (145, 4), (146, 16), (147, 2),
(148, 18), (149, 19), (150, 3), (151, 2), (152, 13), (153, 4),
(154, 18), (155, 13), (156, 2), (157, 18), (158, 2), (159, 14), (160, 13),
(161, 2), (162, 2), (163, 13), (164, 5), (165, 13), (166, 2), (167, 14),
(168, 13), (169, 18), (170, 2), (171, 14), (172, 18),
-- Diploma PDE
(173, 1), (174, 3), (175, 19), (176, 13), (177, 13), (178, 4), (179, 16);
