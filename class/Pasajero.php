<?php
//ACTION
if( isset($_POST["action"])){        
    $opt= $_POST["action"];
    unset($_POST['action']);    
    // Classes
    require_once("Conexion.php");
    require_once("GpsmovilAPI.php");
    require_once("Usuario.php");
    require_once("UUID.php");
    // 
    // Instance
    $pasajero = new Pasajero();
    switch($opt){
        case "Registrar":
            echo json_encode($pasajero->Registrar());
            break;
        case "ReadAll":
            echo json_encode($pasajero->ReadAll());
            break;
        case "Search_cedula":
            echo json_encode($pasajero->Search_cedula());
            break;
        case "Delete":
            echo json_encode($pasajero->Delete());
            break;
        case "LoadById":
            echo json_encode($pasajero->LoadById());
            break;
        case "Actualizar":
            echo json_encode($pasajero->Actualizar());
            break;
    }
}

class Pasajero{
    public $id=""; 
    public $codigoEmpresa=""; 
    public $nombre="";
    public $emailResponsable="";
    public $idResponsable="";
    public $cedula="";

    function __construct(){

        if(isset($_POST["id"])){
            $this->id= $_POST["id"];
        }
        
        if(isset($_POST["obj"])){
            $obj= json_decode($_POST["obj"],true);
            $this->id=$obj["id"] ?? NULL;
            $this->idResponsable=$obj["idResponsable"] ?? NULL;
            $this->cedula=$obj["cedula"] ?? NULL;
            $this->nombre=$obj["nombre"] ?? NULL;
            $this->codigoEmpresa=$obj["codigoEmpresa"] ?? NULL;
        }
    }
    
    function ReadAll(){
        try {
            $sql= 'SELECT DISTINCT p.id, p.name, p.document, p.status FROM gpsmovilpro.tc_passenger p
            INNER JOIN tc_user_passenger up
            ON p.id = up.passengerid
            INNER JOIN tc_users u
            ON u.id = up.userid
            WHERE u.id = :idResponsable;';
            $param= array(':idResponsable'=>$this->idResponsable);

            error_log("idResponsable: ".$this->idResponsable, 0);            
            error_log("SQL: ".$sql, 0);

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

    function Search_cedula(){
        try {
            $sql= 'SELECT id, name, document, transportCode
            FROM tc_passenger
            WHERE document LIKE "%'.$this->cedula.'%";';
            $data= DATA::Ejecutar($sql);
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

    function LoadById(){
        try {
            $sql= 'SELECT p.document, p.name, p.transportCode
            FROM tc_passenger p
            WHERE id = "'.$this->id.'";';
            $data= DATA::Ejecutar($sql);
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

    function Registrar(){
        try {
            $objUsuario = new Usuario;
            $objUsuario->attributes["cedula"] = "SINCEDULA";
            $objUsuario->email = "SINEMAIL";
            $objUsuario->id = $this->codigoEmpresa;
            $estadoEmpresaTransporte = $objUsuario->ValidarUsuario();
            if ($estadoEmpresaTransporte ){

                if ( ! $this->id = $this->ValidarPasajero() ){
                    $this->id = $this->id==false?$this->GetLastid():false;
    
                    $sql= 'INSERT into tc_passenger 
                    (id, name, document, transportCode, status)
                    VALUES (:id, :name, :document, :transportCode, :status);';
                    $param= array(':id'=>$this->id, 
                            ':name'=>$this->nombre, 
                            ':document'=>$this->cedula,
                            ':transportCode'=>$this->codigoEmpresa,
                            ':status'=>1);            
                    $data= DATA::Ejecutar($sql, $param, false);
                }
                else
                    return "pasajeroRepetido";

                if ( !$this->ValidarPasajeroXUsuario($this->id, $this->idResponsable) ){
                    $sql="INSERT INTO tc_user_passenger
                        (userid, passengerid)
                        VALUES (:userid, :passengerid);";
                    $param= array(':userid'=>$this->idResponsable, ':passengerid'=>$this->id);            
                    $data= DATA::Ejecutar($sql, $param, false);
                } 
                return "registrado";           
                //Asocia al pasajero con la empresa
                // if ( !$this->ValidarPasajeroXUsuario($this->id, $this->codigoEmpresa) ){
                //     $sql="INSERT INTO tc_user_passenger
                //         (userid, passengerid)
                //         VALUES (:userid, :passengerid);";
                //     $param= array(':userid'=>$this->codigoEmpresa, ':passengerid'=>$this->id);            
                //     $data= DATA::Ejecutar($sql, $param, false);
                // }   
            }
            else 
                return "invalidCodeTransport";

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

    function Actualizar (){        
        $objUsuario = new Usuario;
        $objUsuario->attributes["cedula"] = "SINCEDULA";
        $objUsuario->email = "SINEMAIL";
        $objUsuario->id = $this->codigoEmpresa;
        $estadoEmpresaTransporte = $objUsuario->ValidarUsuario();
        if ($estadoEmpresaTransporte ){
            $sql= 'SELECT id FROM tc_passenger
                WHERE id <> :id
                AND document = :document;';
            $param= array(':id'=>$this->id,
                    ':document'=>$this->cedula);            
            $data= DATA::Ejecutar($sql, $param);
            if (!$data){
                $sql= 'UPDATE tc_passenger p
                    SET p.document = :document, p.name = :name, p.transportCode = :transportCode
                    WHERE id = :id;';
                $param= array(':document'=>$this->cedula,
                        ':name'=>$this->nombre,
                        ':transportCode'=>$this->codigoEmpresa,
                        ':id'=>$this->id);            
                $data= DATA::Ejecutar($sql, $param);
                return "actualizado";
            }
            else
                return "cedulaInvalida";
        }
        else 
            return "invalidCodeTransport";
        
    }

    function GetLastid(){
        $sql="SELECT AUTO_INCREMENT
        FROM information_schema.TABLES
        WHERE TABLE_SCHEMA = 'gpsmovilpro'
        AND TABLE_NAME = 'tc_passenger';";
        $data = DATA::Ejecutar($sql);  
        if ($data[0]){
            return $data[0][0];
        }
        else 
            return false;
        
    }

    function ValidarPasajero(){
        $sql="SELECT id
        FROM tc_passenger
        WHERE document = '" . $this->cedula . "';";
        $data = DATA::Ejecutar($sql);  
        if ($data)
            return $data[0]["id"];
        else
            return false;        
    }

    function Delete(){

        
        $sql="DELETE FROM tc_user_passenger 
            WHERE passengerid = '" . $this->id . "';";
        $data = DATA::Ejecutar($sql);  


        $sql="DELETE FROM tc_passenger 
            WHERE id = '" . $this->id . "';";
        $data = DATA::Ejecutar($sql);
        return true;        
    }

    function ValidarPasajeroXUsuario($userid, $passengerid){
        $sql="SELECT userid, passengerid
            FROM tc_user_passenger
            WHERE userid = :id
            AND passengerid = :idResponsable;";
        $param= array(':id'=>$userid, ':idResponsable'=>$passengerid);            
        $data= DATA::Ejecutar($sql, $param);
        if ($data)
            return $data[0];
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