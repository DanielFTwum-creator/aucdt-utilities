
import React, { useState, useCallback, useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import type { AppContextType, Ratings } from '../../types';
import { EVALUATION_CRITERIA_CONFIG } from '../../constants';

type TestStatus = 'pending' | 'running' | 'passed' | 'failed';

interface TestResult {
    name: string;
    status: TestStatus;
    message: string;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const SelfTestRunner: React.FC = () => {
    const context = useContext(AppContext) as AppContextType;
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    const updateTestStatus = (name: string, status: TestStatus, message: string = '') => {
        setTestResults(prev => prev.map(t => t.name === name ? { ...t, status, message } : t));
    };

    const runTests = useCallback(async () => {
        setIsRunning(true);
        const tests: { name: string, fn: () => Promise<void> }[] = [
            {
                name: 'Student Form Submission',
                fn: async () => {
                    const initialCount = context.evaluations.length;
                    
                    const programme = context.curriculum.programmes[0];
                    if (!programme) throw new Error("No programme available for test.");
                    
                    const course = context.curriculum.courses.find(c => c.programmeId === programme.id && c.lecturerIds.length > 0);
                    if (!course) throw new Error("No course with lecturers found for the first programme.");
                    
                    const lecturerId = course.lecturerIds[0];
                    const lecturer = context.curriculum.lecturers.find(l => l.id === lecturerId);
                    if (!lecturer) throw new Error("Lecturer for the selected course not found.");

                    // Create a valid ratings object based on the actual criteria
                    const testRatings: Ratings = {};
                    Object.values(EVALUATION_CRITERIA_CONFIG).flat().forEach(criterion => {
                        testRatings[criterion.id] = 5; // Assign a top score for the test
                    });

                    context.handleAssessmentSubmit({
                        programmeId: programme.id,
                        lecturerId: lecturer.id,
                        courseId: course.id,
                        semester: 1,
                        ratings: testRatings,
                        comment: 'E2E Test Submission',
                        recommend: 'Recommend'
                    });
                    
                    await sleep(100); // allow state to update
                    
                    if (context.evaluations.length === initialCount + 1) {
                         updateTestStatus('Student Form Submission', 'passed');
                    } else {
                        throw new Error('Evaluation count did not increase.');
                    }
                }
            },
            {
                name: 'Audit Log Entry Creation',
                fn: async () => {
                    const initialLogCount = context.auditLogs.length;
                    context.addAuditLog('E2E Test Action', 'Testing log creation');
                     await sleep(100);
                     if(context.auditLogs.length === initialLogCount + 1) {
                         updateTestStatus('Audit Log Entry Creation', 'passed');
                     } else {
                         throw new Error('Audit log count did not increase.');
                     }
                }
            }
        ];
        
        setTestResults(tests.map(t => ({ name: t.name, status: 'pending', message: '' })));
        await sleep(500);

        for (const test of tests) {
            try {
                updateTestStatus(test.name, 'running');
                await sleep(500);
                await test.fn();
            } catch (error: any) {
                updateTestStatus(test.name, 'failed', error.message);
            }
        }
        setIsRunning(false);
    }, [context]);

    const getStatusIcon = (status: TestStatus) => {
        const iconMap = {
            passed: <span aria-hidden="true" className="text-green-500">✓</span>,
            failed: <span aria-hidden="true" className="text-red-500">✗</span>,
            running: <span aria-hidden="true" className="animate-spin">⏳</span>,
            pending: <span aria-hidden="true" className="text-gray-400">?</span>,
        };
        return iconMap[status] || iconMap.pending;
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">E2E Self-Testing Suite</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                Run a series of in-browser tests to verify core application functionality. This simulates user workflows without any backend calls.
            </p>
            <button onClick={runTests} disabled={isRunning} className="px-6 py-2 mb-6 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
                {isRunning ? 'Running Tests...' : 'Start Suite'}
            </button>
            <div className="space-y-4">
                {testResults.map(result => (
                    <div key={result.name} className="flex items-start p-4 border rounded-lg dark:border-gray-700">
                        <div className="mr-4 text-xl">{getStatusIcon(result.status)}</div>
                        <div>
                            <p className="font-semibold">{result.name}</p>
                            <p className={`text-sm ${result.status === 'failed' ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                                {result.status.charAt(0).toUpperCase() + result.status.slice(1)} {result.message && `- ${result.message}`}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
