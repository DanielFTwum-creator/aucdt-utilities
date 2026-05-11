#!/usr/bin/env python3
"""
Lab Data Collector - Central Analysis and Reporting System
Aggregates disk analysis data from Windows and macOS systems
"""

import json
import os
import sys
import logging
import argparse
import smtplib
import sqlite3
import datetime
import glob
import shutil
from pathlib import Path
from email.mime.text import MimeText
from email.mime.multipart import MimeMultipart
from email.mime.application import MimeApplication
from typing import Dict, List, Any, Optional
import csv

# Configuration
CONFIG = {
    'data_directories': [
        '/shared/disk-analysis',  # Network share
        '/Users/Shared/LabData/DiskAnalysis',  # macOS local
        'C:\\LabData\\DiskAnalysis',  # Windows local
    ],
    'database_path': '/shared/lab-analysis.db',
    'reports_directory': '/shared/reports',
    'web_export_directory': '/shared/web-data',
    'retention_days': 90,
    'email': {
        'enabled': True,
        'smtp_server': 'mail.yourdomain.com',
        'smtp_port': 587,
        'username': 'lab-monitoring@yourdomain.com',
        'password': 'your_password',  # Use environment variable in production
        'recipients': ['admin@yourdomain.com'],
    },
    'thresholds': {
        'disk_usage_warning': 80,  # Percentage
        'disk_usage_critical': 90,  # Percentage
        'large_directory_gb': 10,  # GB
    }
}

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/shared/lab-collector.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)


class LabDataCollector:
    """Central data collector for lab disk analysis"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.db_path = config['database_path']
        self.reports_dir = Path(config['reports_directory'])
        self.web_export_dir = Path(config['web_export_directory'])
        
        # Ensure directories exist
        self.reports_dir.mkdir(parents=True, exist_ok=True)
        self.web_export_dir.mkdir(parents=True, exist_ok=True)
        
        # Initialize database
        self.init_database()
    
    def init_database(self):
        """Initialize SQLite database for storing analysis data"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Create tables
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS analysis_runs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    hostname TEXT NOT NULL,
                    platform TEXT NOT NULL,
                    timestamp DATETIME NOT NULL,
                    file_path TEXT NOT NULL,
                    total_size_gb REAL,
                    total_files INTEGER,
                    analysis_type TEXT DEFAULT 'daily',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS directory_data (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    analysis_run_id INTEGER,
                    directory_name TEXT NOT NULL,
                    directory_path TEXT NOT NULL,
                    size_gb REAL NOT NULL,
                    file_count INTEGER NOT NULL,
                    modification_date TEXT,
                    depth INTEGER DEFAULT 1,
                    percentage REAL DEFAULT 0,
                    FOREIGN KEY (analysis_run_id) REFERENCES analysis_runs (id)
                )
            ''')
            
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS alerts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    hostname TEXT NOT NULL,
                    alert_type TEXT NOT NULL,
                    message TEXT NOT NULL,
                    severity TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    resolved BOOLEAN DEFAULT FALSE
                )
            ''')
            
            conn.commit()
            conn.close()
            logger.info("Database initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize database: {e}")
            raise
    
    def collect_analysis_files(self) -> List[str]:
        """Collect all JSON analysis files from configured directories"""
        analysis_files = []
        
        for data_dir in self.config['data_directories']:
            if os.path.exists(data_dir):
                # Look for JSON files in subdirectories
                pattern = os.path.join(data_dir, '**', '*.json')
                files = glob.glob(pattern, recursive=True)
                analysis_files.extend(files)
                logger.info(f"Found {len(files)} files in {data_dir}")
            else:
                logger.warning(f"Data directory not found: {data_dir}")
        
        return analysis_files
    
    def parse_analysis_file(self, file_path: str) -> Optional[Dict[str, Any]]:
        """Parse a single analysis JSON file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Extract metadata from filename
            filename = os.path.basename(file_path)
            parts = filename.replace('.json', '').split('-')
            
            if len(parts) >= 2:
                hostname = parts[0]
                timestamp_str = '-'.join(parts[1:])
            else:
                hostname = 'unknown'
                timestamp_str = datetime.datetime.now().strftime('%Y%m%d-%H%M%S')
            
            # Determine platform from path or data
            platform = 'unknown'
            if 'win' in filename.lower() or 'windows' in file_path.lower():
                platform = 'windows'
            elif 'mac' in filename.lower() or 'macos' in file_path.lower():
                platform = 'macos'
            elif '/c/' in str(data.get('directory_analysis', [{}])[0].get('path', '')):
                platform = 'windows'
            elif '/Users' in str(data.get('directory_analysis', [{}])[0].get('path', '')):
                platform = 'macos'
            
            # Calculate totals
            total_size_gb = 0
            total_files = 0
            if 'directory_analysis' in data:
                for dir_data in data['directory_analysis']:
                    total_size_gb += dir_data.get('size_kb', 0) / (1024 * 1024)  # Convert KB to GB
                    total_files += dir_data.get('file_count', 0)
            
            return {
                'hostname': hostname,
                'platform': platform,
                'timestamp': timestamp_str,
                'file_path': file_path,
                'total_size_gb': round(total_size_gb, 2),
                'total_files': total_files,
                'raw_data': data
            }
            
        except Exception as e:
            logger.error(f"Failed to parse analysis file {file_path}: {e}")
            return None
    
    def store_analysis_data(self, analysis_data: Dict[str, Any]) -> int:
        """Store analysis data in database"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Insert analysis run
            cursor.execute('''
                INSERT INTO analysis_runs 
                (hostname, platform, timestamp, file_path, total_size_gb, total_files)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                analysis_data['hostname'],
                analysis_data['platform'],
                analysis_data['timestamp'],
                analysis_data['file_path'],
                analysis_data['total_size_gb'],
                analysis_data['total_files']
            ))
            
            analysis_run_id = cursor.lastrowid
            
            # Insert directory data
            if 'directory_analysis' in analysis_data['raw_data']:
                for dir_data in analysis_data['raw_data']['directory_analysis']:
                    cursor.execute('''
                        INSERT INTO directory_data 
                        (analysis_run_id, directory_name, directory_path, size_gb, 
                         file_count, modification_date, depth, percentage)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        analysis_run_id,
                        dir_data.get('name', ''),
                        dir_data.get('path', ''),
                        dir_data.get('size_kb', 0) / (1024 * 1024),  # Convert to GB
                        dir_data.get('file_count', 0),
                        dir_data.get('modification_date', ''),
                        dir_data.get('depth', 1),
                        dir_data.get('percentage', 0)
                    ))
            
            conn.commit()
            conn.close()
            
            logger.info(f"Stored analysis data for {analysis_data['hostname']} - {analysis_data['timestamp']}")
            return analysis_run_id
            
        except Exception as e:
            logger.error(f"Failed to store analysis data: {e}")
            return -1
    
    def generate_lab_summary_report(self) -> str:
        """Generate comprehensive lab summary report"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Get overall statistics
            cursor.execute('''
                SELECT 
                    COUNT(DISTINCT hostname) as total_systems,
                    COUNT(*) as total_analyses,
                    SUM(total_size_gb) as total_disk_usage_gb,
                    SUM(total_files) as total_files,
                    platform
                FROM analysis_runs 
                WHERE timestamp >= date('now', '-7 days')
                GROUP BY platform
            ''')
            
            platform_stats = cursor.fetchall()
            
            # Get per-system latest data
            cursor.execute('''
                SELECT 
                    ar.hostname,
                    ar.platform,
                    ar.timestamp,
                    ar.total_size_gb,
                    ar.total_files,
                    MAX(ar.created_at) as latest_analysis
                FROM analysis_runs ar
                WHERE ar.created_at >= date('now', '-7 days')
                GROUP BY ar.hostname
                ORDER BY ar.total_size_gb DESC
            ''')
            
            system_stats = cursor.fetchall()
            
            # Get top directories across all systems
            cursor.execute('''
                SELECT 
                    dd.directory_name,
                    dd.directory_path,
                    dd.size_gb,
                    ar.hostname,
                    ar.platform
                FROM directory_data dd
                JOIN analysis_runs ar ON dd.analysis_run_id = ar.id
                WHERE ar.created_at >= date('now', '-7 days')
                    AND dd.size_gb > ?
                ORDER BY dd.size_gb DESC
                LIMIT 20
            ''', (self.config['thresholds']['large_directory_gb'],))
            
            large_directories = cursor.fetchall()
            
            conn.close()
            
            # Generate report
            report_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            report = f"""
LAB DISK ANALYSIS SUMMARY REPORT
Generated: {report_time}
=====================================

PLATFORM OVERVIEW (Last 7 Days)
--------------------------------
"""
            
            total_systems = 0
            total_analyses = 0
            total_disk_gb = 0
            total_files = 0
            
            for stats in platform_stats:
                systems, analyses, disk_gb, files, platform = stats
                total_systems += systems
                total_analyses += analyses
                total_disk_gb += disk_gb or 0
                total_files += files or 0
                
                report += f"""
{platform.upper()} Systems:
  - Systems: {systems}
  - Analyses: {analyses}
  - Total Disk Usage: {disk_gb:.1f} GB
  - Total Files: {files:,}
"""
            
            report += f"""
TOTAL LAB STATISTICS
-------------------
Total Systems: {total_systems}
Total Analyses: {total_analyses}
Total Disk Usage: {total_disk_gb:.1f} GB
Total Files: {total_files:,}

SYSTEM BREAKDOWN (Latest Analysis)
---------------------------------
"""
            
            for system in system_stats:
                hostname, platform, timestamp, size_gb, files, latest = system
                report += f"  {hostname} ({platform}): {size_gb:.1f} GB, {files:,} files - {timestamp}\n"
            
            if large_directories:
                report += f"""
LARGE DIRECTORIES (>{self.config['thresholds']['large_directory_gb']} GB)
----------------------------------
"""
                for directory in large_directories:
                    name, path, size_gb, hostname, platform = directory
                    report += f"  {size_gb:.1f} GB - {name} on {hostname} ({platform})\n    Path: {path}\n"
            
            # Add alerts
            alerts = self.check_and_generate_alerts()
            if alerts:
                report += "\nALERTS\n------\n"
                for alert in alerts:
                    report += f"  {alert['severity']}: {alert['message']}\n"
            
            report += f"""
WEB DASHBOARD
------------
https://64vrc4xoo7.space.minimax.io

Report generated by Lab Data Collector v1.0
"""
            
            return report
            
        except Exception as e:
            logger.error(f"Failed to generate summary report: {e}")
            return f"Error generating report: {e}"
    
    def check_and_generate_alerts(self) -> List[Dict[str, Any]]:
        """Check for alert conditions and generate alerts"""
        alerts = []
        
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Check for systems with high disk usage
            cursor.execute('''
                SELECT hostname, total_size_gb, platform
                FROM analysis_runs
                WHERE created_at >= date('now', '-1 day')
                GROUP BY hostname
                HAVING MAX(created_at)
            ''')
            
            recent_systems = cursor.fetchall()
            
            for hostname, size_gb, platform in recent_systems:
                if size_gb > 100:  # Example threshold
                    severity = "WARNING" if size_gb > 100 else "CRITICAL" if size_gb > 200 else "INFO"
                    alert = {
                        'hostname': hostname,
                        'alert_type': 'high_disk_usage',
                        'message': f"{hostname} ({platform}) has {size_gb:.1f} GB disk usage",
                        'severity': severity
                    }
                    alerts.append(alert)
                    
                    # Store in database
                    cursor.execute('''
                        INSERT INTO alerts (hostname, alert_type, message, severity)
                        VALUES (?, ?, ?, ?)
                    ''', (alert['hostname'], alert['alert_type'], alert['message'], alert['severity']))
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            logger.error(f"Error checking alerts: {e}")
        
        return alerts
    
    def export_for_web_dashboard(self):
        """Export data in format suitable for web dashboard"""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Get latest analysis for each system
            cursor.execute('''
                SELECT 
                    ar.hostname,
                    ar.platform,
                    ar.timestamp,
                    ar.total_size_gb,
                    ar.total_files,
                    ar.file_path,
                    ar.id
                FROM analysis_runs ar
                JOIN (
                    SELECT hostname, MAX(created_at) as latest
                    FROM analysis_runs
                    GROUP BY hostname
                ) latest_runs ON ar.hostname = latest_runs.hostname 
                    AND ar.created_at = latest_runs.latest
            ''')
            
            systems_data = cursor.fetchall()
            
            # Create web export data
            web_data = {
                'last_updated': datetime.datetime.now().isoformat(),
                'summary': {
                    'total_systems': len(systems_data),
                    'total_disk_usage_gb': sum(s[3] for s in systems_data),
                    'total_files': sum(s[4] for s in systems_data),
                },
                'systems': []
            }
            
            for system in systems_data:
                hostname, platform, timestamp, size_gb, files, file_path, run_id = system
                
                # Get directory breakdown for this system
                cursor.execute('''
                    SELECT directory_name, directory_path, size_gb, file_count, percentage
                    FROM directory_data
                    WHERE analysis_run_id = ?
                    ORDER BY size_gb DESC
                    LIMIT 20
                ''', (run_id,))
                
                directories = cursor.fetchall()
                
                system_data = {
                    'hostname': hostname,
                    'platform': platform,
                    'timestamp': timestamp,
                    'total_size_gb': size_gb,
                    'total_files': files,
                    'directories': [
                        {
                            'name': d[0],
                            'path': d[1],
                            'size_gb': round(d[2], 2),
                            'file_count': d[3],
                            'percentage': d[4]
                        } for d in directories
                    ]
                }
                
                web_data['systems'].append(system_data)
            
            # Save web export file
            export_file = self.web_export_dir / 'lab-summary.json'
            with open(export_file, 'w') as f:
                json.dump(web_data, f, indent=2)
            
            logger.info(f"Web dashboard data exported to {export_file}")
            
            # Also export CSV for spreadsheet analysis
            csv_file = self.web_export_dir / 'lab-summary.csv'
            with open(csv_file, 'w', newline='') as f:
                writer = csv.writer(f)
                writer.writerow(['Hostname', 'Platform', 'Timestamp', 'Total Size (GB)', 'Total Files'])
                for system in systems_data:
                    writer.writerow([system[0], system[1], system[2], system[3], system[4]])
            
            conn.close()
            
        except Exception as e:
            logger.error(f"Failed to export web dashboard data: {e}")
    
    def send_email_report(self, report_content: str):
        """Send email report to configured recipients"""
        if not self.config['email']['enabled']:
            return
        
        try:
            msg = MimeMultipart()
            msg['From'] = self.config['email']['username']
            msg['To'] = ', '.join(self.config['email']['recipients'])
            msg['Subject'] = f"Lab Disk Analysis Report - {datetime.date.today()}"
            
            msg.attach(MimeText(report_content, 'plain'))
            
            # Attach CSV export if available
            csv_file = self.web_export_dir / 'lab-summary.csv'
            if csv_file.exists():
                with open(csv_file, 'rb') as f:
                    attach = MimeApplication(f.read(), _subtype='csv')
                    attach.add_header('Content-Disposition', 'attachment', filename='lab-summary.csv')
                    msg.attach(attach)
            
            # Send email
            server = smtplib.SMTP(self.config['email']['smtp_server'], self.config['email']['smtp_port'])
            server.starttls()
            server.login(self.config['email']['username'], self.config['email']['password'])
            server.send_message(msg)
            server.quit()
            
            logger.info("Email report sent successfully")
            
        except Exception as e:
            logger.error(f"Failed to send email report: {e}")
    
    def cleanup_old_data(self):
        """Clean up old analysis data based on retention policy"""
        try:
            cutoff_date = datetime.datetime.now() - datetime.timedelta(days=self.config['retention_days'])
            
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            # Delete old analysis runs and related data
            cursor.execute('DELETE FROM analysis_runs WHERE created_at < ?', (cutoff_date,))
            deleted_runs = cursor.rowcount
            
            # Clean up orphaned directory data
            cursor.execute('''
                DELETE FROM directory_data 
                WHERE analysis_run_id NOT IN (SELECT id FROM analysis_runs)
            ''')
            deleted_dirs = cursor.rowcount
            
            # Clean up old alert data
            cursor.execute('DELETE FROM alerts WHERE created_at < ?', (cutoff_date,))
            deleted_alerts = cursor.rowcount
            
            conn.commit()
            conn.close()
            
            logger.info(f"Cleanup complete: {deleted_runs} runs, {deleted_dirs} directories, {deleted_alerts} alerts removed")
            
        except Exception as e:
            logger.error(f"Failed to cleanup old data: {e}")
    
    def run_collection_cycle(self):
        """Run a complete data collection cycle"""
        logger.info("Starting lab data collection cycle")
        
        try:
            # Collect analysis files
            analysis_files = self.collect_analysis_files()
            logger.info(f"Found {len(analysis_files)} analysis files")
            
            processed_count = 0
            for file_path in analysis_files:
                analysis_data = self.parse_analysis_file(file_path)
                if analysis_data:
                    run_id = self.store_analysis_data(analysis_data)
                    if run_id > 0:
                        processed_count += 1
            
            logger.info(f"Processed {processed_count} analysis files")
            
            # Generate reports
            report = self.generate_lab_summary_report()
            
            # Save report to file
            report_file = self.reports_dir / f"lab-report-{datetime.date.today()}.txt"
            with open(report_file, 'w') as f:
                f.write(report)
            
            # Export for web dashboard
            self.export_for_web_dashboard()
            
            # Send email report
            self.send_email_report(report)
            
            # Cleanup old data
            self.cleanup_old_data()
            
            logger.info("Data collection cycle completed successfully")
            
        except Exception as e:
            logger.error(f"Data collection cycle failed: {e}")
            raise


def main():
    parser = argparse.ArgumentParser(description='Lab Data Collector')
    parser.add_argument('--config', help='Configuration file path')
    parser.add_argument('--collect', action='store_true', help='Run data collection cycle')
    parser.add_argument('--report', action='store_true', help='Generate report only')
    parser.add_argument('--export', action='store_true', help='Export web data only')
    parser.add_argument('--cleanup', action='store_true', help='Cleanup old data only')
    
    args = parser.parse_args()
    
    # Load custom config if provided
    config = CONFIG
    if args.config and os.path.exists(args.config):
        with open(args.config, 'r') as f:
            custom_config = json.load(f)
            config.update(custom_config)
    
    collector = LabDataCollector(config)
    
    if args.collect:
        collector.run_collection_cycle()
    elif args.report:
        report = collector.generate_lab_summary_report()
        print(report)
    elif args.export:
        collector.export_for_web_dashboard()
    elif args.cleanup:
        collector.cleanup_old_data()
    else:
        # Default: run full collection cycle
        collector.run_collection_cycle()


if __name__ == '__main__':
    main()
