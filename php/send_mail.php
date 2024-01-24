<?php
require $_SERVER["DOCUMENT_ROOT"] . '/../' . 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


function sendMail($email, $name, $subject, $content)
{
//config

//    echo 'email ', $email, '<br/>';
//    echo 'name ', $name, '<br/>';
//    echo 'subject ', $subject, '<br/>';
//    echo 'content ', $content, '<br/>';

    $mailer = new PHPMailer(true);
    $mailer->CharSet = "UTF-8";
//
    $mailer->Sender = $sender;
    $mailer->AddReplyTo($email, $name);
    $mailer->SetFrom($email, $name);
    //$mailer->AddAddress($recipient);
    //$mailer->AddAddress("kannisko@gmail.com");
    $mailer->AddAddress('formsender@linylulu.com');
    $mailer->Subject = $subject;
    $mailer->MsgHtml($content);

    // konfiguracja połączenia
    $mailer->SMTPDebug = 2;//SMTP::DEBUG_SERVER;    //Enable verbose debug output
    $mailer->isSMTP();                            // Set mailer to use SMTP
    $mailer->Host = $smtpHost;           // Specify main and backup SMTP servers
    $mailer->Port = $smtpPort;                          // TCP port to connect to

    $mailer->SMTPAuth = true;                     // Enable SMTP authentication
    $mailer->Username = $smtpUser;       // SMTP username
    $mailer->Password = $smtpPassword;         // SMTP password
    $mailer->SMTPSecure = 'ssl';                  // Enable TLS encryption, `ssl` also accepted

    // zrobione
    return $mailer->Send();
}

?>