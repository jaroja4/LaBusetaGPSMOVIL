<?php

    class GPSMOVIL {
        public static $host='http://167.99.154.84:8082';
        private static $adminEmail='jaroja4@gmail.com';
        private static $adminPassword='Jason1989+';
        public static $cookie;
        private static $jsonA='Accept: application/json';
        private static $jsonC='Content-Type: application/json';
        private static $urlEncoded='Content-Type: application/x-www-form-urlencoded';
        private static $sessionId = array(
            "Accept: */*",
            "Authorization: Basic amFyb2phNEBnbWFpbC5jb206SmFzb24xOTg5Kw==",
            "Cache-Control: no-cache",
            "Connection: keep-alive",
            "Host: 167.99.154.84:8082",
            "Postman-Token: b1623a59-82f3-497e-8836-67fcc7e82c1d,7b44c2dc-ef77-4336-99dc-0d4f659efb7b",
            "User-Agent: PostmanRuntime/7.15.0",
            "accept-encoding: gzip, deflate",
            "cache-control: no-cache"
          );

        //Server
        public static function server(){
            
            return self::curl('/api/server?'.$data,'GET',$sessionId,'',array());
        }

        //Session
        public static function loginAdmin(){
            
            return self::login(self::$adminEmail,self::$adminPassword);
        }

        public static function login($email,$password){
            
            $data='email='.self::validarTexto($email).'&password='.self::validarTexto($password);
            
            return self::curl('/api/session','POST',array(),$data,array(self::$urlEncoded));
        }

        private static function validarTexto($t=null){
            $r = "";
            for($i=0; $i<strlen($t); $i++) {
                $vLetra = ord($t[$i]);
                switch ($vLetra) {
                    case ($vLetra >= 48 && $vLetra <= 57 ):
                    case ($vLetra >= 65 && $vLetra <= 90 ):
                    case ($vLetra >= 97 && $vLetra <= 122 ):
                        $r .= $t[$i];
                        break;
                    default:
                        $r .= "%".dechex($vLetra);
                }
            }
            return $r;
        }

        public static function logout($sessionId){
            
            return self::curl('/api/session','DELETE',$sessionId,'',array(self::$urlEncoded));
        }

        public static function session($sessionId){
            
            return self::curl('/api/session?'.$data,'GET',$sessionId,'',array());
        }

        //users
        public static function users($sessionId,$id){
            
            if($id != ''){
                $data='userId='.$id;
            }
            
            return self::curl('/api/users?'.$data,'GET',$sessionId,'',array());
        }

        public static function signup($name,$email,$password){
            
            $name = $name;
            $email = $email;
            $password = $password;
            
            $data='{"name":"'.$name.'","email":"'.$email.'","password":"'.$password.'"}';
            return self::curl('/api/users','POST','',$data,array(self::$jsonC));
        }	
            
        public static function userAdd($name,$email,$password,$attributes){
            
            $newUser = array("id"=> 84,
                "name"=> $name,
                "attributes"=>$attributes,
                "login"=> "",
                "email"=> $email,
                "phone"=> null,
                "readonly"=> true,
                "administrator"=> false,
                "map"=> "custom",
                "latitude"=> 0,
                "longitude"=> 0,
                "zoom"=> 23,
                "twelveHourFormat"=> false,
                "coordinateFormat"=> null,
                "disabled"=> false,
                "expirationTime"=> null,
                "deviceLimit"=> 0,
                "userLimit"=> 0,
                "deviceReadonly"=> true,
                "token"=> null,
                "limitCommands"=> false,
                "poiLayer"=> null,
                "password"=> $password
            );

            // array_push($newUser, $attributes);
            

            $data = json_encode($newUser);
            return self::curl('/api/users','POST',self::$sessionId,$data,array(self::$jsonC));
        }

        public static function userUpdate($sessionId,$id,$name,$email,$password,$attributes){
            $id = $id;
            $name = $name;
            $email = $email;
            $password = $password;
            $readOnly = 'false';
            $administrator = 'false';
            $map = '';
            $latitude = '0';
            $longitude = '0';
            $zoom = '0';
            $twelveHourFormat = 'false';
            $coordinateFormat = '0';
            $disabled = 'false';
            $expirationTime = '';
            $deviceLimit = '-1';
            $userLimit = '-1';
            $deviceReadonly = 'false';
            $limitCommands = 'false';
            $token = '';
            $login = "";
            $phone = "";
            $poiLayer = "";
            $attributes = $attributes;
            $data='{"id":"'.$id.'","name":"'.$name.'","email":"'.$email.'","administrator":"'.$administrator.'","coordinateFormat":"'.$coordinateFormat.'","deviceLimit":"'.$deviceLimit.'","deviceReadonly":"'.$deviceReadonly.'","disabled":"'.$disabled.'","expirationTime":"'.$expirationTime.'","latitude":"'.$latitude.'","limitCommands":"'.$limitCommands.'","login":"'.$login.'","longitude":"'.$longitude.'","map":"'.$map.'","phone":"'.$phone.'","poiLayer":"'.$poiLayer.'","readonly":"'.$readOnly.'","token":"'.$token.'","twelveHourFormat":"'.$twelveHourFormat.'","userLimit":"'.$userLimit.'","zoom":"'.$zoom.'","password":"'.$password.'","attributes":'.$attributes.'}';
            return self::curl('/api/users/'.$id,'PUT',$sessionId,$data,array(self::$jsonC));
        }

        public static function userDelete($sessionId,$id){
            return self::curl('/api/users/'.$id,'DELETE',$sessionId,$data,array(self::$jsonC));
        }

        //Devices
        public static function devices($id=null){
            if($id != ''){
                $data='userId='.$id;
            }else{
                $data='';
            }            
            return self::curl('/api/devices?'.$data,'GET',self::$sessionId,'',array());
        }

        public static function deviceAdd($sessionId,$name,$uniqueId,$phone,$model,$category,$attributes){
            
            $id = '-1';
            $attributes = $attributes;
            $data='{"id":"'.$id.'","name":"'.$name.'","uniqueId":"'.$uniqueId.'","phone":"'.$phone.'","model":"'.$model.'","category":"'.$category.'","attributes":'.$attributes.'}';
            return self::curl('/api/devices','POST',$sessionId,$data,array(self::$jsonC));
        }

        public static function deviceUpdate($sessionId,$id,$name,$uniqueId,$phone,$model,$category,$attributes){
            $id = $id;
            $attributes = $attributes;
            $data='{"id":"'.$id.'","name":"'.$name.'","uniqueId":"'.$uniqueId.'","phone":"'.$phone.'","model":"'.$model.'","category":"'.$category.'","attributes":'.$attributes.'}';
            return self::curl('/api/devices/'.$id,'PUT',$sessionId,$data,array(self::$jsonC));
        }

        public static function deviceDelete($sessionId,$id){
            return self::curl('/api/devices/'.$id,'DELETE',$sessionId,$data,array(self::$jsonC));
        }

        //Geofences & Routes
        public static function geofences($sessionId){
            
            return self::curl('/api/geofences?'.$data,'GET',$sessionId,'',array());
        }

        public static function geofenceAdd($sessionId,$name,$description,$area,$attributes){
            
            $id = '-1';
            $attributes = $attributes;
            $data='{"id":"'.$id.'","name":"'.$name.'","description":"'.$description.'","area":"'.$area.'","attributes":'.$attributes.'}';
            return self::curl('/api/geofences','POST',$sessionId,$data,array(self::$jsonC));
        }

        public static function geofenceUpdate($sessionId,$id,$name,$description,$area,$attributes){
            $id = $id;
            $attributes = $attributes;
            $data='{"id":"'.$id.'","name":"'.$name.'","description":"'.$description.'","area":"'.$area.'","attributes":'.$attributes.'}';
            return self::curl('/api/geofences/'.$id,'PUT',$sessionId,$data,array(self::$jsonC));
        }

        public static function geofenceDelete($sessionId,$id){
            return self::curl('/api/geofences/'.$id,'DELETE',$sessionId,$data,array(self::$jsonC));
        }

        //Notifications
        public static function notificationsTypes($sessionId){
            
            return self::curl('/api/notifications/types?'.$data,'GET',$sessionId,'',array());
        }

        public static function notifications($sessionId){
            
            return self::curl('/api/notifications?'.$data,'GET',$sessionId,'',array());
        }

        public static function notificationAdd($sessionId,$type,$always,$notificators,$attributes){
            
            $id = '-1';
            $attributes = $attributes;
            $data='{"id":"'.$id.'","type":"'.$type.'","always":"'.$always.'","notificators":"'.$notificators.'","attributes":'.$attributes.'}';
            return self::curl('/api/notifications','POST',$sessionId,$data,array(self::$jsonC));
        }

        public static function notificationUpdate($sessionId,$id,$type,$always,$notificators,$attributes){
            $id = $id;
            $attributes = $attributes;
            $data='{"id":"'.$id.'","type":"'.$type.'","always":"'.$always.'","notificators":"'.$notificators.'","attributes":'.$attributes.'}';
            return self::curl('/api/notifications/'.$id,'PUT',$sessionId,$data,array(self::$jsonC));
        }

        public static function notificationDelete($sessionId,$id){
            return self::curl('/api/notifications/'.$id,'DELETE',$sessionId,$data,array(self::$jsonC));
        }

        public static function notificationTest($sessionId){
            return self::curl('/api/notifications/test','POST',$sessionId,$data,array(self::$jsonC));
        }

        //Permissions
        public static function assignUserDevice($userId,$deviceId){
            
            $data='{"userId":"'.$userId.'","deviceId":'.$deviceId.'}';
            
            return self::curl('/api/permissions','POST',$sessionId,$data,array(self::$jsonC));
        }

        public static function removeUserDevice($userId,$deviceId){
            
            $data='{"userId":"'.$userId.'","deviceId":'.$deviceId.'}';
            
            return self::curl('/api/permissions','DELETE',self::$sessionId,$data,array(self::$jsonC));
        }

        public static function assignUserManagedUser($userId,$managedUserId){
            
            $data='{"userId":'.$userId.',"managedUserId":'.$managedUserId.'}';
            
            return self::curl('/api/permissions','POST',self::$sessionId,$data,array(self::$jsonC));
        }

        public static function removeUserManagedUser($userId,$deviceId){
            
            $data='{"userId":'.$userId.',"managedUserId":'.$deviceId.'}';
            
            return self::curl('/api/permissions','DELETE',self::$sessionId,$data,array(self::$jsonC));
        }

        public static function assignDeviceGeofence($sessionId,$deviceId,$geofenceId){
            
            $data='{"deviceId":"'.$deviceId.'","geofenceId":'.$geofenceId.'}';
            
            return self::curl('/api/permissions','POST',$sessionId,$data,array(self::$jsonC));
        }

        public static function removeDeviceGeofence($sessionId,$deviceId,$geofenceId){
            
            $data='{"deviceId":"'.$deviceId.'","geofenceId":'.$geofenceId.'}';
            
            return self::curl('/api/permissions','DELETE',$sessionId,$data,array(self::$jsonC));
        }

        public static function assignDeviceNotification($sessionId,$deviceId,$notificationId){
            
            $data='{"deviceId":"'.$deviceId.'","notificationId":'.$notificationId.'}';
            
            return self::curl('/api/permissions','POST',$sessionId,$data,array(self::$jsonC));
        }

        public static function removeDeviceNotification($sessionId,$deviceId,$notificationId){
            
            $data='{"deviceId":"'.$deviceId.'","notificationId":'.$notificationId.'}';
            
            return self::curl('/api/permissions','DELETE',$sessionId,$data,array(self::$jsonC));
        }

        //Positions
        public static function positions($sessionId){
            
            return self::curl('/api/positions?'.$data,'GET',$sessionId,'',array());
        }

        public static function position($sessionId,$id){
            
            $data='id='.$id;
            
            return self::curl('/api/positions?'.$data,'GET',$sessionId,'',array());
        }

        //Reports
        public static function reportSummary($sessionId,$deviceId,$from,$to){
            
            $data='deviceId='.$deviceId.'&from='.$from.'&to='.$to;
            
            return self::curl('/api/reports/summary?'.$data,'GET',$sessionId,'',array());
        }

        public static function reportTrips($sessionId,$deviceId,$from,$to){
            
            $data='deviceId='.$deviceId.'&from='.$from.'&to='.$to;
            
            return self::curl('/api/reports/trips?'.$data,'GET',$sessionId,'',array());
        }

        public static function reportStops($sessionId,$deviceId,$from,$to){
            
            $data='deviceId='.$deviceId.'&from='.$from.'&to='.$to;
            
            return self::curl('/api/reports/stops?'.$data,'GET',$sessionId,'',array());
        }

        public static function reportRoute($sessionId,$deviceId,$from,$to){
            
            $data='deviceId='.$deviceId.'&from='.$from.'&to='.$to;
            
            return self::curl('/api/reports/route?'.$data,'GET',$sessionId,'',array());
        }

        public static function reportEvents($sessionId,$deviceId,$from,$to){
            
            $data='deviceId='.$deviceId.'&from='.$from.'&to='.$to;
            
            return self::curl('/api/reports/events?'.$data,'GET',$sessionId,'',array());
        }

        public static function reportChart($sessionId,$deviceId,$from,$to){
            
            $data='deviceId='.$deviceId.'&from='.$from.'&to='.$to;
            
            return self::curl('/api/reports/route?'.$data,'GET',$sessionId,'',array());
        }

        public static function reportEventsType($sessionId,$deviceId,$type,$from,$to){
            
            $data='deviceId='.$deviceId.'&from='.$from.'&to='.$to.'&type='.$type;
            
            return self::curl('/api/reports/events?'.$data,'GET',$sessionId,'',array());
        }

        //Commands
        public static function commandsTypes($sessionId,$deviceId){
            
            $data='deviceId='.$deviceId;
            
            return self::curl('/api/commands/types?'.$data,'GET',$sessionId,'',array());
        }

        public static function commandSend($sessionId,$deviceId,$type,$attributes){
            
            $id = '0';
            $description = 'true';
            $textChannel = 'false';
            $data='{"type":"'.$type.'","deviceId":"'.$deviceId.'","attributes":'.$attributes.',"description":'.$description.'}';
            return self::curl('/api/commands/send','POST',$sessionId,$data,array(self::$jsonC));
        }
            
        //curl	
        public static function curl($task,$method,$cookie,$data,$header) {
            
            $res=new stdClass();
            $res->responseCode='';
            $res->error='';
                        
            // $header[]="Cookie: ".$cookie;
            $arrayHeader = array_merge($cookie, $header);
    
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_PORT, "8082");
            curl_setopt($ch, CURLOPT_URL, self::$host.$task);
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);
            curl_setopt($ch, CURLOPT_HEADER, 1);
            curl_setopt($ch, CURLOPT_ENCODING, "");
            curl_setopt($ch, CURLOPT_MAXREDIRS, 10);
            curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
            
            if($method=='POST' || $method=='PUT' || $method=='DELETE') {
                curl_setopt($ch, CURLOPT_POST, 1);
                curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
            }
            if ($cookie != "")
                curl_setopt($ch, CURLOPT_HTTPHEADER,$arrayHeader);

            $data=curl_exec($ch);
            $size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
            
            if (preg_match('/^Set-Cookie:\s*([^;]*)/mi', substr($data, 0, $size), $c) == 1) self::$cookie = $c[1];
                $res->response = substr($data, $size);
            
            if(!curl_errno($ch)) {
                $res->responseCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            }
            else {
                $res->responseCode=400;
                $res->error= curl_error($ch);
            }
            
            curl_close($ch);
            return $res;
            }
        }

?>