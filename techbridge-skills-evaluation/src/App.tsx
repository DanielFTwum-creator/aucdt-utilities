import { ArrowLeft, ArrowRight, Award, BarChart2, BookOpen, CheckCircle, Clock, Download, FileText, Home, RefreshCw, Settings, ShieldCheck, Target, Trash2, TrendingDown, TrendingUp, Upload, Users, XCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// --- INITIAL DATA & CONFIGURATION ---
const initialProgrammeData = {
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
          { "id": "FTD267", "title": "Introduction to Production Management", "duration": 15, "questions": 0 },
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

const ADMIN_PASSWORD = "admin"; // Simple password for demo purposes

// --- HELPER FUNCTIONS & HOOKS ---

// Custom hook for using Local Storage
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  return [storedValue, setValue];
};

// Audit Logger
const useAuditLog = () => {
  const [log, setLog] = useLocalStorage('tuc-audit-log', []);

  const addLogEntry = (eventType, eventData) => {
    const newEntry = {
      timestamp: new Date().toISOString(),
      eventType,
      ...eventData
    };
    setLog(prevLog => [...prevLog, newEntry]);
  };

  return { log, addLogEntry, setLog };
};


// --- BRANDED UI COMPONENTS (from Analytics Dashboard) ---

const StatCard = ({ title, value, change, icon, subtitle }) => (
  <div className="bg-white rounded-xl border-l-4 border-[#D4AF37] p-6 shadow-[0_4px_12px_rgba(139,21,56,0.15)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 rounded-lg bg-[#F4E4BC]">{icon}</div>
      <div className={`flex items-center text-sm font-medium ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'}`}>
        {change > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : change < 0 ? <TrendingDown className="w-4 h-4 mr-1" /> : null}
        {change !== 0 && `${change > 0 ? '+' : ''}${change}%`}
      </div>
    </div>
    <div>
      <h3 className="text-2xl font-bold text-[#2C1810] mb-1">{value.toLocaleString()}</h3>
      <p className="text-[#2C1810] text-sm font-medium">{title}</p>
      {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
    </div>
  </div>
);

const SkillProgressBar = ({ skill, value, change }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium text-[#2C1810]">{skill}</span>
      <div className="flex items-center">
        <span className="text-sm text-[#2C1810] font-semibold mr-2">{value}%</span>
        <span className={`text-xs font-medium ${change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'}`}>
          {change > 0 ? '+' : ''}{change}
        </span>
      </div>
    </div>
    <div className="w-full bg-[#E6D5C7] rounded-full h-2">
      <div className="bg-gradient-to-r from-[#8B1538] to-[#6B1028] h-2 rounded-full transition-all duration-500" style={{ width: `${value}%` }} />
    </div>
  </div>
);

// --- MODAL COMPONENT ---
const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-xl p-8 shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};


// --- CORE APPLICATION COMPONENTS ---

// 1. Programme Dashboard (FR-001)
const ProgrammeDashboard = ({ setView, setProgramme, programmes }) => (
    <div>
        <h2 className="text-2xl font-semibold text-[#2C1810] mb-6">Academic Programmes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programmes.map(prog => (
                <div key={prog.id} onClick={() => { setProgramme(prog); setView('programmeDetail'); }}
                     className="bg-white p-6 rounded-xl shadow-[0_4px_12px_rgba(139,21,56,0.15)] cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4 border-[#D4AF37]">
                    <h3 className="text-lg font-bold text-[#8B1538]">{prog.name}</h3>
                    <p className="text-gray-600 text-sm mt-2">View available assessments for this programme.</p>
                </div>
            ))}
        </div>
    </div>
);

// 2. Programme Detail (FR-002, FR-003)
const ProgrammeDetail = ({ programme, setView, setAssessment }) => (
    <div>
        <button onClick={() => setView('dashboard')} className="flex items-center text-sm font-medium text-[#8B1538] mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Programmes
        </button>
        <h2 className="text-2xl font-semibold text-[#2C1810] mb-2">{programme.name}</h2>
        <p className="text-gray-500 mb-6">Select an assessment to begin.</p>
        
        {Object.entries(programme.assessments).map(([year, assessments]) => (
            <div key={year} className="mb-6">
                <h3 className="text-lg font-semibold text-[#6B1028] capitalize mb-3 border-b-2 border-[#E6D5C7] pb-2">
                    {year.replace('year', 'Year ')}
                </h3>
                <div className="space-y-3">
                    {assessments.map(asm => (
                        <div key={asm.id} onClick={() => { setAssessment(asm); setView('assessment'); }}
                             className="bg-white p-4 rounded-lg shadow-sm cursor-pointer flex justify-between items-center hover:bg-[#F8F6F0]">
                            <div className="flex items-center">
                                <span className="text-xs font-mono bg-[#E6D5C7] text-[#6B1028] px-2 py-1 rounded-md mr-4">{asm.id}</span>
                                <div>
                                    <h4 className="font-semibold text-[#2C1810]">{asm.title}</h4>
                                    <p className="text-xs text-gray-500">{asm.questions} Questions | {asm.duration} Minutes</p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-[#D4AF37]" />
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

// 3. Assessment Player (FR-004 to FR-008, FR-019, FR-020)
const AssessmentPlayer = ({ assessment, questions, setView, setResults, addLogEntry }) => {
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useLocalStorage(`assessment-session-${assessment.id}`, {});
    const [timeLeft, setTimeLeft] = useLocalStorage(`assessment-time-${assessment.id}`, assessment.duration * 60);
    const [confirmSubmit, setConfirmSubmit] = useState(false);

    const timerRef = useRef();

    useEffect(() => {
        addLogEntry('ASSESSMENT_START', { assessmentId: assessment.id, title: assessment.title });
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, []);
    
    useEffect(() => {
        if (timeLeft === 0) {
            handleSubmit();
        }
    }, [timeLeft]);

    const handleAnswer = (questionIndex, answer) => {
        const newAnswers = { ...answers, [questionIndex]: answer };
        setAnswers(newAnswers);
        addLogEntry('QUESTION_ANSWER', { assessmentId: assessment.id, questionIndex, answer });
    };

    const handleSubmit = () => {
        clearInterval(timerRef.current);
        let score = 0;
        questions.forEach((q, index) => {
            if (answers[index] === q.answer) {
                score++;
            }
        });
        const finalResults = {
            score,
            total: questions.length,
            answers,
            questions,
            assessmentId: assessment.id,
            assessmentTitle: assessment.title
        };
        setResults(finalResults);
        addLogEntry('ASSESSMENT_SUBMIT', { assessmentId: assessment.id, score, total: questions.length });
        
        // Clear session from local storage
        localStorage.removeItem(`assessment-session-${assessment.id}`);
        localStorage.removeItem(`assessment-time-${assessment.id}`);

        setView('results');
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!questions || questions.length === 0) {
        return (
            <div className="text-center p-8 bg-white rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-[#8B1538] mb-4">No Questions Available</h2>
                <p className="text-gray-600 mb-6">This assessment has not been configured with questions yet. Please check back later or contact an administrator.</p>
                <button onClick={() => setView('dashboard')} className="flex items-center mx-auto px-6 py-2 bg-gradient-to-r from-[#8B1538] to-[#6B1028] text-white rounded-full font-semibold text-sm">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(139,21,56,0.15)]">
                <div className="flex justify-between items-center border-b border-[#E6D5C7] pb-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-[#8B1538]">{assessment.id} - {assessment.title}</h2>
                        <p className="text-sm text-gray-500">Question {currentQ + 1} of {questions.length}</p>
                    </div>
                    <div className="flex items-center font-semibold text-lg text-[#6B1028] bg-[#F4E4BC] px-4 py-2 rounded-full">
                        <Clock className="w-5 h-5 mr-2" />
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-[#2C1810] mb-6">{questions[currentQ].question}</h3>
                    <div className="space-y-4">
                        {questions[currentQ].options.map(option => (
                            <div key={option} onClick={() => handleAnswer(currentQ, option)}
                                 className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${answers[currentQ] === option ? 'bg-[#F4E4BC] border-[#D4AF37]' : 'border-[#E6D5C7] hover:border-[#D4AF37]'}`}>
                                {option}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#E6D5C7]">
                    <button onClick={() => setCurrentQ(q => Math.max(0, q - 1))} disabled={currentQ === 0}
                            className="flex items-center px-6 py-2 bg-white border border-[#E6D5C7] text-[#2C1810] rounded-full font-semibold text-sm disabled:opacity-50">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                    </button>
                    {currentQ < questions.length - 1 ? (
                        <button onClick={() => setCurrentQ(q => Math.min(questions.length - 1, q + 1))}
                                className="flex items-center px-6 py-2 bg-gradient-to-r from-[#8B1538] to-[#6B1028] text-white rounded-full font-semibold text-sm">
                            Next <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    ) : (
                        <button onClick={() => setConfirmSubmit(true)}
                                className="flex items-center px-6 py-2 bg-gradient-to-r from-[#8B1538] to-[#6B1028] text-white rounded-full font-semibold text-sm">
                            Submit Assessment
                        </button>
                    )}
                </div>
            </div>
            <Modal isOpen={confirmSubmit} onClose={() => setConfirmSubmit(false)}>
                <h3 className="text-lg font-bold text-[#2C1810] mb-4">Confirm Submission</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to submit your answers? This action cannot be undone.</p>
                <div className="flex justify-end space-x-4">
                    <button onClick={() => setConfirmSubmit(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-[#8B1538] text-white rounded-lg">Submit</button>
                </div>
            </Modal>
        </div>
    );
};

// 4. Results Page (FR-009 to FR-012)
const ResultsPage = ({ results, setView }) => {
    const [feedback, setFeedback] = useState('');
    const [isLoadingFeedback, setIsLoadingFeedback] = useState(true);
    const [reviewMode, setReviewMode] = useState(false);

    useEffect(() => {
        const fetchFeedback = async () => {
            setIsLoadingFeedback(true);
            const incorrectAnswers = results.questions
                .map((q, i) => ({ ...q, userAnswer: results.answers[i] }))
                .filter(q => q.userAnswer !== q.answer);

            const prompt = `A student took an assessment titled "${results.assessmentId} - ${results.assessmentTitle}". They scored ${results.score} out of ${results.total}. 
            Here are the questions they got wrong and the answers they chose:
            ${incorrectAnswers.map(q => `- Question: "${q.question}", Their Answer: "${q.userAnswer}", Correct Answer: "${q.answer}"`).join('\n')}
            
            Provide encouraging, personalised feedback in British English. Explain why some of their incorrect answers might have been wrong and offer brief, constructive advice for improvement. Keep it concise and supportive. Start with "Well done on completing the assessment!".`;
            
            try {
                // This is a mock API call. Replace with your actual Gemini API call.
                // In a real app, the API key should be handled securely.
                const apiKey = ""; // IMPORTANT: Add your Gemini API key here for feedback to work.
                if (!apiKey) {
                    setFeedback("AI feedback is not configured. Please add an API key. \n\nBased on your results, focus on reviewing the topics where you made mistakes. Great effort!");
                    setIsLoadingFeedback(false);
                    return;
                }
                
                let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
                const payload = { contents: chatHistory };
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
                
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const result = await response.json();
                const text = result.candidates[0].content.parts[0].text;
                setFeedback(text);

            } catch (error) {
                console.error("Error fetching AI feedback:", error);
                setFeedback("There was an issue generating your feedback. Please try again later. Well done on completing the assessment!");
            } finally {
                setIsLoadingFeedback(false);
            }
        };

        fetchFeedback();
    }, [results]);

    if (reviewMode) {
        return <ReviewAnswers results={results} setReviewMode={setReviewMode} />;
    }

    const percentage = results.total > 0 ? Math.round((results.score / results.total) * 100) : 0;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(139,21,56,0.15)] text-center">
                <h2 className="text-2xl font-bold text-[#8B1538] mb-2">Assessment Complete!</h2>
                <p className="text-gray-600 mb-6">Here is a summary of your performance for {results.assessmentId}.</p>
                <div className="flex justify-center items-center my-8">
                    <div className="relative w-48 h-48">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path className="text-[#E6D5C7]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                            <path className="text-[#8B1538]" strokeDasharray={`${percentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"></path>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold text-[#2C1810]">{percentage}%</span>
                            <span className="text-gray-500">{results.score}/{results.total} Correct</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-[#F8F6F0] p-6 rounded-lg text-left my-6">
                    <h3 className="font-semibold text-[#2C1810] mb-3">Personalised Feedback</h3>
                    {isLoadingFeedback ? (
                        <p className="text-gray-600 animate-pulse">Generating your feedback...</p>
                    ) : (
                        <p className="text-gray-700 whitespace-pre-wrap">{feedback}</p>
                    )}
                </div>

                <div className="flex justify-center space-x-4 mt-8">
                    <button onClick={() => setView('dashboard')} className="flex items-center px-6 py-2 bg-white border border-[#E6D5C7] text-[#2C1810] rounded-full font-semibold text-sm">
                        <Home className="w-4 h-4 mr-2" /> Back to Dashboard
                    </button>
                    <button onClick={() => setReviewMode(true)} className="flex items-center px-6 py-2 bg-gradient-to-r from-[#8B1538] to-[#6B1028] text-white rounded-full font-semibold text-sm">
                        Review Answers <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const ReviewAnswers = ({ results, setReviewMode }) => (
    <div className="max-w-4xl mx-auto">
        <button onClick={() => setReviewMode(false)} className="flex items-center text-sm font-medium text-[#8B1538] mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Results
        </button>
        <h2 className="text-2xl font-semibold text-[#2C1810] mb-6">Review Your Answers for {results.assessmentId}</h2>
        <div className="space-y-6">
            {results.questions.map((q, index) => {
                const userAnswer = results.answers[index];
                const isCorrect = userAnswer === q.answer;
                return (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="font-semibold text-[#2C1810] mb-4">Question {index + 1}: {q.question}</h3>
                        <div className="space-y-3">
                            {q.options.map(option => {
                                let style = 'border-gray-300';
                                if (option === q.answer) style = 'border-green-500 bg-green-50 text-green-800';
                                if (option === userAnswer && !isCorrect) style = 'border-red-500 bg-red-50 text-red-800';
                                
                                return (
                                    <div key={option} className={`p-3 border-2 rounded-lg flex items-center ${style}`}>
                                        {option === q.answer && <CheckCircle className="w-5 h-5 mr-3 text-green-600" />}
                                        {option === userAnswer && !isCorrect && <XCircle className="w-5 h-5 mr-3 text-red-600" />}
                                        {option}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

// 5. Admin Panel (FR-013 to FR-018)
const AdminPanel = ({ programmeData, setProgrammeData, log, setLog }) => {
    const [showModal, setShowModal] = useState(false);
    const [action, setAction] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });
    const fileInputRef = useRef(null);

    const handleExportProgrammes = () => {
        const dataStr = JSON.stringify(programmeData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tuc-programmes.json';
        a.click();
        URL.revokeObjectURL(url);
        setMessage({ text: 'Programme data exported successfully.', type: 'success' });
    };

    const handleImportProgrammes = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target.result);
                    if (json.programmes && json.questions) {
                        setProgrammeData(json);
                        setMessage({ text: 'Programme data imported successfully.', type: 'success' });
                    } else {
                        throw new Error('Invalid file structure.');
                    }
                } catch (error) {
                    setMessage({ text: `Import failed: ${error.message}`, type: 'error' });
                }
            };
            reader.readAsText(file);
        } else {
            setMessage({ text: 'Please select a valid JSON file.', type: 'error' });
        }
        fileInputRef.current.value = null; // Reset file input
    };

    const handleExportLog = () => {
        const dataStr = JSON.stringify(log, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tuc-audit-log.json';
        a.click();
        URL.revokeObjectURL(url);
        setMessage({ text: 'Audit log exported successfully.', type: 'success' });
    };

    const performAction = () => {
        if (action === 'clearLog') {
            setLog([]);
            setMessage({ text: 'Audit log cleared.', type: 'success' });
        } else if (action === 'resetData') {
            setProgrammeData(initialProgrammeData);
            setMessage({ text: 'Programme data reset to default.', type: 'success' });
        }
        setShowModal(false);
        setAction(null);
    };

    const adminActions = [
        { label: 'Export Programme Data', icon: Download, action: handleExportProgrammes, color: 'blue' },
        { label: 'Import Programme Data', icon: Upload, action: () => fileInputRef.current.click(), color: 'blue' },
        { label: 'Export Audit Log', icon: FileText, action: handleExportLog, color: 'green' },
        { label: 'Clear Audit Log', icon: Trash2, action: () => { setAction('clearLog'); setShowModal(true); }, color: 'red' },
        { label: 'Reset All Data', icon: RefreshCw, action: () => { setAction('resetData'); setShowModal(true); }, color: 'red' },
    ];

    return (
        <div>
            <h2 className="text-2xl font-semibold text-[#2C1810] mb-6">Administrative Panel</h2>
            {message.text && (
                <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <input type="file" ref={fileInputRef} onChange={handleImportProgrammes} accept=".json" className="hidden" />
                {adminActions.map(act => (
                    <div key={act.label} onClick={act.action}
                         className={`bg-white p-6 rounded-xl shadow-sm cursor-pointer flex flex-col items-center justify-center text-center hover:bg-gray-50 border-b-4 border-${act.color}-500`}>
                        <act.icon className={`w-10 h-10 mb-3 text-${act.color}-600`} />
                        <span className="font-semibold text-[#2C1810]">{act.label}</span>
                    </div>
                ))}
            </div>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <h3 className="text-lg font-bold text-[#2C1810] mb-4">Confirm Action</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to {action === 'clearLog' ? 'clear the audit log' : 'reset all programme data'}? This cannot be undone.</p>
                <div className="flex justify-end space-x-4">
                    <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                    <button onClick={performAction} className="px-4 py-2 bg-red-600 text-white rounded-lg">Confirm</button>
                </div>
            </Modal>
        </div>
    );
};


// 6. Analytics Dashboard (Integrated)
const AnalyticsDashboard = () => {
    // Using static data as per the original component, now updated for 4 programmes
    const programmePerformance = [
        { name: 'Jewellery Design', students: 145, avgScore: 87, completion: 92 },
        { name: 'Digital Media', students: 203, avgScore: 84, completion: 88 },
        { name: 'Fashion Design', students: 167, avgScore: 81, completion: 85 },
        { name: 'Product Design', students: 89, avgScore: 89, completion: 94 }
    ];
    const skillsBreakdown = [
        { skill: 'Technical Skills', value: 78, change: +5 },
        { skill: 'Creative Design', value: 85, change: +8 },
        { skill: 'Problem Solving', value: 72, change: +3 },
        { skill: 'Communication', value: 81, change: +7 },
        { skill: 'Project Management', value: 69, change: -2 },
        { skill: 'Industry Knowledge', value: 83, change: +4 }
    ];

    const kpiData = {
        totalStudents: 604,
        totalAssessments: 2196,
        avgCompletionRate: 89,
        avgScore: 82,
        trends: { students: +12, assessments: +18, completion: +3, score: +5 }
    };
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-[#E6D5C7] shadow-lg">
                    <p className="label font-semibold text-[#2C1810]">{`${label}`}</p>
                    {payload.map((pld, index) => (
                        <p key={index} style={{ color: pld.color }} className="text-sm">{`${pld.name}: ${pld.value}`}</p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold text-[#2C1810] mb-6">Performance Analytics</h2>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Students" value={kpiData.totalStudents} change={kpiData.trends.students} icon={<Users className="w-6 h-6 text-[#8B1538]" />} subtitle="Across all programmes" />
                <StatCard title="Assessments Completed" value={kpiData.totalAssessments} change={kpiData.trends.assessments} icon={<BookOpen className="w-6 h-6 text-[#8B1538]" />} subtitle="This academic year" />
                <StatCard title="Completion Rate" value={`${kpiData.avgCompletionRate}%`} change={kpiData.trends.completion} icon={<Target className="w-6 h-6 text-[#8B1538]" />} subtitle="Average across programmes" />
                <StatCard title="Average Score" value={`${kpiData.avgScore}%`} change={kpiData.trends.score} icon={<Award className="w-6 h-6 text-[#8B1538]" />} subtitle="Skills assessment average" />
            </section>
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-[0_4px_12px_rgba(139,21,56,0.15)]">
                    <h3 className="text-lg font-semibold text-[#2C1810] mb-4">Programme Performance Comparison</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={programmePerformance}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E6D5C7" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="avgScore" fill="#8B1538" name="Average Score" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="completion" fill="#D4AF37" name="Completion Rate" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-[0_4px_12px_rgba(139,21,56,0.15)]">
                    <h3 className="text-lg font-semibold text-[#2C1810] mb-4">Skills Development Progress</h3>
                    <div className="space-y-4">
                        {skillsBreakdown.map((skill, index) => (
                            <SkillProgressBar key={index} {...skill} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};


// --- MAIN APP COMPONENT (Router & State Management) ---
const App = () => {
    const [view, setView] = useState('dashboard'); // dashboard, programmeDetail, assessment, results, admin, analytics
    const [programmeData, setProgrammeData] = useLocalStorage('tuc-programme-data', initialProgrammeData);
    const [selectedProgramme, setSelectedProgramme] = useState(null);
    const [selectedAssessment, setSelectedAssessment] = useState(null);
    const [results, setResults] = useState(null);
    const [sessionToResume, setSessionToResume] = useState(null);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [adminError, setAdminError] = useState('');

    const { log, addLogEntry, setLog } = useAuditLog();

    useEffect(() => {
        addLogEntry('APP_LOAD', {});
        // Check for an in-progress assessment on load
        const inProgress = Object.keys(localStorage).find(k => k.startsWith('assessment-session-'));
        if (inProgress) {
            const assessmentId = inProgress.replace('assessment-session-', '');
            const allAssessments = programmeData.programmes.flatMap(p => Object.values(p.assessments).flat());
            const assessmentDetails = allAssessments.find(a => a.id === assessmentId);
            if (assessmentDetails) {
                setSessionToResume(assessmentDetails);
            }
        }
    }, []);

    const resumeAssessment = () => {
        setSelectedAssessment(sessionToResume);
        setView('assessment');
        setSessionToResume(null);
    };
    
    const discardAssessment = () => {
        localStorage.removeItem(`assessment-session-${sessionToResume.id}`);
        localStorage.removeItem(`assessment-time-${sessionToResume.id}`);
        setSessionToResume(null);
    };

    const handleAdminLogin = () => {
        if (password === ADMIN_PASSWORD) {
            setIsAdminAuthenticated(true);
            setView('admin');
            setShowAdminModal(false);
            setAdminError('');
            setPassword('');
        } else {
            setAdminError('Incorrect password.');
        }
    };

    const renderView = () => {
        switch (view) {
            case 'dashboard':
                return <ProgrammeDashboard setView={setView} setProgramme={setSelectedProgramme} programmes={programmeData.programmes} />;
            case 'programmeDetail':
                return <ProgrammeDetail programme={selectedProgramme} setView={setView} setAssessment={setSelectedAssessment} />;
            case 'assessment':
                return <AssessmentPlayer assessment={selectedAssessment} questions={programmeData.questions[selectedAssessment.id] || []} setView={setView} setResults={setResults} addLogEntry={addLogEntry} />;
            case 'results':
                return <ResultsPage results={results} setView={setView} />;
            case 'admin':
                return <AdminPanel programmeData={programmeData} setProgrammeData={setProgrammeData} log={log} setLog={setLog} />;
            case 'analytics':
                return <AnalyticsDashboard />;
            default:
                return <ProgrammeDashboard setView={setView} setProgramme={setSelectedProgramme} programmes={programmeData.programmes} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F6F0] text-[#2C1810] font-sans">
            <header className="bg-white/80 backdrop-blur-sm border-b border-[#E6D5C7] px-6 py-3 sticky top-0 z-20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center cursor-pointer" onClick={() => setView('dashboard')}>
                        <img src="https://techbridge.edu.gh/wp-content/uploads/tuc-logo.png" alt="TUC Logo" className="h-12 mr-4" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
                        <div>
                            <h1 className="text-xl font-bold text-[#8B1538]">Skills Evaluation System</h1>
                        </div>
                    </div>
                    <nav className="flex items-center space-x-4">
                        <button onClick={() => setView('dashboard')} className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-[#E6D5C7] transition-colors"><Home className="w-5 h-5"/><span>Home</span></button>
                        <button onClick={() => setView('analytics')} className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-[#E6D5C7] transition-colors"><BarChart2 className="w-5 h-5"/><span>Analytics</span></button>
                        <button onClick={() => { if(isAdminAuthenticated) setView('admin'); else setShowAdminModal(true); }} className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-[#E6D5C7] transition-colors">
                            {isAdminAuthenticated ? <ShieldCheck className="w-5 h-5 text-green-600"/> : <Settings className="w-5 h-5"/>}
                            <span>Admin</span>
                        </button>
                    </nav>
                </div>
            </header>

            <main className="p-6">
                {renderView()}
            </main>

            <Modal isOpen={!!sessionToResume} onClose={() => {}}>
                <h3 className="text-lg font-bold text-[#2C1810] mb-4">Resume Assessment?</h3>
                <p className="text-gray-600 mb-6">We found an assessment in progress for "{sessionToResume?.id} - {sessionToResume?.title}". Would you like to resume where you left off?</p>
                <div className="flex justify-end space-x-4">
                    <button onClick={discardAssessment} className="px-4 py-2 bg-gray-200 rounded-lg">Discard</button>
                    <button onClick={resumeAssessment} className="px-4 py-2 bg-[#8B1538] text-white rounded-lg">Resume</button>
                </div>
            </Modal>

            <Modal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)}>
                <h3 className="text-lg font-bold text-[#2C1810] mb-4">Admin Access</h3>
                <p className="text-gray-600 mb-4">Please enter the password to access administrative tools.</p>
                <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                />
                {adminError && <p className="text-red-500 text-sm mb-4">{adminError}</p>}
                <div className="flex justify-end space-x-4">
                    <button onClick={() => setShowAdminModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                    <button onClick={handleAdminLogin} className="px-4 py-2 bg-[#8B1538] text-white rounded-lg">Login</button>
                </div>
            </Modal>
        </div>
    );
};

export default App;
