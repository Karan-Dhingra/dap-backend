const sendEmail = require('./sendEmail')

const sendPaymentConfirmation = async ({
    userName,
    email,
    quantity,
    amount
}) => {    
    return sendEmail({
        to: email,
        subject: 'Payment Confirmation',
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0 " />
                <meta name="format-detection" content="telephone=no" />
                <title>Chickey Chik</title>
            </head>
            
            <body style="margin: 0; padding: 0">
                <!-- <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">
                    Hello, and welcome to 
                    </span> -->
            
                <table
                align="center"
                width="650"
                border="0"
                cellspacing="0"
                cellpadding="0"
                bgcolor="#141416"
                >
                <tr>
                    <td valign="top" bgcolor="#141416" width="100%">
                    <table
                        width="650"
                        role="content-container"
                        class="outer"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                    >
                        <tr>
                        <td>
                            <tr>
                            <td
                                style="
                                padding-top: 30px;
                                padding-bottom: 30px;
                                text-align: center;
                                border-bottom: 1px solid #333335;
                                "
                            >
                                <img
                                src="https://www.chickeychik.com/images/logo.png"
                                alt="chickeychik"
                                />
                            </td>
                            </tr>
                        </td>
                        </tr>
                    </table>
                    </td>
                </tr>
                <tr>
                    <table
                    align="center"
                    width="650"
                    border="0"
                    cellspacing="0"
                    cellpadding="0"
                    bgcolor="#141416"
                    >
                    <tr>
                        <td style="padding-top: 50px; padding-bottom: 30px">
                        <table
                            width="650"
                            align="center"
                            role="content-container"
                            class="outer"
                            align="center"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                        >
                            <tr>
                            <td>
                                <table
                                width="480"
                                align="center"
                                role="content-container"
                                class="outer"
                                align="center"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                                >
                                <tr>
                                    <td>
                                    <h1
                                        style="
                                        font-family: Arial, Helvetica, sans-serif;
                                        font-size: 30px;
                                        font-weight: bold;
                                        text-align: left;
                                        color: #ffd84d;
                                        margin-top: 0px;
                                        margin-bottom: 0;
                                        line-height: 22px;
                                        "
                                    >
                                        Purchase confirmation
                                    </h1>
                                    <p
                                        style="
                                        font-family: Arial, Helvetica, sans-serif;
                                        font-size: 16px;
                                        font-weight: 400;
                                        text-align: left;
                                        color: #ffffff;
                                        margin-top: 20px;
                                        margin-bottom: 0;
                                        line-height: 22px;
                                        "
                                    >
                                        You have received ${amount} Chik Token
                                    </p>
                                    </td>
                                </tr>
                                <tr>
                                    <table
                                    align="center"
                                    width="480"
                                    cellpadding="0"
                                    cellspacing="0"
                                    border="0"
                                    >
                                    <tr>
                                        <td
                                        style="
                                            padding-top: 25px;
                                            padding-bottom: 20px;
                                            width: 160px;
                                        "
                                        >
                                        <table align="center" valign="center">
                                            <tr>
                                            <p
                                                style="
                                                font-family: Arial, Helvetica, sans-serif;
                                                font-size: 16px;
                                                font-weight: 400;
                                                text-align: left;
                                                color: #ffffff;
                                                margin-top: 20px;
                                                margin-bottom: 0;
                                                line-height: 22px;
                                                "
                                            >
                                                Username :
                                            </p>
                                            <p
                                                style="
                                                font-family: Arial, Helvetica, sans-serif;
                                                font-size: 16px;
                                                font-weight: 400;
                                                text-align: left;
                                                color: #ffffff;
                                                margin-top: 20px;
                                                margin-bottom: 0;
                                                line-height: 22px;
                                                "
                                            >
                                                Quantity :
                                            </p>
                                            <p
                                                style="
                                                font-family: Arial, Helvetica, sans-serif;
                                                font-size: 16px;
                                                font-weight: 400;
                                                text-align: left;
                                                color: #ffffff;
                                                margin-top: 20px;
                                                margin-bottom: 0;
                                                line-height: 22px;
                                                "
                                            >
                                                Deposit time :
                                            </p>
                                            </tr>
                                        </table>
                                        </td>
                                        <td style="padding-top: 25px; padding-bottom: 20px">
                                        <table align="center" valign="center">
                                            <tr>
                                            <p
                                                style="
                                                font-family: Arial, Helvetica, sans-serif;
                                                font-size: 16px;
                                                font-weight: 400;
                                                text-align: left;
                                                color: #ffffff;
                                                margin-top: 20px;
                                                margin-bottom: 0;
                                                line-height: 22px;
                                                "
                                            >
                                                <a
                                                style="color: #ffffff"
                                                href="mailto:${email}"
                                                >
                                                ${email}</a
                                                >
                                            </p>
                                            <p
                                                style="
                                                font-family: Arial, Helvetica, sans-serif;
                                                font-size: 16px;
                                                font-weight: 400;
                                                text-align: left;
                                                color: #ffffff;
                                                margin-top: 20px;
                                                margin-bottom: 0;
                                                line-height: 22px;
                                                "
                                            >
                                                ${quantity}
                                            </p>
                                            <p
                                                style="
                                                font-family: Arial, Helvetica, sans-serif;
                                                font-size: 16px;
                                                font-weight: 400;
                                                text-align: left;
                                                color: #ffffff;
                                                margin-top: 20px;
                                                margin-bottom: 0;
                                                line-height: 22px;
                                                "
                                            >
                                                ${new Date().getTime()}
                                            </p>
                                            </tr>
                                        </table>
                                        </td>
                                    </tr>
                                    </table>
                                </tr>
                                </table>
                            </td>
                            </tr>
                            <tr>
                            <td valign="top" bgcolor="#0c0c0c" width="100%">
                                <table
                                width="650"
                                align="center"
                                role="content-container"
                                class="outer"
                                align="center"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                                >
                                <tr>
                                    <td>
                                    <tr>
                                        <table
                                        align="center"
                                        width="480"
                                        valign="center"
                                        cellspacing="0"
                                        cellpadding="0"
                                        style="margin-top: 0px; margin-bottom: 0px"
                                        >
                                        <tr>
                                            <td
                                            style="
                                                padding-top: 50px;
                                                padding-bottom: 25px;
                                                background-color: #0c0c0c;
                                            "
                                            >
                                            <table
                                                align="center"
                                                valign="center"
                                                cellspacing="0"
                                                cellpadding="0"
                                                width="350"
                                            >
                                                <tr>
                                                <td width="45">
                                                    <a
                                                    href="https://www.reddit.com/r/gamepay/"
                                                    target="_blank"
                                                    ><img
                                                        style="display: block"
                                                        src="https://www.chickeychik.com/notification-mail/redit.png"
                                                        alt="Redit"
                                                    /></a>
                                                </td>
                                                <td width="45">
                                                    <a
                                                    href="https://www.instagram.com/chickeychikofficial"
                                                    target="_blank"
                                                    ><img
                                                        style="display: block"
                                                        src="https://www.chickeychik.com/notification-mail/instagram.png"
                                                        alt="Instagram"
                                                    /></a>
                                                </td>
                                                <td width="45">
                                                    <a
                                                    href="https://www.pinterest.com/chickeychikofficial"
                                                    target="_blank"
                                                    ><img
                                                        style="display: block"
                                                        src="https://www.chickeychik.com/notification-mail/pintrest.png"
                                                        alt="pintrest"
                                                    /></a>
                                                </td>
                                                <td width="45">
                                                    <a
                                                    href="https://www.facebook.com/Chickeychikofficial/"
                                                    target="_blank"
                                                    ><img
                                                        style="display: block"
                                                        src="https://www.chickeychik.com/notification-mail/facebook.png"
                                                        alt="facebook"
                                                    /></a>
                                                </td>
                                                <td width="45">
                                                    <a
                                                    href="https://vm.tiktok.com/TTPdkqefwv"
                                                    target="_blank"
                                                    ><img
                                                        style="display: block"
                                                        src="https://www.chickeychik.com/notification-mail/tiktok.png"
                                                        alt="tiktok"
                                                    /></a>
                                                </td>
                                                <td width="45">
                                                    <a
                                                    href="https://twitter.com/OfficialChickey"
                                                    target="_blank"
                                                    ><img
                                                        style="display: block"
                                                        src="https://www.chickeychik.com/notification-mail/twitter.png"
                                                        alt="twitter"
                                                    /></a>
                                                </td>
                                                <td width="45">
                                                    <a
                                                    href="https://www.youtube.com/channel/UCN_LNU5EaXrrbzKKtDIKwiQ/"
                                                    target="_blank"
                                                    ><img
                                                        style="display: block"
                                                        src="https://www.chickeychik.com/notification-mail/youtube.png"
                                                        alt="youtube"
                                                    /></a>
                                                </td>
                                                <td width="45">
                                                    <a
                                                    href="https://t.me/chickeychikofficial"
                                                    target="_blank"
                                                    ><img
                                                        style="display: block"
                                                        src="https://www.chickeychik.com/notification-mail/telegram.png"
                                                        alt="telegram"
                                                    /></a>
                                                </td>
                                                </tr>
                                            </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                            <hr
                                                style="
                                                width: 250px;
                                                border-color: #4d4f66;
                                                margin-top: 20px;
                                                "
                                            />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                            valign="center"
                                            style="
                                                padding-top: 25px;
                                                padding-bottom: 30px;
                                            "
                                            >
                                            <table
                                                align="center"
                                                valign="center"
                                                style="width: 430px; padding-left: 25px"
                                            >
                                                <tr>
                                                <td align="center">
                                                    <a
                                                    href="https://www.chickeychik.com/"
                                                    target="_blank"
                                                    style="
                                                        font-family: Arial, Helvetica,
                                                        sans-serif;
                                                        font-size: 16px;
                                                        color: #b6b6b6;
                                                        text-decoration: none;
                                                    "
                                                    >Visit Us</a
                                                    >
                                                </td>
                                                <td align="center">
                                                    <a
                                                    href="https://www.chickeychik.com/terms-use.html"
                                                    target="_blank"
                                                    style="
                                                        font-family: Arial, Helvetica,
                                                        sans-serif;
                                                        font-size: 16px;
                                                        color: #b6b6b6;
                                                        text-decoration: none;
                                                    "
                                                    >Terms of Use</a
                                                    >
                                                </td>
                                                <td align="center">
                                                    <a
                                                    href="https://www.chickeychik.com/privacy-policy.html"
                                                    target="_blank "
                                                    style="
                                                        font-family: Arial, Helvetica,
                                                        sans-serif;
                                                        font-size: 16px;
                                                        color: #b6b6b6;
                                                        text-decoration: none;
                                                    "
                                                    >Privacy Policy</a
                                                    >
                                                </td>
                                                </tr>
                                            </table>
                                            </td>
                                        </tr>
                                        </table>
                                    </tr>
                                    </td>
                                </tr>
                                </table>
                            </td>
                            </tr>
                        </table>
                        </td>
                    </tr>
                    </table>
                </tr>
                <tr>
                    <table
                    align="center"
                    width="650"
                    border="0"
                    cellspacing="0"
                    cellpadding="0"
                    bgcolor="#e9eff5"
                    >
                    <tr>
                        <td style="padding-top: 30px; padding-bottom: 30px">
                        <p
                            style="
                            font-family: Arial, Helvetica, sans-serif;
                            font-size: 16px;
                            font-weight: 400;
                            color: #030626;
                            margin: 0;
                            text-align: center;
                            "
                        >
                            @2022 Chickeychik, All rights reserved
                        </p>
                        </td>
                    </tr>
                    </table>
                </tr>
                </table>
            </body>
            </html>
        `
    })
}

export default sendPaymentConfirmation