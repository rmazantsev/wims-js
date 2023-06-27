import { useContext } from "react";
import { Link } from "react-router-dom";
import { JwtContext } from "../Root";
import jwt_decode from "jwt-decode";

const Info = () => {
    const { jwtResponse, setJwtResponse } = useContext(JwtContext);

    return (
        null
        // <>
        //     <dl className="row">
        //         <dt className="col-sm-2">
        //             jwt decoded
        //         </dt>
        //         <dd className="col-sm-10 text-break">
        //             <pre>
        //                 {jwtResponse ? JSON.stringify(jwt_decode(jwtResponse?.jwt), null, 4) : "no jwt"}
        //             </pre>
        //         </dd>

        //         <dt className="col-sm-2">
        //             jwt
        //         </dt>
        //         <dd className="col-sm-10 text-break">
        //             {jwtResponse?.jwt}
        //         </dd>
        //         <dt className="col-sm-2">
        //             refreshToken
        //         </dt>
        //         <dd className="col-sm-10">
        //             {jwtResponse?.refreshToken}
        //         </dd>
        //     </dl>
        // </>
    );
}

export default Info;