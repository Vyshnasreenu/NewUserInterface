import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import $, { data, event } from 'jquery'
import CMS from './CMS'
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth'
import auth from '../../fireBase'
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    let nav = useNavigate()

    const [state, setState] = useState({
        email: "",
        password: "",
    })

    const [errorState, setErrorState] = useState({
        email: false,
        password: false,
    })


    const changeHandler = (event, name) => {
        const { value } = event.target
        const newState = { ...state };
        if (name === "email" || name === "password") {
            newState[name] = value;
        }
        setState(newState)

    }
    const validateEmail = (validemail) => {
        var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        if (validemail.match(regex)) {
            return true;
        } else {
            alert("Invalid email address")
            return false;
        }
    }

    const loginHandler = () => {
        const newErrorState = { ...errorState };
        let flag = true;
        if (CMS.isNullOrEmpty(state.email)) {
            $("#mail").addClass("empty")
            newErrorState.email = true;
            flag = false;
        }
        else {
            if (validateEmail(state.email)) {
                $("#mail").removeClass("empty")
                newErrorState.email = false;
                flag = true;
            }
        }
        if (CMS.isNullOrEmpty(state.password)) {
            $("#password").addClass("empty")
            newErrorState.password = true;
            flag = false;
        } else {
            $("#password").removeClass("empty")
            newErrorState.password = false
            flag = true;
        }
        if (flag) {
            try {
                signInWithEmailAndPassword(auth, state.email, state.password)
                    .then((userCredential) => {
                        // Signed in 
                        const user = userCredential.user;
                        toast.success("Login Successfully")
                        setTimeout(() => {
                            nav("./home")
                        }, 2000)
                        // ...
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        toast.error("Invalid Email Id and password")
                    });
            } catch (error) { }
        }
        setErrorState(newErrorState)
    }

    const resetPassword = () => {
        try {
            if (!CMS.isNullOrEmpty(state.email)) {
                sendPasswordResetEmail(auth, state.email).then(() => {
                    toast.success("Email verification sent!")
                })
            } else {
                toast.warning("Enter your current email!")
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className=''>
            <div className=' p-2'>
                <div className='row p-2'>
                    <div className='col'>
                        <TextField
                            id="mail"
                            label="Email"
                            name="email"
                            error={errorState.email}
                            size='small'
                            value={state.email}
                            fullWidth
                            onChange={(event) => changeHandler(event, "email")} />
                    </div>
                </div>
                <div className='row p-2'>
                    <div className='col'>
                        <FormControl variant='outlined' sx={{ m: 0, width: "100%" }}>
                            <InputLabel htmlFor="password" style={{ margin: "-2px" }}>Password</InputLabel>
                            <OutlinedInput
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name='password'
                                size='small'
                                label="Password"
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={setShowPassword}
                                            onMouseDown={() => setShowPassword(false)}
                                            edge="end"
                                        >
                                            {!showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>}
                                error={errorState.password}
                                fullWidth
                                value={state.password || ""}
                                onChange={(event) => changeHandler(event, "password")}
                            />
                        </FormControl>
                        <span role='button' tabIndex={0} className='btn text-primary' onClick={resetPassword}>Forgot password</span>
                    </div>
                </div>
                <div className='row p-2'>
                    <div className='m-auto'>
                        <Button variant='contained' color='primary' onClick={loginHandler}>Login</Button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default LoginPage