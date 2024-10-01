import React, {useState} from "react";
import { ThemeProvider, useColorScheme } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import CssBaseline from '@mui/material/CssBaseline'
import Input from '@mui/material/Input'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function SignUp({customTheme}) {
    document.title = "Sign Up";

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmpassword: '',
    })

    const changeForm = (data) => {
        const { name, value } = data.target;
        setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        }));
    };

    const accountSubmit = () => {
        if(formData.password !== formData.confirmpassword) {
            toast.error('Passwords do not match.');
            return;
        } else if( !formData.username || !formData.password || !formData.confirmpassword) {
            toast.error('You must complete all fields.');
            return;
        }
        fetch(`/api/users/`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: formData.username,
                password: formData.password,
            })
        }).then((res) => {
            if (res.status === 404) {
                alert("An error occurred while creating user data");
            } else if (!res.ok) {
                alert("An error occurred while posting user data");
            } else {
                res.json().then((resObject) => {
                    toast.success('Account created successfully!');
                    window.location.href = resObject.redirectUrl;
                });
            }
        });


    }
    return (
        <>
            <Paper
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

                <Typography            
                    fontSize = '2rem'
                >
                    Create a New Account!
                </Typography>
                Come Join the Fitness Track Community! Already have one? 
                <Typography
                    component="div"
                    fontSize="sm"
                    sx={{ alignSelf: 'left',color: customTheme.palette.background.default,
                    '&:hover': {
                        color: '#14D11A', 
                        textDecorationColor: '#14D11A',
                        textDecoration: 'underline',
                    },
                    py: '0.10rem',
                    }}
                    >
                    <Link href="/login" sx={{color: customTheme.palette.primary.main}}>Sign in here. </Link>
                </Typography>
                Let's set up your account. 
                <FormControl>
                    <FormLabel sx={{color: customTheme.palette.primary.main}}>Username</FormLabel>
                    <Input
                        // html input attribute
                        name="username"
                        type="username"
                        placeholder="benchpresslover06"
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

                <FormControl>
                    <FormLabel sx={{color: customTheme.palette.primary.main}}>Confirm Password</FormLabel>
                    <Input
                        name="confirmpassword"
                        type="password"
                        placeholder="password"
                        onChange={changeForm}
                        value={formData.confirmpassword}
                        required
                    />
                </FormControl>

                <Button type="submit" onClick={accountSubmit} sx={{ mt: 1, color: customTheme.palette.background.default, backgroundColor: customTheme.palette.primary.main }}>Create Account</Button>

            </Paper>
        </>
    );
}

export default SignUp;