<?php
  $email = $_GET['email'];
  $key = $_GET['key'];
  $id = $_GET['id'];

  $to = $email;

  $subject = "Расшарен список на spisoknado";

  $message = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>Расшарен список на spisoknado</title></head><body><p>Вам расшарен список на сайте spisoknado. Для доступа к списку перейдите по ссылке: <a href="http://spisoknado.ru/#/lists/list/'.$id.'/'.$email.'/'.$key.'">ссылка на список</a></p></body></html>';

  $headers  = "Content-type: text/html; charset=UTF-8 \r\n";
  $headers .= "From: spisoknado\r\n";

  mail($to, $subject, $message, $headers);
?>
