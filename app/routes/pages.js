import Register from 'views/Register';

import { PersonAdd, Fingerprint } from '@material-ui/icons';
import LoginPage from '../containers/LoginPage';

// material-ui-icons

// const Demo = () => <div>Ho</div>;
const pagesRoutes = [
  // {
  //   path: '/register',
  //   name: 'Đăng kí',
  //   short: 'Đăng kí',
  //   mini: 'RP',
  //   icon: PersonAdd,
  //   component: Register,
  // },
  {
    path: '/login',
    name: 'Đăng nhập',
    short: 'Đăng nhập',
    mini: 'LP',
    icon: Fingerprint,
    component: LoginPage,
  },
  // {
  //   path: '/',
  //   name: '',
  //   short: '',
  //   mini: '',
  //   icon: Fingerprint,
  //   component: LoginPage,
  // },
  // {
  //   path: '/',
  //   redirect:true,
  //   pathTo: '/login',
  //   name: 'Home page',
  //   short: 'Pricing',
  //   mini: 'PP',
  //   icon: MonetizationOn,
  //   // component: Demo,
  // },
  // {
  //   path: '/lock-screen',
  //   name: 'Lock Screen Page',
  //   short: 'Lock',
  //   mini: 'LSP',
  //   icon: LockOpen,
  //   component: Demo,
  // },
];

export default pagesRoutes;
