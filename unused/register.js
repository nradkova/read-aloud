// import { useContext } from "react";
// import { useNavigate } from "react-router-dom";

// import './index.css'

// import userService from "../../services/user";
// import AuthContext from "../../context/authContext";

// import Title from "../../components/title";
// import PageLayout from "../../components/pageLayout";


// const Register = () => {
  
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const onRegisterSubmitHandler = (e) => {
//     e.preventDefault();

//     const username = e.target.username.value;
//     const password = e.target.password.value;

//     userService.register({ username, password })
//       .then(authData => {
//         login(authData)
//         navigate('/home');
//       });
//   }

//   return (
//     <PageLayout>
//       <Title title="Register" />
//       <div className="signup-section-wrapper">
//         <div className="signup-section">
//           <div className="signup-section-info">
//             <h2>Welcome </h2>
//             <i className="fas fa-users"></i>
//             <h2>to our community.</h2>
//           </div>
//           <form action="#" method="POST" className="signup-form" onSubmit={onRegisterSubmitHandler}>
//             <ul className="no-bullet">
//               <li>
//                 <label htmlFor="username"></label>
//                 <input type="text" className="input-fields" id="username" name="username" placeholder="Username" required />
//               </li>
//               <li>
//                 <label htmlFor="password"></label>
//                 <input type="password" className="input-fields" id="password" name="password" placeholder="Password" required />
//               </li>
//               <li>
//                 <label htmlFor="rePass"></label>
//                 <input type="password" className="input-fields" id="rePass" name="rePass" placeholder="Repeat password" required />
//               </li>
//               <li >
//                 <input type="submit" className="join-btn" name="join" alt="Join" value="Join" />
//               </li>
//             </ul>
//           </form>
//         </div>
//       </div>
//     </PageLayout>
//   )
// }

// export default Register;