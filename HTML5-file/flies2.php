
<?php
ini_set('default_charset','utf-8');
$image_arr=array ("image/png","image/gif","image/jpg","image/bmp","image/jpeg");
foreach($_FILES as $file){
	$path_arr=pathinfo($file["name"]);
	if(in_array($file["type"],$image_arr)){
		echo "200";
		if(is_uploaded_file($file["tmp_name"])){
			move_uploaded_file($file["tmp_name"],     "./1/" .md5($path_arr['basename']).".".$path_arr['extension']);		
		}
	}else{
		echo "403";
	}	
}
?>


