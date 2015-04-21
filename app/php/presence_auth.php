<?php

header('Content-Type: application/json');

require_once('Pusher.php');

$app_id = '44660';
$app_key = 'd80503305bdaa3b819e5';
$app_secret = 'ee7d6123c202ac761d47';
    
$pusher = new Pusher( $app_key, $app_secret, $app_id );

$presence_data = array('name' => $user['name']);
echo $pusher->presence_auth($_POST['channel_name'], $_POST['socket_id'], $_SESSION["user_id"], array("id" => $_SESSION["user_name"]));

?>
