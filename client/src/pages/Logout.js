import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ReactSession } from 'react-client-session';

export default function SongsPage() {
    const navigation = useNavigate();

    function logout() {
        ReactSession.remove('user');
        const isLoggedIn = ReactSession.get('user');
        navigation('/')
    }
    useEffect(() => {

        logout();
    });



}