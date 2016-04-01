var dialog;
var postId;

function _loadPosts(like) {
    var url = '/api/posts/allPendent' + (like ? '?title=' + like : '');
    $.getJSON(url, function(res) {
        if (res.type == false) {
            return;
        }
        $('tbody', '#table-posts').find('tr').remove();
        $(res.data).each(function(index, item) {
            var tr = $('<tr>');
            tr.attr('id', item.id);
            
            tr.append($('<td>').text(index + 1));
            tr.append($('<td>').text(item.title));
            tr.append($('<td>').text(item.category));
            tr.append($('<td>').text(item.author));
            
            var link = $('<a>');
            link.text('Visualizar');
            link.addClass('link-post-view');
            link.click(function() {
               openDialog(item.id); 
            });
            
            tr.append($('<td>').append(link));
            
            $('#table-posts tbody').append(tr);
        });
    });
}

function _loadCategories() {
    $.getJSON('/api/categories', function(res) {
        $(res.data).each(function(index, item) {
            var option = '<option value="' + item.id + '">' + item.name + '</option>';
            $('#select-category').append($(option));
        });
    });
}

function openDialog(id) {
    var url = '/api/posts?id=' + id;
    $.getJSON(url, function(res) {
        if (res.type == false) {
            return;
        }
        postId = id;
        $('#dialog-post-view').empty().append(res.data.content);
        dialog.dialog("option", "title", res.data.title).dialog("open");
    });
}

function removePost() {
    $.post('/api/posts/delete', { id: postId }, function() {
        dialog.dialog("close");
        _loadPosts($('#search-post').val());
    });
}

function approvePost() {
    $.post('/api/posts/approve', { id: postId } , function() {
        dialog.dialog("close");
        _loadPosts($('#search-post').val());
    });
}

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

    if ($('#select-category').length > 0)
        _loadCategories();

    $('#search-post').keypress(function(e) {
        if (e.which == 13) { // ENTER
            _loadPosts($(this).val());
        }
    });
    
    dialog = $("#dialog-post-view").dialog({
        autoOpen: false,
        height: 400,
        width: 500,
        modal: true,
        buttons: {
            "Aprovar": approvePost,
            "Excluir": removePost,
            "Fechar": function() {
                dialog.dialog("close");
            }
        },
        close: function() {
            $(':input', '#formNewIte')
                .not(':button, :submit, :reset, :hidden')
                .val('')
                .removeAttr('checked')
                .removeAttr('selected');
        }
    });

    _loadPosts();
});