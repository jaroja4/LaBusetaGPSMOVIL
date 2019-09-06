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
                pasajero.ReadAll_list;
                var data = JSON.parse(e);
                if (data) {
                    Swal.fire({
                        title: 'Listo!',
                        type: 'success',
                        timer: 1500
                    })
                }
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
        var dataPasajero = JSON.parse(e);

        $('#inp_identificacionPasajero').val(dataPasajero[0]["document"]);
        $('#inp_nombrePasajero').val(dataPasajero[0]["name"]);
        $('#inp_codTransportista').val();


    }

    EditarPasajero(obj) {
        alert("Editar pasajero con id: " + obj);
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
                            return pasajero.drawBoton(row.id);
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

    drawBoton(id) {
        var dropPasajero = `<div class="dropdown">
        <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">
        <i class="fa fa-address-card-o " aria-hidden="true"></i> 
        <span class="caret"></span></button>
        <ul class="dropdown-menu">
          <li><p onclick="pasajero.CancelaViajePasajero(${id})">Cancelar Viaje</p></li>
          <li><p onclick="pasajero.EditarPasajero(${id})">Editar Nombre</p></li>
          <li><p onclick="pasajero.EliminarPasajero(${id})">Eliminar</p></li>
        </ul>
      </div>`;
      return dropPasajero;
    }
}

let pasajero = new Pasajero();