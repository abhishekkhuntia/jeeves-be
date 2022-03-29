'use strict';
import sendGrid from '@sendgrid/mail';

sendGrid.setApiKey(process.env.SENDGRID_API_KEY || '')
export function sendInvitationMail(userName: string, emailId: string){
    const signupMsg = {
        to: emailId,
        from: process.env.SENDGRID_EMAIL || '', // Change to your verified sender
        subject: 'Account creation Successful',
        text: `Hi${userName}, your account has been created successfully.`,
        html: `Hi <strong>${userName}</strong><br/><p>Your account has been created successfully. <br/> Proceed to login.</p>`,
    };
    sendGrid
    .send(signupMsg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    })
}