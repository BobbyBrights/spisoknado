<?php
  $email = $_POST['email'];
  $code = $_POST['code'];

  $to  = $email;

  $subject = "Активация аккаунта на spisoknado";

  $message = '
  <html>
      <head>
          <title>Активация аккаунта на spisoknado</title>
      </head>
      <body>
          <p>Поздравляем, вы успешно зарегистрировались на сайте spisoknado. Для активации аккаунта перейдите по ссылке: <a href="http://romger.tmweb.ru/spisoknado/#/login?email=$email&code=$code">ссылка активация</a></p>
      </body>
  </html>';

  $headers  = "Content-type: text/html; charset=windows-1251 \r\n";
  $headers .= "From: spisoknado\r\n";

  mail($to, $subject, $message, $headers);
?>
