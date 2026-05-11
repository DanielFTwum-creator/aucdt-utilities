import React from 'react';
import { TabId } from './types';
import { TABS } from './constants';
import Header from './components/Header';
import Tabs from './components/Tabs';
import OverviewTab from './components/OverviewTab';
import TeamStatusTab from './components/TeamStatusTab';
import WorkshopTab from './components/WorkshopTab';
import ConceptsTab from './components/ConceptsTab';
import AdminTab from './components/AdminTab';
import SelfTestTab from './components/SelfTestTab';
import { useAppContext } from './context/AppContext';

const App: React.FC = () => {
    const { activeTab, setActiveTab } = useAppContext();
    const contentRef = React.useRef<HTMLDivElement>(null);

    const handleTabChange = (tabId: TabId) => {
        setActiveTab(tabId);
        setTimeout(() => {
            contentRef.current?.focus();
        }, 0);
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewTab />;
            case 'status':
                return <TeamStatusTab />;
            case 'workshop':
                return <WorkshopTab />;
            case 'concepts':
                return <ConceptsTab />;
            case 'admin':
                return <AdminTab />;
            case 'selftest':
                return <SelfTestTab />;
            default:
                return <OverviewTab />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <Header />
            <Tabs tabs={TABS} activeTab={activeTab} setActiveTab={handleTabChange} />
            <main>
                 <div
                    ref={contentRef}
                    role="tabpanel"
                    id={`panel-${activeTab}`}
                    aria-labelledby={`tab-${activeTab}`}
                    tabIndex={-1}
                    className="outline-none"
                >
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default App;