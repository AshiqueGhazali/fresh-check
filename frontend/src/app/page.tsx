'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ChefHat, Shield, BarChart3, ArrowRight, Sparkles, Clock, Zap } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      const dashboardRoute = getDashboardRoute(user.role);
      router.push(dashboardRoute);
    }
  }, [user, loading, router]);

  const getDashboardRoute = (role: string): string => {
    switch (role) {
      case 'ADMIN':
        return '/dashboard/admin';
      case 'INSPECTOR':
        return '/dashboard/inspector';
      case 'KITCHEN_MANAGER':
        return '/dashboard/kitchen';
      case 'HOTEL_MANAGEMENT':
        return '/dashboard/management';
      default:
        return '/';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="lg:h-screen overflow-hidden bg-linear-to-br from-[#cffafe] via-white to-[#fefce8] flex flex-col">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-4 sm:px-6 lg:px-8 py-4 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 bg-linear-to-br from-[#047857] to-[#10b981] rounded-xl flex items-center justify-center shadow-lg"
            >
              <ChefHat className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-linear-to-r from-[#047857] to-[#10b981] bg-clip-text text-transparent">
              FreshCheck
            </span>
          </div>
          <Link href="/login">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              Sign In
            </Button>
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-auto">
        <div className="max-w-7xl w-full py-8 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Food Quality
                <br />
                <span className="bg-linear-to-r from-[#047857] to-[#10b981] bg-clip-text text-transparent">
                  Redefined
                </span>
              </h1>

              <p className="text-[14px] sm:text-[16px] lg:text-[18px] text-gray-600 mb-8 leading-relaxed">
                Streamline your food safety inspections, maintain quality standards, and ensure compliance with our comprehensive monitoring solution.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link href="/login">
                  <Button 
                    size="lg" 
                    className="group w-full sm:min-w-75 bg-linear-to-r from-[#047857] to-[#10b981] hover:from-[#10b981] hover:to-[#047857] text-white px-8 py-6 text-base shadow-lg hover:shadow-xl transition-all duration-1000"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right Content - Feature Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid gap-6"
            >
              {/* Card 1 */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Assurance</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Real-time monitoring of food safety standards and compliance metrics
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Analytics</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      AI-powered insights and predictive analytics for better decisions
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-linear-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Reports</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Generate comprehensive reports in seconds with automated workflows
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="px-4 sm:px-6 lg:px-8 py-4 bg-[#064e3b] backdrop-blur-sm border-t border-gray-200"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-100 text-sm">
            © 2024 FreshCheck. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-100">
            <a href="" className="hover:text-white hover:underline transition-colors">Privacy</a>
            <a href="" className="hover:text-white hover:underline transition-colors">Terms</a>
            <a href="" className="hover:text-white hover:underline transition-colors">Contact</a>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}