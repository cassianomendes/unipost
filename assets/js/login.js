$(function() {
    $("#form-login").submit(function(e) {
        e.preventDefault();

        var formData = $(this).serializeObject();

        $.post("/api/authenticate", JSON.stringify(formData), function(res) {
            console.log(res);
            if (res.type == false) {
                $('#form-login .alert-warning').text(res.data).show();
            } else {
                window.location = '/';
            }
        });
    });
});