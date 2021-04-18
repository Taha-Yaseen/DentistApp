$(document).ready(function() {

    for (let i = 1; i < 5; i++)
        for (let j = 1; j < 9; j++)
            $('#number').append('<option value="' + i + j + '">' + i + j + '</option>')

    let getStat = () =>
        $.get("http://localhost:2777/view-stat", data => {
            $('#status').html('')
            $(data).each(function(index, element) {
                $('#status').append('<option value="' + element.name + '">' + element.name + '</option>')
            })
        })

    getStat()
    const $tableID = $('#table')


    $tableID.on('click', '.table-remove', function(e) {
        e.preventDefault()

        $target = $(e.target)

        const ids = $target.attr('id')

        let value
        $.get("http://localhost:2777/view-info", data => {
            $(data).each(function(index, element) {
                $(element.teeth).each(function(index, elementT) {
                    if (elementT._id == ids) {
                        value = elementT.tot
                    }
                })
            })
        })
        $('#ConfrmRemoveModal').modal('show')
        $('#conf-remove').click(function() {
            console.log("tootn remove clicked")
            let Tinfo = {
                id: ids,
                val: value
            }
            $.post("http://localhost:2777/deleteTeeth", Tinfo)
            $('#ConfrmRemoveModal').modal('hide')
            $($target).parents('tr').toggle(200, () => {
                $($target).parents('tr').detach()
            })

        })

    })
    $tableID.on('click', '.table-edit', function(e) {
        e.preventDefault()
        $target = $(e.target)
        const id = $target.attr('id')
        $('#modalTeethForm').modal('show')
        $.get("http://localhost:2777/view-info", data => {
            $(data).each(function(index, element) {
                $(element.teeth).each(function(index, elementT) {
                    if (elementT._id == id) {
                        $('#pName').text(element.name)
                    }
                })
            })
        })
        $('#number').find('option').prop("selected", false);
        $('#status').find('option').prop("selected", false);









        $.get("http://localhost:2777/view-info", data => {
            $(data).each(function(index, element) {
                $(element.teeth).each(function(index, elementT) {
                    if (elementT._id == id) {

                        $.each(elementT.number.split(","), function(i, e) {
                            $("#number option[value='" + e + "']").prop("selected", true);
                        });

                        $.each(elementT.status.split(","), function(i, e) {
                            $("#status option[value='" + e + "']").prop("selected", true);
                        });

                        $("#cost").val(elementT.cost)
                    }
                })
            })
        })

        $('#editT').off('click')
        $('#editT').on('click', (e) => {
            e.preventDefault()
            let tooth = {
                ids: id,
                number: $("#number").val().toString(),
                status: $("#status").val().toString(),
                cost: $("#cost").val(),
            }

            $.post("http://localhost:2777/teeth-edit", tooth)
            $('#modalTeethForm').modal('hide')

            get()
        })
        get()




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

                $('#p-tb').append(`
                <tr>
                <td  class='p-name'>` + element.name + `</td>
                <td class="tnum">` + elementT.number + `</td> 
                <td class="tsta">` + elementT.status + `</td> 
                <td>` + elementT.cost + `</td> 
                <td> 
                    <span class="table-edit">
                        <button type="button" class="btn btn-success btn-rounded btn-sm my-0 " id='` + elementT._id + `'>Edit</button>
                    </span>
                </td> 
                <td> 
                    <span class="table-remove">
                        <button type="button" class="btn btn-danger btn-rounded btn-sm my-0 " id='` + elementT._id + `'>Remove</button>
                    </span>
                </td>
                </tr> `)
            })
        })
    })

    get()






})