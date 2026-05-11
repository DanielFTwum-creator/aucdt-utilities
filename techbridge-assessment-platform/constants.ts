import { ProgrammeData } from './types';

export const ADMIN_PASSWORD = "admin"; // Simple password for demo purposes

export const initialProgrammeData: ProgrammeData = {
  "programmes": [
    {
      "id": "jd",
      "name": "Jewellery Design",
      "assessments": {
        "year1": [
          { "id": "BJDT111", "title": "Introduction to Jewellery Design", "duration": 15, "questions": 0 },
          { "id": "ACDT112", "title": "Workshop Safety Practices", "duration": 10, "questions": 0 },
          { "id": "ACDT113", "title": "Foundations in Technical Drawing", "duration": 10, "questions": 0 },
          { "id": "ACDT114", "title": "Basic Drawing", "duration": 10, "questions": 0 },
          { "id": "ACDT115", "title": "Introduction to African Art & Culture", "duration": 15, "questions": 0 },
          { "id": "ACDT116", "title": "Communication and Study Skills I", "duration": 10, "questions": 0 },
          { "id": "BJDT121", "title": "Experimental Jewellery Practices", "duration": 15, "questions": 0 },
          { "id": "BJDT122", "title": "Workshop Practice Basics", "duration": 10, "questions": 0 },
          { "id": "BJDT123", "title": "Orthographic and Isometric Projections", "duration": 15, "questions": 0 },
          { "id": "BJDT125", "title": "Introduction to Design and Modelling", "duration": 15, "questions": 0 },
          { "id": "ACDT125", "title": "Introduction to Computer Aided Design", "duration": 15, "questions": 0 },
          { "id": "ACDT126", "title": "Communication and Study Skills II", "duration": 10, "questions": 0 }
        ],
        "year2": [
          { "id": "BJDT231", "title": "Concept Design and Modelling", "duration": 15, "questions": 0 },
          { "id": "BJDT232", "title": "Fabrication and Finishing Basics", "duration": 15, "questions": 0 },
          { "id": "BJDT233", "title": "Alloy Calculation, Measuring and Marking", "duration": 15, "questions": 0 },
          { "id": "BJDT234", "title": "Introduction to Metallurgy", "duration": 15, "questions": 0 },
          { "id": "BJDT235", "title": "Assaying. Refining and Hallmarking", "duration": 15, "questions": 0 },
          { "id": "BJDT236", "title": "3D Modelling in Computing", "duration": 15, "questions": 0 },
          { "id": "ACDT237", "title": "Introduction to Entrepreneurship", "duration": 10, "questions": 0 },
          { "id": "BJDT241", "title": "Concept Design and Modelling", "duration": 15, "questions": 0 },
          { "id": "BJDT242", "title": "Fabrication and Finishing Techniques", "duration": 15, "questions": 0 },
          { "id": "BJDT243", "title": "Jewellery Casting Methods", "duration": 15, "questions": 0 },
          { "id": "BJDT244", "title": "Jewellery Surface Coating Methods", "duration": 15, "questions": 0 },
          { "id": "BJDT245", "title": "Advanced Metallurgy", "duration": 15, "questions": 0 },
          { "id": "BJDT246", "title": "Advanced Computer Application", "duration": 15, "questions": 0 },
          { "id": "BJDT247", "title": "New Venture Creation", "duration": 10, "questions": 0 }
        ],
        "year3": [
            { "id": "BJDT351", "title": "Advanced Design & Modelling Techniques", "duration": 15, "questions": 0 },
            { "id": "BJDT352", "title": "Fabrication and Finishing techniques", "duration": 15, "questions": 0 },
            { "id": "BJDT353", "title": "Introduction to Gemmology", "duration": 15, "questions": 0 },
            { "id": "BJDT354", "title": "Introduction to Gem Setting", "duration": 15, "questions": 0 },
            { "id": "BJDT355", "title": "Seminar", "duration": 15, "questions": 0 },
            { "id": "ACDT356", "title": "Business Management and Sustenance", "duration": 10, "questions": 0 },
            { "id": "ACDT357", "title": "Operations Management", "duration": 10, "questions": 0 },
            { "id": "BJDT361", "title": "Model Making and Fabrication", "duration": 10, "questions": 0 },
            { "id": "BJDT362", "title": "Jewellery Production", "duration": 20, "questions": 0 },
            { "id": "BJDT363", "title": "Advanced Gemmology", "duration": 15, "questions": 0 },
            { "id": "BJDT364", "title": "General Gem Setting Techniques", "duration": 15, "questions": 0 },
            { "id": "BJDT365", "title": "Ethical and Legal Issues in Jewellery", "duration": 10, "questions": 0 },
            { "id": "ACDT367", "title": "Research Methods", "duration": 15, "questions": 0 }
        ],
        "year4": [
            { "id": "BJDT471", "title": "Host Entity Evaluation Report", "duration": 30, "questions": 0 },
            { "id": "BJDT472", "title": "Industrial Activity Report", "duration": 20, "questions": 0 },
            { "id": "BJDT481", "title": "Post Industrial Attachment Seminars", "duration": 15, "questions": 0 },
            { "id": "BJDT482", "title": "Studio Research in Jewellery Design", "duration": 20, "questions": 0 },
            { "id": "BJDT483", "title": "Jewellery Exhibition and Portfolio", "duration": 15, "questions": 0 },
            { "id": "BJDT484", "title": "Project Management in Jewellery Design", "duration": 15, "questions": 0 },
            { "id": "BJDT485", "title": "Project Work", "duration": 15, "questions": 0 },
            { "id": "ACDT486", "title": "Accounting & Finance for Entrepreneurs", "duration": 15, "questions": 0 }
        ]
      }
    },
    {
      "id": "dm",
      "name": "Digital Media",
      "assessments": {
        "year1": [
          { "id": "DMCD111", "title": "Introduction to Digital Media", "duration": 15, "questions": 1 },
          { "id": "DMCD112", "title": "Basic Design", "duration": 15, "questions": 0 },
          { "id": "DMCD113", "title": "Introduction to Communication Design", "duration": 15, "questions": 0 },
          { "id": "DMCD114", "title": "Introduction to Computer Applications", "duration": 15, "questions": 0 },
          { "id": "ACDT114-DM", "title": "Basic Drawing", "duration": 15, "questions": 0 },
          { "id": "ACDT115-DM", "title": "Introduction to African Art & Culture", "duration": 15, "questions": 0 },
          { "id": "ACDT116-DM", "title": "Communication and Study Skills I", "duration": 10, "questions": 0 },
          { "id": "DMCD121", "title": "Basic Programming", "duration": 15, "questions": 0 },
          { "id": "DMCD122", "title": "Idea Development Techniques", "duration": 15, "questions": 0 },
          { "id": "DMCD123", "title": "Basic Rendering Techniques", "duration": 15, "questions": 0 },
          { "id": "DMCD124", "title": "Design History", "duration": 15, "questions": 0 },
          { "id": "ACDT124", "title": "Typography", "duration": 15, "questions": 0 },
          { "id": "ACDT125-DM", "title": "Image Manipulation", "duration": 15, "questions": 0 },
          { "id": "ACDT126-DM", "title": "Communication and Study Skills II", "duration": 10, "questions": 0 }
        ],
        "year2": [
          { "id": "DMCD231", "title": "Logos, Symbols & Trademarks", "duration": 15, "questions": 0 },
          { "id": "DMCD232", "title": "Print Design", "duration": 15, "questions": 0 },
          { "id": "DMCD233", "title": "Advanced Typography", "duration": 15, "questions": 0 },
          { "id": "DMCD234", "title": "Photography", "duration": 15, "questions": 0 },
          { "id": "DMCD235", "title": "Print Production", "duration": 15, "questions": 0 },
          { "id": "DMCD236", "title": "Design Seminar", "duration": 15, "questions": 0 },
          { "id": "ACDT231", "title": "Introduction to Entrepreneurship", "duration": 10, "questions": 0 },
          { "id": "DMCD241", "title": "Brand & Identity Systems", "duration": 15, "questions": 0 },
          { "id": "DMCD242", "title": "Advanced Print Design", "duration": 15, "questions": 0 },
          { "id": "DMCD243", "title": "Web Design", "duration": 15, "questions": 0 },
          { "id": "DMCD244", "title": "Advanced Photography", "duration": 15, "questions": 0 },
          { "id": "DMCD245", "title": "Advanced Print Production", "duration": 15, "questions": 0 }
        ],
        "year3": [
          { "id": "DMCD351", "title": "First Practical Training & Internship", "duration": 20, "questions": 0 },
          { "id": "DMCD352", "title": "Book & Magazine Design", "duration": 15, "questions": 0 },
          { "id": "DMCD353", "title": "Advertising Design", "duration": 15, "questions": 0 },
          { "id": "DMCD354", "title": "Online Media Technology", "duration": 15, "questions": 0 },
          { "id": "DMCD355", "title": "Animation", "duration": 15, "questions": 0 },
          { "id": "ACDT351", "title": "Business Management and Sustenance", "duration": 10, "questions": 0 },
          { "id": "DMCD361", "title": "Copywriting", "duration": 15, "questions": 0 },
          { "id": "DMCD362", "title": "Advanced Advertising Design", "duration": 15, "questions": 0 },
          { "id": "DMCD363", "title": "Video Production", "duration": 15, "questions": 0 },
          { "id": "DMCD364", "title": "Advanced Animation", "duration": 15, "questions": 0 },
          { "id": "ACDT361", "title": "Research Methods", "duration": 15, "questions": 0 },
          { "id": "DMCD365", "title": "Sound Production (Elective)", "duration": 15, "questions": 0 },
          { "id": "DMCD366", "title": "Motion Graphics (Elective)", "duration": 15, "questions": 0 }
        ],
        "year4": [
          { "id": "DMCD471", "title": "Second Practical Training & Internship", "duration": 20, "questions": 0 },
          { "id": "DMCD472", "title": "Project & Report Writing I", "duration": 15, "questions": 0 },
          { "id": "DMCD473", "title": "Professional Portfolio Development I", "duration": 15, "questions": 0 },
          { "id": "DMCD474", "title": "Contracts & Copyright (Elective)", "duration": 15, "questions": 0 },
          { "id": "ACDT471", "title": "Accounting & Finance for Entrepreneurs (Elective)", "duration": 15, "questions": 0 },
          { "id": "DMCD481", "title": "Project & Report Writing II", "duration": 15, "questions": 0 },
          { "id": "DMCD482", "title": "Professional Portfolio Development II", "duration": 15, "questions": 0 },
          { "id": "DMCD483", "title": "Ethics and Career Planning (Elective)", "duration": 15, "questions": 0 },
          { "id": "DMCD484", "title": "Taxes and Regulations (Elective)", "duration": 15, "questions": 0 }
        ]
      }
    },
    {
      "id": "fd",
      "name": "Fashion Design",
      "assessments": {
        "year1": [
          { "id": "FDT151", "title": "Introduction to Fashion", "duration": 15, "questions": 1 },
          { "id": "FDT153", "title": "Introduction to Textile Design", "duration": 15, "questions": 0 },
          { "id": "FDT155", "title": "Pattern Making", "duration": 15, "questions": 0 },
          { "id": "FDT157", "title": "Sewing Techniques", "duration": 15, "questions": 0 },
          { "id": "FDT159", "title": "Introduction to Textiles", "duration": 15, "questions": 0 },
          { "id": "ACDT114", "title": "Basic Drawing", "duration": 15, "questions": 0 },
          { "id": "ACDT117", "title": "Information Communication Technology I", "duration": 15, "questions": 0 },
          { "id": "ACDT115", "title": "Introduction to African Art & Culture", "duration": 15, "questions": 0 },
          { "id": "ACDT116", "title": "Communication and Study Skills I", "duration": 15, "questions": 0 },
          { "id": "FDT150", "title": "Introduction to Creative Design in Fashion", "duration": 15, "questions": 0 },
          { "id": "FDT152", "title": "Textile Design", "duration": 15, "questions": 0 },
          { "id": "FDT154", "title": "Pattern Adaptation", "duration": 15, "questions": 0 },
          { "id": "FDT156", "title": "Garment Construction", "duration": 15, "questions": 0 },
          { "id": "FDT158", "title": "Freehand Cutting", "duration": 15, "questions": 0 },
          { "id": "FDT160", "title": "Basic Design", "duration": 15, "questions": 0 },
          { "id": "ACDT127", "title": "Information Communication Technology II", "duration": 15, "questions": 0 },
          { "id": "ACDT126", "title": "Communication and Study Skills II", "duration": 15, "questions": 0 },
          { "id": "WEL150", "title": "Industrial Attachment I", "duration": 15, "questions": 0 }
        ],
        "year2": [
          { "id": "FDT251", "title": "Creative Design in Fashion", "duration": 15, "questions": 0 },
          { "id": "FDT253", "title": "Printed Textile Design Application", "duration": 15, "questions": 0 },
          { "id": "FDT255", "title": "Pattern Technology I", "duration": 15, "questions": 0 },
          { "id": "FDT257", "title": "Garment Technology I", "duration": 15, "questions": 0 },
          { "id": "FDT259", "title": "Introduction to Fabric Studies", "duration": 15, "questions": 0 },
          { "id": "FDT261", "title": "Fashion Illustration", "duration": 15, "questions": 0 },
          { "id": "FDT263", "title": "Basic Computer Aided Design", "duration": 15, "questions": 0 },
          { "id": "FDT265", "title": "Introduction to Fashion Accessories", "duration": 15, "questions": 0 },
          { "id": "FDT267", "title": "Introduction to Production Management", "duration": 15, "questions": 0 },
          { "id": "FDT250", "title": "Basic Fashion Design and Illustration", "duration": 15, "questions": 0 },
          { "id": "FDT252", "title": "Pattern Technology II", "duration": 15, "questions": 0 },
          { "id": "FDT254", "title": "Garment Technology II", "duration": 15, "questions": 0 },
          { "id": "FDT256", "title": "Fabric Studies", "duration": 15, "questions": 0 },
          { "id": "FDT258", "title": "Millinery Design and Production", "duration": 15, "questions": 0 },
          { "id": "FDT260", "title": "Computer Aided Design", "duration": 15, "questions": 0 },
          { "id": "FDT262", "title": "Fashion Marketing", "duration": 15, "questions": 0 },
          { "id": "FDT264", "title": "Production Management", "duration": 15, "questions": 0 },
          { "id": "WEL250", "title": "Industrial Attachment", "duration": 15, "questions": 0 }
        ],
        "year3": [
          { "id": "FDT351", "title": "Design and Illustration", "duration": 15, "questions": 0 },
          { "id": "FDT353", "title": "Garment Decoration Techniques", "duration": 15, "questions": 0 },
          { "id": "FDT355", "title": "Pattern Alteration", "duration": 15, "questions": 0 },
          { "id": "FDT357", "title": "Fashion Draping", "duration": 15, "questions": 0 },
          { "id": "FDT359", "title": "Design and Production of Bags and Slippers", "duration": 15, "questions": 0 },
          { "id": "FDT361", "title": "Entrepreneurship I", "duration": 15, "questions": 0 },
          { "id": "FDT363", "title": "Seminar in Fashion", "duration": 15, "questions": 0 },
          { "id": "ACDT367", "title": "Research Methods", "duration": 15, "questions": 0 },
          { "id": "WEL350", "title": "Industrial Attachment III", "duration": 15, "questions": 0 },
          { "id": "FDT352", "title": "Research Methods/Seminar", "duration": 15, "questions": 0 }
        ],
        "year4": [
          { "id": "FDT451", "title": "Collection Development", "duration": 15, "questions": 0 },
          { "id": "FDT453", "title": "Quality Control in Garment Production", "duration": 15, "questions": 0 },
          { "id": "FDT455", "title": "Beauty Culture", "duration": 15, "questions": 0 },
          { "id": "FDT457", "title": "Entrepreneurship II", "duration": 15, "questions": 0 },
          { "id": "FDT459", "title": "Thesis/ Project I", "duration": 15, "questions": 0 },
          { "id": "FDT450", "title": "Final Collection Development", "duration": 15, "questions": 0 },
          { "id": "FDT452", "title": "Portfolio Development and Exhibition", "duration": 15, "questions": 0 },
          { "id": "FDT454", "title": "Salesmanship and Sales Management", "duration": 15, "questions": 0 },
          { "id": "FDT460", "title": "Fashion Merchandising", "duration": 15, "questions": 0 },
          { "id": "FDT464", "title": "Thesis/ Project II", "duration": 15, "questions": 0 }
        ]
      }
    },
    {
      "id": "pd",
      "name": "Product Design",
      "assessments": {
        "year1": [
          { "id": "BPDE111", "title": "Introduction to Industrial/Product Design", "duration": 15, "questions": 1 },
          { "id": "ACDT112", "title": "Safety In Workshop Practices", "duration": 10, "questions": 0 },
          { "id": "ACDT113", "title": "Technical Drawing", "duration": 10, "questions": 0 },
          { "id": "ACDT114", "title": "Basic Drawing", "duration": 10, "questions": 0 },
          { "id": "ACDT115", "title": "Introduction to African Art & Culture", "duration": 15, "questions": 0 },
          { "id": "ACDT116", "title": "Communication Skills I", "duration": 10, "questions": 0 },
          { "id": "ACDT117", "title": "Information Communication Technology I", "duration": 10, "questions": 0 },
          { "id": "BPDE121", "title": "Idea Development and Design Processes", "duration": 15, "questions": 0 },
          { "id": "BPDE122", "title": "Workshop Practices", "duration": 15, "questions": 0 },
          { "id": "BPDE123", "title": "Orthographic and Isometric Projections", "duration": 15, "questions": 0 },
          { "id": "BPDE125", "title": "Freehand Drawing Techniques", "duration": 15, "questions": 0 },
          { "id": "ACDT125", "title": "Introduction to Computer Aided Design", "duration": 15, "questions": 0 },
          { "id": "ACDT126", "title": "Communication Skills II", "duration": 10, "questions": 0 },
          { "id": "ACDT127", "title": "Information Communication Technology II", "duration": 10, "questions": 0 }
        ],
        "year2": [
          { "id": "BPDE231", "title": "Introduction to Modelling", "duration": 15, "questions": 0 },
          { "id": "BPDE232", "title": "Product Design Methods", "duration": 15, "questions": 0 },
          { "id": "BPDE233", "title": "Perspective Drawing", "duration": 15, "questions": 0 },
          { "id": "BPDE234", "title": "Nature of Materials and Processes", "duration": 15, "questions": 0 },
          { "id": "BPDE235", "title": "Manufacturing Processes I", "duration": 15, "questions": 0 },
          { "id": "BPDE236", "title": "Three-Dimensional Design in Computing", "duration": 15, "questions": 0 },
          { "id": "BPDE237", "title": "Introduction to Entrepreneurship", "duration": 10, "questions": 0 },
          { "id": "BPDE241", "title": "Design for Use", "duration": 15, "questions": 0 },
          { "id": "BPDE242", "title": "Visual Communication and Package Design", "duration": 15, "questions": 0 },
          { "id": "BPDE243", "title": "Ergonomics and Human Factors Applications", "duration": 15, "questions": 0 },
          { "id": "BPDE244", "title": "Contextual Nature of Products", "duration": 15, "questions": 0 },
          { "id": "BPDE245", "title": "Objects and Impacts", "duration": 15, "questions": 0 },
          { "id": "BPDE246", "title": "Advanced Computer Application", "duration": 15, "questions": 0 },
          { "id": "ACDT247", "title": "New Venture Creation", "duration": 10, "questions": 0 }
        ],
        "year3": [
          { "id": "BPDE351", "title": "Practical Model Making Techniques", "duration": 15, "questions": 0 },
          { "id": "BPDE352", "title": "Product Interface Design", "duration": 15, "questions": 0 },
          { "id": "BPDE353", "title": "Workshop Practice I", "duration": 15, "questions": 0 },
          { "id": "BPDE354", "title": "Design and Development", "duration": 15, "questions": 0 },
          { "id": "BPDE355", "title": "Seminar", "duration": 15, "questions": 0 },
          { "id": "ACDT356", "title": "Business Management and Sustainability", "duration": 10, "questions": 0 },
          { "id": "BPDE361", "title": "Mass Production Technology", "duration": 15, "questions": 0 },
          { "id": "BPDE362", "title": "Rendering for Presentation", "duration": 15, "questions": 0 },
          { "id": "BPDE363", "title": "Workshop Practice II", "duration": 15, "questions": 0 },
          { "id": "BPDE364", "title": "Design and Sustainability", "duration": 15, "questions": 0 },
          { "id": "BPDE365", "title": "Ethical and Legal Issues", "duration": 10, "questions": 0 },
          { "id": "ACDT367", "title": "Research Methods", "duration": 15, "questions": 0 }
        ],
        "year4": [
          { "id": "BPDE471", "title": "Industrial Attachment", "duration": 20, "questions": 0 },
          { "id": "BPDE472", "title": "Project Report I", "duration": 20, "questions": 0 },
          { "id": "BPDE481", "title": "Industrial Attachment Seminars", "duration": 15, "questions": 0 },
          { "id": "BPDE482", "title": "Studio Research in Product Design", "duration": 15, "questions": 0 },
          { "id": "BPDE483", "title": "Exhibition Design", "duration": 15, "questions": 0 },
          { "id": "BPDE484", "title": "Project Report II", "duration": 15, "questions": 0 },
          { "id": "ACDT485", "title": "Accounting and Finance for Entrepreneurs", "duration": 15, "questions": 0 }
        ]
      }
    }
  ],
  "questions": {
    "DMCD111": [
        { "question": "What does RGB stand for in digital colour models?", "options": ["Red, Green, Blue", "Red, Grey, Black", "Royal Gold Banner", "Raster Graphics Buffer"], "answer": "Red, Green, Blue" }
    ],
    "FDT151": [
        { "question": "Which of these is a natural fibre?", "options": ["Cotton", "Polyester", "Nylon", "Rayon"], "answer": "Cotton" }
    ],
    "BPDE111": [
        { "question": "What is the primary focus of ergonomics?", "options": ["User comfort and efficiency", "Aesthetics", "Material cost", "Manufacturing speed"], "answer": "User comfort and efficiency" }
    ]
  }
};