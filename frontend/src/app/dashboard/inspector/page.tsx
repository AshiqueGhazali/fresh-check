'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, FileText, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import api from '@/lib/api';

interface Stats {
  myReports: number;
  myPendingReports: number;
  mySubmittedReports: number;
}

export default function InspectorDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/stats/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const cards = [
    {
      title: 'Inspection Forms',
      description: 'View and fill inspection forms',
      icon: ClipboardList,
      value: 'Start',
      href: '/dashboard/inspector/forms',
      color: 'from-blue-600 to-cyan-600',
    },
    {
      title: 'My Reports',
      description: 'View all your inspection reports',
      icon: FileText,
      value: stats?.myReports || 0,
      href: '/dashboard/inspector/reports',
      color: 'from-purple-600 to-pink-600',
    },
    {
      title: 'Pending',
      description: 'Draft reports not yet submitted',
      icon: Clock,
      value: stats?.myPendingReports || 0,
      href: '/dashboard/inspector/reports',
      color: 'from-orange-600 to-red-600',
    },
    {
      title: 'Submitted',
      description: 'Reports submitted for review',
      icon: CheckCircle,
      value: stats?.mySubmittedReports || 0,
      href: '/dashboard/inspector/reports',
      color: 'from-green-600 to-teal-600',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Inspector Dashboard</h2>
          <p className="text-gray-600 mt-2">Conduct inspections and submit reports</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={card.href}>
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-gray-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl">{card.title}</CardTitle>
                        <CardDescription className="mt-1">{card.description}</CardDescription>
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center`}>
                        <card.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">{card.value}</div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
