class Pasajero {
    // Constructor
    constructor(codigoEmpresa, nombreResponsable, identificacionResponsable, emailResponsable, passwdResponsable, nombrePasajero, identificacionPasajero) {
        this.codigoEmpresa = codigoEmpresa || null;
        this.nombreResponsable = nombreResponsable || "";
        this.identificacionResponsable = identificacionResponsable || "";
        this.emailResponsable = emailResponsable || "";
        this.passwdResponsable = passwdResponsable || "";
        this.nombrePasajero = nombrePasajero || null;
        this.identificacionPasajero = identificacionPasajero || null;
    }


    get Registrar() {
        var miAccion = 'Registrar';
        $.ajax({
            type: "POST",
            url: "class/Pasajero.php",
            data: {
                action: miAccion,
                obj: JSON.stringify(pasajero)
            }
        })
            .done(function (e) {
                var data = JSON.parse(e);
                if (data) {
                    console.log("OK");
                    // var selData = data.map(function (data){return {value:data.uniqueId,text:data.name}});
                    // $("#sel_buscaVehiculo").select2({ "data": selData });
                    // $("#sel_buscaVehiculo").val("-1");
                    // $('#sel_buscaVehiculo').select2().trigger('change');
                    // $('#sel_buscaVehiculo').html('');
                    // $.each(data,
                    //     function (key, val) {
                    //         $('#sel_buscaVehiculo').append('<option value="' + val.uniqueId + '">' + val.name + '</option>');
                    //     })

                    // $('#sel_buscaVehiculo').append('<option value="null" selected disabled hidden>Seleccione un Autorizador </option>').change();

                }
            })
            .fail(function (e) {
                // usuario.showError(e);
            });
    }
}

let pasajero = new Pasajero();