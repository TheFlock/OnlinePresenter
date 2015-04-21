<?php

require_once('Pusher.php');

$app_id = '44660';
$app_key = 'd80503305bdaa3b819e5';
$app_secret = 'ee7d6123c202ac761d47';
    
$pusher = new Pusher( $app_key, $app_secret, $app_id );

$channelID = $_POST["channelID"];
$eventID = $_POST["eventID"];
$message = $_POST["message"];

$auth = $pusher->socket_auth($channelID, $eventID );
$pusher->trigger( $channelID, $eventID, $message );

?>
