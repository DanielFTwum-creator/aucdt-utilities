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

export default function App() {
  return (
    <Router>
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
