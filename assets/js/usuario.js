class Usuario {
    // Constructor
    constructor(id, usuario, passwd, cedula, nombre, empresa, correo, fechaCreacion, rol) {
        this.id = id || null;
        this.usuario = usuario || "";
        this.passwd = passwd || "";
        this.cedula = cedula || "";
        this.nombre = nombre || "";
        this.empresa = empresa || "";
        this.correo = correo || null;
        this.fechaCreacion = fechaCreacion || [];
        this.rol = rol || "";
    }

    get clearModalNuevoUsuario(){
        $("#inp_nombre").val("");
        $("#inp_identificacion").val("");
        $("#inp_correo").val("");
        $("#inp_usuario").val("");
        $("#inp_empresa").val("");
        $("#inp_searchValue").val("");      
        $('#sel_tipoFiltro').val("mail").change();
        $('#inp_rol').val("Visitante").change();
    }

    get Login() {
        var miAccion = 'Login';
        $.ajax({
            type: "POST",
            url: "class/Usuario.php",
            data: {
                action: miAccion,
                obj: JSON.stringify(usuario)
            }
        })
        .always(function (e) {
            usuario.passwd = null;
        })
        .done(function (e) {                
            var data = JSON.parse(e);
            if (data){
                usuario.id = data.id;
                device.LoadbyUser;
                $(".panelPrincipal").removeAttr("style");
                $('#mdl_login').modal('toggle');
            }
            
            
        })
        .fail(function (e) {
            // usuario.showError(e);
        })
    }
}

let usuario = new Usuario();