import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendVerificationEmail = async (email, token) => {
    // const url = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    //
    // await transporter.sendMail({
    //     to: email,
    //     subject: 'Verify your email',
    //     html: `Click <a href="${url}">here</a> to verify your email.`,
    // });

    console.log(email, token)
};

