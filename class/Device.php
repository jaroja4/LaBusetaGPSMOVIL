<?php
//ACTION
if( isset($_POST["action"])){        
    $opt= $_POST["action"];
    unset($_POST['action']);    
    // Classes
    require_once("Conexion.php");
    require_once("GpsmovilAPI.php");
    // 
    // Instance
    $device = new Device();
    switch($opt){
        case "LoadbyUser":
            echo json_encode($device->LoadbyUser());
            break;
    }
}

class Device{
    public $id=""; 
    public $name=""; 
    public $uniqueid=""; 
    public $lastUpdate=""; 
    public $positionId=""; 
    public $groupId=""; 
    public $attributes=""; 
    public $phone=""; 
    public $model=""; 
    public $contact=""; 
    public $category=""; 
    public $disabled="";

    function __construct(){

        if(isset($_POST["id"])){
            $this->id= $_POST["id"];
        }
        
        if(isset($_POST["obj"])){
            $obj= json_decode($_POST["obj"],true);
            $this->$id=$obj["id"] ?? NULL; 
            $this->$name=$obj["name"] ?? NULL; 
            $this->$uniqueid=$obj["uniqueid"] ?? NULL; 
            $this->$lastUpdate=$obj["lastUpdate"] ?? NULL; 
            $this->$positionId=$obj["positionId"] ?? NULL; 
            $this->$groupId=$obj["groupId"] ?? NULL; 
            $this->$attributes=$obj["attributes"] ?? NULL; 
            $this->$phone=$obj["phone"] ?? NULL; 
            $this->$model=$obj["model"] ?? NULL; 
            $this->$contact=$obj["contact"] ?? NULL; 
            $this->$category=$obj["category"] ?? NULL; 
            $this->$disabled=$obj["disabled"] ?? NULL;

        }
    }

    function LoadbyUser(){
        try {
            $a = GPSMOVIL::devices($this->id);
            $response = json_decode($a->response);
            if ( $response ){
                return $response;
            }
            else
                return false;

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

    function AssingUserDevice(){
        $API_res = GPSMOVIL::assignUserDevice($userId, $deviceId);

    }

    function RemoveUserDevice(){
        removeUserDevice($userId, $deviceId);

    }
}

?>