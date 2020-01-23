import { Router, Request, Response, NextFunction } from 'express';

interface RequestWithbody extends Request {
  body: { [key: string]: string | undefined }
}

function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.session && req.session.loggedIn) {
    next();
    return;
  } 

  res.status(403);
  res.send('Not permitted');
}

const router = Router();

router.post('/login', (req: RequestWithbody, res: Response) => {
  const { email, password } = req.body;

  // hardcoded email and pass just to test it
  if (email && password && email === 'email@me.com' && password === 'pass') {
    req.session = { loggedIn: true };
    res.redirect('/');
  } else {
    res.send('Invalid email or password');
  }

});

router.get('/', (req: Request, res: Response) => {
  if (req.session && req.session.loggedIn) {
    res.send(`
      <div>
        <div>
          Logged in!
          <a href="/logout">Logout</a>
        </div>
      </div>
    `);
  } else {
    res.send(`
      <div>
        <div>
          Not logged in!!
          <a href="/login">Login</a>
        </div>
      </div>
    `);
  }
});

router.get('/logout', (req: Request, res: Response) => {
  req.session = undefined;
  res.redirect('/');
});

router.get('/protected', requireAuth, (req: Request, res: Response) => {
  res.send('Protected route, logged-in user');
})

export { router };