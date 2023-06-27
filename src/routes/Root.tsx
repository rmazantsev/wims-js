import {createContext, useState} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import {useLocalStorage} from 'usehooks-ts';

import Footer from "../components/Footer";
import Header from "../components/Header";
import {IJWTResponse} from "../dto/IJWTResponse";
import {MantineProvider} from '@mantine/core';
import {Notifications} from '@mantine/notifications';

export const JwtContext = createContext<{
    jwtResponse: IJWTResponse | null,
    setJwtResponse: ((data: IJWTResponse | null) => void) | null
}>({jwtResponse: null, setJwtResponse: null});

const Root = () => {
    const [jwtResponse, setJwtResponse] = useLocalStorage<IJWTResponse | null>('jwtResponse', null);

    return (
        <JwtContext.Provider value={{jwtResponse, setJwtResponse}}>

            <Header />
            <MantineProvider withNormalizeCSS withGlobalStyles>
                <Notifications />
                <div className="container" style={{marginBottom: '100px'}}>
                    <main role="main" className="pb-3">
                        <Outlet />
                    </main>
                </div>
            </MantineProvider>

            <Footer />
        </JwtContext.Provider>
    );
}

export default Root;