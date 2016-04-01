$(function() {
    $("#form-create-post").submit(function(e) {
        e.preventDefault();

        var formData = $(this).serializeObject();

        $.post("/api/posts", JSON.stringify(formData), function(res) {
            if (res.type == false) {
                $('#form-create-post .alert-warning').text(res.data).show();
            } else {
                window.location = '/';
            }
        });
    });

    _loadCategories();

    function _loadCategories() {
        $.getJSON('/api/categories', function(res) {
            $(res.data).each(function(index, item) {
                var option = '<option value="' + item.id + '">' + item.name + '</option>';
                $('#select-category').append($(option));
            });
        });
    }
});