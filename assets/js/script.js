$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$("#form-login").submit(function(e) {
    e.preventDefault();

    var formData = JSON.stringify($(this).serializeObject());

    $.post("/authenticate", formData, function(res) {
        console.log(res);
        if (res.type == false) {
            $('#form-login .alert-warning').text(res.data).show();
        } else {
            window.document.cookie = 'session=' + res.data.id;
            window.location = '/';
        }
    });
});

$("#form-signup").submit(function(e) {
    e.preventDefault();

    var formData = JSON.stringify($(this).serializeObject());

    $.post("/signup", formData, function(res) {

    });
});