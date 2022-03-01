import { useContext,useEffect } from "react";
import { useNavigate } from "react-router-dom";

import './index.css';

import useAuthForm from "../../../hooks/useAuthForm";
import AuthContext from "../../../context/authContext";

import Title from "../../../components/title";
import Loader from "../../../components/loader";
import ValidationError from "../../../components/validation-error";


const Login = () => {

	const navigate = useNavigate();
	const {login} = useContext(AuthContext);

	const {
        authValue,
        isLoading,
        validationError,
        isSuccess,
		onChangeInputHandler,
		onSubmitUserLoginHandler
	} = useAuthForm();

	useEffect(() => {
		if (isSuccess) {
			login(authValue);
			navigate("/home", { replace: true });
		}
	},[isSuccess])


	if (isLoading) {
		return (
			<>
				<Loader />
			</>
		)
	}

	return (
		<>
			<Title title="Login" />
			<div className="signin-section-wrapper">
				<div className="signin-section">
					<div className="signin-section-info">
						<h2>Happy </h2>
						<i className="fas fa-users"></i>
						<h2>to have you here.</h2>
					</div>
					<form action="#" method="POST" className="signup-form" onSubmit={onSubmitUserLoginHandler}>
						<ul className="no-bullet">
							<li>
								<label htmlFor="username"></label>
								<input type="text" className="input-fields" id="username" name="username" placeholder="Username"  onChange={onChangeInputHandler}/>
								{validationError.username && <ValidationError message={validationError.username}/>}
							</li>
							<li>
								<label htmlFor="password"></label>
								<input type="password" className="input-fields" id="password" name="password" placeholder="Password" onChange={onChangeInputHandler} />
								{validationError.password && <ValidationError message={validationError.password}/>}
							</li>
							<li >
								<input type="submit" className="join-btn" name="join" alt="Join" value="Join" />
								{validationError.credentials && <ValidationError message={validationError.credentials}/>}
							</li>
						</ul>
					</form>
				</div>
			</div>
		</>
	)
}

export default Login;