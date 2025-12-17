import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAllForms = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const forms = await prisma.inspectionForm.findMany({
      where: { isActive: true },
      include: {
        createdBy: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(forms);
  } catch (error) {
    console.error('Get forms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getForm = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const form = await prisma.inspectionForm.findUnique({
      where: { id: parseInt(id) },
      include: {
        createdBy: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!form) {
      res.status(404).json({ message: 'Form not found' });
      return;
    }

    res.json(form);
  } catch (error) {
    console.error('Get form error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createForm = async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, questions } = req.body;

  try {
    const form = await prisma.inspectionForm.create({
      data: {
        title,
        questions: JSON.stringify(questions),
        createdById: req.user!.id,
      },
      include: {
        createdBy: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(201).json(form);
  } catch (error) {
    console.error('Create form error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateForm = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, questions, isActive } = req.body;

  try {
    const updateData: any = {};
    if (title) updateData.title = title;
    if (questions) updateData.questions = JSON.stringify(questions);
    if (typeof isActive !== 'undefined') updateData.isActive = isActive;

    const form = await prisma.inspectionForm.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        createdBy: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json(form);
  } catch (error) {
    console.error('Update form error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteForm = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await prisma.inspectionForm.update({
      where: { id: parseInt(id) },
      data: { isActive: false },
    });

    res.json({ message: 'Form deactivated successfully' });
  } catch (error) {
    console.error('Delete form error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
