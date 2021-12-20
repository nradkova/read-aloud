import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import './index.css'

import userService from "../../../services/user";
import AuthContext from "../../../context/authContext";

import PageLayout from "../../../components/page-layout";


const Logout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmitLogoutHandler = (e) => {
    userService.logout()
      .then(() => {
        logout()
        navigate("/home", { replace: true });
      });
  }


  return (
    <PageLayout>
     <h1 className="page-title-logout">Logout</h1>
      <div className="signout-section-wrapper">
        <div className="signout-section">
          <div className="signout-section-text">
            <h2>You are about to unsubscribe  </h2>
            <h3>&gt;&gt;&gt; READ ALOUD &lt;&lt;&lt;</h3>
          </div>
          <input type="submit" className="logout-btn" onClick={onSubmitLogoutHandler} value="Confirm" />
        </div>
      </div>
    </PageLayout>
  )
}

export default Logout;