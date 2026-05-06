import React from 'react';
import { 
  TrophyIcon,
  UsersIcon,
  DocumentCheckIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { formatNumber, formatPercentage, generateInsight } from '../../../utils/formatters';

/**
 * All-Time Statistics Banner Component - Magazine Quality Edition
 * 
 * Premium banner showcasing lifetime performance with:
 * - Professional icon system (no emojis)
 * - Sophisticated gold/amber gradient
 * - Enhanced typography hierarchy
 * - Contextual performance insights
 * - Premium card styling with depth
 * - Micro-interactions and animations
 * 
 * @component
 */
export const AllTimeStatsBanner = ({ stats }) => {
  if (!stats) return null;

  // Calculate additional insights
  const conversionInsight = generateInsight(stats.conversionRate, 'conversion');
  const acceptanceInsight = generateInsight(stats.acceptanceRate, 'acceptance');
  const registrationInsight = generateInsight(stats.registrationRate, 'registration');

  return (
    <section
      className="premium-banner"
      role="region"
      aria-labelledby="alltime-heading"
      aria-describedby="alltime-description"
    >
      {/* Screen reader description */}
      <div id="alltime-description" className="sr-only">
        All-time statistics showing {formatNumber(stats.signups)} total signups,
        {formatNumber(stats.applicants)} applicants, {formatNumber(stats.accepted)} accepted students,
        and {formatNumber(stats.registered)} registered students from {stats.dateRange}.
        Registration rate is {formatPercentage(stats.registrationRate)}, which is {registrationInsight}.
        Conversion rate from signups to applicants is {formatPercentage(stats.conversionRate)}, which is {conversionInsight}.
        Acceptance rate is {formatPercentage(stats.acceptanceRate)}, which is {acceptanceInsight}.
      </div>

      {/* Header Section */}
      <div className="banner-header">
        <div className="header-content">
          <div className="title-group">
            <div className="icon-badge-large">
              <TrophyIcon className="w-8 h-8 text-amber-400" aria-hidden="true" />
            </div>
            <div>
              <h2 id="alltime-heading" className="banner-title">
                All-Time Performance
              </h2>
              <p className="banner-subtitle">
                Complete Lifetime Statistics <span className="date-range">({stats.dateRange})</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Featured Metric - Registration Rate */}
        <div className="featured-metric">
          <div className="metric-icon">
            <AcademicCapIcon className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="metric-content">
            <p className="metric-label">Registration Rate</p>
            <p 
              className="metric-value-large"
              aria-label={`Registration rate is ${stats.registrationRate} percent`}
            >
              {formatPercentage(stats.registrationRate)}
            </p>
            <p className="metric-description">
              {formatNumber(stats.registered)} of {formatNumber(stats.accepted)} accepted
            </p>
            <p className="metric-insight">
              {registrationInsight}
            </p>
          </div>
        </div>
      </div>
      
      {/* Statistics Grid */}
      <div className="stats-grid">
        {/* Total Signups */}
        <StatCard
          label="Total Signups"
          value={stats.signups}
          icon={<UsersIcon className="w-7 h-7" />}
          description="All-time signups"
        />
        
        {/* Total Applicants */}
        <StatCard
          label="Total Applicants"
          value={stats.applicants}
          icon={<DocumentCheckIcon className="w-7 h-7" />}
          description="Completed applications"
        />
        
        {/* Total Accepted */}
        <StatCard
          label="Total Accepted"
          value={stats.accepted}
          icon={<CheckCircleIcon className="w-7 h-7" />}
          description="Acceptance offers sent"
        />
        
        {/* Total Registered - Highlighted */}
        <StatCard
          label="Total Registered"
          value={stats.registered}
          icon={<AcademicCapIcon className="w-7 h-7" />}
          description="Enrolled students"
          highlighted={true}
        />
      </div>
      
      {/* Additional Metrics Row */}
      <div className="metrics-row">
        {/* Conversion Rate */}
        <MetricCard
          label="Conversion Rate"
          value={formatPercentage(stats.conversionRate)}
          description="Signups → Applicants"
          insight={conversionInsight}
          icon={<ArrowTrendingUpIcon className="w-5 h-5" />}
        />
        
        {/* Acceptance Rate */}
        <MetricCard
          label="Acceptance Rate"
          value={formatPercentage(stats.acceptanceRate)}
          description="Accepted / Applicants"
          insight={acceptanceInsight}
          icon={<CheckCircleIcon className="w-5 h-5" />}
        />
        
        {/* Total Processed */}
        <MetricCard
          label="Total Processed"
          value={formatNumber(stats.applicants)}
          description="All applications reviewed"
          icon={<ChartBarIcon className="w-5 h-5" />}
        />
      </div>

      <style jsx>{`
        .premium-banner {
          background: linear-gradient(135deg, rgba(251, 146, 60, 0.9) 0%, rgba(249, 115, 22, 0.85) 100%);
          border-radius: 2rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          padding: 2.5rem;
          margin-bottom: 2.5rem;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .premium-banner::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at top left, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at bottom right, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
          pointer-events: none;
        }

        .banner-header {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        @media (min-width: 768px) {
          .banner-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
          }
        }

        .header-content {
          flex: 1;
        }

        .title-group {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .icon-badge-large {
          width: 4rem;
          height: 4rem;
          border-radius: 1.5rem;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
          flex-shrink: 0;
        }

        .banner-title {
          font-family: 'Inter', -apple-system, sans-serif;
          font-size: 2.5rem;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin: 0 0 0.5rem 0;
        }

        .banner-subtitle {
          font-size: 1.125rem;
          font-weight: 500;
          opacity: 0.95;
          margin: 0;
        }

        .date-range {
          font-size: 1rem;
          opacity: 0.85;
        }

        .featured-metric {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 1.5rem;
          padding: 2rem;
          min-width: 280px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .metric-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .metric-content {
          flex: 1;
        }

        .metric-label {
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0.9;
          margin-bottom: 0.5rem;
        }

        .metric-value-large {
          font-family: 'JetBrains Mono', monospace;
          font-size: 3rem;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .metric-description {
          font-size: 0.875rem;
          opacity: 0.85;
          margin-bottom: 0.5rem;
        }

        .metric-insight {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #86efac;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stats-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        @media (min-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .metrics-row {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .metrics-row {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 640px) {
          .premium-banner {
            padding: 1.5rem;
          }

          .banner-title {
            font-size: 2rem;
          }

          .featured-metric {
            min-width: 100%;
            flex-direction: column;
            text-align: center;
          }

          .metric-value-large {
            font-size: 2.5rem;
          }

          .stats-grid,
          .metrics-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

/**
 * Individual stat card component with premium styling
 * @private
 */
const StatCard = ({ label, value, icon, description, highlighted = false }) => {
  return (
    <div 
      className={`stat-card ${highlighted ? 'highlighted' : ''}`}
      role="group"
      aria-label={`${label}: ${formatNumber(value)}`}
    >
      <div className="stat-icon" aria-hidden="true">
        {icon}
      </div>
      <p className="stat-label">{label}</p>
      <p className="stat-value" aria-label={formatNumber(value)}>
        {formatNumber(value)}
      </p>
      <p className="stat-description">{description}</p>

      <style jsx>{`
        .stat-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 1.5rem;
          padding: 1.5rem;
          text-align: center;
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .stat-card:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
        }

        .stat-card.highlighted {
          background: rgba(255, 255, 255, 0.25);
          border: 3px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
        }

        .stat-card.highlighted:hover {
          transform: translateY(-6px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
        }

        .stat-icon {
          width: 3.5rem;
          height: 3.5rem;
          margin: 0 auto 1rem auto;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 1rem;
          color: white;
        }

        .stat-label {
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0.9;
          margin-bottom: 0.75rem;
        }

        .stat-value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 2.5rem;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .stat-description {
          font-size: 0.8125rem;
          opacity: 0.8;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

/**
 * Smaller metric card for additional stats with insights
 * @private
 */
const MetricCard = ({ label, value, description, insight, icon }) => {
  return (
    <div 
      className="metric-card"
      role="group"
      aria-label={`${label}: ${value}`}
    >
      <div className="metric-header">
        <div className="metric-icon-small" aria-hidden="true">
          {icon}
        </div>
        <p className="metric-label-small">{label}</p>
      </div>
      <p className="metric-value-medium">{value}</p>
      <p className="metric-description-small">{description}</p>
      {insight && <p className="metric-insight-small">{insight}</p>}

      <style jsx>{`
        .metric-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 1.25rem;
          padding: 1.25rem;
          transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .metric-card:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .metric-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .metric-icon-small {
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 0.75rem;
          flex-shrink: 0;
        }

        .metric-label-small {
          font-size: 0.8125rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0.9;
          margin: 0;
          flex: 1;
        }

        .metric-value-medium {
          font-family: 'JetBrains Mono', monospace;
          font-size: 1.875rem;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .metric-description-small {
          font-size: 0.8125rem;
          opacity: 0.8;
          margin: 0 0 0.5rem 0;
        }

        .metric-insight-small {
          font-size: 0.75rem;
          font-weight: 600;
          color: #86efac;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default AllTimeStatsBanner;
