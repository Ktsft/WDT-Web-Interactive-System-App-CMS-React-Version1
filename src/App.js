// // import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

// import { UserProvider } from '../src/profile/userProvider';
// import logo from './logo.svg';
// import './App.css';

import { Login, Dashboard, Verify } from "./profile/index";

// // function App() {
// //   return (
// //     <UserProvider>
// //       {/* <Router>
// //         <Route path="/login">
// //           <Login />
// //         </Route>
// //         <Route path="/dashboard">
// //           <Dashboard />
// //         </Route>
// //         <Route path="/Verify">
// //           <Verify />
// //         </Route>
// //         <Route exact path="/">
// //           <Redirect to="/login" />
// //         </Route>
// //       </Router> */}
// //       <Router>
// //         <Route path="/login">
// //           <Login />
// //         </Route>
// //         <Route path="/dashboard">
// //           <Dashboard />
// //         </Route>
// //         <Route path="/Verify">
// //           <Verify />
// //         </Route>
// //         <Route exact path="/">
// //           <Redirect to="/login" />
// //         </Route>
// //       </Router>
// //     </UserProvider>
// //   );
// // }


// function App() {
//   return (
//     <div>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         {/* <Route path="/game" element={<Game />} />
//         <Route path="/leaderboard" element={<Leaderboard />} /> */}
//       </Routes>
//     </div>
//   );
// }

// export default App;


function App() {
  return (
  <>
    <Routes>
      <Route path ="/" element={<Login />} />
      <Route path ="/login" element={<Login />} />
      <Route path ="/dashboard" element={<Dashboard />} />
      <Route path ="/verify/:id" element={<Verify />} />
    </Routes>
</>
  );
}


export default App;
