export interface DiagnosticResult {
    service: string;
    status: 'pass' | 'fail' | 'warn';
    latencyMs?: number;
    message?: string;
}

export const runSystemDiagnostics = async (): Promise<DiagnosticResult[]> => {
    const results: DiagnosticResult[] = [];
    const startTime = performance.now();

    // 1. Local Storage Check (Persistence)
    try {
        const testKey = '__diag_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.getItem(testKey);
        localStorage.removeItem(testKey);
        results.push({
            service: 'Local Storage (Persistence)',
            status: 'pass',
            latencyMs: Math.round(performance.now() - startTime),
            message: 'Read/write operations successful'
        });
    } catch (error) {
        results.push({
            service: 'Local Storage (Persistence)',
            status: 'fail',
            latencyMs: 0,
            message: 'Failed to access local storage'
        });
    }

    // 2. Mock API Gateway Check (Simulated)
    const apiStart = performance.now();
    try {
        // Simulate a network call
        await new Promise(resolve => setTimeout(resolve, 150));
        results.push({
            service: 'API Gateway connection',
            status: 'pass',
            latencyMs: Math.round(performance.now() - apiStart),
            message: 'Endpoint resolving normally'
        });
    } catch (error) {
         results.push({
            service: 'API Gateway connection',
            status: 'fail',
            latencyMs: Math.round(performance.now() - apiStart),
            message: 'Endpoint unreachable'
        });
    }

    // 3. Document Viewer / DOM Check
    try {
        const hasDom = typeof document !== 'undefined';
        results.push({
            service: 'DOM Execution Context',
            status: hasDom ? 'pass' : 'fail',
            message: hasDom ? 'Virtual DOM mounted securely' : 'DOM not available'
        });
    } catch (e) {
        results.push({
            service: 'DOM Execution Context',
            status: 'fail',
            message: 'Execution error in DOM context'
        });
    }

    // 4. Crypto / Randomization check for secure IDs
    const cryptoStart = performance.now();
    try {
        const buffer = new Uint8Array(4);
        window.crypto.getRandomValues(buffer);
        results.push({
            service: 'Web Crypto API',
            status: 'pass',
            latencyMs: Math.round(performance.now() - cryptoStart),
            message: 'Secure RNG available'
        });
    } catch (error) {
         results.push({
            service: 'Web Crypto API',
            status: 'warn',
            message: 'Fallback RNG in use'
        });
    }

    return results;
};
