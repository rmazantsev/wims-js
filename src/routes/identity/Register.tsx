import { MouseEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IRegisterData } from "../../dto/IRgeisterData";
import { IdentityService } from "../../services/IdentityService";
import { JwtContext } from "../Root";
import RegisterFormView from "./RegisterFormView";

const Register = () => {
    const navigate = useNavigate();

    const [values, setInput] = useState({
        password: "",
        confirmPassword: "",
        email: "",
        firstName: "",
        lastName: "",
    } as IRegisterData);

    const [validationErrors, setValidationErrors] = useState([] as string[]);

    const handleChange = (target: EventTarget & HTMLInputElement) => {
        // debugger;
        // console.log(target.name, target.value, target.type)

        setInput({ ...values, [target.name]: target.value });
    }

    const {jwtResponse, setJwtResponse} = useContext(JwtContext);

    const identityService = new IdentityService();

    const onSubmit = async (event: MouseEvent) => {
        console.log('onSubmit', event);
        event.preventDefault();

        if (values.firstName.length == 0 || values.lastName.length == 0 || values.email.length == 0 || values.password.length == 0 || values.password != values.confirmPassword) {
            setValidationErrors(["Bad input values!"]);
            return;
        }
        // remove errors
        setValidationErrors([]);

        var jwtData = await identityService.register(values);
        if (jwtData == undefined) {
            setValidationErrors(['Bad request']);
            return;
        } 

        if (setJwtResponse){
            setJwtResponse(jwtData);
            navigate("/");
       }

    }

    return (
        <RegisterFormView values={values} handleChange={handleChange} onSubmit={onSubmit} validationErrors={validationErrors} />
    );
}

export default Register;