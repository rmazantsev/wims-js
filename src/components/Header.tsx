import {useContext} from "react";
import {Link, useLocation} from "react-router-dom";
import {JwtContext} from "../routes/Root";
import IdentityHeader from "./IdentityHeader";

import "./index.scss";
import classNames from "classnames";

const Header = () => {
    const {jwtResponse, setJwtResponse} = useContext(JwtContext);
    const location = useLocation();

    console.log("Header  location:", location.pathname)

    return (
        <header>
            <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
                <div className="container">
                    <Link className="navbar-brand" to="/">WIMS</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                        <ul className="navbar-nav flex-grow-1">
                            <li className={classNames('nav-item', {
                                'active': location.pathname === '/warehouses'
                            })}
                                style={{'display': jwtResponse == null ? 'none' : ''}}
                            >
                                <Link to="/warehouses" className="nav-link text-dark">Storage</Link>
                            </li>
                            <li className={classNames('nav-item', {
                                'active': location.pathname === '/items'
                            })} style={{'display': jwtResponse == null ? 'none' : ''}}>
                                <Link to="/items" className="nav-link text-dark">Items</Link>
                            </li>
                            <li className={classNames('nav-item', {
                                'active': location.pathname === '/warehousesinventory'
                            })}
                             style={{'display': jwtResponse == null ? 'none' : ''}}>
                                <Link to="/warehousesinventory" className="nav-link text-dark">Inventory</Link>
                            </li>
                            <li className={classNames('nav-item', {
                                'active': location.pathname === '/transactionhistory'
                            })} style={{'display': jwtResponse == null ? 'none' : ''}}>
                                <Link to="/transactionhistory" className="nav-link text-dark">Transaction history</Link>
                            </li>
                        </ul>
                        <ul className="navbar-nav">
                            <IdentityHeader />
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;