<?php
//ACTION
if( isset($_POST["action"])){        
    $opt= $_POST["action"];
    unset($_POST['action']);    
    // Classes
    require_once("Conexion.php");
    require_once("GpsmovilAPI.php");
    // Instance
    $driver = new Driver();
    switch($opt){
        case "ReadDeviceByDriver":
            echo json_encode($driver->ReadDeviceByDriver());
            break;
        case "ReadPassagerByTransportCode":
            echo json_encode($driver->ReadPassagerByTransportCode());
            break;
        case "PasajeroByBusetica":
            echo json_encode($driver->PasajeroByBusetica());
            break;
        case "Get_Empresa_Usuario":
            echo json_encode($driver->Get_Empresa_Usuario());
            break;
    }
}

class Driver{
    public $id=null;
    public $idBusetica=null;
    public $idPasajero=null;
    public $pasajeroEstado=null;

    function __construct(){

        if(isset($_POST["id"])){
            $this->id= $_POST["id"];
        }
        
        if(isset($_POST["obj"])){
            $obj= json_decode($_POST["obj"],true);
            $this->id=$obj["id"] ?? NULL;
            $this->idBusetica=$obj["idBusetica"] ?? NULL;
            $this->idPasajero=$obj["idPasajero"] ?? NULL;
            $this->pasajeroEstado=$obj["pasajeroEstado"] ?? NULL;

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

    function ReadPassagerByTransportCode(){
        try {
            $sql= 'SELECT p.id, p.name, p.status
            FROM gpsmovilpro.tc_user_user uu
            INNER JOIN gpsmovilpro.tc_passenger p
            ON p.transportCode = uu.userid
            WHERE manageduserid = :id;';
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

    function PasajeroByBusetica(){
        try {
            $sql="SELECT userid 
                FROM gpsmovilpro.tc_user_passenger
                WHERE passengerid = :passengerid;";
            $param= array(':passengerid'=>$this->idPasajero);
            $data= DATA::Ejecutar($sql, $param);
            if ($data){
                foreach ($data as $user) {
                    if ($this->pasajeroEstado)
                        $API_res = GPSMOVIL::assignUserDevice($user["userid"], $this->idBusetica);
                    else
                        $API_res = GPSMOVIL::removeUserDevice($user["userid"], $this->idBusetica);                    
                }
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

    function Get_Empresa_Usuario(){
        try {
            $sql="SELECT DISTINCT u.id, u.name, u.email, u.phone, u.attributes
                FROM tc_users u, 
                    (
                    SELECT p.transportCode 
                    FROM tc_passenger p
                    INNER JOIN tc_user_passenger u_p
                    ON p.id = u_p.passengerid
                    INNER JOIN tc_users u
                    ON u.id = u_p.userid
                    WHERE u.id = :id
                    ) AS empresas
                WHERE u.id = empresas.transportCode;";
            $param= array(':id'=>$this->id);
            $data= DATA::Ejecutar($sql, $param);
            if ($data){
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