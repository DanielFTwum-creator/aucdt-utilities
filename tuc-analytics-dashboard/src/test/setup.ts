import '@testing-library/jest-dom';
import { vi } from 'vitest';

declare global {
  var fetch: ReturnType<typeof vi.fn>;
}

// Clear all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

// Mock the fetch API
global.fetch = vi.fn((url) => {
  if (url.includes(`${import.meta.env.BASE_URL}data/funnel-data.json`)) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        timeSeriesData: [],
        totalMetrics: {
          totalSignups: 100,
          totalApplicants: 50,
          totalAccepted: 25,
          totalRegistered: 10,
          acceptedNotRegistered: 15,
          signupsNeverApplied: 50,
          overallConversionRate: 10,
        },
        conversionRates: {
          signupToApplication: 50,
          applicationToAcceptance: 50,
          acceptanceToRegistration: 40,
        },
        funnelBreakdown: {
          registered: 10,
          acceptedNotRegistered: 15,
          rejected: 10,
          waitlisted: 5,
        },
        important_correction: {
          correction_date: "2025-06-08",
          correction_reason: "Previous analysis incorrectly mixed student and sponsor/guardian data",
          corrected_analysis: "Students: 96.9% domestic, 3.1% international. Sponsors/guardians provide international support network.",
          key_finding: "TUC is primarily a domestic Ghanaian institution with a global family support network"
        },
        // Assuming corrected_multi_party_demographics will be merged here
        corrected_multi_party_demographics: {
            metadata: {
                processing_date: "2025-06-08",
                analysis_type: "Multi-Party Demographic Correction",
                critical_correction: "Student and Sponsor/Guardian data separated",
                data_sources_properly_separated: true
            },
            student_demographics: {
                total_students: 1000,
                residence_distribution: { "Ghana": 969, "International": 31 },
                student_international_analysis: { "Ghana": 969, "Nigeria": 10, "Other": 21 },
                true_international_students: {
                    domestic_students_percentage: 96.9,
                    international_students_percentage: 3.1,
                    primary_international_origin: "Nigeria"
                },
                student_communication_access: {
                    mobile_access_rate: 98,
                    landline_access_rate: 2
                }
            },
            sponsor_guardian_demographics: {
                total_sponsor_guardians: 800,
                geographic_distribution: { "Ghana": 500, "UK": 100, "USA": 100, "Canada": 50, "Germany": 50 },
                country_distribution: { "Ghana": 500, "UK": 100, "USA": 100, "Canada": 50, "Germany": 50 },
                international_analysis: { "Ghana": 500, "International": 300 },
                domestic_vs_international_support: {
                    domestic_percentage: 62.5,
                    international_percentage: 37.5
                }
            },
            multi_party_insights: {}
        }
      }),
    });
  }
  if (url.includes(`${import.meta.env.BASE_URL}data/corrected_multi_party_demographics.json`)) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        metadata: {
            processing_date: "2025-06-08",
            analysis_type: "Multi-Party Demographic Correction",
            critical_correction: "Student and Sponsor/Guardian data separated",
            data_sources_properly_separated: true
        },
        student_demographics: {
            total_students: 1000,
            residence_distribution: { "Ghana": 969, "International": 31 },
            student_international_analysis: { "Ghana": 969, "Nigeria": 10, "Other": 21 },
            true_international_students: {
                domestic_students_percentage: 96.9,
                international_students_percentage: 3.1,
                primary_international_origin: "Nigeria"
            },
            student_communication_access: {
                mobile_access_rate: 98,
                landline_access_rate: 2
            }
        },
        sponsor_guardian_demographics: {
            total_sponsor_guardians: 800,
            geographic_distribution: { "Ghana": 500, "UK": 100, "USA": 100, "Canada": 50, "Germany": 50 },
            country_distribution: { "Ghana": 500, "UK": 100, "USA": 100, "Canada": 50, "Germany": 50 },
            international_analysis: { "Ghana": 500, "International": 300 },
            domestic_vs_international_support: {
                domestic_percentage: 62.5,
                international_percentage: 37.5
            }
        },
        multi_party_insights: {}
      }),
    });
  }
  // Handle other fetch calls if necessary
  return Promise.reject(new Error(`Unhandled fetch request for URL: ${url}`));
}) as any;
