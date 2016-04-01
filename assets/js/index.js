var dialog;

$(function() {
    $('#search-post').keypress(function(e) {
        if (e.which == 13) { // ENTER
            _loadPosts($(this).val());
        }
    });

    dialog = $("#dialog-post-view").dialog({
        autoOpen: false,
        height: 300,
        width: 350,
        modal: true,
        buttons: {
            // "Salvar": addItem,
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

    function _loadPosts(like) {
        var url = '/api/posts/mostRecents' + (like ? '?title=' + like : '');
        $.getJSON(url, function(res) {
            if (res.type == false) {
                return;
            }
            $('tbody', '#table-posts').find('tr').remove();
            $(res.data).each(function(index, item) {
                var trElement = '<tr item-id=' + item.id + '>' +
                    '	<td>' +
                    '		' + (index + 1) +
                    '	</td>' +
                    '	<td>' +
                    '		' + item.title +
                    '	</td>' +
                    '	<td>' +
                    '		' + item.category +
                    '	</td>' +
                    '	<td>' +
                    '		' + item.author +
                    '	</td>' +
                    '	<td>' +
                    '		<a onClick="openDialog(' + item.id + ')">visualizar</a>' +
                    '	</td>' +
                    '<tr>';
                $('#table-posts tbody').append($(trElement));
            });
        });
    }
});

function openDialog(id) {
    var url = '/api/posts?id=' + id;
    $.getJSON(url, function(res) {
        if (res.type == false) {
            return;
        }
        $('#dialog-post-view').empty().append(res.data.content);
        dialog.dialog("option", "title", res.data.title).dialog("open");
    });
}