import {useContext} from "react";
import {Link, useNavigate} from "react-router-dom";
import {JwtContext} from "../routes/Root";
import {IdentityService} from "../services/IdentityService";
import jwt_decode from "jwt-decode";

const IdentityHeader = () => {
    const {jwtResponse, setJwtResponse} = useContext(JwtContext);
    const navigate = useNavigate();
    const identityService = new IdentityService();

    const logout = () => {
        if (jwtResponse)
            identityService.logout(jwtResponse).then(response => {
                if (setJwtResponse)
                    setJwtResponse(null);
                navigate("/");
            });
    }

    if (jwtResponse) {
        let jwtObject: any = jwt_decode(jwtResponse.jwt);

        return (
            <>
                <li className="nav-item">
                    <Link to="/" className="nav-link text-dark">
                        <UserInfo jwtObject={jwtObject} />
                    </Link>
                </li>
                <li className="nav-item">
                    <a onClick={(e) => {
                        e.preventDefault();
                        logout();
                    }} className="nav-link text-dark" href="#">Logout</a>
                </li>
            </>
        );
    }
    return (
        <>
            <li className="nav-item">
                <Link to="register" className="nav-link text-dark">Register</Link>
            </li>
            <li className="nav-item">
                <Link to="login" className="nav-link text-dark">Login</Link>
            </li>
        </>
    );
}

interface IUserInfoProps {
    jwtObject: any
}

const UserInfo = (props: IUserInfoProps) => {
    return (
        <>
            {props.jwtObject['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'] + ' '}
            {props.jwtObject['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'] + ' '}
            ({props.jwtObject['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']})
            {' '}
            Role:{' '}
            <span style={{color: 'red'}}>
                {props.jwtObject['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']}
            </span>
        </>
    );
}

export default IdentityHeader;