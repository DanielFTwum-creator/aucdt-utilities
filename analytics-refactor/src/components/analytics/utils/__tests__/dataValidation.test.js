import { validateDataIntegrity } from '../dataValidation';

describe('dataValidation', () => {
  describe('validateDataIntegrity', () => {
    it('should return valid for correct data', () => {
      const data = [
        {
          MONTH: '2023-01',
          SIGNUPS: '100',
          APPLICANTS: '50',
          ACCEPTED: '25',
          REJECTED: '15',
          WAITLISTED: '10',
          REGISTERED: '20',
        },
      ];
      const result = validateDataIntegrity(data);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid for missing required fields', () => {
      const data = [{ SIGNUPS: '100' }];
      const result = validateDataIntegrity(data);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Record 0 (unknown): Missing required field \'MONTH\'');
    });

    it('should return invalid for non-numeric values', () => {
      const data = [
        {
          MONTH: '2023-01',
          SIGNUPS: 'abc',
          APPLICANTS: '50',
          ACCEPTED: '25',
          REJECTED: '15',
          WAITLISTED: '10',
          REGISTERED: '20',
        },
      ];
      const result = validateDataIntegrity(data);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Record 0 (2023-01): Invalid value for 'SIGNUPS': abc");
    });

    it('should return invalid for negative values', () => {
        const data = [
          {
            MONTH: '2023-01',
            SIGNUPS: '-10',
            APPLICANTS: '50',
            ACCEPTED: '25',
            REJECTED: '15',
            WAITLISTED: '10',
            REGISTERED: '20',
          },
        ];
        const result = validateDataIntegrity(data);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain("Record 0 (2023-01): Invalid value for 'SIGNUPS': -10");
      });

    it('should return invalid for incorrect month format', () => {
      const data = [
        {
          MONTH: '01-2023',
          SIGNUPS: '100',
          APPLICANTS: '50',
          ACCEPTED: '25',
          REJECTED: '15',
          WAITLISTED: '10',
          REGISTERED: '20',
        },
      ];
      const result = validateDataIntegrity(data);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Record 0: Invalid month format '01-2023' (expected YYYY-MM)");
    });

    it('should return invalid for duplicate months', () => {
        const data = [
          {
            MONTH: '2023-01',
            SIGNUPS: '100',
            APPLICANTS: '50',
            ACCEPTED: '25',
            REJECTED: '15',
            WAITLISTED: '10',
            REGISTERED: '20',
          },
          {
            MONTH: '2023-01',
            SIGNUPS: '100',
            APPLICANTS: '50',
            ACCEPTED: '25',
            REJECTED: '15',
            WAITLISTED: '10',
            REGISTERED: '20',
          },
        ];
        const result = validateDataIntegrity(data);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Duplicate months found: 2023-01');
      });
  });
});
