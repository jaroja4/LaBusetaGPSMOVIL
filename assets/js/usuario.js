class Usuario {
    // Constructor
    constructor(id, usuario, passwd, cedula, attributes, nombre, telefono, codigoEmpresa, correo, fechaCreacion, rol) {
        this.id = id || null;
        this.usuario = usuario || "";
        this.passwd = passwd || "";
        this.cedula = cedula || "";
        this.attributes = attributes || {};
        this.nombre = nombre || "";
        this.telefono = telefono || "";
        this.codigoEmpresa = codigoEmpresa || "";
        this.correo = correo || null;
        this.fechaCreacion = fechaCreacion || [];
        this.rol = rol || "";
    }

    get Registrar() {
        var miAccion = 'Registrar';
        this.attributes = { cedula: this.cedula, codigoEmpresa: this.codigoEmpresa };
        $.ajax({
            type: "POST",
            url: "class/Usuario.php",
            data: {
                action: miAccion,
                obj: JSON.stringify(usuario)
            }
        })
            .done(function (e) {
                var data = JSON.parse(e);
                if (data) {
                    switch (data) {
                        case "existe":
                            Swal.fire({
                                type: 'info',
                                title: 'Usted ya posee cuenta con nosotros!'
                            })
                            break;
                        case "success":
                            $('#panel_crearCuenta').css('display', 'none');
                            $("#panel_volver").show();
                            break;
                        default:
                            alert("ERROR");
                            break;
    
                    }
                }
                else{
                    alert("ERROR");
                }
            })
            .always(function (e) {

            })
            .fail(function (e) {
                // usuario.showError(e);
            });
    }

    get Buscar_id() {
        var miAccion = 'Buscar_id';
        this.id = this.codigoEmpresa;
        this.correo = "sinEmail";
        this.attributes = { cedula: "sinCedula" };
        $.ajax({
            type: "POST",
            url: "class/Usuario.php",
            data: {
                action: miAccion,
                obj: JSON.stringify(usuario)
            }
        })
            .done(function (e) {
                var data = JSON.parse(e);
                data != false ? usuario.ocultaFrmEmpresa : usuario.empresaError;
            })
            .always(function (e) {
                this.id = null;
            })

    }

    get ocultaTodosFrm() {
        this.id = null;
        $('#panel_codigoEmpresa').css('display', 'none');
        $('#panel_crearCuenta').css('display', 'none');
        $('#panel_volver').css('display', 'none');
    }

    get ocultaFrmEmpresa() {
        this.id = null;
        $('#panel_codigoEmpresa').css('display', 'none');
        $('#panel_crearCuenta').show();
    }

    get empresaError() {
        $("#inp_codigoEmpresa").val("");
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'El codigo de empresa no existe!',
            timer: 1500
        })
    }
    // get clearModalNuevoUsuario(){
    //     $("#inp_nombre").val("");
    //     $("#inp_identificacion").val("");
    //     $("#inp_correo").val("");
    //     $("#inp_usuario").val("");
    //     $("#inp_empresa").val("");
    //     $("#inp_searchValue").val("");      
    //     $('#sel_tipoFiltro').val("mail").change();
    //     $('#inp_rol').val("Visitante").change();
    // }

    // get Login() {
    //     var miAccion = 'Login';
    //     $.ajax({
    //         type: "POST",
    //         url: "class/Usuario.php",
    //         data: {
    //             action: miAccion,
    //             obj: JSON.stringify(usuario)
    //         }
    //     })
    //     .always(function (e) {
    //         usuario.passwd = null;
    //     })
    //     .done(function (e) {                
    //         var data = JSON.parse(e);
    //         if (data){
    //             usuario.id = data.id;
    //             device.LoadbyUser;
    //             $(".panelPrincipal").removeAttr("style");
    //             $('#mdl_login').modal('toggle');
    //         }


    //     })
    //     .fail(function (e) {
    //         // usuario.showError(e);
    //     })
    // }

    // get logintraccar () {
    //     $.ajaxSetup({
    //         crossDomain: true,
    //         xhrFields: {
    //             withCredentials: true
    //         }
    //       });
    //       $.post("http://gpsmovilpro.com:8082/api/session", {email:usuario.correo, password:usuario.passwd})
    //        .done(function(data){

    //        });
    // }

}

let usuario = new Usuario();