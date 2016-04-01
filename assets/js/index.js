$(function() {
    $('#search-post').keypress(function(e) {
        if (e.which == 13) { // ENTER
            _loadPosts($(this).val());
        }
    });

    _loadPosts();

    function _loadPosts(like) {
        var url = '/api/posts' + (like ? '?title=' + like : '');
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
                    '		<a onClick="openDialog(' + item.content + ')">visualizar</a>' +
                    '	</td>' +
                    '<tr>';
                $('#table-posts tbody').append($(trElement));
            });
        });
    }
});