import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAllReports = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userRole = req.user?.role;
    const userId = req.user?.id;

    let where: any = {};

    // Inspectors see only their reports
    if (userRole === 'INSPECTOR') {
      where.inspectorId = userId;
    }
    // Kitchen managers and management see approved reports
    else if (userRole === 'KITCHEN_MANAGER' || userRole === 'HOTEL_MANAGEMENT') {
      where.status = 'APPROVED';
    }
    // Admins see all reports

    const reports = await prisma.inspectionReport.findMany({
      where,
      include: {
        form: {
          select: {
            title: true,
          },
        },
        inspector: {
          select: {
            name: true,
          },
        },
        reviewedBy: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(reports);
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getReport = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const report = await prisma.inspectionReport.findUnique({
      where: { id: parseInt(id) },
      include: {
        form: true,
        inspector: {
          select: {
            name: true,
          },
        },
        reviewedBy: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!report) {
      res.status(404).json({ message: 'Report not found' });
      return;
    }

    res.json(report);
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createReport = async (req: AuthRequest, res: Response): Promise<void> => {
  const { formId, data, remarks } = req.body;

  try {
    const report = await prisma.inspectionReport.create({
      data: {
        formId: parseInt(formId),
        data: JSON.stringify(data),
        remarks,
        inspectorId: req.user!.id,
        status: 'DRAFT',
      },
      include: {
        form: {
          select: {
            title: true,
          },
        },
        inspector: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(201).json(report);
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateReport = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { data, remarks } = req.body;

  try {
    const report = await prisma.inspectionReport.update({
      where: { id: parseInt(id) },
      data: {
        data: data ? JSON.stringify(data) : undefined,
        remarks: remarks !== undefined ? remarks : undefined,
      },
      include: {
        form: {
          select: {
            title: true,
          },
        },
        inspector: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json(report);
  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const submitReport = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const report = await prisma.inspectionReport.update({
      where: { id: parseInt(id) },
      data: {
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
      include: {
        form: {
          select: {
            title: true,
          },
        },
        inspector: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json(report);
  } catch (error) {
    console.error('Submit report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const approveReport = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { remarks } = req.body;

  try {
    const report = await prisma.inspectionReport.update({
      where: { id: parseInt(id) },
      data: {
        status: 'APPROVED',
        reviewedById: req.user!.id,
        reviewedAt: new Date(),
        remarks,
      },
      include: {
        form: {
          select: {
            title: true,
          },
        },
        inspector: {
          select: {
            name: true,
          },
        },
        reviewedBy: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json(report);
  } catch (error) {
    console.error('Approve report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const rejectReport = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { remarks } = req.body;

  try {
    const report = await prisma.inspectionReport.update({
      where: { id: parseInt(id) },
      data: {
        status: 'REJECTED',
        reviewedById: req.user!.id,
        reviewedAt: new Date(),
        remarks,
      },
      include: {
        form: {
          select: {
            title: true,
          },
        },
        inspector: {
          select: {
            name: true,
          },
        },
        reviewedBy: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json(report);
  } catch (error) {
    console.error('Reject report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
