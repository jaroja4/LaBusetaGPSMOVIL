class Device {
    // Constructor
    constructor(id, nombre, empresa, correo, fechaCreacion) {
        this.id = id || null;
        this.nombre = nombre || "";
        this.empresa = empresa || "";
        this.correo = correo || null;
        this.fechaCreacion = fechaCreacion || [];
    }

    get LoadbyUser() {
        var miAccion = 'LoadbyUser';
        $.ajax({
            type: "POST",
            url: "class/Device.php",
            data: {
                action: miAccion,
                id: usuario.id
            }
        })
            .done(function (e) {
                var data = JSON.parse(e);
                if (data) {
                    var selData = data.map(function (data){return {id:data.uniqueId,text:data.name}});
                    $("#sel_buscaDevice").select2({ "data": selData });
                    $("#sel_buscaDevice").val("-1");
                    $('#sel_buscaDevice').select2().trigger('change');
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

let device = new Device();