<?php
require '../../php/send_mail.php';
sendMail(
    $_POST['email'],
    $_POST['name'],
    $_POST['subject'],
    $_POST['message']
);
?>