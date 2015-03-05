<?php
header("Content-Type: application/json");
$dir    = getcwd();
$files = scandir($dir.'/projects');
$tree="";
for ($i=3;$i<count($files);$i++){

echo '<li class="projectElement" id="'.$files[$i].'">'.$files[$i].'</li>';

}



?>