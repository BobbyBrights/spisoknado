<?php
  $email = $_GET['email'];
  $code = $_GET['code'];

  $to = $email;

  $subject = "Активация аккаунта на spisoknado";

  $message = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>Активация аккаунта на spisoknado</title></head><body><p>Поздравляем, вы успешно зарегистрировались на сайте spisoknado. Для активации аккаунта перейдите по ссылке: <a href="http://romger.tmweb.ru/spisoknado/#/login?email='.$email.'&code='.$code.'">ссылка активации</a></p></body></html>';

  $headers  = "Content-type: text/html; charset=UTF-8 \r\n";
  $headers .= "From: spisoknado\r\n";

  mail($to, $subject, $message, $headers);
?>
