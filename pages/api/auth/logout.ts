import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    console.error('Method not allowed');
    return res.status(405).json({
      error: { message: 'Method not allowed' },
    });
  }

  res.status(204).send('');
}

export default handler;
