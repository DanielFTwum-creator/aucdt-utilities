-- LEMS Production Migration — 2026-06-13
-- Adds missing columns to wms_lems_ tables in tuc_wms_db
-- and backfills all rows with GTEC curriculum data.
-- Safe to re-run: ALTER TABLE uses IF NOT EXISTS, UPDATEs are idempotent.

USE tuc_wms_db;

-- ============================================================
-- 1. ADD MISSING COLUMNS
-- ============================================================

ALTER TABLE wms_lems_programmes
  ADD COLUMN IF NOT EXISTS level            VARCHAR(20)  NULL,
  ADD COLUMN IF NOT EXISTS total_credits    INT          NULL,
  ADD COLUMN IF NOT EXISTS mentor_institution VARCHAR(255) NULL;

ALTER TABLE wms_lems_lecturers
  ADD COLUMN IF NOT EXISTS qualification VARCHAR(20) NULL;

ALTER TABLE wms_lems_courses
  ADD COLUMN IF NOT EXISTS credits INT       NULL,
  ADD COLUMN IF NOT EXISTS type    VARCHAR(20) NULL;

-- ============================================================
-- 2. UPDATE PROGRAMMES (fix codes + set level / total_credits)
-- ============================================================

UPDATE wms_lems_programmes SET code='DMCD',  level='B.Tech',      total_credits=120, mentor_institution=NULL WHERE id=1;
UPDATE wms_lems_programmes SET code='FDT',   level='B.Tech',      total_credits=120, mentor_institution=NULL WHERE id=2;
UPDATE wms_lems_programmes SET code='CFDT',  level='Certificate', total_credits=60,  mentor_institution=NULL WHERE id=3;
UPDATE wms_lems_programmes SET code='JDT',   level='B.A.',        total_credits=120, mentor_institution=NULL WHERE id=4;
UPDATE wms_lems_programmes SET code='DJDT',  level='Diploma',     total_credits=90,  mentor_institution=NULL WHERE id=5;
UPDATE wms_lems_programmes SET code='PDE',   level='B.A.',        total_credits=120, mentor_institution=NULL WHERE id=6;
UPDATE wms_lems_programmes SET code='DPD',   level='Diploma',     total_credits=90,  mentor_institution=NULL WHERE id=7;

-- ============================================================
-- 3. UPDATE LECTURERS (fix departments + set qualification)
-- ============================================================

UPDATE wms_lems_lecturers SET department='Design & Technology',       qualification='PhD'   WHERE id=1;
UPDATE wms_lems_lecturers SET department='Design & Technology',       qualification='M.Sc.' WHERE id=2;
UPDATE wms_lems_lecturers SET department='Communication & Languages', qualification='M.A.'  WHERE id=3;
UPDATE wms_lems_lecturers SET department='Information Technology',    qualification='M.Sc.' WHERE id=4;
UPDATE wms_lems_lecturers SET department='Design & Technology',       qualification='M.Sc.' WHERE id=5;
UPDATE wms_lems_lecturers SET department='Digital Media',             qualification='B.Sc.' WHERE id=6;
UPDATE wms_lems_lecturers SET department='Design & Technology',       qualification='M.Sc.' WHERE id=7;
UPDATE wms_lems_lecturers SET department='Fashion Design',            qualification='M.Sc.' WHERE id=8;
UPDATE wms_lems_lecturers SET department='Fashion Design',            qualification='M.Sc.' WHERE id=9;
UPDATE wms_lems_lecturers SET department='Textile Design',            qualification='M.A.'  WHERE id=10;
UPDATE wms_lems_lecturers SET department='Fashion Design',            qualification='B.Sc.' WHERE id=11;
UPDATE wms_lems_lecturers SET department='Fashion Design',            qualification='M.Sc.' WHERE id=12;
UPDATE wms_lems_lecturers SET department='CAD & Technology',          qualification='M.Sc.' WHERE id=13;
UPDATE wms_lems_lecturers SET department='Entrepreneurship & Business',qualification='M.B.A.'WHERE id=14;
UPDATE wms_lems_lecturers SET department='Pattern Technology',        qualification='M.Sc.' WHERE id=15;
UPDATE wms_lems_lecturers SET department='Jewellery & Metalwork',     qualification='B.Sc.' WHERE id=16;
UPDATE wms_lems_lecturers SET department='Research Methods',          qualification='PhD'   WHERE id=17;
UPDATE wms_lems_lecturers SET department='Product Design',            qualification='M.Sc.' WHERE id=18;
UPDATE wms_lems_lecturers SET department='Technical Drawing',         qualification='M.Sc.' WHERE id=19;
UPDATE wms_lems_lecturers SET department='Fashion Design',            qualification='B.Sc.' WHERE id=20;
UPDATE wms_lems_lecturers SET department='Metallurgy & Materials',    qualification='M.Sc.' WHERE id=21;
UPDATE wms_lems_lecturers SET department='Communication & Languages', qualification='M.Ed.' WHERE id=22;
UPDATE wms_lems_lecturers SET department='Design & Technology',       qualification='B.Sc.' WHERE id=23;
UPDATE wms_lems_lecturers SET department='Digital Media',             qualification='M.Sc.' WHERE id=24;

-- ============================================================
-- 4. UPDATE COURSES — credits and type (179 courses)
-- ============================================================

-- DMCD (1–47)
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=1;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=2;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=3;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=4;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=5;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=6;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=7;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=8;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=9;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=10;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=11;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=12;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=13;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=14;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=15;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=16;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=17;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=18;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=19;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=20;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=21;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=22;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=23;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=24;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=25;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=26;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=27;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=28;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=29;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=30;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=31;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=32;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=33;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=34;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=35;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=36;
UPDATE wms_lems_courses SET credits=2, type='Mandatory' WHERE id=37;
UPDATE wms_lems_courses SET credits=3, type='Elective'  WHERE id=38;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=39;
UPDATE wms_lems_courses SET credits=6, type='Practical' WHERE id=40;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=41;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=42;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=43;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=44;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=45;
UPDATE wms_lems_courses SET credits=6, type='Research'  WHERE id=46;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=47;

-- FDT B.Tech (48–91)
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=48;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=49;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=50;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=51;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=52;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=53;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=54;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=55;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=56;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=57;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=58;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=59;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=60;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=61;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=62;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=63;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=64;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=65;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=66;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=67;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=68;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=69;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=70;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=71;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=72;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=73;
UPDATE wms_lems_courses SET credits=3, type='Elective'  WHERE id=74;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=75;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=76;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=77;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=78;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=79;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=80;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=81;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=82;
UPDATE wms_lems_courses SET credits=3, type='Elective'  WHERE id=83;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=84;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=85;
UPDATE wms_lems_courses SET credits=2, type='Mandatory' WHERE id=86;
UPDATE wms_lems_courses SET credits=3, type='Elective'  WHERE id=87;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=88;
UPDATE wms_lems_courses SET credits=6, type='Practical' WHERE id=89;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=90;
UPDATE wms_lems_courses SET credits=3, type='Elective'  WHERE id=91;

-- Certificate FDT (92–98)
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=92;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=93;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=94;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=95;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=96;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=97;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=98;

-- JDT BA (99–127)
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=99;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=100;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=101;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=102;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=103;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=104;
UPDATE wms_lems_courses SET credits=2, type='Mandatory' WHERE id=105;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=106;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=107;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=108;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=109;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=110;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=111;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=112;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=113;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=114;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=115;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=116;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=117;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=118;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=119;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=120;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=121;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=122;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=123;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=124;
UPDATE wms_lems_courses SET credits=2, type='Mandatory' WHERE id=125;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=126;
UPDATE wms_lems_courses SET credits=6, type='Practical' WHERE id=127;

-- Diploma JDT (128–139)
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=128;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=129;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=130;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=131;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=132;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=133;
UPDATE wms_lems_courses SET credits=2, type='Mandatory' WHERE id=134;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=135;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=136;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=137;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=138;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=139;

-- PDE BA (140–172)
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=140;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=141;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=142;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=143;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=144;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=145;
UPDATE wms_lems_courses SET credits=2, type='Mandatory' WHERE id=146;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=147;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=148;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=149;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=150;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=151;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=152;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=153;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=154;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=155;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=156;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=157;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=158;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=159;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=160;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=161;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=162;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=163;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=164;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=165;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=166;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=167;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=168;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=169;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=170;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=171;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=172;

-- Diploma PDE (173–179)
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=173;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=174;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=175;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=176;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=177;
UPDATE wms_lems_courses SET credits=3, type='Core'      WHERE id=178;
UPDATE wms_lems_courses SET credits=2, type='Mandatory' WHERE id=179;

-- ============================================================
-- 5. VERIFY
-- ============================================================

SELECT 'programmes' AS tbl, COUNT(*) AS total,
       SUM(level IS NOT NULL) AS has_level,
       SUM(total_credits IS NOT NULL) AS has_credits
FROM wms_lems_programmes;

SELECT 'lecturers' AS tbl, COUNT(*) AS total,
       SUM(qualification IS NOT NULL) AS has_qualification
FROM wms_lems_lecturers;

SELECT 'courses' AS tbl, COUNT(*) AS total,
       SUM(credits IS NOT NULL) AS has_credits,
       SUM(type IS NOT NULL) AS has_type
FROM wms_lems_courses;
