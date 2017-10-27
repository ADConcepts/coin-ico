<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <title>Coin-ICO</title>

    <style type="text/css">

        body {
            font-family: Trebuchet MS, sans-serif;
        }

        a {
            text-decoration: none !important;
        }

        .tb-bg {
            background-color: #f8f8f8;
        }

        .title {

        }

        .title td {
            color: #000000;
        }

        .title td p {

            margin: 5px 0;
            font-size: 24px;
            font-weight: bold;
            font-family: Trebuchet MS, sans-serif;
        }

        .title2 td {
            color: #7d7d7d;
        }

        .title2 td p {
            margin: 30px 0 10px 0;
        }

        .title3 td {

            color: #000000
        }

        .title3 td p {

            margin: 10px 0;
        }

        .btn1 {
            background-color: #CF7213;
            color: #fff;
            padding: 11px;
            display: inline-block;
            font-size: 14px;
            text-align: center;
            border-bottom: 3px solid #ab5e0f;
        }

        .line td hr {

            background-color: #CF7213;
            height: 1px;
            border: none;
            margin: 15px 0;
        }

        @media only screen and (max-device-width: 480px) {
            /* mobile-specific CSS styles go here */
            table[class=container] {
                width: 300px !important;
                padding: 0px;
            }

            table tr td[class=logo] a img {

                width: 80%;
            }

            table tr td[class=lady] img {

                width: 80%;
            }

        }

        /* regular CSS styles go here */
        table.container {

        }


    </style>
</head>
<body style="margin:0; padding:0; background-color:#fff;">
<center>


    <table width="100%" cellpadding="0" cellspacing="0" border="0" class="wrapper" bgcolor="#FFFFFF">
        <tr>
            <td height="50" style="font-size:10px; line-height:10px;">&nbsp;</td>
        </tr>

        <tr>
            <td align="center" valign="top">

                <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                    <tbody>
                    <tr>
                        <td align="center" valign="middle" class="logo">
                            <a href="#"><img src="http://coin-ico.app/images/red-logo.png" alt="logo"></a>
                        </td>

                    </tr>
                    </tbody>
                </table>

            </td>
        </tr>

        <tr>
            <td height="10" style="font-size:10px; line-height:10px;">&nbsp;</td>
        </tr>

        <tr>
            <td align="center">
                <table width="600" cellpadding="15" cellspacing="0" border="0" class="container tb-bg">
                    <tr>
                        <td>

                            <table>
                                <tr>
                                    <td height="10"></td>
                                </tr>
                            </table>

                            <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                                <tbody>
                                <tr class="title" align="left">
                                    <td><p>Hello!</p></td>
                                </tr>
                                </tbody>
                            </table>

                            <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                                <tbody>
                                <tr class="title2">
                                    <td>
                                        @foreach ($introLines as $line)
                                            <p>{{ $line }}</p>
                                        @endforeach
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            @isset($actionText)
                            <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                                <tbody>
                                <tr>

                                    <td>
                                        <table cellpadding="0" cellspacing="0" border="0" class="container"
                                               align="left">
                                            <tbody>
                                            <tr>
                                                <a href="{{ $actionUrl }}" class="button button-new" style="font-family: Avenir, Helvetica, sans-serif; box-sizing: border-box; text-decoration: none !important; border-radius: 3px; box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16); color: #FFF; display: inline-block; -webkit-text-size-adjust: none; background-color: #CF7213; border-top: 10px solid #CF7213; border-right: 18px solid #CF7213; border-bottom: 10px solid #CF7213; border-left: 18px solid #CF7213;">{{ $actionText }}</a>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>

                                </tr>

                                </tbody>
                            </table>
                            @endisset

                            <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">

                                <tbody>
                                <tr class="line">
                                    <td>
                                        @foreach ($outroLines as $line)
                                            <p>{{ $line }}</p>
                                        @endforeach
                                    </td>
                                </tr>
                                </tbody>

                            </table>
                            <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">

                                <tbody>
                                <tr class="line">
                                    <td>
                                        <hr>
                                    </td>
                                </tr>
                                </tbody>

                            </table>


                            <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                                <tbody>
                                <tr class="title3">
                                    <td>
                                        <p>Regards, <br> CryptedUnited</p>
                                    </td>
                                </tr>
                                </tbody>
                            </table>


                            <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                                <tbody>
                                </tbody>
                            </table>


                            <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                                <tr>
                                    <td height="20" style="font-size:10px; line-height:10px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>


        <tr>
            <td height="20" style="font-size:10px; line-height:10px;">&nbsp;</td>
        </tr>


    </table>
</center>
</body>
</html>