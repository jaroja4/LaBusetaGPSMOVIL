class Driver {
    // Constructor
    constructor(id, idPasajero, idBusetica, pasajeroEstado) {
        this.id = id || null;
        this.idPasajero = idPasajero || null;
        this.idBusetica = idBusetica || null;
        this.pasajeroEstado = pasajeroEstado || null;
    }

    get ReadDeviceByDriver() {
        var miAccion = 'ReadDeviceByDriver';
        $.ajax({
            type: "POST",
            url: "class/Driver.php",
            data: {
                action: miAccion,
                obj: JSON.stringify(driver)
            }
        })
            .done(function (e) {
                driver.loadSelectDevice(e);
            })
            .fail(function (e) {
                // dataCenter.showError(e);
            });
    }

    get ReadPassagerByTransportCode(){
        $.ajax({
            type: "POST",
            url: "class/Driver.php",
            data: {
                action: "ReadPassagerByTransportCode",
                obj: JSON.stringify(driver)
            }
        })
            .done(function (e) {
                driver.drawPasajerosDataTable(e);
            })
            .fail(function (e) {
                // dataCenter.showError(e);
            });
    }

    get PasajeroByBusetica(){
        $.ajax({
            type: "POST",
            url: "class/Driver.php",
            data: {
                action: "PasajeroByBusetica",
                obj: JSON.stringify(driver)
            }
        })
            .done(function (e) {
                // driver.drawPasajerosDataTable(e);
            })
            .fail(function (e) {
                // dataCenter.showError(e);
            });
    }

    handleStatus(obj, idPasajero) {
        driver.idPasajero = idPasajero;
        if (obj.checked) {
            driver.pasajeroEstado = 1;
            driver.PasajeroByBusetica;
        }
        else {
            driver.pasajeroEstado = 0;
            driver.PasajeroByBusetica;
        }
    }

    drawPasajerosDataTable(e) {
        if (e) {
            var dataPasajero = JSON.parse(e);

            $('#tbl_pasajeros').DataTable({
                data: dataPasajero,
                language: {
                    "emptyTable": "Sin pasajeros registrados"
                },
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
                            return driver.drawBoton(row.id, row.status);
                        }
                    }
                ],
                fnDrawCallback: function () {
                    $("#tbl_pasajeros thead").remove();
                }
            });

            // $('#tbl_pasajeros tbody').on('click', 'td', function () {
            //     if ( ! $(this.firstChild).hasClass("apple-switch") ){
            //         pasajero.id = $('#tbl_pasajeros').DataTable().row(this.parent).data().id;
            //         $('#btn_frmEliminarPasajer').show();
            //         pasajero.EditarPasajero();
            //     }
            // });

        }
    }

    loadSelectDevice(e) {        
        var dataDevice = JSON.parse(e);
        $("#sel_frmSelDevice").empty();
        var sel_frmSelDevice = $("#sel_frmSelDevice");
        $.each(dataDevice, function() {
            sel_frmSelDevice.append($("<option />").val(this.id).text(this.name));
        });
        driver.idBusetica = sel_frmSelDevice.val();
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

        var dropPasajero = `
            <div style="text-align: right;">
                <input class="apple-switch" onclick='driver.handleStatus(this,${id})' ${estado} type="checkbox">
            </div>`;
        return dropPasajero;
    }
}

let driver = new Driver();