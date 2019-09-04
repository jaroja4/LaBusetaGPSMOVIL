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

    get Search_cedula(){
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

    loadPasajeroData(e){        
        var dataPasajero = JSON.parse(e);

        $('#inp_identificacionPasajero').val(dataPasajero[0]["document"]);
        $('#inp_nombrePasajero').val(dataPasajero[0]["name"]);
        $('#inp_codTransportista').val();
        

    }

    EditarPasajero(obj){
        var pasajeroEditar = $('#tbl_pasajeros').DataTable().row(obj.parentElement.parentElement.parentElement.parentElement.parentElement).data().id
        alert (pasajeroEditar);
    }

    drawPasajerosDataTable(e) {
        if (e){
            var dataPasajero = JSON.parse(e);
            
            $('#tbl_pasajeros').DataTable({
                data: dataPasajero,
                destroy: true,
                autoWidth: false,
                paging:   false,
                ordering: false,
                searching: false,
                info:     false,
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
                        mRender: function (e) {
                            return dropPasajero;
                        }
                    }
                ],
                fnDrawCallback: function() {
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
}

let pasajero = new Pasajero();

dropPasajero = `<div class="dropdown">
    <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">
    <i class="fa fa-address-card-o " aria-hidden="true"></i> 
    <span class="caret"></span></button>
    <ul class="dropdown-menu">
      <li><p onclick="pasajero.CancelaViajePasajero(this)">Cancelar Viaje</p></li>
      <li><p onclick="pasajero.EditarPasajero(this)">Editar Nombre</p></li>
      <li><p onclick="pasajero.EliminarPasajero(this)">Eliminar</p></li>
    </ul>
  </div>`;