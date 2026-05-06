import React, { useState, useEffect } from 'react';
import './index.css';

const KanbanApp = () => {
  const columns = [
    { id: 'backlog', title: 'Backlog', color: 'bg-gray-100' },
    { id: 'todo', title: 'To Do', color: 'bg-blue-100' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-yellow-100' },
    { id: 'review', title: 'Code Review', color: 'bg-purple-100' },
    { id: 'done', title: 'Done', color: 'bg-green-100' }
  ];

  // Load tasks from localStorage or use default
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('kanbanTasks');
    return savedTasks ? JSON.parse(savedTasks) : [
      {
        id: '1',
        title: 'Update -dev for cypress',
        description: 'Identify and update cypress entry points',
        assignee: 'Mandela',
        priority: 'high',
        dueDate: '2025-06-15',
        column: 'in-progress'
      },
      {
        id: '2',
        title: 'Update -sdev for cypress',
        description: 'Identify and update cypress entry points',
        assignee: 'Mandela',
        priority: 'medium',
        dueDate: '2025-06-18',
        column: 'in-progress'
      },
      {
        id: '3',
        title: 'Implement cypress tests',
        description: 'Create step1 tests',
        assignee: 'Mandela',
        priority: 'high',
        dueDate: '2025-06-20',
        column: 'todo'
      },
      {
        id: '4',
        title: 'Setup pipeline for aucdt-utilities',
        description: 'Setup pipelines to build aucdt-utilities',
        assignee: 'DTwum',
        priority: 'medium',
        dueDate: '2025-06-22',
        column: 'backlog'
      },
      {
        id: '5',
        title: 'Write unit tests',
        description: 'Add comprehensive test coverage for core platform features',
        assignee: 'DTwum',
        priority: 'high',
        dueDate: '2025-06-25',
        column: 'todo'
      }
    ];
  });

  const [draggedTask, setDraggedTask] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
    dueDate: '',
    column: 'backlog'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingTask, setViewingTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };

  const handleDragEnd = () => {
    setDragOverColumn(null);
    setDraggedTask(null);
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    if (draggedTask) {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === draggedTask.id
            ? { ...task, column: columnId }
            : task
        )
      );
      setDragOverColumn(null);
      setDraggedTask(null);
    }
  };

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      const task = {
        ...newTask,
        id: Date.now().toString()
      };
      setTasks(prev => [...prev, task]);
      resetTaskForm();
      setShowTaskForm(false);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({ ...task });
    setShowTaskForm(true);
  };

  const handleUpdateTask = () => {
    if (newTask.title.trim()) {
      setTasks(prev =>
        prev.map(task =>
          task.id === editingTask.id ? { ...newTask } : task
        )
      );
      resetTaskForm();
      setShowTaskForm(false);
      setEditingTask(null);
    }
  };

  const resetTaskForm = () => {
    setNewTask({
      title: '',
      description: '',
      assignee: '',
      priority: 'medium',
      dueDate: '',
      column: 'backlog'
    });
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    setViewingTask(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.assignee.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const TaskCard = ({ task }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
      onDragEnd={handleDragEnd}
      onClick={() => setViewingTask(task)}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800 text-sm">{task.title}</h3>
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditTask(task);
            }}
            className="text-gray-400 hover:text-blue-600 p-1"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteTask(task.id);
            }}
            className="text-gray-400 hover:text-red-600 p-1"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
      
      {task.description && (
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">{task.description}</p>
      )}
      
      <div className="space-y-2">
        {task.assignee && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>👤</span>
            <span className="truncate">{task.assignee}</span>
          </div>
        )}
        
        {task.dueDate && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>📅</span>
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <span>🚩</span>
          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">TUC ICT Development Team Kanban</h1>
            <p className="text-gray-600 mt-2">Track your development tasks and progress</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks..."
                className="w-full p-2 pl-9 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>
            <button
              onClick={() => setShowTaskForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
            >
              <span>➕</span>
              Add Task
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {columns.map(column => (
            <div
              key={column.id}
              className={`${column.color} rounded-lg p-4 min-h-96 ${dragOverColumn === column.id ? 'ring-2 ring-blue-500' : ''}`}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={() => setDragOverColumn(null)}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-gray-800">{column.title}</h2>
                <span className="bg-white text-gray-600 text-xs px-2 py-1 rounded-full">
                  {tasks.filter(task => task.column === column.id).length}
                </span>
              </div>
              
              <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
                {filteredTasks
                  .filter(task => task.column === column.id)
                  .map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                  
                {filteredTasks.filter(task => task.column === column.id).length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    <p>No tasks found</p>
                    <p className="mt-1">Drag tasks here or add new ones</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Task Form Modal */}
        {showTaskForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div 
              className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter task title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Enter task description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assignee
                  </label>
                  <input
                    type="text"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter assignee name"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                {!editingTask && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Column
                    </label>
                    <select
                      value={newTask.column}
                      onChange={(e) => setNewTask(prev => ({ ...prev, column: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {columns.map(column => (
                        <option key={column.id} value={column.id}>
                          {column.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={editingTask ? handleUpdateTask : handleAddTask}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                  disabled={!newTask.title.trim()}
                >
                  {editingTask ? 'Update Task' : 'Add Task'}
                </button>
                <button
                  onClick={() => {
                    setShowTaskForm(false);
                    setEditingTask(null);
                    resetTaskForm();
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Task Details Modal */}
        {viewingTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div 
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{viewingTask.title}</h3>
                <button
                  onClick={() => setViewingTask(null)}
                  className="text-gray-500 hover:text-gray-700 text-lg"
                >
                  ✕
                </button>
              </div>
              
              {viewingTask.description && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-1">Description</h4>
                  <p className="text-gray-600 text-sm">{viewingTask.description}</p>
                </div>
              )}
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-700 w-24">Assignee:</span>
                  <span className="text-gray-600 text-sm">
                    {viewingTask.assignee || 'Unassigned'}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-700 w-24">Due Date:</span>
                  <span className="text-gray-600 text-sm">
                    {viewingTask.dueDate 
                      ? new Date(viewingTask.dueDate).toLocaleDateString() 
                      : 'No due date'}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-700 w-24">Priority:</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${getPriorityColor(viewingTask.priority)}`}>
                    {viewingTask.priority}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-700 w-24">Status:</span>
                  <span className="text-gray-600 text-sm">
                    {columns.find(col => col.id === viewingTask.column)?.title || viewingTask.column}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setViewingTask(null);
                    handleEditTask(viewingTask);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Edit Task
                </button>
                <button
                  onClick={() => setViewingTask(null)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanApp;