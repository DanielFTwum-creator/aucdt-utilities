
import type { Programme, Course, Lecturer } from './types';
import { RatingCategory } from './types';

export const ADMIN_PASSWORD = "admin123";

export const RATING_CATEGORIES: RatingCategory[] = [
    RatingCategory.TeachingQuality,
    RatingCategory.Communication,
    RatingCategory.SubjectKnowledge,
    RatingCategory.Punctuality,
];

export const INITIAL_PROGRAMMES: Programme[] = [
    { id: 'dmcd', name: 'B.Tech Digital Media & Communication Design' },
    { id: 'fdt-btech', name: 'B.Tech Fashion Design Technology' },
    { id: 'fdt-cert', name: 'Certificate Fashion Design Technology' },
    { id: 'jdt-ba', name: 'B.A. Jewellery Design Technology' },
    { id: 'jdt-dip', name: 'Diploma Jewellery Design Technology' },
    { id: 'pde-ba', name: 'B.A. Product Design & Entrepreneurship' },
    { id: 'pde-dip', name: 'Diploma Product Design' },
];

export const INITIAL_LECTURERS: Lecturer[] = [
    // Digital Media & Communication Design
    { id: 'lec_dmcd_1', name: 'Dr. Andrew Richard Owusu Addo', programmeId: 'dmcd' },
    { id: 'lec_dmcd_2', name: 'Mr. William Daitey', programmeId: 'dmcd' },
    { id: 'lec_dmcd_3', name: 'Mr. Daniel Boateng', programmeId: 'dmcd' },
    { id: 'lec_dmcd_4', name: 'Mr. Bright Agbosu', programmeId: 'dmcd' },
    { id: 'lec_dmcd_5', name: 'Mr. Selasi Ahiabu', programmeId: 'dmcd' },
    { id: 'lec_dmcd_6', name: 'Mr. Samuel Wellington', programmeId: 'dmcd' },
    { id: 'lec_dmcd_7', name: 'Mr. Robert Bunkangsang Buchag', programmeId: 'dmcd' },
    { id: 'lec_dmcd_8', name: 'Mr. Isaac N. Ofori', programmeId: 'dmcd' },
    { id: 'lec_dmcd_9', name: 'Mr. Ntim Pipim', programmeId: 'dmcd' },

    // Fashion Design Technology (B.Tech)
    { id: 'lec_fdt-btech_1', name: 'Dr. Andrew Richard Owusu Addo', programmeId: 'fdt-btech' },
    { id: 'lec_fdt-btech_2', name: 'Ms. Florence Kushitor', programmeId: 'fdt-btech' },
    { id: 'lec_fdt-btech_3', name: 'Mrs. Mary Eddy Takyi', programmeId: 'fdt-btech' },
    { id: 'lec_fdt-btech_4', name: 'Mr. Daniel Boateng', programmeId: 'fdt-btech' },
    { id: 'lec_fdt-btech_5', name: 'Mr. Bright Senanu Agbosu', programmeId: 'fdt-btech' },
    { id: 'lec_fdt-btech_6', name: 'Mr. Nutifafa Fiadzomor', programmeId: 'fdt-btech' },
    { id: 'lec_fdt-btech_7', name: 'Mr. William Daitey', programmeId: 'fdt-btech' },
    { id: 'lec_fdt-btech_8', name: 'Mrs. Elsie Mills', programmeId: 'fdt-btech' },
    { id: 'lec_fdt-btech_9', name: 'Ms. Victoria Honu', programmeId: 'fdt-btech' },
    { id: 'lec_fdt-btech_10', name: 'Mr. Aaron Adjacodjoe', programmeId: 'fdt-btech' },
    { id: 'lec_fdt-btech_11', name: 'Mr. Ntim Pipim', programmeId: 'fdt-btech' },
    { id: 'lec_fdt-btech_12', name: 'Mr. Daniel Morrison', programmeId: 'fdt-btech' },
    { id: 'lec_fdt-btech_13', name: 'TBD Lecturer', programmeId: 'fdt-btech' },


    // Fashion Design Technology (Certificate)
    { id: 'lec_fdt-cert_1', name: 'Ms. Vivian Yeboah', programmeId: 'fdt-cert' },
    { id: 'lec_fdt-cert_2', name: 'Mr. Nutifafa Fiadzomor', programmeId: 'fdt-cert' },
    { id: 'lec_fdt-cert_3', name: 'Mr. Kwame Ntim Pipim', programmeId: 'fdt-cert' },

    // Jewellery Design Technology (B.A.)
    { id: 'lec_jdt-ba_1', name: 'Dr. Andrew Richard Owusu Addo', programmeId: 'jdt-ba' },
    { id: 'lec_jdt-ba_2', name: 'Mr. Amevor', programmeId: 'jdt-ba' },
    { id: 'lec_jdt-ba_3', name: 'Mr. Daniel Boateng', programmeId: 'jdt-ba' },
    { id: 'lec_jdt-ba_4', name: 'Mr. William Daitey', programmeId: 'jdt-ba' },
    { id: 'lec_jdt-ba_5', name: 'Mr. Bright Agbosu', programmeId: 'jdt-ba' },
    { id: 'lec_jdt-ba_6', name: 'Mr. Selete Komla Delali Ofori', programmeId: 'jdt-ba' },
    { id: 'lec_jdt-ba_7', name: 'Mr. Ntim Pipim', programmeId: 'jdt-ba' },
    { id: 'lec_jdt-ba_8', name: 'Mr. Kwame Baah Panin Owusu', programmeId: 'jdt-ba' },
    { id: 'lec_jdt-ba_9', name: 'Mr. Aaron Adjacodjoe', programmeId: 'jdt-ba' },

    // Jewellery Design Technology (Diploma)
    { id: 'lec_jdt-dip_1', name: 'Dr. Andrew Richard Owusu Addo', programmeId: 'jdt-dip' },
    { id: 'lec_jdt-dip_2', name: 'Mr. Eric Amevo', programmeId: 'jdt-dip' },
    { id: 'lec_jdt-dip_3', name: 'Mr. Selete Komla Delali Ofori', programmeId: 'jdt-dip' },
    { id: 'lec_jdt-dip_4', name: 'Mr. Daniel Boateng', programmeId: 'jdt-dip' },
    { id: 'lec_jdt-dip_5', name: 'Mr. William Diatey', programmeId: 'jdt-dip' },
    { id: 'lec_jdt-dip_6', name: 'Mr. Bright Agbosu', programmeId: 'jdt-dip' },
    { id: 'lec_jdt-dip_7', name: 'Mr. Aaron Adjacodjoe', programmeId: 'jdt-dip' },
    { id: 'lec_jdt-dip_8', name: 'Mr. Kwame Baah Panin Owusu', programmeId: 'jdt-dip' },
    { id: 'lec_jdt-dip_9', name: 'Dr. Joseph A. A. Sackey', programmeId: 'jdt-dip' },

    // Product Design & Entrepreneurship (B.A.)
    { id: 'lec_pde-ba_1', name: 'Dr. Andrew Richard Owusu Addo', programmeId: 'pde-ba' },
    { id: 'lec_pde-ba_2', name: 'Mr. Amevor', programmeId: 'pde-ba' },
    { id: 'lec_pde-ba_3', name: 'Mr. Aaron Adjacodjoe', programmeId: 'pde-ba' },
    { id: 'lec_pde-ba_4', name: 'Mr. Selete Komla Delali Ofori', programmeId: 'pde-ba' },
    { id: 'lec_pde-ba_5', name: 'Mr. Daniel Boateng', programmeId: 'pde-ba' },
    { id: 'lec_pde-ba_6', name: 'Mr. William Daitey', programmeId: 'pde-ba' },
    { id: 'lec_pde-ba_7', name: 'Mr. Bright Agbosu', programmeId: 'pde-ba' },
    { id: 'lec_pde-ba_8', name: 'Mr. Fredrick Tattah', programmeId: 'pde-ba' },
    { id: 'lec_pde-ba_9', name: 'Mr. Selasi Ahiabu', programmeId: 'pde-ba' },
    { id: 'lec_pde-ba_10', name: 'Mr. Kwame Ntim Pipim', programmeId: 'pde-ba' },

    // Product Design (Diploma)
    { id: 'lec_pde-dip_1', name: 'Dr. Andrew Richard Owusu Addo', programmeId: 'pde-dip' },
    { id: 'lec_pde-dip_2', name: 'Mr. Amevor', programmeId: 'pde-dip' },
    { id: 'lec_pde-dip_3', name: 'Mr. Aaron Adjacodjoe', programmeId: 'pde-dip' },
    { id: 'lec_pde-dip_4', name: 'Mr. Selete Komla Delali Ofori', programmeId: 'pde-dip' },
    { id: 'lec_pde-dip_5', name: 'Mr. Daniel Boateng', programmeId: 'pde-dip' },
    { id: 'lec_pde-dip_6', name: 'Mr. Bright Agbosu', programmeId: 'pde-dip' },
];

export const INITIAL_COURSES: Course[] = [
    // --- B.TECH DIGITAL MEDIA AND COMMUNICATION DESIGN ---
    // Year 1, Sem 1
    { id: 'dmcd1101', name: 'AUCDT 115: Introduction to African Art & Culture', programmeId: 'dmcd', year: 1, semester: 1 },
    { id: 'dmcd1102', name: 'DMCD 112: Basic Design', programmeId: 'dmcd', year: 1, semester: 1 },
    { id: 'dmcd1103', name: 'DMCD 113: Introduction to Communication Design', programmeId: 'dmcd', year: 1, semester: 1 },
    { id: 'dmcd1104', name: 'DMCD 114: Introduction to Computer Graphics Applications', programmeId: 'dmcd', year: 1, semester: 1 },
    { id: 'dmcd1105', name: 'AUCDT 116: Introduction to Communication Skills', programmeId: 'dmcd', year: 1, semester: 1 },
    { id: 'dmcd1106', name: 'AUCDT 114: Basic Drawing', programmeId: 'dmcd', year: 1, semester: 1 },
    { id: 'dmcd1107', name: 'AUCDT 117: Introduction to Information and Communication Technology', programmeId: 'dmcd', year: 1, semester: 1 },
    { id: 'dmcd1108', name: 'DMCD 111: Introduction to Digital Media', programmeId: 'dmcd', year: 1, semester: 1 },
    // Year 1, Sem 2
    { id: 'dmcd1201', name: 'DMCD 122: Idea Development Techniques', programmeId: 'dmcd', year: 1, semester: 2 },
    { id: 'dmcd1202', name: 'DMCD 126: Image Manipulation', programmeId: 'dmcd', year: 1, semester: 2 },
    { id: 'dmcd1203', name: 'AUCDT 126: Communication Skills', programmeId: 'dmcd', year: 1, semester: 2 },
    { id: 'dmcd1204', name: 'DMCD 121: Basic Programming', programmeId: 'dmcd', year: 1, semester: 2 },
    { id: 'dmcd1205', name: 'DMCD 123: Basic Rendering Techniques', programmeId: 'dmcd', year: 1, semester: 2 },
    { id: 'dmcd1206', name: 'DMCD 125: Introduction to Typography', programmeId: 'dmcd', year: 1, semester: 2 },
    { id: 'dmcd1207', name: 'DMCD 124: Design History', programmeId: 'dmcd', year: 1, semester: 2 },
    { id: 'dmcd1208', name: 'AUCDT 127: Information and Communication Technology', programmeId: 'dmcd', year: 1, semester: 2 },
    // Year 2, Sem 1
    { id: 'dmcd2101', name: 'DMCD 236: Introduction to Animation', programmeId: 'dmcd', year: 2, semester: 1 },
    { id: 'dmcd2102', name: 'DMCD 233: Typography and Basic Layout Design', programmeId: 'dmcd', year: 2, semester: 1 },
    { id: 'dmcd2103', name: 'DMCD 232: Print Design', programmeId: 'dmcd', year: 2, semester: 1 },
    { id: 'dmcd2104', name: 'DMCD 231: Corporate Identity', programmeId: 'dmcd', year: 2, semester: 1 },
    { id: 'dmcd2105', name: 'DMCD 235: Print Production', programmeId: 'dmcd', year: 2, semester: 1 },
    { id: 'dmcd2106', name: 'DMCD 234: Fundamentals of Photography', programmeId: 'dmcd', year: 2, semester: 1 },
    { id: 'dmcd2107', name: 'DMCD 237: Introduction to Production Management', programmeId: 'dmcd', year: 2, semester: 1 },
    // Year 2, Sem 2
    { id: 'dmcd2201', name: 'DMCD 242: Digital Print Technology', programmeId: 'dmcd', year: 2, semester: 2 },
    { id: 'dmcd2202', name: 'DMCD 244: Digital Photography', programmeId: 'dmcd', year: 2, semester: 2 },
    { id: 'dmcd2203', name: 'DMCD 243: Web Design', programmeId: 'dmcd', year: 2, semester: 2 },
    { id: 'dmcd2204', name: 'DMCD 241: Brand and Identity Systems', programmeId: 'dmcd', year: 2, semester: 2 },
    { id: 'dmcd2205', name: 'DMCD 246: Introduction to Video Production and Motion', programmeId: 'dmcd', year: 2, semester: 2 },
    { id: 'dmcd2206', name: 'DMCD 245: Digital Print Production', programmeId: 'dmcd', year: 2, semester: 2 },
    // Year 3, Sem 1
    { id: 'dmcd3101', name: 'DMCD 353: Online Media Technology', programmeId: 'dmcd', year: 3, semester: 1 },
    { id: 'dmcd3102', name: 'DMCD 354: Animation', programmeId: 'dmcd', year: 3, semester: 1 },
    { id: 'dmcd3103', name: 'DMCD 352: Advertising Design', programmeId: 'dmcd', year: 3, semester: 1 },
    { id: 'dmcd3104', name: 'DMCD 356: Video Production', programmeId: 'dmcd', year: 3, semester: 1 },
    { id: 'dmcd3105', name: 'DMCD 355: Copywriting', programmeId: 'dmcd', year: 3, semester: 1 },
    { id: 'dmcd3106', name: 'DMCD 351: Book & Magazine Design', programmeId: 'dmcd', year: 3, semester: 1 },
    { id: 'dmcd3107', name: 'AUCDT 352: Seminar in DMCD', programmeId: 'dmcd', year: 3, semester: 1 },
    { id: 'dmcd3108', name: 'DMCD 357: Motion Graphics', programmeId: 'dmcd', year: 3, semester: 1 },
    { id: 'dmcd3109', name: 'AUCDT 351: Introduction to Entrepreneurship', programmeId: 'dmcd', year: 3, semester: 1 },
    // Year 3, Sem 2
    { id: 'dmcd3201', name: 'ACDT 352: Research Methods', programmeId: 'dmcd', year: 3, semester: 2 },
    { id: 'dmcd3202', name: 'ACDT 351: Industrial Attachment', programmeId: 'dmcd', year: 3, semester: 2 },
    // Year 4, Sem 1
    { id: 'dmcd4101', name: 'DMCD 471: Sound Production', programmeId: 'dmcd', year: 4, semester: 1 },
    { id: 'dmcd4102', name: 'DMCD 472: Portfolio Development', programmeId: 'dmcd', year: 4, semester: 1 },
    { id: 'dmcd4103', name: 'DMCD 352: Interactive Animation', programmeId: 'dmcd', year: 4, semester: 1 },
    { id: 'dmcd4104', name: 'AUCDT 472: Thesis / Project', programmeId: 'dmcd', year: 4, semester: 1 },
    { id: 'dmcd4105', name: 'DMCD 473: Video Post Production', programmeId: 'dmcd', year: 4, semester: 1 },
    { id: 'dmcd4106', name: 'DMCD 475: Advertising Design Technology', programmeId: 'dmcd', year: 4, semester: 1 },
    { id: 'dmcd4107', name: 'AUCDT 471: Entrepreneurship', programmeId: 'dmcd', year: 4, semester: 1 },
    
    // --- B.TECH FASHION DESIGN TECHNOLOGY ---
    // Year 1, Sem 1
    { id: 'fdtb1101', name: 'ACDT 115: Introduction to African Art & Culture', programmeId: 'fdt-btech', year: 1, semester: 1 },
    { id: 'fdtb1102', name: 'FDT 114: Sewing Techniques', programmeId: 'fdt-btech', year: 1, semester: 1 },
    { id: 'fdtb1103', name: 'FDT 113: Basic Pattern Technology', programmeId: 'fdt-btech', year: 1, semester: 1 },
    { id: 'fdtb1104', name: 'ACDT 116: Communication Skills I', programmeId: 'fdt-btech', year: 1, semester: 1 },
    { id: 'fdtb1105', name: 'FDT 111: Introduction to Fashion', programmeId: 'fdt-btech', year: 1, semester: 1 },
    { id: 'fdtb1106', name: 'FDT 112: Introduction to Textiles', programmeId: 'fdt-btech', year: 1, semester: 1 },
    { id: 'fdtb1107', name: 'ACDT 114: Basic Drawing', programmeId: 'fdt-btech', year: 1, semester: 1 },
    { id: 'fdtb1108', name: 'ACDT 117: Information Communication Technology I', programmeId: 'fdt-btech', year: 1, semester: 1 },
    // Year 1, Sem 2
    { id: 'fdtb1201', name: 'FDT 122: Textile Design', programmeId: 'fdt-btech', year: 1, semester: 2 },
    { id: 'fdtb1202', name: 'ACDT 126: Communication Skills II', programmeId: 'fdt-btech', year: 1, semester: 2 },
    { id: 'fdtb1203', name: 'FDT 126: Basic Design', programmeId: 'fdt-btech', year: 1, semester: 2 },
    { id: 'fdtb1204', name: 'FDT 124: Garment Construction', programmeId: 'fdt-btech', year: 1, semester: 2 },
    { id: 'fdtb1205', name: 'FDT 123: Pattern Adaptation', programmeId: 'fdt-btech', year: 1, semester: 2 },
    { id: 'fdtb1206', name: 'FDT 125: Freehand Cutting', programmeId: 'fdt-btech', year: 1, semester: 2 },
    { id: 'fdtb1207', name: 'ACDT 127: Information Communication Technology II', programmeId: 'fdt-btech', year: 1, semester: 2 },
    { id: 'fdtb1208', name: 'FDT 121: Introduction to Creative Design in Fashion', programmeId: 'fdt-btech', year: 1, semester: 2 },
    // Year 2, Sem 1
    { id: 'fdtb2101', name: 'FDT 234: Garment Technology I', programmeId: 'fdt-btech', year: 2, semester: 1 },
    { id: 'fdtb2102', name: 'FDT 232: Printed Textile Design Application', programmeId: 'fdt-btech', year: 2, semester: 1 },
    { id: 'fdtb2103', name: 'FDT 238: Introduction to Fashion Accessories', programmeId: 'fdt-btech', year: 2, semester: 1 },
    { id: 'fdtb2104', name: 'FDT 237: Basic Computer Aided Design', programmeId: 'fdt-btech', year: 2, semester: 1 },
    { id: 'fdtb2105', name: 'FDT 233: Pattern Technology I', programmeId: 'fdt-btech', year: 2, semester: 1 },
    { id: 'fdtb2106', name: 'FDT 235: Introduction to Fabric Studies', programmeId: 'fdt-btech', year: 2, semester: 1 },
    { id: 'fdtb2107', name: 'FDT 231: Creative Design in Fashion', programmeId: 'fdt-btech', year: 2, semester: 1 },
    { id: 'fdtb2108', name: 'FDT 239: Introduction to Production Management', programmeId: 'fdt-btech', year: 2, semester: 1 },
    { id: 'fdtb2109', name: 'FDT 236: Fashion Illustration', programmeId: 'fdt-btech', year: 2, semester: 1 },
    // Year 2, Sem 2
    { id: 'fdtb2201', name: 'FDT 241: Basic Fashion Design and Illustration', programmeId: 'fdt-btech', year: 2, semester: 2 },
    { id: 'fdtb2202', name: 'FDT 242: Pattern Technology II', programmeId: 'fdt-btech', year: 2, semester: 2 },
    { id: 'fdtb2203', name: 'FDT 245: Millinery Design and Production', programmeId: 'fdt-btech', year: 2, semester: 2 },
    { id: 'fdtb2204', name: 'FDT 243: Garment Technology II', programmeId: 'fdt-btech', year: 2, semester: 2 },
    { id: 'fdtb2205', name: 'FDT 248: Production Management', programmeId: 'fdt-btech', year: 2, semester: 2 },
    { id: 'fdtb2206', name: 'FDT 244: Fabric Studies', programmeId: 'fdt-btech', year: 2, semester: 2 },
    { id: 'fdtb2207', name: 'FDT 246: Computer-Aided Design', programmeId: 'fdt-btech', year: 2, semester: 2 },
    { id: 'fdtb2208', name: 'FDT 247: Fashion Marketing', programmeId: 'fdt-btech', year: 2, semester: 2 },
    // Year 3, Sem 1
    { id: 'fdtb3101', name: 'FDT 355: Design & Production of Bags & Slippers', programmeId: 'fdt-btech', year: 3, semester: 1 },
    { id: 'fdtb3102', name: 'FDT 354: Fashion Draping', programmeId: 'fdt-btech', year: 3, semester: 1 },
    { id: 'fdtb3103', name: 'FDT 352: Garment Decoration Techniques', programmeId: 'fdt-btech', year: 3, semester: 1 },
    { id: 'fdtb3104', name: 'FDT 351: Design and Illustration', programmeId: 'fdt-btech', year: 3, semester: 1 },
    { id: 'fdtb3105', name: 'FDT 357: Seminar in Fashion', programmeId: 'fdt-btech', year: 3, semester: 1 },
    { id: 'fdtb3106', name: 'FDT 353: Pattern Alteration', programmeId: 'fdt-btech', year: 3, semester: 1 },
    { id: 'fdtb3107', name: 'FDT 356: Entrepreneurship I', programmeId: 'fdt-btech', year: 3, semester: 1 },
    // Year 3, Sem 2
    { id: 'fdtb3201', name: 'ACDT 352: Research Methods', programmeId: 'fdt-btech', year: 3, semester: 2 },
    { id: 'fdtb3202', name: 'ACDT 351: Industrial Attachment', programmeId: 'fdt-btech', year: 3, semester: 2 },
    // Year 4, Sem 1
    { id: 'fdtb4101', name: 'FDT 471: Collection Development', programmeId: 'fdt-btech', year: 4, semester: 1 },
    { id: 'fdtb4102', name: 'FDT 473: Beauty Culture', programmeId: 'fdt-btech', year: 4, semester: 1 },

    // --- CERTIFICATE FASHION DESIGN TECHNOLOGY ---
    // Year 1, Sem 1
    { id: 'fdtc1101', name: 'CFDT 114: Garment Construction', programmeId: 'fdt-cert', year: 1, semester: 1 },
    { id: 'fdtc1102', name: 'CFDT 113: Basic Pattern Technology', programmeId: 'fdt-cert', year: 1, semester: 1 },
    { id: 'fdtc1103', name: 'CFDT 235: Introduction to Fabric Studies', programmeId: 'fdt-cert', year: 1, semester: 1 },
    { id: 'fdtc1104', name: 'CFDT 247: Fashion Marketing', programmeId: 'fdt-cert', year: 1, semester: 1 },
    { id: 'fdtc1105', name: 'CFDT 236: Fashion Illustration', programmeId: 'fdt-cert', year: 1, semester: 1 },
    // Year 1, Sem 2
    { id: 'fdtc1201', name: 'CFDT 233: Pattern Technology I', programmeId: 'fdt-cert', year: 1, semester: 2 },
    { id: 'fdtc1202', name: 'CFDT 234: Garment Technology I', programmeId: 'fdt-cert', year: 1, semester: 2 },
    { id: 'fdtc1203', name: 'CFDT 235: Introduction to Fabric Studies', programmeId: 'fdt-cert', year: 1, semester: 2 },
    { id: 'fdtc1204', name: 'CFDT 236: Fashion Illustration', programmeId: 'fdt-cert', year: 1, semester: 2 },

    // --- B.A. JEWELLERY DESIGN TECHNOLOGY ---
    // Year 1, Sem 1
    { id: 'jdtb1101', name: 'ACDT 115: Introduction to African Art & Culture', programmeId: 'jdt-ba', year: 1, semester: 1 },
    { id: 'jdtb1102', name: 'ACDT 113: Foundations in Technical Drawing', programmeId: 'jdt-ba', year: 1, semester: 1 },
    { id: 'jdtb1103', name: 'BJDT 111: Introduction to Jewellery Design', programmeId: 'jdt-ba', year: 1, semester: 1 },
    { id: 'jdtb1104', name: 'ACDT 116: Communication Skills I', programmeId: 'jdt-ba', year: 1, semester: 1 },
    { id: 'jdtb1105', name: 'ACDT 114: Basic Drawing', programmeId: 'jdt-ba', year: 1, semester: 1 },
    { id: 'jdtb1106', name: 'ACDT 117: Information and Communication Technology I', programmeId: 'jdt-ba', year: 1, semester: 1 },
    { id: 'jdtb1107', name: 'ACDT 112: Workshop Safety Practices', programmeId: 'jdt-ba', year: 1, semester: 1 },
    // Year 2, Sem 1
    { id: 'jdtb2101', name: 'ACDT 231: Introduction to Entrepreneurship', programmeId: 'jdt-ba', year: 2, semester: 1 },
    { id: 'jdtb2102', name: 'BJDT 234: Introduction to Metallurgy', programmeId: 'jdt-ba', year: 2, semester: 1 },
    { id: 'jdtb2103', name: 'BJDT 235: Refining, Assaying & Hallmarking', programmeId: 'jdt-ba', year: 2, semester: 1 },
    { id: 'jdtb2104', name: 'BJDT 231: Concept Design and Modelling', programmeId: 'jdt-ba', year: 2, semester: 1 },
    { id: 'jdtb2105', name: 'BJDT 232: Basic Fabrication and Finishing', programmeId: 'jdt-ba', year: 2, semester: 1 },
    { id: 'jdtb2106', name: 'BJDT 236: 3D Modelling in Computer', programmeId: 'jdt-ba', year: 2, semester: 1 },
    { id: 'jdtb2107', name: 'BJDT 233: Alloy Calculation, Measuring and Marking', programmeId: 'jdt-ba', year: 2, semester: 1 },
    // Year 2, Sem 2
    { id: 'jdtb2201', name: 'BJDT 245: Metallurgy', programmeId: 'jdt-ba', year: 2, semester: 2 },
    { id: 'jdtb2202', name: 'BJDT 242: Fabrication and Finishing Techniques', programmeId: 'jdt-ba', year: 2, semester: 2 },
    { id: 'jdtb2203', name: 'ACDT 247: Developing a New Venture', programmeId: 'jdt-ba', year: 2, semester: 2 },
    { id: 'jdtb2204', name: 'BJDT 246: Advanced Computer Application', programmeId: 'jdt-ba', year: 2, semester: 2 },
    { id: 'jdtb2205', name: 'BJDT 241: Practical Design and Modelling Processes', programmeId: 'jdt-ba', year: 2, semester: 2 },
    { id: 'jdtb2206', name: 'BJDT 244: Jewellery Surface Coating Methods', programmeId: 'jdt-ba', year: 2, semester: 2 },
    { id: 'jdtb2207', name: 'BJDT 243: Jewellery Casting Methods', programmeId: 'jdt-ba', year: 2, semester: 2 },
    // Year 3, Sem 1
    { id: 'jdtb3101', name: 'BJDT 353: Introduction to Gemmology', programmeId: 'jdt-ba', year: 3, semester: 1 },
    { id: 'jdtb3102', name: 'BJDT 351: Advanced Designs and Modelling Techniques', programmeId: 'jdt-ba', year: 3, semester: 1 },
    { id: 'jdtb3103', name: 'ACDT 356: Business Management and Sustainability', programmeId: 'jdt-ba', year: 3, semester: 1 },
    { id: 'jdtb3104', name: 'BJDT 352: Fabrication and Finishing Practices', programmeId: 'jdt-ba', year: 3, semester: 1 },
    { id: 'jdtb3105', name: 'BJDT 355: Seminar in Jewellery', programmeId: 'jdt-ba', year: 3, semester: 1 },
    { id: 'jdtb3106', name: 'BJDT 354: Introduction to Gem Setting', programmeId: 'jdt-ba', year: 3, semester: 1 },
    // Year 3, Sem 2
    { id: 'jdtb3201', name: 'ACDT 352: Research Methods', programmeId: 'jdt-ba', year: 3, semester: 2 },
    { id: 'jdtb3202', name: 'ACDT 351: Industrial Attachment', programmeId: 'jdt-ba', year: 3, semester: 2 },

    // --- DIPLOMA JEWELLERY DESIGN TECHNOLOGY ---
    // Year 1, Sem 1
    { id: 'jdtd1101', name: 'ACDT 115: Introduction to African Art & Culture', programmeId: 'jdt-dip', year: 1, semester: 1 },
    { id: 'jdtd1102', name: 'ACDT 113: Foundations in Technical Drawing', programmeId: 'jdt-dip', year: 1, semester: 1 },
    { id: 'jdtd1103', name: 'BJDT 111: Introduction to Jewellery Design', programmeId: 'jdt-dip', year: 1, semester: 1 },
    { id: 'jdtd1104', name: 'ACDT 116: Communication Skills I', programmeId: 'jdt-dip', year: 1, semester: 1 },
    { id: 'jdtd1105', name: 'ACDT 114: Basic Drawing', programmeId: 'jdt-dip', year: 1, semester: 1 },
    { id: 'jdtd1106', name: 'ACDT 117: Information and Communication Technology I', programmeId: 'jdt-dip', year: 1, semester: 1 },
    { id: 'jdtd1107', name: 'ACDT 112: Workshop Safety Practices', programmeId: 'jdt-dip', year: 1, semester: 1 },
    { id: 'jdtd1108', name: 'Seminar in Jewellery', programmeId: 'jdt-dip', year: 1, semester: 1 },
    // Year 2, Sem 1
    { id: 'jdtd2101', name: 'DJDT 231: Fabrication and Finishing Practices', programmeId: 'jdt-dip', year: 2, semester: 1 },
    { id: 'jdtd2102', name: 'ACDT 236: Advanced Computer Application in Jewellery Design', programmeId: 'jdt-dip', year: 2, semester: 1 },
    { id: 'jdtd2103', name: 'DJDT 233: Introduction to Metallurgy', programmeId: 'jdt-dip', year: 2, semester: 1 },
    { id: 'jdtd2104', name: 'ACDT 237: Research Methodology', programmeId: 'jdt-dip', year: 2, semester: 1 },
    { id: 'jdtd2105', name: 'DJDT 232: Alloy Calculation, Measuring and Marking', programmeId: 'jdt-dip', year: 2, semester: 1 },
    
    // --- B.A. PRODUCT DESIGN & ENTREPRENEURSHIP ---
    // Year 1, Sem 1
    { id: 'pdeb1101', name: 'ACDT 115: Introduction to African Art & Culture', programmeId: 'pde-ba', year: 1, semester: 1 },
    { id: 'pdeb1102', name: 'ACDT 113: Technical Drawing', programmeId: 'pde-ba', year: 1, semester: 1 },
    { id: 'pdeb1103', name: 'BPDE 111: Introduction to Industrial/Product Design', programmeId: 'pde-ba', year: 1, semester: 1 },
    { id: 'pdeb1104', name: 'ACDT 116: Communication Skills I', programmeId: 'pde-ba', year: 1, semester: 1 },
    { id: 'pdeb1105', name: 'ACDT 114: Basic Drawing', programmeId: 'pde-ba', year: 1, semester: 1 },
    { id: 'pdeb1106', name: 'ACDT 117: Information and Communication Technology I', programmeId: 'pde-ba', year: 1, semester: 1 },
    { id: 'pdeb1107', name: 'ACDT 112: Safety in Workshop Practices', programmeId: 'pde-ba', year: 1, semester: 1 },
    // Year 1, Sem 2
    { id: 'pdeb1201', name: 'BPDE 122: Workshop Practices', programmeId: 'pde-ba', year: 1, semester: 2 },
    { id: 'pdeb1202', name: 'ACDT 126: Communication Skills II', programmeId: 'pde-ba', year: 1, semester: 2 },
    { id: 'pdeb1203', name: 'BPDE 121: Idea Development and Design Processes', programmeId: 'pde-ba', year: 1, semester: 2 },
    { id: 'pdeb1204', name: 'BPDE 124: Freehand Drawing Techniques', programmeId: 'pde-ba', year: 1, semester: 2 },
    { id: 'pdeb1205', name: 'ACDT 125: Introduction to Computer-Aided-Design', programmeId: 'pde-ba', year: 1, semester: 2 },
    { id: 'pdeb1206', name: 'BPDE 123: Orthographic and Isometric Projections', programmeId: 'pde-ba', year: 1, semester: 2 },
    { id: 'pdeb1207', name: 'ACDT 127: Information and Communication Technology II', programmeId: 'pde-ba', year: 1, semester: 2 },
    // Year 2, Sem 1
    { id: 'pdeb2101', name: 'BPDE 235: Manufacturing Processes 1', programmeId: 'pde-ba', year: 2, semester: 1 },
    { id: 'pdeb2102', name: 'BPDE 236: Three-Dimensional in Computing', programmeId: 'pde-ba', year: 2, semester: 1 },
    { id: 'pdeb2103', name: 'BPDE 233: Perspective Drawing', programmeId: 'pde-ba', year: 2, semester: 1 },
    { id: 'pdeb2104', name: 'BPDE 232: Product Design Methods', programmeId: 'pde-ba', year: 2, semester: 1 },
    { id: 'pdeb2105', name: 'BPDE 231: Introduction to Modelling', programmeId: 'pde-ba', year: 2, semester: 1 },
    { id: 'pdeb2106', name: 'BPDE 234: Nature of Materials & Processes', programmeId: 'pde-ba', year: 2, semester: 1 },
    { id: 'pdeb2107', name: 'ACDT 231: Introduction to Entrepreneurship', programmeId: 'pde-ba', year: 2, semester: 1 },
    // Year 2, Sem 2
    { id: 'pdeb2201', name: 'BPDE 241: Design for Use', programmeId: 'pde-ba', year: 2, semester: 2 },
    { id: 'pdeb2202', name: 'BPDE 246: Advanced Computer Application', programmeId: 'pde-ba', year: 2, semester: 2 },
    { id: 'pdeb2203', name: 'BPDE 243: Ergonomics and Human Factors Applications', programmeId: 'pde-ba', year: 2, semester: 2 },
    { id: 'pdeb2204', name: 'BPDE 247: New Venture Creation', programmeId: 'pde-ba', year: 2, semester: 2 },
    { id: 'pdeb2205', name: 'BPDE 242: Visual Communication and Package Design', programmeId: 'pde-ba', year: 2, semester: 2 },
    { id: 'pdeb2206', name: 'BPDE 245: Objects and Impacts', programmeId: 'pde-ba', year: 2, semester: 2 },
    { id: 'pdeb2207', name: 'BPDE 244: Contextual Nature of Products', programmeId: 'pde-ba', year: 2, semester: 2 },
    // Year 3, Sem 1
    { id: 'pdeb3101', name: 'BPDE 354: Design and Development', programmeId: 'pde-ba', year: 3, semester: 1 },
    { id: 'pdeb3102', name: 'BPDE 351: Practical Model Making Techniques', programmeId: 'pde-ba', year: 3, semester: 1 },
    { id: 'pdeb3103', name: 'ACDT 356: Business Management and Sustainability', programmeId: 'pde-ba', year: 3, semester: 1 },
    { id: 'pdeb3104', name: 'BPDE 353: Workshop Practice I', programmeId: 'pde-ba', year: 3, semester: 1 },
    { id: 'pdeb3105', name: 'BPDE 352: Product Interface Design', programmeId: 'pde-ba', year: 3, semester: 1 },

    // --- DIPLOMA PRODUCT DESIGN ---
    // Year 1, Sem 1
    { id: 'pded1101', name: 'ACDT 115: Introduction to African Art & Culture', programmeId: 'pde-dip', year: 1, semester: 1 },
    { id: 'pded1102', name: 'DPD 113: Foundations in Technical Drawing', programmeId: 'pde-dip', year: 1, semester: 1 },
    { id: 'pded1103', name: 'DPD 111: Introduction to Industrial/ Product Design', programmeId: 'pde-dip', year: 1, semester: 1 },
    { id: 'pded1104', name: 'ACDT 116: Communication Skills I', programmeId: 'pde-dip', year: 1, semester: 1 },
    { id: 'pded1105', name: 'DPD 114: Idea Development and Design Processes', programmeId: 'pde-dip', year: 1, semester: 1 },
    { id: 'pded1106', name: 'ACDT 117: Information and Communication Technology I', programmeId: 'pde-dip', year: 1, semester: 1 },
    { id: 'pded1107', name: 'ACDT 112: Safety in Workshop Practices', programmeId: 'pde-dip', year: 1, semester: 1 },
];
