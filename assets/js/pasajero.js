class Pasajero {
    // Constructor
    constructor(codigoEmpresa, nombreResponsable, idResponsable, emailResponsable, cedula, passwdResponsable, nombrePasajero, id, estado) {
        this.codigoEmpresa = codigoEmpresa || null;
        this.nombreResponsable = nombreResponsable || "";
        this.idResponsable = idResponsable || "";
        this.emailResponsable = emailResponsable || "";
        this.passwdResponsable = passwdResponsable || "";
        this.nombrePasajero = nombrePasajero || null;
        this.id = id || null;
        this.cedula = cedula || null;
        this.estado = estado || 0;
    }


    get Registrar() {
        var miAccion = $('#mdlTitle_Pasajero').html();
        $.ajax({
            type: "POST",
            url: "class/Pasajero.php",
            data: {
                action: miAccion,
                obj: JSON.stringify(pasajero)
            }
        })
            .done(function (e) {
                pasajero.ReadAll_list;
                var data = JSON.parse(e);
                var titulo = "Soporte!";
                var tipo = "success";

                switch (data) {
                    case "invalidCodeTransport":
                        titulo = "Empresa Transporte Invalida";
                        tipo = "info";
                        break;
                    case "pasajeroRepetido":
                        titulo = "El pasajero ya estaba registrado";
                        tipo = "info";
                        break;
                    case "registrado":
                        titulo = "Listo";
                        break;
                    case "actualizado":
                        titulo = "Actualizado";
                        break;
                    case "cedulaInvalida":
                        titulo = "La cedula ya se encuentra registrada";
                        tipo = "info";
                        break;
                }
                Swal.fire({
                    title: titulo,
                    type: tipo,
                    timer: 1500
                })
                $('#mdl_Pasajero').modal('hide');
            })
            .always(function (e) {

            })
            .fail(function (e) {
                // usuario.showError(e);
            });
    }

    get ReadAll_list() {
        var miAccion = 'ReadAll';
        $.ajax({
            type: "POST",
            url: "class/Pasajero.php",
            data: {
                action: miAccion,
                obj: JSON.stringify(pasajero)
            }
        })
            .done(function (e) {
                pasajero.drawPasajerosDataTable(e);
            })
            .fail(function (e) {
                // dataCenter.showError(e);
            });
    }

    get Search_cedula() {
        var miAccion = 'Search_cedula';
        $.ajax({
            type: "POST",
            url: "class/Pasajero.php",
            data: {
                action: miAccion,
                obj: JSON.stringify(pasajero)
            }
        })
            .done(function (e) {
                pasajero.loadPasajeroData(e);
            })
            .fail(function (e) {
                // dataCenter.showError(e);
            });
    }

    loadPasajeroData(e) {
        if (e != "null") {
            var dataPasajero = JSON.parse(e);
            $('#inp_identificacionPasajero').val(dataPasajero[0]["document"]);
            $('#inp_nombrePasajero').val(dataPasajero[0]["name"]);
            $('#inp_codTransportista').val(dataPasajero[0]["transportCode"]);
        }
    }

    EditarPasajero() {
        $.ajax({
            type: "POST",
            url: "class/Pasajero.php",
            data: {
                action: "LoadById",
                obj: JSON.stringify(pasajero)
            }
        })
            .done(function (e) {
                var dataPasajero = JSON.parse(e);
                $('#inp_identificacionPasajero').val(dataPasajero["document"]);
                $('#inp_nombrePasajero').val(dataPasajero["name"]);
                $('#inp_codTransportista').val(dataPasajero["transportCode"]);
                $('#tbl_pasajeros').css('display', 'none');
                $("#btn_registrarPasajero").css('display', 'none');
                $('#mdlTitle_Pasajero').html('Actualizar');
                $('#btn_crearPasajero').val('Guardar');
                $('#mdl_Pasajero').modal('show');
            })
    }

    EliminarPasajero() {
        Swal.fire({
            title: 'Esta seguro?',
            text: "Desea borrar este pasajero!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar!',
            cancelButtonText: 'No, cancelar!',
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    type: "POST",
                    url: "class/Pasajero.php",
                    data: {
                        action: "Delete",
                        obj: JSON.stringify(pasajero)
                    }
                })
                    .done(function (e) {
                        pasajero.ReadAll_list;                        
                        $('#tbl_pasajeros').show();
                        $("#panel_gestionPasajero").show();
                        $("#btn_registrarPasajero").show();
                        $('#mdl_Pasajero').modal('hide');
                        Swal.fire(
                            'Eliminado!',
                            'Pasajero Eliminado.',
                            'success'
                        )

                    })
                    .always(function (e) {

                    })
                    .fail(function (e) {
                        // usuario.showError(e);
                    });
            }
        })
    }

    drawPasajerosDataTable(e) {
        if (e) {
            var dataPasajero = JSON.parse(e);

            $('#tbl_pasajeros').DataTable({
                data: dataPasajero,
                destroy: true,
                autoWidth: false,
                paging: false,
                ordering: false,
                searching: false,
                info: false,
                order: [
                    [1, "asc"]
                ],
                columns: [
                    {
                        title: "id",
                        data: "id",
                        targets: 0,
                        visible: false
                    },
                    {
                        title: "Nom",
                        data: "name",
                        width: "95%",
                        targets: 1
                    },
                    {
                        title: "Op",
                        targets: 3,
                        visible: true,
                        width: "5%",
                        mRender: function (data, type, row) {
                            return pasajero.drawBoton(row.id, row.status);
                        }
                    }
                ],
                fnDrawCallback: function () {
                    $("#tbl_pasajeros thead").remove();
                }
            });

            $('#tbl_pasajeros tbody').on('click', 'td', function () {
                if ( ! $(this.firstChild).hasClass("apple-switch") ){
                    pasajero.id = $('#tbl_pasajeros').DataTable().row(this.parent).data().id;
                    $('#btn_frmEliminarPasajer').show();
                    pasajero.EditarPasajero();
                }
            });

        }
    }

    handleStatus(obj, id) {
        pasajero.id = id;
        if (obj.checked) {
            pasajero.estado = 1;
            pasajero.ActualizaEstado();
        }
        else {
            pasajero.estado = 0;
            pasajero.ActualizaEstado();
        }
    }

    ActualizaEstado() {
        $.ajax({
            type: "POST",
            url: "class/Pasajero.php",
            data: {
                action: "UpdateEstado",
                obj: JSON.stringify(pasajero)
            }
        })
            .done(function (e) {
                if (e) {
                    var dataEstado = JSON.parse(e);
                    var titulo, tipo = "";
                    switch (dataEstado["estado"]) {
                        case 0:
                            tipo = "info";
                            titulo = 'Transporte Deshabilitado';
                            break;
                        case 1:
                            tipo = "success";
                            titulo = 'Transporte Habilitado';
                            break;
                        default:
                            tipo = "error";
                            titulo = 'Contactar Soporte';
                            break;

                    }
                    Swal.fire({
                        position: 'top-start',
                        type: tipo,
                        title: titulo,
                        showConfirmButton: false,
                        width: '40%',
                        timer: 1000
                    })
                }
            })
    }

    drawBoton(id, estado) {
        switch (estado) {
            case "0":
                estado = "";
                break;
            case "1":
                estado = "checked";
                break;
            default:
                estado = "";
                break;

        }

        var dropPasajero = `<input class="apple-switch" onclick='pasajero.handleStatus(this,${id})' ${estado} type="checkbox">`;
        return dropPasajero;
    }
}

let pasajero = new Pasajero();