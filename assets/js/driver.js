class Driver {
    // Constructor
    constructor(id) {
        this.id = id || null;
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

    loadSelectDevice(e) {        
        var dataDevice = JSON.parse(e);
        var $sel_frmSelDevice = $("#sel_frmSelDevice");
        $.each(dataDevice, function() {
            $sel_frmSelDevice.append($("<option />").val(this.id).text(this.name));
        });
    }
}

let driver = new Driver();