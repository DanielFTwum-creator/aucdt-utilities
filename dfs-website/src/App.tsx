/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import PageLoader from "@/components/PageLoader";
import { Toaster } from "@/components/ui/sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Lazy-loaded pages
const BookPage = lazy(() => import("@/pages/BookPage"));
const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Programs = lazy(() => import("@/pages/Programs"));
const Seminars = lazy(() => import("@/pages/Seminars"));
const Contact = lazy(() => import("@/pages/Contact"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const VerifyCertificate = lazy(() => import("@/pages/VerifyCertificate"));

// Admin pages
const AdminLogin = lazy(() => import("@/pages/admin/Login"));
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminDiagnostics = lazy(() => import("@/pages/admin/Diagnostics"));
const AdminTesting = lazy(() => import("@/pages/admin/Testing"));
const AdminAuditLogs = lazy(() => import("@/pages/admin/AuditLogs"));

// Top-level route segments the app owns. Anything in the URL path before the
// first of these is the mount point (subpath the app is deployed under).
const APP_ROUTE_SEGMENTS = [
  "about",
  "programs",
  "seminars",
  "contact",
  "blog",
  "verify",
  "book",
  "admin",
];

/**
 * Derive the router basename from the current URL at runtime. Works for any
 * subpath (e.g. "/dfs", "/dfs-website") without rebuilding, because vite
 * `base: './'` keeps the asset bundle path-agnostic.
 */
function detectBasename(): string {
  if (typeof window === "undefined") return "";
  const segments = window.location.pathname.split("/").filter(Boolean);
  const routeIdx = segments.findIndex((s) => APP_ROUTE_SEGMENTS.includes(s));
  // Segments before the first known route make up the mount path. When no app
  // route is present we're at the app root, so all segments are the mount path.
  const mountSegments = routeIdx === -1 ? segments : segments.slice(0, routeIdx);
  return mountSegments.length ? "/" + mountSegments.join("/") : "";
}

export default function App() {
  // vite `base` is "./" in production so built assets stay path-flexible
  // (the same bundle works under /dfs/, /dfs-website/, etc.). That makes
  // import.meta.env.BASE_URL unusable as a router basename, so derive the
  // mount path at runtime: take the URL prefix that precedes the first known
  // top-level app route. Empty string when served from the domain root.
  const basename = detectBasename();

  return (
    <Router basename={basename}>
      <Routes>
        {/* Public Routes with Main Layout */}
        <Route
          path="/*"
          element={
            <Layout>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/programs" element={<Programs />} />
                  <Route path="/seminars" element={<Seminars />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:id" element={<BlogPost />} />
                  <Route path="/verify/:id" element={<VerifyCertificate />} />
                </Routes>
              </Suspense>
            </Layout>
          }
        />

        {/* Book Companion - No Main Layout (has its own full-screen header/footer) */}
        <Route
          path="/book/*"
          element={
            <Suspense fallback={<PageLoader />}>
              <BookPage />
            </Suspense>
          }
        />

        {/* Admin Routes - No Main Layout */}
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<PageLoader />}>
              <AdminLogin />
            </Suspense>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route
                    path="diagnostics"
                    element={
                      <AdminDashboard>
                        <AdminDiagnostics />
                      </AdminDashboard>
                    }
                  />
                  <Route
                    path="testing"
                    element={
                      <AdminDashboard>
                        <AdminTesting />
                      </AdminDashboard>
                    }
                  />
                  <Route
                    path="audit"
                    element={
                      <AdminDashboard>
                        <AdminAuditLogs />
                      </AdminDashboard>
                    }
                  />
                </Routes>
              </Suspense>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </Router>
  );
}
