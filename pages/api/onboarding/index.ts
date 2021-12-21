import { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../../../db/models';
import { CustomRequest, OnboardingSteps } from '../../../types';

const steps: OnboardingSteps = [
  [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
    },
    {
      name: 'country',
      label: 'Country',
      type: 'text',
    },
    {
      name: 'bio',
      label: 'Bio',
      type: 'multiline-text',
    },
  ],
  [
    {
      name: 'receiveNotifications',
      label:
        'Would you like to receive email notifications for new messages when logged out?',
      type: 'yes-no',
      required: true,
    },
    {
      name: 'receiveUpdates',
      label: 'Would you like to receive product updates via email?',
      type: 'yes-no',
      required: true,
    },
  ],
];

async function handler(nextReq: NextApiRequest, res: NextApiResponse) {
  const req = nextReq as CustomRequest;
  if (req.method === 'GET') {
    if (!req.user) {
      return res.status(401).json({});
    }
    return res.status(200).json({ steps });
  } else if (req.method === 'POST') {
    if (!req.user) {
      return res.status(401).json({});
    }

    const steps: OnboardingSteps = req.body.steps;
    const fieldsToUpdate: { [fieldName: string]: any } = {};
    steps.forEach((step) => {
      step.forEach((field) => {
        fieldsToUpdate[field.name] = field.value;
      });
    });

    fieldsToUpdate.completedOnboarding = true;
    User.update(fieldsToUpdate, {
      where: {
        id: req.user.id,
      },
    });

    res.status(201).json({});
  } else {
    console.error('Method not allowed');
    return res.status(405).json({
      error: { message: 'Method not allowed' },
    });
  }
}

export default handler;
