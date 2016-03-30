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

$("#form-categories").submit(function(e) {
    e.preventDefault();

    var formData = $(this).serializeObject();

    $.post("/authenticate", JSON.stringify(formData), function(res) {
        console.log(res);
        if (res.type == false) {
            $('#form-login .alert-warning').text(res.data).show();
        } else {
            //Cookie no Server - window.document.cookie = 'session=' + res.data.id;
            window.location = '/';
        }
    });
});


$(function() {
    $.get("/categoriesList", function(res) {
		console.log(res);
		$.each(res.data, function(index, value ){
			$("#categoriesTable").last().append("<tr><td>"+value.name+"</td></tr>");
		});        
    });
});