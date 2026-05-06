
import React from 'react';
import { DataFlowDiagram, SequenceDiagram, SysArchDiagram, TechStackDiagram, UseCaseDiagram } from './ProjectDiagrams';

export const SRSDocument: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-md rounded-lg mb-12 animate-in fade-in duration-500">
      <div className="border-b-4 border-aucdt-gold pb-6 mb-8 text-center">
        <h1 className="text-3xl font-bold text-aucdt-brown mb-2">Software Requirements Specification (SRS)</h1>
        <h2 className="text-xl text-aucdt-green font-semibold">Vermont Education Contact Aggregator (VECA)</h2>
        <div className="mt-4 text-sm text-gray-500">
          <p><strong>Version:</strong> 1.4 (Final)</p>
          <p><strong>Date:</strong> 25 November 2025</p>
          <p><strong>Prepared For:</strong> Techbridge University College (TUC)</p>
          <p className="mt-1 font-bold text-aucdt-gold">STATUS: COMPLETE</p>
        </div>
      </div>

      <div className="space-y-8 text-aucdt-brown">
        <section>
          <h3 className="text-2xl font-bold border-b border-gray-200 pb-2 mb-4 text-aucdt-gold">1. Introduction</h3>
          <div className="pl-4 space-y-4">
            <div>
              <h4 className="font-bold text-lg">1.1 Purpose</h4>
              <p className="text-gray-700 leading-relaxed">
                The purpose of this document is to define the requirements for the Vermont Education Contact Aggregator (VECA). This application serves as a centralised database and search engine designed to identify, verify, and present contact information for "Heads of Professional Development" and "In-Service Coordinators" within Vermont (VT) elementary schools.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg">1.2 Scope</h4>
              <p className="text-gray-700 leading-relaxed">
                VECA addresses the lack of standardized role titles in Vermont education by aggregating data from dispersed sources. The system includes:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                <li>Automated crawler and manual entry for data acquisition.</li>
                <li>Role normalization logic (e.g., mapping "Director of Learning" to "District PD Lead").</li>
                <li>Secure Administration Console with Audit Logging.</li>
                <li>Accessibility support including High Contrast themes.</li>
                <li>Integrated "Self-Test" framework using Puppeteer simulation.</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold border-b border-gray-200 pb-2 mb-4 text-aucdt-gold">2. System Features</h3>
          <div className="pl-4 space-y-4">
            <div>
              <h4 className="font-bold text-lg text-aucdt-green">2.1 Core Functionality</h4>
              <p className="text-gray-700 mb-2"><strong>FR-01: Data Aggregation</strong> - Scrapes ~50 Supervisory Union websites.</p>
              <p className="text-gray-700 mb-2"><strong>FR-02: Role Mapping</strong> - Intelligence layer to normalize disparate job titles.</p>
              <p className="text-gray-700"><strong>FR-03: Search & Filter</strong> - Real-time filtering by Name, District, and Role.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg text-aucdt-green">2.2 Security & Compliance</h4>
              <p className="text-gray-700 mb-2"><strong>FR-04: Admin Authentication</strong> - Secure password-based entry.</p>
              <p className="text-gray-700"><strong>FR-05: Audit Logging</strong> - Immutable tracking of login, export, and modification events.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg text-aucdt-green">2.3 Quality Assurance</h4>
              <p className="text-gray-700 mb-2"><strong>FR-06: Self-Testing</strong> - Built-in E2E testing suite.</p>
              <p className="text-gray-700"><strong>FR-07: Accessibility</strong> - WCAG 2.1 compliant High Contrast mode.</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold border-b border-gray-200 pb-2 mb-4 text-aucdt-gold">3. System Design Diagrams</h3>
          <div className="pl-4 space-y-8">
            <div>
              <h4 className="font-bold text-lg mb-4">3.1 High-Level Architecture</h4>
              <div className="border border-gray-200 rounded p-2"><SysArchDiagram /></div>
              <p className="text-sm text-gray-500 mt-2">Figure 1: Client-Server-Data Architecture</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">3.2 Technology Stack</h4>
              <div className="border border-gray-200 rounded p-2"><TechStackDiagram /></div>
              <p className="text-sm text-gray-500 mt-2">Figure 2: MERN Stack Implementation Details</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">3.3 Data Flow (Critical Process)</h4>
              <div className="border border-gray-200 rounded p-2"><DataFlowDiagram /></div>
              <p className="text-sm text-gray-500 mt-2">Figure 3: Data Acquisition and Normalization Flow</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold border-b border-gray-200 pb-2 mb-4 text-aucdt-gold">4. Behavioral Design</h3>
          <div className="pl-4 space-y-8">
             <div>
              <h4 className="font-bold text-lg mb-4">4.1 Use Case Diagram</h4>
              <div className="border border-gray-200 rounded p-2"><UseCaseDiagram /></div>
              <p className="text-sm text-gray-500 mt-2">Figure 4: Actor-System Interaction</p>
            </div>
             <div>
              <h4 className="font-bold text-lg mb-4">4.2 Sequence Diagram (Admin Auth)</h4>
              <div className="border border-gray-200 rounded p-2"><SequenceDiagram /></div>
              <p className="text-sm text-gray-500 mt-2">Figure 5: Authentication Sequence</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
