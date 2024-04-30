import { Visibility, VisibilityOff, VisibilityOffOutlined } from '@mui/icons-material'
import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import 'react-phone-number-input/style.css'
import CMS from './CMS'
import $, { event } from "jquery"
import PhoneInput from 'react-phone-number-input'
import auth from '../../fireBase'
import { RecaptchaVerifier, createUserWithEmailAndPassword, signInWithPhoneNumber } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useStopwatch, useTimer } from 'react-timer-hook'
const SignUpPage = ({ tabChanger }) => {

    useEffect(() => {

    }, [])

    let nav = useNavigate()
    const [state, setState] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        password: null,
        confirmPassword: "",
    })

    const [data, setData] = useState({
        validPassword: "",
        passwordString: "",
        backToSign: false,
        otpFlag: false,
        otp: "",
        userCredential: false,
    })

    const [errorState, setErrorState] = useState({
        name: false,
        email: false,
        phoneNumber: false,
        password: false,
        confirmPassword: false,
    })

    const [confirmObj, setConfirmObj] = useState("")

    const [showPassword, setShowPassword] = useState(false)
    const [showConfPassword, setShowConfPassword] = useState(false)

    const changeHandler = (event, name) => {
        const { value } = event.target
        const newData = { ...data }
        const newState = { ...state };
        if (name === "name") {
            newState[name] = value?.toUpperCase();
        }
        else if (name === "email" || name === "confirmPassword" || name === "phoneNumber") {
            newState[name] = value;
        }
        if (name === "password") {
            if (!CMS.isNullOrEmpty(state.password) && state.password.length > 1) {
                const valid = CMS.checkPasswordValidation(state.password)
                newData.validPassword = valid
            } else {
                newData.validPassword = ""
            }
            newState[name] = value;
        }
        if (name === "otp") {
            newData[name] = value;
        }
        setData(newData)
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

    const invisibleReCaptcha = (number) => {
        console.log(number)
        const captcha = new RecaptchaVerifier(auth, 'recaptcha-container', {
            "size": "invisible",
            "callback": (response) => {
            }
        })
        return signInWithPhoneNumber(auth, number, captcha)
    }

    const submitHandler = async () => {
        const newState = { ...state }; const newErrorState = { ...errorState };
        let flag = true;
        if (CMS.isNullOrEmpty(state.name)) {
            $("#name").addClass("empty")
            newErrorState.name = true
            flag = false;
        } else {
            $("#name").removeClass("empty")
            newErrorState.name = false;
            flag = true;
        }
        if (CMS.isNullOrEmpty(state.phoneNumber)) {
            $("#phoneNumber").addClass("empty")
            newErrorState.phoneNumber = true;
        }
        else if (state.phoneNumber.length <= 10) {
            alert("Invalid Phone number")
        }
        else {
            $("#phoneNumber").removeClass("empty")
            newErrorState.phoneNumber = false;
        }
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
        if (CMS.isNullOrEmpty(state.confirmPassword)) {
            $("#confirmPassword").addClass("empty")
            newErrorState.confirmPassword = true;
            flag = false
        } else {
            const valid = CMS.checkPasswordMatchOrNot(state.password, state.confirmPassword)
            if (!valid.check) {
                setData({ passwordString: valid.content })
                return null;
            } else {
                setData({ passwordString: "" })
            }
            $("confirmPassword").removeClass("empty")
            newErrorState.confirmPassword = false;
            flag = true
        }
        const newData = { ...data }
        if (flag) {
            if (!CMS.isNullOrEmpty(state.phoneNumber)) {
                console.log("second")
                try {
                    const response = await invisibleReCaptcha(state.phoneNumber)
                    setConfirmObj(response)
                    newData.otpFlag = true;
                } catch (error) {
                    toast.error("To-many-requests")
                    return
                }
            }
            createUserWithEmailAndPassword(auth, state.email, state.password)
                .then((userCredential) => {
                    console.log(userCredential)
                })
                .catch((error) => {
                    console.log(error)
                    toast.error("Email-already-in-use")

                })
        }
        setData(newData)
        setErrorState(newErrorState)
    }
    const otpVerifierhandler = () => {
        const newData = { ...data }
        console.log(newData, "newData")
        if (CMS.isNullOrEmpty(data.otp)) {
            toast.warning("Please Enter OTP.");
            return
        }
        confirmObj.confirm(data.otp).then((result) => {
            console.log(result._tokenResponse?.isNewUser)
            if (result._tokenResponse?.isNewUser) {
                // New user, proceed with account creation or further registration steps
                setTimeout(() => {
                    nav("./home")
                }, 1000)
                toast.success("Submited Successfully!");
            }
            else {
                toast.error("Already user is logged")
            }
        })
            .catch(function (error) {
                // Handle authentication errors
                toast.warning("Invalid OTP");
                newData.backToSign = true;
            });
        setData(newData)
    }

    const onPhoneInputHandler = (value, county) => {
        const newState = { ...state };
        newState.phoneNumber = value;
        setState(newState)
    }

    // let expiryTimestamp = new Date();
    // expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 300);
    // const { seconds, pause } = useTimer({
    //     expiryTimestamp, onExpire: () => {

    //         console.warn('onExpire called')
    //     }, autoStart: true
    // })
    // let timer;
    // timer = `00:${seconds}`

    // React.useEffect(() => {
    //     if (seconds === 1) {
    //         pause();
    //         console.log('Timer stopped at 0');
    //     }
    //     // timer = null;
    // }, [seconds, pause]);

    const goToSignUp = () => {
        const newData = { ...data }
        newData.otpFlag = false;
        setData(newData)
    }
    return (
        <div>
            {!data.otpFlag ? (
                <>
                    <div className='row p-2'>
                        <div className='col'>
                            <TextField
                                name='name'
                                label="Name"
                                id="name"
                                error={errorState.name}
                                size='small'
                                fullWidth
                                value={state.name || ""}
                                onChange={(event) => changeHandler(event, "name")}
                            />
                        </div>
                    </div>
                    <div className='row p-2'>
                        <div className='col'>
                            <PhoneInput
                                id="phoneNumber"
                                defaultCountry='IN'
                                error={errorState.phoneNumber}
                                value={state.phoneNumber || ""}
                                onChange={onPhoneInputHandler || ""}
                                inputComponent={TextField}
                                smartCaret={false}
                                numberInputProps={{
                                    fullWidth: true,
                                    label: "Phone Number",
                                    inputProps: {
                                        maxLength: 11,
                                    },
                                    type: "tel",
                                    variant: "outlined",
                                    size: "small",
                                }}
                            />
                        </div>
                        <div id='recaptcha-container' className='mt-2' />
                    </div>
                    <div className='row p-2'>
                        <div className='col'>
                            <TextField
                                label="Email"
                                id="mail"
                                name="email"
                                size='small'
                                error={errorState.email}
                                fullWidth
                                value={state.email}
                                onChange={(event) => changeHandler(event, "email")}
                            />
                        </div>
                    </div>
                    <div className='row p-2'>
                        <div className=''>
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
                                <span className='text-danger'>{data?.validPassword || ""}</span>
                            </FormControl>
                        </div>
                    </div>
                    <div className='row p-2'>
                        <div className='col'>
                            <FormControl variant='outlined' sx={{ m: 0, width: "100%" }}>
                                <InputLabel htmlFor="confirmPassword" style={{ margin: "-5px" }}>Confirm Password</InputLabel>
                                <OutlinedInput
                                    id="confirmassword"
                                    type={showConfPassword ? "text" : "password"}
                                    name='confirmPassword'
                                    size='small'
                                    label="confirmPassword"
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={setShowConfPassword}
                                                onMouseDown={() => setShowConfPassword(false)}
                                                edge="end"
                                            >
                                                {!showConfPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>}
                                    error={errorState.confirmPassword}
                                    fullWidth
                                    value={state.confirmPassword || ""}
                                    onChange={(event) => changeHandler(event, "confirmPassword")}
                                />
                                <span className='text-danger'>{data.passwordString || ""}</span>

                            </FormControl>
                        </div>
                    </div>
                    <div className='row p-2'>
                        <div className='m-auto'>
                            <Button onClick={submitHandler}>submit</Button>
                        </div>
                    </div>
                </>
            )
                : (
                    <div className='row mt-2'>
                        <div className='mb-2'>
                            <input type='text' className='form-control' name="otp" id="otpvalue" value={data.otp} onChange={(event) => changeHandler(event, "otp")} />
                        </div>
                        <div className='m-auto d-flex justify-content-between'>
                            {data.backToSign && <Button className='btn btn-link' onClick={goToSignUp}>Back to SignUp</Button>}
                            <Button variant='contained' onClick={otpVerifierhandler}>Verify Otp</Button>
                            {/* {seconds === 1 ? null : timer} */}
                        </div>

                    </div>

                )}
            <ToastContainer />
        </div>
    )
}

export default SignUpPage