<?php
require '../../php/send_mail.php';
$result = sendMail(
    $_POST['email'],
    $_POST['name'],
    $_POST['subject'],
    $_POST['message']
);
$data = ["result" => $result];
header('Content-Type: application/json');
echo json_encode($data);
?>