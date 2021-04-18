$(document).ready(function() {

    const $tableID = $('#table')




    $tableID.on('click', '.table-remove', function(e) {
        e.preventDefault()

        $target = $(e.target)

        const ids = $target.attr('id')
        let value
        $.get("http://localhost:2777/view-info", data => {
            $(data).each(function(index, element) {
                $(element.teeth).each(function(index, elementT) {
                    $(elementT.payments).each(function(index, elementP) {
                        if (elementP._id == ids) {
                            value = elementP.value
                        }
                    })
                })
            })
        })



        $('#ConfrmRemoveModal').modal('show')
        $('#conf-remove').click(function() {

            let Pinfo = {
                id: ids,
                val: value
            }
            $.post("http://localhost:2777/deletePayment", Pinfo)
            $('#ConfrmRemoveModal').modal('hide')
            $($target).parents('tr').toggle(200, () => {
                $($target).parents('tr').detach()
            })

        })

    })


    $('#search').keyup(function() {
        var input, filter, table, tr, td, i, txtValue
        input = $("#search")
        filter = input.val().toUpperCase()
        table = document.getElementById("p-tb")
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

    $('#toothChart').hide()
    $('#chart').click(() => {
        $('#toothChart').toggle(200)
    })


    let get = () => $.get("http://localhost:2777/view-info", data => {
        $('#p-tb').html('')
        $(data).each(function(index, element) {
            $(element.teeth).each(function(index, elementT) {
                $(elementT.payments).each(function(index, elementP) {
                    $('#p-tb').append("<tr id='" + elementP._id + "' pid='" + element._id + "'><td  class='p-name'>" + element.name + '</td><td class="tnum">' + elementT.number +
                        '</td> <td class="tsta">' + elementT.status + '</td> <td>' + elementT.cost + '</td> <td>' + elementP.value + '</td> <td>' + elementP.date + '</td> <td> <span class="table-remove"><button type="button"  id="' + elementP._id + '"class="btn btn-danger btn-rounded btn-sm my-0 " pid="' + elementT._id + '">Remove</button></span></td></tr> </table>')
                })
            })
        })
    })

    get()






})