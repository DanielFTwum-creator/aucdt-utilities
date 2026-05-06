import React, { useState } from 'react';
import { TeamMemberId } from '../types';
import { TEAM_MEMBERS } from '../constants';

const TeamStatusTab: React.FC = () => {
    const [activeMember, setActiveMember] = useState<TeamMemberId>('daniel');
    const member = TEAM_MEMBERS[activeMember];

    return (
        <section className="space-y-6 animate-fade-in" aria-labelledby="team-status-heading">
            <h2 id="team-status-heading" className="text-[1.8rem] font-semibold text-[var(--color-text-primary)] mb-4">Team Status & Blockers</h2>
            <p className="text-base text-[var(--color-text-secondary)] leading-[1.6] mb-6">
                Click on a team member to see their detailed update, including completed tasks, current work, and any impediments slowing them down.
            </p>
            
            <div role="tablist" aria-label="Team members" className="flex flex-wrap gap-2 mb-6">
                {Object.values(TEAM_MEMBERS).map((m) => (
                    <button
                        key={m.id}
                        id={`status-tab-${m.id}`}
                        role="tab"
                        aria-controls="status-panel"
                        aria-selected={activeMember === m.id}
                        onClick={() => setActiveMember(m.id)}
                        className={`py-2 px-4 rounded-full text-sm font-medium bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] transition-colors duration-200 hover:bg-[var(--color-accent)] hover:text-[var(--color-text-inverted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${activeMember === m.id ? 'bg-[var(--color-accent)] text-[var(--color-text-inverted)] border-[var(--color-accent)]' : ''}`}
                    >
                        {m.name}
                    </button>
                ))}
            </div>

            <div id="status-panel" role="tabpanel" aria-labelledby={`status-tab-${activeMember}`} className="bg-[var(--color-surface)] rounded-lg shadow-md border-l-4 border-[var(--color-accent)]">
                <div className="p-6">
                    <h3 className="text-[1.5rem] font-medium text-[var(--color-text-primary)] mb-3">{member.name}</h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase">Update</h4>
                            <p className="text-base text-[var(--color-text-secondary)] leading-[1.6]">{member.update}</p>
                        </div>
                        <div>
                            <h4 className={`text-sm font-semibold uppercase ${member.blocker.isCritical ? 'text-red-500' : 'text-[var(--color-text-muted)]'}`}>Blocker</h4>
                            <p className="text-base text-[var(--color-text-secondary)] leading-[1.6]">{member.blocker.text}</p>
                        </div>
                        {member.quote && (
                            <div>
                                <h4 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase">Key Quote</h4>
                                <p className="text-base text-[var(--color-text-secondary)] leading-[1.6] italic border-l-4 border-[var(--color-accent)] pl-4">{member.quote}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TeamStatusTab;