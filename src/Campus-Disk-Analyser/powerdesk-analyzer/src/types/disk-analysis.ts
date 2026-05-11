export interface DirectoryAnalysis {
  name: string;
  path: string;
  size_kb: number;
  size_formatted: string;
  file_count: number;
  modification_timestamp: number;
  modification_date: string;
  depth: number;
  parent_path: string;
  percentage: number;
}

export interface AnalysisMetadata {
  timestamp: string;
  script_version: string;
  max_depth: number;
  target_directories: string[];
}

export interface DiskAnalysisData {
  analysis_metadata: AnalysisMetadata;
  directory_analysis: DirectoryAnalysis[];
}

export interface TreeNode extends DirectoryAnalysis {
  children: TreeNode[];
  isExpanded: boolean;
  level: number;
}

export type SortColumn = 'name' | 'size_kb' | 'file_count' | 'modification_date';
export type SortDirection = 'asc' | 'desc';
