<?php
 	header("Content-Type: application/json");
	$json = $_POST['json'];
	$folderName=$_POST['folder'];

  
	$flag=0;
	if(file_exists('projects/'.$folderName)){
  	  	if(json_decode($json) != null) { 
    		$file = fopen('projects/'.$folderName.'/project.json','w+');
    		fwrite($file, $json);
    		fclose($file);
    		$flag=1;
        $decoded=json_decode($json,true);
        $urls=$decoded['imageUrls'];

        for($i=0;$i<count($urls);$i++){
          $path=$urls[$i];
          copy($path,'projects/'.$folderName.'/img'.urldecode(substr($path,strrpos($path,'/'))));
        }
        
   		}

   	}
   else {
   		mkdir('projects/'.$folderName);
   	  	if(json_decode($json) != null) {
        mkdir('projects/'.$folderName.'/js');
        mkdir('projects/'.$folderName.'/css'); 
        mkdir('projects/'.$folderName.'/img');
        $file = fopen('projects/'.$folderName.'/project.json','w+');
    		fwrite($file, $json);
    		fclose($file);
        copy('css/project.css','projects/'.$folderName.'/css/project.css');
        copy('css/.htaccess','projects/'.$folderName.'/css/.htaccess');
        copy('js/jquery.min.js','projects/'.$folderName.'/js/jquery.min.js');
        copy('player.js','projects/'.$folderName.'/js/player.js');
        copy('js/jquery.velocity.js','projects/'.$folderName.'/js/jquery.velocity.js');
        copy('css/.htaccess','projects/'.$folderName.'/js/.htaccess');
        copy('project.html','projects/'.$folderName.'/index.html');
        $decoded=json_decode($json,true);
        $urls=$decoded['imageUrls'];

        for($i=0;$i<count($urls);$i++){
          $path=$urls[$i];
          copy($path,'projects/'.$folderName.'/img'.urldecode(substr($path,strrpos($path,'/'))));
        }
        
        $flag=1;
   		}
        
   }

   if($flag==1){
   	echo json_encode(array("Save"=>"Yes"));
   }
   else{
   	echo json_encode(array("Save"=>"No"));
   }
?>