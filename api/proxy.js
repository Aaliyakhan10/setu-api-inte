import fetch from 'node-fetch';
 const getCredentials = () => {
    return {
      xClientId: localStorage.getItem('clientId'),
      xClientSecret: localStorage.getItem('clientSecret'),
      xProductInstanceId: localStorage.getItem('productInstanceId'),
    };
  };

export default async function handler(req, res) {
  try {
     const { xClientId, xClientSecret, xProductInstanceId } = getCredentials();
    
    const { proxy } = req.query;
    const path = proxy.join('/');

    // Construct external API URL
    const apiUrl = `https://dg-sandbox.setu.co/api/${path}`;

    // Forward request to external API
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
         'x-client-id': xClientId,
            'x-client-secret': xClientSecret,
            'x-product-instance-id': xProductInstanceId,
        
        'Content-Type': 'application/json',
        
      },
      body: ['POST', 'PUT', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined,
    });

    
    res.status(response.status);

    
    const data = await response.text();

    
    try {
      res.json(JSON.parse(data));
    } catch {
      res.send(data);
    }

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
