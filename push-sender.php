<?php

include '../config.php';

if(isset($_POST['password'])){
	
if($_POST['password'] == "123456"){
	
$table = '5ef5004929867';
	
$title = $_POST["title"];
	
$message = $_POST["message"];	

$img = $_POST["imgurl"];
	
if($_POST["url"] == "") {
$url = 'index.html';	
}
else {
$url = $_POST["url"];	
}	

$db = new SQLite3('../pwa_token.db');
	
$query = "INSERT INTO list_$table(title, message, click_url, image_url, created_at) VALUES('$title', '$message', '$url', '$img', datetime('now'))";

	if($db->exec($query)) {
	//echo "Inserted Successfully."; 	
	}	

$pushquery = "SELECT * FROM pwa_$table";

$res = $db->query($pushquery);

while ($row = $res->fetchArray()) {
 	$token[] = $row['token'];
}
	
$header=[
    'Authorization: key='.$fcm_server_key,
    'Content-Type: application/json'
    ];
    
    
$msg=[
	'title'=> $title,
	'body' => $message,
	'icon' =>'android-chrome-512x512.png',
	'image' => $img,
	'click_action' => $url, 
	];

$payload=[
	'registration_ids' => $token,
	'data'             => $msg,
	];
		
$curl = curl_init();

curl_setopt_array($curl, array(
    CURLOPT_URL => "https://fcm.googleapis.com/fcm/send",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_HTTPHEADER =>$header
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response1;
}
	
$obj = json_decode($response);
$response2 = $obj->{'success'};	
            
$db->close();
}
}
?>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Push Notification Sender</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js "></script>
<style>
body {
	width: 100%;
	height: 100%;	
	margin: 0;
	overflow-x: hidden;	
}		
.push-form-container {
	margin: auto;
	padding: 30px;
	box-shadow: 0 2px 10px 0 rgba(0,0,0,.16), 0 2px 5px 0 rgba(0,0,0,.26);
}
.push-form-container .push-form-heading {
    color: #fff;
    font-size: 18px;
    position: relative;
    padding: 20px 30px;
    background-color: #66afe9;
    margin: -30px -30px 30px -30px;
}
.push-form .btn-primary {
    border-color: #50a3e6;
    background-color: #66afe9;
}
.image-url {
    width: 100%;	
} 
.bg-success {
    text-align: center;
	line-height: 30px;
	margin-top: 20px;
}
.loading-modal {
    background-color: rgba(255, 255, 255, .8);
    display: none;
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%
}
body.loading .loading-modal {
    display: block
}
.loading-table {
    margin-left: auto;
    margin-right: auto;
    margin-top: 15%;
    margin-bottom: 15%;
}		
</style>
</head>	
<body>
<br/>
	
<div class="container"> 
	<div class="push-form"> 
		<div class="row"> 
			<div class="col-md-6 col-md-offset-3"> 
				<div class="push-form-container"> 
					<form id='pushForm' method='post'>
						<div class="form-group">
							<label for="password">Password</label>
							<input id="password" name="password" class="form-control" type="text" placeholder="Required" required>
						</div>
						<div class="form-group">
							<label for="title">Title</label>
							<input id="title" name="title" class="form-control" type="text" placeholder="Required" required>
						</div>
						<div class="form-group">
							<label for="message">Message</label>
							<textarea id="message" name="message" class="form-control" rows="3" placeholder="Required" required></textarea>
						</div>
						<div class="form-group" id="click-url">
							<label for="url">Click Action URL</label>
							<input id="url" name="url" class="form-control" type="text" placeholder="Optional">
						</div>
						<div class="form-group" id="include-img">
							<label for="imgurl">Image (Optional)</label>
							<div class="dropzone">
								<div id="kano"></div>
							</div>
						</div>
						
						<div class="text-left">
							<input class="btn btn-primary" type="submit" value="Send">
						</div>
					</form>
					<?php if($response2) echo"<p class='bg-success'>Push successfully sent to $response2 devices.</p>"; ?>
				</div> 
			</div> 
		</div> 
	</div> 
</div>  

<script type="text/javascript" src="../imgur.js"></script>
	
<script type="text/javascript">
var feedback = function(res) {
    if (res.success === true) {
        var get_link = res.data.link.replace(/^http:\/\//i, 'https://');
        document.querySelector('.status').innerHTML =
            '<div class="bg-success">Image Uploaded Successfully</div>' + '<input type="hidden" class="form-control image-url" id="imgurl" name="imgurl" value=\"' + get_link + '\"/>';
    }
};

new Imgur({
    clientid: '4409588f10776f7', 
    callback: feedback
});	
</script>	
	
</body>

</html>