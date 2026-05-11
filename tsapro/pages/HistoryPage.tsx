
import React, { useState, useEffect, useMemo } from 'react';
import { getLogs } from '../services/auditLogService';
import { AuditLogEntry, AuditLogEvent, SalaryCalculationLogDetails } from '../types';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import SalaryCalculationDetails from '../components/common/SalaryCalculationDetails';

const formatCurrency = (amount: number | undefined | null) => {
    if (typeof amount !== 'number' || isNaN(amount)) return 'N/A';
    return `₵ ${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};

interface CalculationHistoryEntry extends Omit<AuditLogEntry, 'details'> {
    details: SalaryCalculationLogDetails;
}

const HistoryCard: React.FC<{ entry: CalculationHistoryEntry }> = ({ entry }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { details, timestamp } = entry;

    return (
        <Card className="w-full">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h3 className="text-lg font-bold" data-component="text-accent">{details.recruitName}</h3>
                    <p className="text-xs" data-component="text-tertiary">
                        Calculated on: {new Date(timestamp).toLocaleString()}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm" data-component="text-secondary">Net Monthly Salary</p>
                    <p className="text-xl font-bold" data-component="text-primary">{formatCurrency(details.netSalary)}</p>
                </div>
                <Button variant="secondary" onClick={() => setIsExpanded(!isExpanded)} className="sm:ml-4 flex-shrink-0">
                    {isExpanded ? 'Hide Details' : 'View Details'}
                </Button>
            </div>
            {isExpanded && <SalaryCalculationDetails details={details} />}
        </Card>
    );
};


const HistoryPage: React.FC = () => {
    const [allCalculations, setAllCalculations] = useState<CalculationHistoryEntry[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const logs = getLogs();
        const calculationLogs = logs
            .filter(log => log.event === AuditLogEvent.SALARY_CALCULATION && log.details)
            .map(log => {
                try {
                    return {
                        ...log,
                        details: JSON.parse(log.details as string) as SalaryCalculationLogDetails
                    };
                } catch (e) {
                    console.error("Failed to parse history details", e);
                    return null;
                }
            })
            .filter((log): log is CalculationHistoryEntry => log !== null);
        
        setAllCalculations(calculationLogs);
    }, []);

    const filteredCalculations = useMemo(() => {
        if (!searchTerm) {
            return allCalculations;
        }
        return allCalculations.filter(calc =>
            calc.details.recruitName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, allCalculations]);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold" data-component="title">Salary Calculation History</h1>

            <Card>
                <div className="max-w-lg">
                     <Input
                        id="search-history"
                        label="Search by Recruit Name"
                        type="search"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Enter a name to filter..."
                    />
                </div>
            </Card>

            <div className="space-y-4">
                {filteredCalculations.length > 0 ? (
                    filteredCalculations.map(entry => (
                        <HistoryCard key={entry.id} entry={entry} />
                    ))
                ) : (
                    <Card>
                        <p className="text-center" data-component="text-secondary">
                            No calculation history found{searchTerm ? ' for your search.' : '.'}
                        </p>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;