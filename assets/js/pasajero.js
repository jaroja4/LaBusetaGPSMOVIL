class Pasajero {
    // Constructor
    constructor(codigoEmpresa, nombreResponsable, idResponsable, emailResponsable, cedula, passwdResponsable, nombrePasajero, id) {
        this.codigoEmpresa = codigoEmpresa || null;
        this.nombreResponsable = nombreResponsable || "";
        this.idResponsable = idResponsable || "";
        this.emailResponsable = emailResponsable || "";
        this.passwdResponsable = passwdResponsable || "";
        this.nombrePasajero = nombrePasajero || null;
        this.id = id || null;
        this.cedula = cedula || null;
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

    EditarPasajero(obj) {
        pasajero.id = obj;
        $.ajax({
            type: "POST",
            url: "class/Pasajero.php",
            data: {
                action: "LoadById",
                id: obj
            }
        })
            .done(function (e) {
                var dataPasajero = JSON.parse(e);
                $('#inp_identificacionPasajero').val(dataPasajero[0]["document"]);
                $('#inp_nombrePasajero').val(dataPasajero[0]["name"]);
                $('#inp_codTransportista').val(dataPasajero[0]["transportCode"]);
                $('#tbl_pasajeros').css('display', 'none');
                $("#btn_registrarPasajero").css('display', 'none');
                $('#mdlTitle_Pasajero').html('Actualizar');
                $('#btn_crearPasajero').val('Guardar');
                $('#mdl_Pasajero').modal('show');
            })
    }

    CancelaViajePasajero(obj) {
        alert("Cancelar viaje para pasajero con id: " + obj);
    }

    EliminarPasajero(obj) {
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
                        id: obj
                    }
                })
                    .done(function (e) {
                        pasajero.ReadAll_list;

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

            $('#tbl_pasajeros tbody').on('click', 'tr', function () {
                // pasajero.clear;
                // pasajero.id = $('#tbl_pasajeros').DataTable().row(this).data().id;
                // pasajero.cargarResponsablebyID;
            });

        }
    }

    handleClick(obj, id) {
        if (obj.checked) {
            // alert("check" + id);
            Swal.fire({
                position: 'top-start',
                type: 'success',
                title: 'Transporte Habilitado',
                showConfirmButton: false,
                timer: 1000,
                width: '40%'
            })
        }
        else {
            Swal.fire({
                position: 'top-start',
                type: 'info',
                title: 'Transporte Deshabilitado',
                showConfirmButton: false,
                width: '40%',
                timer: 1000
            })
        }
    }

    drawBoton(id, estado) {
        var btn_clase = "";
        var btn_viaje = "";
        switch (estado) {
            case "0":
                btn_clase = "danger";
                btn_viaje = `<p style=" margin-left: 5px;" onclick="pasajero.HabilitaViajePasajero(${id})">Habilitar</p>`;
                break;
            case "1":
                btn_clase = "success";
                btn_viaje = `<p style=" margin-left: 5px;" onclick="pasajero.DeshabilitaViajePasajero(${id})">Deshabilitar</p>`;
                break;
            default:
                btn_clase = "danger";
                btn_viaje = `<p style=" margin-left: 5px;" onclick="pasajero.HabilitaViajePasajero(${id})">Habilitar</p>`;
                break;

        }

        var dropPasajero = `<input class="apple-switch" onclick='pasajero.handleClick(this,${id})' type="checkbox">`;
        //     var dropPasajero = `<div class="dropdown">
        //     <button class="btn btn-${btn_clase} dropdown-toggle" type="button" data-toggle="dropdown">
        //     <i class="fa fa-address-card-o " aria-hidden="true"></i> 
        //     <span class="caret"></span></button>
        //     <ul class="dropdown-menu">
        //       <li><p style=" margin-left: 5px;" onclick="pasajero.EditarPasajero(${id})">Modificar</p></li>
        //       <li>${btn_viaje}</li>
        //       <li><p style=" margin-left: 5px;" onclick="pasajero.EliminarPasajero(${id})">Eliminar</p></li>
        //     </ul>
        //   </div>`;
        return dropPasajero;
    }
}

let pasajero = new Pasajero();