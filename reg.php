<?php
include_once ('config.php');

function register_user_prepared_stmt($uname,$nick,$pwd,$link){

     $stmt = $link->prepare("SELECT `name` FROM `ebad_users` WHERE name = ? LIMIT 1");
     $stmt->bind_param("s",$uname);
     if ($stmt->execute()) {
	$row = $stmt->fetch();
	if ($row){
		echo "$uname is already registred.";
		return;
	}
     }
    $stmt = $link->prepare("INSERT INTO ebad_users (`uid`, `name`, `passwd`, `nick`, `email`, `address`, `phone`, `credits`, `cc_num`, `profile`) VALUES (NULL, ?, ?, ?,'', '', '', '0', '', '');");
  $stmt->bind_param("sss",$uname,$pwd,$nick);
  if ($stmt->execute()) {
     $stmt->close();
     $ent_name=htmlentities($uname);
     echo "Username $ent_name has been successfully registered.  ";
     $msg_query = $link->prepare("INSERT INTO ebad_messages (msg_txt, msg_nick) VALUES ('Welcome to E-Bad', ?);");
     $msg_query->bind_param("s",$nick);
     if ($msg_query->execute()){
		echo "Welcome $nick";
	}
  }
  else echo "Database error: Unable to register.";


}


$uname=$_POST['uname'];
$nick=$_POST['nick'];
$pwd=$_POST['pwd'];

if (!empty($uname) && !empty($nick) && !empty($pwd)) {
  register_user_prepared_stmt($uname,$nick,$pwd,$user_db);
}
else {
?>
    

<center>
Register a new user:
<form method=post action="reg.php">
<table>
<tr><td>New Username:</td><td><input type=text name=uname /></td></tr>
<tr><td>Nick:</td><td><input type=text name=nick /></td></tr>
<tr><td>Password:</td><td><input type=password name=pwd /></td></tr>
<tr><td></td><td><input type=submit value=Register></td></tr>
</table>
</center>

<?php 
}
?>

