<!DOCTYPE html>
<html lang="en">
<head>
  <title>PWA Push List</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="viewport-fit=cover, initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <style>
	 .container { max-width: 100%; padding-left: 2.5px; padding-right: 2.5px; }
     .card-body { padding: 12px; }
	 .card { margin: 5px; }
	 .card-title { margin-bottom: 5px; } 
	 .row { margin-right:0; margin-left: 0; }
	 .col { font-size: 15px; }
	 .pushurl { text-decoration: none; color: inherit; }
  </style>
</head>
<body>
 
<div class="container">

<?php

function pushtime_Ago($time) { 
 
    $diff= time() - $time; 
    $sec= $diff; 
    $min= round($diff / 60 ); 
    $hrs= round($diff / 3600); 
    $days= round($diff / 86400 ); 
    $weeks= round($diff / 604800); 
    $mnths= round($diff / 2600640 ); 
    $yrs= round($diff / 31207680 ); 
      
    if($sec <= 60) { 
        echo "<i class='fa fa-clock-o'></i> $sec seconds ago"; 
    } 
      
    else if($min <= 60) { 
        if($min==1) { 
            echo "<i class='fa fa-clock-o'></i> one minute ago"; 
        } 
        else { 
            echo "<i class='fa fa-clock-o'></i> $min minutes ago"; 
        } 
    } 
      
    else if($hrs <= 24) { 
        if($hrs == 1) {  
            echo "<i class='fa fa-clock-o'></i> an hour ago"; 
        } 
        else { 
            echo "<i class='fa fa-clock-o'></i> $hrs hours ago"; 
        } 
    } 
      
    else if($days <= 7) { 
        if($days == 1) { 
            echo "<i class='fa fa-clock-o'></i> Yesterday"; 
        } 
        else { 
            echo "<i class='fa fa-clock-o'></i> $days days ago"; 
        } 
    } 
      
    else if($weeks <= 4.3) { 
        if($weeks == 1) { 
            echo "<i class='fa fa-clock-o'></i> a week ago"; 
        } 
        else { 
            echo "<i class='fa fa-clock-o'></i> $weeks weeks ago"; 
        } 
    } 
      
    else if($mnths <= 12) { 
        if($mnths == 1) { 
            echo "<i class='fa fa-clock-o'></i> a month ago"; 
        } 
        else { 
            echo "<i class='fa fa-clock-o'></i> $mnths months ago"; 
        } 
    } 
      
    else { 
        if($yrs == 1) { 
            echo "<i class='fa fa-clock-o'></i> one year ago"; 
        } 
        else { 
            echo "<i class='fa fa-clock-o'></i> $yrs years ago"; 
        } 
    } 
} 
  
$db = new SQLite3('../pwa_token.db');

$pushquery = "SELECT * FROM list_5ef5004929867 ORDER BY rowid DESC LIMIT 20";

$res = $db->query($pushquery);

while ($row = $res->fetchArray()) {
	echo "<div class='card'>";
	echo "<div class='card-body'>";
    echo "<h6 class='card-title font-weight-bold'>{$row['title']}</h6>";
	echo "<p class='card-text'>{$row['message']}</p>";
	echo "</div>";
	echo "<div class='row'>";
	echo "<div class='col card-time'>";
	$curr_time= $row['created_at']; 
    $time_ago =strtotime($curr_time); 
    $print_time = pushtime_Ago($time_ago); 
	echo "$print_time"; 
	echo "</div>";
	echo "<div class='col card-link' style='text-align: right;'>";
	if($row['click_url'] !== 'index.html') { 
    echo "<a class='pushurl' href='{$row['click_url']}' target='_blank'><i class='fa fa-external-link'></i></a>";
	}
	echo "</div>";
	echo "</div>";
	echo "<p></p>";
	if($row['image_url'] !== '') { 
    echo "<div class='view overlay'><img class='card-img-top' src='{$row['image_url']}'></div>";
	}
	echo "</div>";
} 

$db->close();

?>
	
</div>

</body>
</html>