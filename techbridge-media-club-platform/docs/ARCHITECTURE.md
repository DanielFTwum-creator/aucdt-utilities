# System Architecture

## 1. High-Level System Architecture

The Techbridge Media Club Platform acts as a client-side Single Page Application (SPA). It leverages React 19 capabilities and uses simulated services to mimic backend functionality.

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <!-- Background -->
  <rect width="800" height="500" fill="#f8f9fa" rx="10"/>
  
  <!-- Client Container -->
  <rect x="50" y="50" width="700" height="400" rx="10" fill="#ffffff" stroke="#2d3748" stroke-width="2"/>
  <text x="400" y="80" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="18" fill="#2d3748">Client Browser (React 19.2.4)</text>

  <!-- Context Layer -->
  <g transform="translate(100, 120)">
    <rect width="600" height="60" rx="5" fill="#e6fffa" stroke="#38b2ac" stroke-width="1"/>
    <text x="300" y="35" text-anchor="middle" font-family="sans-serif" font-weight="bold" fill="#2c7a7b">Context Layer (Theme, Toast, Auth Mock)</text>
  </g>

  <!-- Router/Layout Layer -->
  <g transform="translate(100, 200)">
    <rect width="600" height="150" rx="5" fill="#fff5f5" stroke="#e53e3e" stroke-width="1"/>
    <text x="300" y="25" text-anchor="middle" font-family="sans-serif" font-weight="bold" fill="#c53030">Application Layout & Routing</text>
    
    <!-- Modules -->
    <rect x="20" y="50" width="100" height="80" rx="5" fill="#fff" stroke="#e53e3e"/>
    <text x="70" y="95" text-anchor="middle" font-family="sans-serif" font-size="12">Dashboard</text>
    
    <rect x="130" y="50" width="100" height="80" rx="5" fill="#fff" stroke="#e53e3e"/>
    <text x="180" y="95" text-anchor="middle" font-family="sans-serif" font-size="12">Content CMS</text>
    
    <rect x="240" y="50" width="100" height="80" rx="5" fill="#fff" stroke="#e53e3e"/>
    <text x="290" y="95" text-anchor="middle" font-family="sans-serif" font-size="12">Asset Lib</text>
    
    <rect x="350" y="50" width="100" height="80" rx="5" fill="#fff" stroke="#e53e3e"/>
    <text x="400" y="95" text-anchor="middle" font-family="sans-serif" font-size="12">Events</text>

    <!-- Admin Module (Protected) -->
    <rect x="460" y="50" width="120" height="80" rx="5" fill="#2d3748" stroke="#000"/>
    <text x="520" y="85" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#fff" font-weight="bold">Admin Panel</text>
    <text x="520" y="105" text-anchor="middle" font-family="sans-serif" font-size="10" fill="#cbd5e0">(Diagnostics, Logs)</text>
  </g>

  <!-- Service Layer -->
  <g transform="translate(100, 380)">
    <rect width="600" height="50" rx="5" fill="#ebf8ff" stroke="#4299e1" stroke-width="1"/>
    <text x="300" y="30" text-anchor="middle" font-family="sans-serif" font-weight="bold" fill="#2b6cb0">Service Layer (Singleton Instances)</text>
    <text x="150" y="30" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#2b6cb0">AuditService</text>
    <text x="450" y="30" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#2b6cb0">CollaborationService</text>
  </g>

  <!-- Flow Arrows -->
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="#000" />
    </marker>
  </defs>
  <line x1="400" y1="180" x2="400" y2="200" stroke="#000" stroke-width="2" marker-end="url(#arrow)"/>
  <line x1="400" y1="350" x2="400" y2="380" stroke="#000" stroke-width="2" marker-end="url(#arrow)"/>
</svg>
```

## 2. Real-Time Collaboration Architecture

The platform uses the `BroadcastChannel` API to simulate WebSocket behavior, allowing synchronization between different tabs/windows of the same browser without a backend server.

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="300" viewBox="0 0 800 300">
  <defs>
    <marker id="sync" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
       <circle cx="5" cy="5" r="3" fill="#D4A017" />
    </marker>
  </defs>

  <!-- Channel -->
  <rect x="200" y="120" width="400" height="60" rx="30" fill="#7A0019" />
  <text x="400" y="155" text-anchor="middle" fill="#fff" font-weight="bold" font-family="monospace">BroadcastChannel ('tmcp_collab_doc1')</text>

  <!-- Tab A -->
  <rect x="50" y="50" width="150" height="100" rx="5" fill="#fff" stroke="#333" stroke-width="2" />
  <text x="125" y="80" text-anchor="middle" font-weight="bold">User Tab A</text>
  <text x="125" y="100" text-anchor="middle" font-size="12">Editor Component</text>
  
  <!-- Tab B -->
  <rect x="600" y="50" width="150" height="100" rx="5" fill="#fff" stroke="#333" stroke-width="2" />
  <text x="675" y="80" text-anchor="middle" font-weight="bold">User Tab B</text>
  <text x="675" y="100" text-anchor="middle" font-size="12">Editor Component</text>
  
  <!-- Bot -->
  <rect x="325" y="220" width="150" height="60" rx="5" fill="#eee" stroke="#666" stroke-dasharray="5,5" />
  <text x="400" y="245" text-anchor="middle" font-style="italic">Simulated Bots</text>
  <text x="400" y="265" text-anchor="middle" font-size="10">(Sarah, David)</text>

  <!-- Connections -->
  <line x1="125" y1="150" x2="200" y2="150" stroke="#333" stroke-width="2" marker-end="url(#sync)" />
  <line x1="675" y1="150" x2="600" y2="150" stroke="#333" stroke-width="2" marker-end="url(#sync)" />
  <line x1="400" y1="220" x2="400" y2="180" stroke="#666" stroke-width="2" stroke-dasharray="5,5" />
</svg>
```

## 3. Database Schema (Conceptual)

Although the prototype uses in-memory data (`constants.ts`), the data models adhere to the following relational schema defined in `types.ts`.

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
  <defs>
    <style>
      .table-header { fill: #7A0019; stroke: #000; }
      .table-body { fill: #fff; stroke: #000; }
      .text-header { fill: #fff; font-weight: bold; font-family: monospace; font-size: 14px; }
      .text-body { fill: #000; font-family: monospace; font-size: 12px; }
      .line { stroke: #555; stroke-width: 2; }
    </style>
  </defs>

  <!-- Users Table -->
  <g transform="translate(50, 50)">
    <rect class="table-header" width="180" height="30" />
    <text x="90" y="20" class="text-header" text-anchor="middle">USERS</text>
    <rect class="table-body" y="30" width="180" height="110" />
    <text x="10" y="50" class="text-body">PK id: string</text>
    <text x="10" y="70" class="text-body">   name: string</text>
    <text x="10" y="90" class="text-body">   email: string</text>
    <text x="10" y="110" class="text-body">   role: enum</text>
    <text x="10" y="130" class="text-body">   avatar: string</text>
  </g>

  <!-- Content Table -->
  <g transform="translate(300, 50)">
    <rect class="table-header" width="180" height="30" />
    <text x="90" y="20" class="text-header" text-anchor="middle">CONTENT</text>
    <rect class="table-body" y="30" width="180" height="150" />
    <text x="10" y="50" class="text-body">PK id: string</text>
    <text x="10" y="70" class="text-body">   title: string</text>
    <text x="10" y="90" class="text-body">   type: enum</text>
    <text x="10" y="110" class="text-body">   author: string</text>
    <text x="10" y="130" class="text-body">   status: enum</text>
    <text x="10" y="150" class="text-body">   created: date</text>
    <text x="10" y="170" class="text-body">   views: number</text>
  </g>

  <!-- Assets Table -->
  <g transform="translate(550, 50)">
    <rect class="table-header" width="180" height="30" />
    <text x="90" y="20" class="text-header" text-anchor="middle">ASSETS</text>
    <rect class="table-body" y="30" width="180" height="130" />
    <text x="10" y="50" class="text-body">PK id: string</text>
    <text x="10" y="70" class="text-body">   name: string</text>
    <text x="10" y="90" class="text-body">   type: enum</text>
    <text x="10" y="110" class="text-body">   size: string</text>
    <text x="10" y="130" class="text-body">   uploader: string</text>
    <text x="10" y="150" class="text-body">   url: string</text>
  </g>

  <!-- Events Table -->
  <g transform="translate(300, 250)">
    <rect class="table-header" width="180" height="30" />
    <text x="90" y="20" class="text-header" text-anchor="middle">EVENTS</text>
    <rect class="table-body" y="30" width="180" height="130" />
    <text x="10" y="50" class="text-body">PK id: string</text>
    <text x="10" y="70" class="text-body">   title: string</text>
    <text x="10" y="90" class="text-body">   date: date</text>
    <text x="10" y="110" class="text-body">   location: string</text>
    <text x="10" y="130" class="text-body">   attendees: int</text>
    <text x="10" y="150" class="text-body">   status: enum</text>
  </g>

  <!-- Audit Log Table -->
  <g transform="translate(50, 250)">
    <rect class="table-header" width="180" height="30" style="fill: #2d3748" />
    <text x="90" y="20" class="text-header" text-anchor="middle">AUDIT_LOG</text>
    <rect class="table-body" y="30" width="180" height="110" />
    <text x="10" y="50" class="text-body">PK id: string</text>
    <text x="10" y="70" class="text-body">   timestamp: date</text>
    <text x="10" y="90" class="text-body">   level: enum</text>
    <text x="10" y="110" class="text-body">   message: string</text>
    <text x="10" y="130" class="text-body">FK user: string</text>
  </g>

  <!-- Relationships -->
  <!-- User to Audit Log -->
  <line x1="140" y1="190" x2="140" y2="250" class="line" stroke-dasharray="4"/>
  <circle cx="140" cy="250" r="3" fill="#000"/>
  
  <!-- User to Content (Logical) -->
  <path d="M230,100 L300,100" class="line" stroke-dasharray="4" marker-end="url(#arrow)"/>
</svg>
```