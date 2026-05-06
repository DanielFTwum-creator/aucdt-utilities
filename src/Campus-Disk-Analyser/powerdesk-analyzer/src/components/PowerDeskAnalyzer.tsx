import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight, ChevronDown, Folder, Search, Download, Upload, RefreshCw, BarChart3 } from 'lucide-react';
import { DiskAnalysisData, TreeNode, SortColumn, SortDirection } from '../types/disk-analysis';
import { buildTreeFromFlatData, flattenTree, toggleNodeExpansion, searchTree, sortTree } from '../utils/tree-builder';
import StatisticsPanel from './StatisticsPanel';

interface PowerDeskAnalyzerProps {
  data?: DiskAnalysisData;
}

const PowerDeskAnalyzer: React.FC<PowerDeskAnalyzerProps> = ({ data: initialData }) => {
  const [data, setData] = useState<DiskAnalysisData | null>(initialData || null);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<SortColumn>('size_kb');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [loading, setLoading] = useState(!initialData);

  // Load data from JSON file if not provided as prop
  useEffect(() => {
    if (!initialData) {
      loadData();
    }
  }, [initialData]);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/sample-disk-analysis-data.json');
      if (!response.ok) throw new Error('Failed to load data');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Build tree structure when data changes
  useEffect(() => {
    if (data) {
      const tree = buildTreeFromFlatData(data.directory_analysis);
      setTreeData(tree);
    }
  }, [data]);

  // Apply search and sort filters
  const filteredAndSortedTree = useMemo(() => {
    if (!treeData.length) return [];
    
    let filtered = searchTerm ? searchTree(treeData, searchTerm) : treeData;
    return sortTree(filtered, sortColumn, sortDirection);
  }, [treeData, searchTerm, sortColumn, sortDirection]);

  // Flatten tree for display
  const displayNodes = useMemo(() => {
    return flattenTree(filteredAndSortedTree);
  }, [filteredAndSortedTree]);

  const handleToggleExpansion = (path: string) => {
    setTreeData(prev => toggleNodeExpansion(prev, path));
  };

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          setData(jsonData);
        } catch (error) {
          console.error('Error parsing uploaded file:', error);
          alert('Error parsing uploaded file. Please ensure it\'s a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const exportToCSV = () => {
    if (!data) return;
    
    const csvContent = [
      'Folder,Path,Size,Files,Modified',
      ...data.directory_analysis.map(item => 
        `"${item.name}","${item.path}","${item.size_formatted}",${item.file_count},"${item.modification_date}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'disk-analysis.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSizeBarWidth = (node: TreeNode) => {
    const maxSize = Math.max(...(data?.directory_analysis.map(d => d.size_kb) || [1]));
    return Math.max((node.size_kb / maxSize) * 100, 2); // Minimum 2% width for visibility
  };

  const SortableHeader: React.FC<{ column: SortColumn; children: React.ReactNode; className?: string }> = ({ 
    column, 
    children, 
    className = '' 
  }) => (
    <th 
      className={`px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors ${className}`}
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortColumn === column && (
          <span className={`text-blue-600 ${sortDirection === 'asc' ? 'rotate-180' : ''}`}>
            ↓
          </span>
        )}
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin h-8 w-8 text-blue-600" />
        <span className="ml-2 text-gray-600">Loading disk analysis data...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No data available. Please upload a disk analysis file.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">PowerDesk Disk Analyzer</h1>
                <p className="text-blue-100 mt-1">
                  Analysis from {new Date(data.analysis_metadata.timestamp).toLocaleDateString()} | 
                  {data.directory_analysis.length} directories scanned
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <label className="cursor-pointer bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-lg transition-colors flex items-center shadow-lg">
                <Upload className="h-4 w-4 mr-2" />
                Upload
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={exportToCSV}
                className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-lg transition-colors flex items-center shadow-lg"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Panel */}
        <div className="p-6 bg-gray-50 border-b">
          <StatisticsPanel data={data} />
        </div>
      </div>

      {/* Main Analysis Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">

        {/* Search Bar */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search folders and paths..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
            <div className="ml-4 text-sm text-gray-500">
              {displayNodes.length} of {data.directory_analysis.length} folders {searchTerm && `matching "${searchTerm}"`}
            </div>
          </div>
        </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader column="name" className="w-2/5">
                Folders
              </SortableHeader>
              <SortableHeader column="size_kb" className="w-1/4">
                Total
              </SortableHeader>
              <SortableHeader column="file_count" className="w-1/6">
                Files in Folder
              </SortableHeader>
              <SortableHeader column="modification_date" className="w-1/6">
                Modified
              </SortableHeader>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayNodes.map((node, index) => (
              <tr 
                key={node.path} 
                className={`hover:bg-blue-50 transition-all duration-200 border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                {/* Folder Name Column */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div 
                    className="flex items-center"
                    style={{ paddingLeft: `${node.level * 20}px` }}
                  >
                    {node.children.length > 0 ? (
                      <button
                        onClick={() => handleToggleExpansion(node.path)}
                        className="mr-2 p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        {node.isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-gray-600" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-600" />
                        )}
                      </button>
                    ) : (
                      <div className="w-6 h-6 mr-2" />
                    )}
                    <Folder className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {node.name}
                    </span>
                  </div>
                </td>

                {/* Size Column with Bar */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-1 mr-3">
                      <div className="w-full bg-gray-200 rounded-full h-5 relative shadow-inner">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-blue-500 h-5 rounded-full transition-all duration-500 ease-out shadow-sm"
                          style={{ width: `${getSizeBarWidth(node)}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-start pl-3 text-xs font-semibold text-white drop-shadow-sm">
                          {node.size_formatted}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* File Count Column */}
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {node.file_count.toLocaleString()}
                </td>

                {/* Modified Date Column */}
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {node.modification_date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

        {displayNodes.length === 0 && searchTerm && (
          <div className="text-center py-8 text-gray-500">
            No folders found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};

export default PowerDeskAnalyzer;
