import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import './index.css'

import useAuthForm from "../../../hooks/useAuthForm";
import AuthContext from "../../../context/authContext";

import Title from "../../../components/title";
import Loader from "../../../components/loader";
import ValidationError from "../../../components/validation-error";


const Register = () => {

	const navigate = useNavigate();
	const {login } = useContext(AuthContext);

	const {
		formValue,
        authValue,
        isLoading,
        validationError,
        isSuccess,
        onChangeInputHandler,
        onSubmitUserRegisterHandler,
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
			<Title title="Register" />
			<div className="signup-section-wrapper">
				<div className="signup-section">
					<div className="signup-section-info">
						<h2>Welcome </h2>
						<i className="fas fa-users"></i>
						<h2>to our community.</h2>
					</div>
					<form action="#" method="POST" className="signup-form" onSubmit={onSubmitUserRegisterHandler}>
						<ul className="no-bullet">
							<li>
								<label htmlFor="username"></label>
								<input type="text" className="input-fields" id="username" name="username" placeholder="Username" defaultValue={formValue.username} onChange={onChangeInputHandler} />
								{validationError.username && <ValidationError message={validationError.username} />}
								{validationError.exists && <ValidationError message={validationError.exists} />}
							</li>
							<li>
								<label htmlFor="password"></label>
								<input type="password" className="input-fields" id="password" name="password" placeholder="Password" defaultValue={formValue.password} onChange={onChangeInputHandler} />
								{validationError.password && <ValidationError message={validationError.password} />}
							</li>
							<li>
								<label htmlFor="rePass"></label>
								<input type="password" className="input-fields" id="rePass" name="rePass" placeholder="Repeat password" defaultValue={formValue.rePass} onChange={onChangeInputHandler} />
								{validationError.rePass && <ValidationError message={validationError.rePass} />}
							</li>
							<li >
								<input type="submit" className="join-btn" name="join" alt="Join" value="Join" />
							</li>
						</ul>
					</form>
				</div>
			</div>
		</>
	)
}

export default Register;