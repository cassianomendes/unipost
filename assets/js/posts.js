$(function() {
    loadCategories();
});

$("#form-create-post").submit(function(e) {
    e.preventDefault();

    var formData = $(this).serializeObject();

    $.post("/api/posts/create", JSON.stringify(formData), function(res) {
        if (res.type == false) {
            $('#form-create-post .alert-warning').text(res.data).show();
        } else {
            window.location = '/';
        }
    });
});