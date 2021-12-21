import { NextApiRequest, NextApiResponse } from 'next';

interface CustomRequest extends NextApiRequest {
  user: {
    id: number;
    username: string;
    email: string;
    photoUrl: string;
    password: string;
    salt: string;
  };
}

function handler(nextReq: NextApiRequest, res: NextApiResponse) {
  const req = nextReq as CustomRequest;
  if (req.method !== 'GET') {
    console.error('Method not allowed');
    return res.status(405).json({
      error: { message: 'Method not allowed' },
    });
  }

  if (req.user) {
    return res.status(200).json(req.user);
  } else {
    return res.status(200).json({});
  }
}

export default handler;
