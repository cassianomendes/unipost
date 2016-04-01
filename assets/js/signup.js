$(function() {
    $("#form-signup").submit(function(e) {
        e.preventDefault();

        var formData = $(this).serializeObject();

        if (formData.password !== formData.confirmPassword) {
            $('#form-signup .alert-warning').text("As senhas não coincidem.").show();
            return;
        }

        $.post("/api/signup", JSON.stringify(formData), function(res) {
            if (res.type == false) {
                $('#form-signup .alert-warning').text(res.data).show();
            } else {
                window.location = '/';
            }
        });
    });
});