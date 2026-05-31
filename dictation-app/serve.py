#!/usr/bin/env python3
"""
Cache-busting HTTP server for Dictation App SPA
- Serves index.html for all routes (SPA routing)
- Adds aggressive no-cache headers to force fresh loads
- Runs on localhost:5173
"""

import os
import sys
import mimetypes
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from datetime import datetime

DIST_DIR = Path(__file__).parent / 'dist'

class CacheBustingHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        # Log the request
        print(f'[{datetime.now().strftime("%H:%M:%S")}] {self.command} {self.path}')

        # Always serve from dist
        os.chdir(DIST_DIR)

        # Normalize path
        path = self.path.lstrip('/')

        # Check if file exists
        file_path = DIST_DIR / path

        # For SPA: serve index.html if file doesn't exist or is a directory
        if not file_path.is_file() or file_path.is_dir():
            self.path = '/index.html'
            path = 'index.html'
            file_path = DIST_DIR / path

        # Call parent handler
        super().do_GET()

    def end_headers(self):
        # Aggressive cache-busting headers
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('ETag', f'W/"{datetime.now().timestamp()}"')  # Dynamic ETag

        # CORS for dev
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

        super().end_headers()

    def log_message(self, format, *args):
        # Suppress default logging, we log in do_GET
        pass

def run_server():
    os.chdir(DIST_DIR)
    server_address = ('localhost', 5173)
    httpd = HTTPServer(server_address, CacheBustingHandler)
    print(f'🚀 Dictation App Server running at http://localhost:5173/')
    print(f'📁 Serving from: {DIST_DIR}')
    print(f'🔄 Cache-busting enabled: All responses have no-cache headers')
    print(f'🛣️  SPA routing: Non-existent routes serve index.html')
    print(f'⏹️  Press Ctrl+C to stop\n')

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\n🛑 Server stopped')
        sys.exit(0)

if __name__ == '__main__':
    run_server()
