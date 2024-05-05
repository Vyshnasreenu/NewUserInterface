import React, { useState } from 'react'
import './HomeStyles.css'
import { Box, Button, Tab, Tabs, TextField } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import SignUpPage from './SignUpPage'
import LoginPage from './LoginPage'
import NoticePage from './NoticePage'
const LandingPage = () => {

    const [changeTab, setChangeTab] = useState("1")

    const tabChanger = (value, newValue) => {
        setChangeTab(newValue)
    }

    const loginAccountHandler = (value) => {
        setChangeTab("2")
    }


    return (
        <div>
            <div className='row'>
                <div className='col'>
                    <div className='row' style={{ height: "99vh", background: "orange", position: "", width: "100%" }}>
                        <div className='col-md-7'>
                            <NoticePage />
                        </div>
                        <div className='col-md-4 m-auto bg-white' style={{ borderRadius: "10px" }}>
                            <div className='p-3'>
                                <div className=''>
                                    <TabContext value={changeTab}>
                                        <Box sx={{ borderBottom: "1" }}>
                                            <Tabs onChange={tabChanger} value={changeTab}>
                                                <Tab label="Sign Up" value="1" />
                                                <Tab label="Login" value="2" />
                                            </Tabs>
                                        </Box>
                                        <TabPanel value="1">
                                            <SignUpPage tabChanger={loginAccountHandler} />
                                            <div className='row p-2'>
                                                <span className='text-primary' role='button'  tabIndex={0} onClick={() => loginAccountHandler()}>Already have an account? Login</span>
                                            </div>
                                        </TabPanel>
                                        <TabPanel value="2">
                                            <LoginPage />
                                        </TabPanel>
                                    </TabContext>
                                </div>
                                {/* <div className='row p-2 m-auto'>
                                    <div className='col-md-4'>
                                        <Button variant='text' color='info'>Facebook</Button>
                                    </div>
                                    <div className='col-md-4'>
                                        <Button variant='text' color='info'>Google</Button>
                                    </div>
                                    <div className='col-md-4'>
                                        <Button variant='text' color='info'>Twitter</Button>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default LandingPage