import { useEffect } from 'react';
import {useNavigate} from "react-router-dom";

const config = require('../config.json');


export default function SongsPage() {
const navigation = useNavigate();

    function logout() {
        fetch(`http://${config.server_host}:${config.server_port}/loggingOut`)
        .then(response => response.json())
        .then(navigation('/'))
    }
    useEffect(() => {
        logout();
    });
}