<?php
header("Content-Type: application/json");

$folderName=$_POST['folder'];
$folderName='projects/'.$folderName;

 function Delete($path)
    {
        if (is_dir($path) === true){
            $files = array_diff(scandir($path), array('.', '..'));
        foreach ($files as $file){
            Delete(realpath($path) . '/' . $file);
            }

        return rmdir($path);
    }

    else if (is_file($path) === true)
    {
        return unlink($path);
    }

    return false;
}


echo Delete($folderName);


?>