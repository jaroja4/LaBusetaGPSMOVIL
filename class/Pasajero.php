<?php
//ACTION
if( isset($_POST["action"])){        
    $opt= $_POST["action"];
    unset($_POST['action']);    
    // Classes
    require_once("Conexion.php");
    require_once("GpsmovilAPI.php");
    require_once("Usuario.php");
    // 
    // Instance
    $device = new Device();
    switch($opt){
        case "Registrar":
            echo json_encode($device->Registrar());
            break;
    }
}

class Device{
    public $id=""; 
    public $codigoEmpresa=""; 
    public $nombreResponsable=""; 
    public $identificacionResponsable=""; 
    public $emailResponsable="";
    public $passwdResponsable="";
    public $nombrePasajero="";
    public $identificacionPasajero="";

    function __construct(){

        if(isset($_POST["id"])){
            $this->id= $_POST["id"];
        }
        
        if(isset($_POST["obj"])){
            $obj= json_decode($_POST["obj"],true);
            $this->codigoEmpresa=$obj["codigoEmpresa"] ?? NULL;
            $this->nombreResponsable=$obj["nombreResponsable"] ?? NULL;
            $this->identificacionResponsable=$obj["identificacionResponsable"] ?? NULL;
            $this->emailResponsable=$obj["emailResponsable"] ?? NULL;
            $this->passwdResponsable=$obj["passwdResponsable"] ?? NULL;
            $this->nombrePasajero=$obj["nombrePasajero"] ?? NULL;
            $this->identificacionPasajero=$obj["identificacionPasajero"] ?? NULL;
        }
    }
    
    function Registrar(){
        try {
            $res = null;
            $usuario = new Usuario;
            $usuario->identificacion = $this->identificacionResponsable;
            $usuario->email = $this->emailResponsable;


            $attributes = array(
                "grupo" => "planPiloto",
                "identificacion" => $this->identificacionResponsable
            );
            
            if ( !$usuario->ValidarUsuario() ){
                $API_res = GPSMOVIL::userAdd($this->nombreResponsable, $this->emailResponsable, $this->passwdResponsable, $attributes);
                switch ($API_res->responseCode) {
                    case 415:
                        $res = "repetido";
                        break;
                    case 202:
                        $res = "sinrespuesta";
                        break;
                    case 200:
                        $res = true;
                        break;
                    default:
                        $res = false;
                }
                $usuario->id = json_decode($API_res->response)->id;
            }

            if ( !$usuario->ValidarUsuarioXEmpresa($this->codigoEmpresa) ){
                $API_res = GPSMOVIL::assignUserManagedUser($usuario->id, $this->codigoEmpresa);
            }            

            
            if ( !$this->ValidarPasajero() ){
                $sql= 'INSERT into tc_passenger 
                (name, document)
                VALUES (:name, :document);';
                $param= array(':name'=>$this->nombrePasajero, ':document'=>$this->identificacionPasajero);            
                $data= DATA::Ejecutar($sql, $param, false);
            }

            return true;

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

    function ValidarPasajero(){
        $sql="SELECT id
        FROM tc_passenger
        WHERE document = '" . $this->identificacionPasajero . "';";
        $data = DATA::Ejecutar($sql);  
        if ($data)
            return $data[0]["id"];
        else
            return false;        
    }

    // function ValidarUsuario(){
    //     $sql="SELECT id
    //     FROM tc_users
    //     WHERE email = '" . $this->emailResponsable . "'
    //     OR attributes LIKE '%".  $this->identificacionResponsable . "%';";
    //     $data = DATA::Ejecutar($sql);  
    //     if ($data){
    //         $this->id = $data[0]["id"];
    //         return true;
    //     }
    //     else
    //         return false;        
    // }

}

?>