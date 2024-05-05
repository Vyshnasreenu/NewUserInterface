import React from 'react'

const NoticePage = () => {
    return (
        <div className=' m-3'
            style={{
                height: "400px",
                display: "flex",
                justifyContent: "start",
                alignItems: "center"
            }}>
            <div className='row '>
                <h4 className='text-start'>INSTRUCTIONS:-</h4>
                <div >
                    <p className='notice-content'>1. Give Proper Mobile Number and Email, Otherwise you won't get any kind of notication and emails.</p>
                    <p className='notice-content'>2. After submit it's take few minutes to verify the captch, Don't click again submit button.</p>
                    <p className='notice-content'>3. Click on Forgot password, Give your current email.</p>
                </div>
            </div>
            <div className='row'>
            </div>
        </div>
    )
}

export default NoticePage