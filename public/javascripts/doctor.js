$(document).ready(() => {
    let url = "https://dentistapp-7007.herokuapp.com"
    const $tableID = $('#table')

    $('#add').click(function() {
        $("#name").val('')
    })

    $('#conf-add').on('click', (e) => {
        e.preventDefault()
        let dr = {
            name: $("#name").val()
        }
        $.post(url + "/post-dr", dr).then(getList())

    })

    $tableID.on('click', '.removeBtn', function(e) {

        e.preventDefault()

        $target = $(e.target)

        const id = $target.attr('id')

        $('#ConfrmRemoveModal').modal('show')
        $('#conf-remove').click(function() {
            $.ajax({
                method: 'DELETE',
                url: url + '/d',
                data: {
                    id
                },
                success: function(response) {
                    $('#ConfrmRemoveModal').modal('hide')
                    $($target).parents('tr').detach()
                },
                error: function(err) {
                    console.log(err)

                }
            })
        })
    })
    $('#search').keyup(function() {
        var input, filter, table, tr, td, i, txtValue
        input = $("#search")
        filter = input.val().toUpperCase()
        table = document.getElementById("s-list")
        tr = table.getElementsByTagName("tr")
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0]
            console.log(td)
            if (td) {
                txtValue = td.textContent || td.innerText
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = ""
                } else {
                    tr[i].style.display = "none"
                }
            }
        }
    })
    let getList = () =>
        $.get(url + "/view-dr", data => {
            $('#s-tb').html('')
            $(data).each(function(index, element) {

                $('#s-tb').append("<tr><td  class='text-center'>" + element['name'] + '</td> <td> <span class="table-remove"><button type="button"  id="' + element['_id'] + '"class="btn btn-danger btn-rounded btn-sm my-0 text-center removeBtn">Remove</button></span></td></tr> </table>')
            })
        })
    getList()

})