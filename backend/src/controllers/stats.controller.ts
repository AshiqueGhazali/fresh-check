import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userRole = req.user?.role;
    const userId = req.user?.id;

    // Common stats
    const totalUsers = await prisma.user.count();
    const totalGuidelines = await prisma.guideline.count();
    const totalForms = await prisma.inspectionForm.count();
    
    // Report stats
    const totalReports = await prisma.inspectionReport.count();
    const submittedReports = await prisma.inspectionReport.count({
      where: { status: 'SUBMITTED' },
    });
    const approvedReports = await prisma.inspectionReport.count({
      where: { status: 'APPROVED' },
    });
    const rejectedReports = await prisma.inspectionReport.count({
      where: { status: 'REJECTED' },
    });

    // Role-specific stats
    let roleSpecificStats = {};

    if (userRole === 'INSPECTOR') {
      const myReports = await prisma.inspectionReport.count({
        where: { inspectorId: userId },
      });
      const myPendingReports = await prisma.inspectionReport.count({
        where: { 
          inspectorId: userId,
          status: 'DRAFT',
        },
      });
      const mySubmittedReports = await prisma.inspectionReport.count({
        where: { 
          inspectorId: userId,
          status: 'SUBMITTED',
        },
      });

      roleSpecificStats = {
        myReports,
        myPendingReports,
        mySubmittedReports,
      };
    }

    if (userRole === 'ADMIN') {
      const pendingApprovals = submittedReports;
      
      roleSpecificStats = {
        totalUsers,
        totalForms,
        totalGuidelines,
        pendingApprovals,
      };
    }

    // Calculate compliance score (approved / total submitted)
    const totalSubmitted = submittedReports + approvedReports + rejectedReports;
    const complianceScore = totalSubmitted > 0 
      ? Math.round((approvedReports / totalSubmitted) * 100) 
      : 0;

    res.json({
      totalReports,
      submittedReports,
      approvedReports,
      rejectedReports,
      complianceScore,
      ...roleSpecificStats,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
