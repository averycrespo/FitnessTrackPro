import React, {useState} from "react";
import ReactDOM from 'react-dom/client'
import { ThemeProvider, useColorScheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom';
import { createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Input from '@mui/material/Input'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Checkbox from '@mui/material/Checkbox'
import '../static/css/styles.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Login({customTheme}) {
    const navigate = useNavigate();
    document.title = "Login";
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const changeForm = (data) => {
        const { name, value } = data.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    //need to CACHE this instead but will use localStorage until merge
    const setUser = (data) => {
        
        const usr_id = data.user.id;
        localStorage.setItem('usr_id', usr_id);
    }

    const auth_login = () => {

        if( !formData.username.trim() || !formData.password.trim() ) {
            toast.error('You must complete all fields.');
            return;
        }
        fetch('/api/users/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: formData.username, 
                password: formData.password
            }),
        }).then(response => {
            if (!response.ok) {
                throw new Error('Login failed');
            }
            return response.json();
        })
        .then(data => {
            console.log('Login successful:', data);
            toast.success('Login successful!'); 
            setUser(data);
            navigate('/viewWorkouts');
        })
        .catch(error => {
            toast.error('Invalid login'); 
            console.error('Login error:', error.message);
        });
    }

    return (
        <>
            <Box
                sx={{
                width: '50%',
                mx: 'auto', // margin left & right
                my: 4, // margin top & bottom
                py: 3, // padding top & bottom
                px: 2, // padding left & right
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                borderRadius: 'sm',
                boxShadow: 'md',
                backgroundColor: customTheme.palette.background.Paper,
                }}
                variant="outlined"
            >
            <ToastContainer/>

                <Box>
                    <Typography level="h2" component="h2" 
                    sx={{
                        textAlign: 'center',
                        fontFamily: '"Bungee Shade", sans-serif',
                        fontWeight: '400',
                        color: customTheme.palette.primary.main,
                        WebkitTextStroke: '1px black',
                        fontSize: 'calc(3vw + 2vh)',
                        }}>
                        <b>Fitness Track Pro</b>
                    </Typography>
                </Box>
                <FormControl>
                    <FormLabel sx={{color: customTheme.palette.primary.main}}>Username</FormLabel>
                    <Input
                        // html input attribute
                        name="username"
                        type="username"
                        placeholder="bigLifter12"
                        onChange={changeForm}
                        value={formData.username}
                        required
                    />
                </FormControl>
                <FormControl>
                    <FormLabel sx={{color: customTheme.palette.primary.main}}>Password</FormLabel>
                    <Input
                        // html input attribute
                        name="password"
                        type="password"
                        placeholder="password"
                        onChange={changeForm}
                        value={formData.password}
                        required
                    />
                </FormControl>
                <Button onClick={auth_login} sx={{ mt: 1, backgroundColor: customTheme.palette.primary.main, color: customTheme.palette.background.Paper, 
                '&:hover': { color: customTheme.palette.primary.main }  }}>Log in</Button>

                <Typography
                    component="div"
                    fontSize="sm"
                    sx={{ alignSelf: 'center', color: customTheme.palette.background.default }}
                    >
                    Don&apos;t have an account? <Link href="/signup" sx={{ color: customTheme.palette.primary.main }}>Sign up</Link>
                </Typography>
            </Box>
        </>
    );

}

export default Login;