import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAllGuidelines = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const guidelines = await prisma.guideline.findMany({
      include: {
        updatedBy: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(guidelines);
  } catch (error) {
    console.error('Get guidelines error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getGuideline = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const guideline = await prisma.guideline.findUnique({
      where: { id: parseInt(id) },
      include: {
        updatedBy: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!guideline) {
      res.status(404).json({ message: 'Guideline not found' });
      return;
    }

    res.json(guideline);
  } catch (error) {
    console.error('Get guideline error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createGuideline = async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, content, severity } = req.body;

  try {
    const guideline = await prisma.guideline.create({
      data: {
        title,
        content,
        severity: severity || 'MINOR',
        updatedById: req.user!.id,
      },
      include: {
        updatedBy: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(201).json(guideline);
  } catch (error) {
    console.error('Create guideline error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateGuideline = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, content, severity } = req.body;

  try {
    const guideline = await prisma.guideline.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        severity,
        updatedById: req.user!.id,
      },
      include: {
        updatedBy: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json(guideline);
  } catch (error) {
    console.error('Update guideline error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteGuideline = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.guideline.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Guideline deleted successfully' });
  } catch (error) {
    console.error('Delete guideline error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
