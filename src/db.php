<?php

$servername = "bigci0mepec750rsachx-mysql.services.clever-cloud.com";
$username = "uiiko78egsbbpa7h";
$password = "xDo6bnARzIpfbDVphiuA";
$dbname = "bigci0mepec750rsachx";
$port = "3306";

$conn = new mysqli(
    $servername, 
    $username, 
    $password, 
    $dbname, 
    $port
);

if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}