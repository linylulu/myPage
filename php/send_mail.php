<?php
require $_SERVER["DOCUMENT_ROOT"] . '/../' . 'vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


function sendMail($email, $name, $subject, $content)
{
//config
    $ini_file = $_SERVER["DOCUMENT_ROOT"] . '/../' . '.config/config.ini';
    $config = parse_ini_file($ini_file, true);
    $mail_cfg = $config['mail'];

    $mailer = new PHPMailer(true);
    $mailer->CharSet = "UTF-8";

    $mailer->Sender = $mail_cfg['sender'];
    $mailer->AddReplyTo($email, $name);
    $mailer->SetFrom($email, $name);
    $mailer->AddAddress($mail_cfg['recipient']);
    $mailer->AddAddress($mail_cfg['sender']);
    $mailer->Subject = $subject;
    $mailer->MsgHtml($content);

    // konfiguracja połączenia
    $mailer->SMTPDebug = 0;//SMTP::DEBUG_SERVER;    //Enable verbose debug output
    $mailer->isSMTP();                            // Set mailer to use SMTP
    $mailer->Host = $mail_cfg['smtpHost'];           // Specify main and backup SMTP servers
    $mailer->Port = $mail_cfg['smtpPort'];                          // TCP port to connect to

    $mailer->SMTPAuth = true;                     // Enable SMTP authentication
    $mailer->Username = $mail_cfg['smtpUser'];       // SMTP username
    $mailer->Password = $mail_cfg['smtpPassword'];         // SMTP password
    $mailer->SMTPSecure = 'ssl';                  // Enable TLS encryption, `ssl` also accepted

    // zrobione
    return $mailer->Send();
}

?>