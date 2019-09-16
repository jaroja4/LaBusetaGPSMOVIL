<?php
//ACTION
if( isset($_POST["action"])){        
    $opt= $_POST["action"];
    unset($_POST['action']);    
    // Classes
    require_once("Conexion.php");
    // Instance
    $driver = new Driver();
    switch($opt){
        case "ReadDeviceByDriver":
            echo json_encode($driver->ReadDeviceByDriver());
            break;
    }
}

class Driver{
    public $id="";

    function __construct(){

        if(isset($_POST["id"])){
            $this->id= $_POST["id"];
        }
        
        if(isset($_POST["obj"])){
            $obj= json_decode($_POST["obj"],true);
            $this->id=$obj["id"] ?? NULL;

        }
    }

    function ReadDeviceByDriver(){
        try {
            $sql= 'SELECT d.id, d.name 
            FROM tc_devices d
            INNER JOIN tc_user_device ud
            ON ud.deviceid = d.id
            INNER JOIN tc_users u
            ON u.id = ud.userid
            AND u.id = :id;';
            $param= array(':id'=>$this->id);
            $data= DATA::Ejecutar($sql, $param);
            if($data){
                return $data;
            }

        }     
        catch(Exception $e) {
            error_log("[ERROR]  (".$e->getCode()."): ". $e->getMessage());
            header('HTTP/1.0 400 Bad error');
            die(json_encode(array(
                'code' => $e->getCode() ,
                'msg' => 'Error al cargar la lista'))
            );
        }
    }
}

?>