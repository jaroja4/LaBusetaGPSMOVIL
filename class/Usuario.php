<?php
//ACTION
if( isset($_POST["action"])){        
    $opt= $_POST["action"];
    unset($_POST['action']);    
    // Classes
    require_once("Conexion.php");
    require_once("GpsmovilAPI.php");
    require_once("Device.php");
    // 
    // Instance
    $usuario = new Usuario();
    switch($opt){
        case "Login":
            echo json_encode($usuario->Login());
            break;
    }
}

class Usuario{
    public $id="";   
    public $name="";   
    public $passwd="";  
    public $email="";  
    public $readonly=""; 
    public $administrator=""; 
    public $latitude=""; 
    public $longitude=""; 
    public $zoom=""; 
    public $twelvehourformat=""; 
    public $attributes=""; 
    public $disabled=""; 
    public $devicelimit=""; 
    public $token=""; 
    public $devicereadonly=""; 
    public $phone="";
    public $legalDocument="";

    function __construct(){

        if(isset($_POST["id"])){
            $this->id= $_POST["id"];
        }
        
        if(isset($_POST["obj"])){
            $obj= json_decode($_POST["obj"],true);
            $this->id=$obj["id"] ?? NULL;   
            $this->name = $obj["nombre"] ?? NULL;
            $this->passwd=$obj["passwd"] ?? NULL;   
            $this->email=$obj["correo"] ?? NULL;
            $this->readonly=$obj["readonly"] ?? NULL;
            $this->administrator=$obj["administrator"] ?? NULL; 
            $this->latitude=$obj["latitude"] ?? NULL; 
            $this->longitude=$obj["longitude"] ?? NULL; 
            $this->zoom=$obj["zoom"] ?? NULL; 
            $this->twelvehourformat=$obj["twelvehourformat"] ?? NULL; 
            $this->attributes=$obj["attributes"] ?? NULL; 
            $this->disabled=$obj["disabled"] ?? NULL; 
            $this->devicelimit=$obj["devicelimit"] ?? NULL; 
            $this->token=$obj["token"] ?? NULL; 
            $this->devicereadonly=$obj["devicereadonly"] ?? NULL; 
            $this->phone=$obj["phone"] ?? NULL;
            $this->legalDocument=$obj["legalDocument"] ?? NULL;
        }
    }

    function Login(){
        try {
            $a = GPSMOVIL::login($this->email,$this->passwd);
            $response = json_decode($a->response);
            if ( isset($response->disabled) ){
                if ($response->disabled == false){
                    return $response;
                }
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

    public function ValidarUsuario(){
        $param = '%cedula":"'.  $this->identificacion . '%';
        $sql="SELECT id, name, email, readonly, administrator, map, latitude, longitude, zoom, twelvehourformat, 
            attributes, disabled, devicelimit, token, devicereadonly, phone
        FROM tc_users
        WHERE email = '" . $this->email . "'
        OR attributes LIKE '".  $param . "';";
        $data = DATA::Ejecutar($sql);  
        if ($data){
            $this->id = $data[0]["id"];
            return true;
        }
        else
            return false;        
    }

    public function ValidarUsuarioXEmpresa($codigoEmpresa){
        $sql="SELECT userid, manageduserid
            FROM tc_user_user
            WHERE userid = :userid
            AND manageduserid = :manageduserid;";
        $param= array(':userid'=>$this->id, ':manageduserid'=>$codigoEmpresa);            
        $data= DATA::Ejecutar($sql, $param);
        if ($data)
            return $data[0]["userid"];
        else
            return false;        
    }
}

?>