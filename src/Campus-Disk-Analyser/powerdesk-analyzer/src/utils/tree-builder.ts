import { DirectoryAnalysis, TreeNode } from '../types/disk-analysis';

export function buildTreeFromFlatData(flatData: DirectoryAnalysis[]): TreeNode[] {
  const nodeMap = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  // Sort by depth first to ensure parents are processed before children
  const sortedData = [...flatData].sort((a, b) => a.depth - b.depth);

  // Create all nodes
  sortedData.forEach(item => {
    const node: TreeNode = {
      ...item,
      children: [],
      isExpanded: item.depth <= 2, // Expand first 2 levels by default
      level: 0 // Will be calculated based on tree position
    };
    nodeMap.set(item.path, node);
  });

  // Build the tree structure
  sortedData.forEach(item => {
    const node = nodeMap.get(item.path)!;
    
    if (item.parent_path && nodeMap.has(item.parent_path)) {
      const parent = nodeMap.get(item.parent_path)!;
      parent.children.push(node);
      node.level = parent.level + 1;
    } else {
      // This is a root node
      roots.push(node);
    }
  });

  // Sort children by size (largest first)
  const sortChildren = (nodes: TreeNode[]) => {
    nodes.forEach(node => {
      node.children.sort((a, b) => b.size_kb - a.size_kb);
      sortChildren(node.children);
    });
  };

  roots.sort((a, b) => b.size_kb - a.size_kb);
  sortChildren(roots);

  return roots;
}

export function flattenTree(nodes: TreeNode[]): TreeNode[] {
  const result: TreeNode[] = [];
  
  const traverse = (nodeList: TreeNode[]) => {
    nodeList.forEach(node => {
      result.push(node);
      if (node.isExpanded && node.children.length > 0) {
        traverse(node.children);
      }
    });
  };
  
  traverse(nodes);
  return result;
}

export function toggleNodeExpansion(nodes: TreeNode[], targetPath: string): TreeNode[] {
  return nodes.map(node => {
    if (node.path === targetPath) {
      return { ...node, isExpanded: !node.isExpanded };
    }
    return {
      ...node,
      children: toggleNodeExpansion(node.children, targetPath)
    };
  });
}

export function searchTree(nodes: TreeNode[], searchTerm: string): TreeNode[] {
  if (!searchTerm.trim()) return nodes;
  
  const lowercaseSearch = searchTerm.toLowerCase();
  
  const filterNode = (node: TreeNode): TreeNode | null => {
    const nameMatches = node.name.toLowerCase().includes(lowercaseSearch);
    const pathMatches = node.path.toLowerCase().includes(lowercaseSearch);
    
    const filteredChildren = node.children
      .map(child => filterNode(child))
      .filter(child => child !== null) as TreeNode[];
    
    if (nameMatches || pathMatches || filteredChildren.length > 0) {
      return {
        ...node,
        children: filteredChildren,
        isExpanded: filteredChildren.length > 0 // Expand nodes with matching children
      };
    }
    
    return null;
  };
  
  return nodes
    .map(node => filterNode(node))
    .filter(node => node !== null) as TreeNode[];
}

export function sortTree(nodes: TreeNode[], column: string, direction: 'asc' | 'desc'): TreeNode[] {
  const sortFn = (a: TreeNode, b: TreeNode) => {
    let comparison = 0;
    
    switch (column) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'size_kb':
        comparison = a.size_kb - b.size_kb;
        break;
      case 'file_count':
        comparison = a.file_count - b.file_count;
        break;
      case 'modification_date':
        comparison = a.modification_timestamp - b.modification_timestamp;
        break;
      default:
        comparison = 0;
    }
    
    return direction === 'asc' ? comparison : -comparison;
  };
  
  const sortedNodes = [...nodes].sort(sortFn);
  
  return sortedNodes.map(node => ({
    ...node,
    children: sortTree(node.children, column, direction)
  }));
}
