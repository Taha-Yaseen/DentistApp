$(document).ready(function() {
    let url = "https://dentistapp-7007.herokuapp.com"
    for (let i = 1; i < 5; i++)
        for (let j = 1; j < 9; j++)
            $('#toothT').append('<option value="' + i + j + '">' + i + j + '</option>')




    let getStat = () =>
        $.get(url + "/view-stat", data => {
            $('#statusT').html('')
            $(data).each(function(index, element) {
                $('#statusT').append('<option value="' + element.name + '">' + element.name + '</option>')
            })
        })

    getStat()
    let getDr = () =>
        $.get(url + "/view-dr", data => {
            $('#dr').html('')
            $(data).each(function(index, element) {
                $('#dr').append('<option value="' + element.name + '">' + element.name + '</option>')
            })
        })

    getDr()

    function unique(arr) {
        var u = {},
            a = [];
        for (var i = 0, l = arr.length; i < l; ++i) {
            if (!u.hasOwnProperty(arr[i])) {
                a.push(arr[i]);
                u[arr[i]] = 1;
            }
        }
        return a;
    }

    //table-profiles
    const $tableID = $('#table')


    class Patients {
        constructor(name, phone, age, rating, dr, note) {
            this.name = name
            this.phone = phone
            this.age = age
            this.rating = rating
            this.dr = dr
            this.note = note
        }
    }
    class Teeth {
        constructor(id, num, status, cost) {
            this.id = id
            this.num = num
            this.status = status
            this.cost = cost
        }
    }

    class Payment {
        constructor(tid, value) {
            this.tid = tid
            this.value = value
        }

    }

    $tableID.on('click', '.table-remove', function(e) {
        e.preventDefault()

        $target = $(e.target)

        const id = $target.attr('id')

        $('#ConfrmRemoveModal').modal('show')
        $('#conf-remove').click(function() {
            $.ajax({
                method: 'DELETE',
                url: url + '/',
                data: {
                    id
                },
                success: function(response) {
                    $('#ConfrmRemoveModal').modal('hide')
                    $($target).parents('tr').toggle(200, () => {
                        $($target).parents('tr').detach()
                    })
                },
                error: function(err) {
                    console.log(err)
                }
            })
        })




    })
    $tableID.on('click', '.tooth-btn', function(e) {
        e.preventDefault()
        $target = $(e.target)

        const id = $target.attr('id')

        $.get(url + "/view-info", data => {
            $(data).each(function(index, element) {
                if (element['_id'] == id) {
                    $(".pName").html("Patient Name:  " + element.name)
                }
            })
        })




        $('#modalTeethForm').modal('show')
        $("#toothT").val('')
        $("#statusT").val('')
        $("#cost").val(0)

        $('#teethSubmit').click(function() {
            let tooth = new Teeth(id, $("#toothT").val().toString(), $("#statusT").val().toString(), $("#cost").val())
            if (allTrue(tooth)) {
                $.post('http://localhost:${port}/post-tooth', tooth).then(() => {
                    $('#modalTeethForm').modal('toggle')
                    $('#modalDone').modal('toggle')
                    getList()
                })
            }
        })
    })


    $tableID.on('click', '.payment-btn', function(e) {
        e.preventDefault()
        $target = $(e.target)

        const id = $target.attr('id')

        $('#modalPaymentForm').modal('show')

        $("#toothP").val('')
        $("#statusP").val('')
        $("#value").val(0)
        $('#costVal').html("cost: ---")
        $('#remVal').html("remaining: ---")
        $('#paidVal').html("paid: ---")
        $("#statusP").prop('disabled', true)
        $("#value").prop('disabled', true)

        $.get("/view-info", data => {
            $(data).each(function(index, element) {
                if (element['_id'] == id) {
                    let arr = []
                    $(".pName").html("Patient Name:  " + element.name)
                    $("#toothP").html('')
                    $("#statusP").html('')
                    $(element.teeth).each((index, element) => {
                        arr.push(element.number)
                    })
                    $(unique(arr)).each((i, element) => {
                        $('#toothP').append('<option value="' + element + '">' + element + '</option>')
                    })
                    $("#toothP").val('')
                }
            })

        })

        $('#toothP').on('change', () => getS(id, $('#toothP').val()))
        $('#statusP').on('change', () => getV(id, $("#statusP").val(), $('#toothP').val()))


        $('#paymentSubmit').off('click');
        $('#paymentSubmit').on('click', function(e) {

            const tid = $('#paymentSubmit').attr('pid')
            console.log(tid)
            e.preventDefault()
            let payment = new Payment(tid, $("#value").val())
            if (allTrue(payment)) {
                $.post(url + '/post-payment', payment).then(() => {
                    $('#modalPaymentForm').modal('hide')
                    $('#modalDone').modal('toggle')
                    getList()
                })
            }
        })
    })
    $tableID.off('click', '.print-btn')
    $tableID.on('click', '.print-btn', (e) => {
        e.preventDefault()
        $target = $(e.target)
        const id = $target.attr('id')


        $('#reciptModal').modal('show')



        $.get(url + "/view-info", data => {
            $('#rtb').html('')
            let today = new Date()
            let time = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
            $('#rec-date').html(time)
            $(data).each(function(index, element) {
                if (id == element._id) {
                    $('#rec-name').html(element.name)
                    $('#rec-phone').html(element.phone)
                    $('#totalP').html(element.totP)

                    $(element.teeth).each(function(index, elementT) {
                        $(elementT.payments).each(function(index, elementP) {
                            $('#rtb').append(`
                            <tr>
                                        <td>` + elementT.number + `</td>
                                        <td>` + elementT.status + `</td>
                                        <td>` + elementT.cost + `</td>
                                        <td>` + elementP.value + `</td>
                                        <td>` + elementP.date + `</td>
                                    </tr>
                            `)
                        })
                    })
                }
            })
        })
        $('#print').click(
            (e) => {
                e.preventDefault()
                printJS({
                    printable: 'modal-body',
                    type: 'html',
                    header: '<div style="text-align:center"><h2>Dentist Recipt</h2> <h3>Dr.Ayman</h3> <h5> Address: Beirut </h5> <h5 > Phone: 0777777 </h5></div>',
                    style: `
                table {
                    border-collapse: collapse;
                  }
                  
                  th,td {
                    border-bottom: 1px solid black;
                    text-align: left;
                    
                  }
                  div{
                      margin-right:10px;
                      margin-bottom:5px;
                    }
                    #footerD{
                        position:fixed;
                        bottom:20px;
                        left:80%;
                    }
                    #footerP{
                        position:fixed;
                        bottom:20px;
                        left:5%;
                    }
                    .ttext{
                        font-weight: bold;
                    }    
                `,
                })

            }
        )

    })



    $tableID.on('click', '.profile-btn', function(e) {
        e.preventDefault()
        $('#submit-footer').html('<button type="button"  id="editP"  class="btn btn-unique ">Edit <i class="fas fa-paper-plane-o ml-1"></i></button>')
        $target = $(e.target)
        const id = $target.attr('id')
        $('#modalContactForm').modal('show')

        $('#ttb').show()
        $('#dr').find('option').prop("selected", false);



        $.get(url + "/view-info", data => {


            $(data).each(function(index, element) {
                if (element['_id'] == id) {

                    $("#name").val(element.name)
                    $("#phone").val(element.phone)
                    $("#age").val(element.age)
                    $("#rating").val(element.rating)
                    $.each(element.dr.split(","), function(i, e) {
                        $("#dr option[value='" + e + "']").prop("selected", true);
                    });
                    $("#note").val(element.note)
                    $(element.teeth).each((i, e) => {
                        $('#ttb').append('<tr><td>' + e.number + '</td><td>' + e.status + '</td></tr>')
                    })
                }
            })
        })


        $('#editP').on('click', (e) => {
            e.preventDefault()
            let person = {
                ids: id,
                name: $("#name").val(),
                phone: $("#phone").val(),
                age: $("#age").val(),
                rating: $("input[name=rating]").val(),
                dr: $('#dr').val().toString(),
                note: $("#note").val(),
            }

            $.post(url + "/post-edit", person)
            $('#modalContactForm').modal('hide')

            getList()
        })
        getList()




    })

    function allTrue(obj) {
        for (var o in obj)
            if (obj[o].length == 0)
                return false;
        return true;
    }

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
    $('#add').click(function() {
        $('#open').hide()
        $('#ttb').hide()
        $('#print').hide()
        $("#name").val('')
        $("#phone").val('')
        $("#age").val('')
        $("#note").val('')
        $("#rating").val(3)
        $('#dr').val('')
        $('#submit-footer').html('<button type="button" id="newP" data-dismiss="modal" class="btn btn-unique ">Add <i class="fas fa-paper-plane-o ml-1"></i></button>')
        $('#toothTable').html('')
        $('#tc').html('')
        $('#dr').change(() => {
            var str = "";
            $("select option:selected").each(function() {
                str += $(this).text() + ", ";
            });
            $("#selected").html(str);
        }).change();


        $('#newP').on('click', (e) => {

            //e.preventDefault()

            let person = new Patients($("#name").val(), $("#phone").val(), $("#age").val(), $("#rating").val(), $('#dr').val().toString(), $('#note').val())
            if (person.name.length > 0)
                $.post(url + "/post-info", person).then(() => {
                    $('modalContactForm').modal('hide')
                    AddOne(person)
                })


        })

    })



    let getList = () =>
        $.get(url + "/view-info", data => {
            $('#p-tb').html('')
            $(data).each(function(index, element) {

                $('#p-tb').prepend("<tr class='animated zoomIn'><td  class='p-name'>" + element['name'] + '</td><td>' + element['phone'] + '</td> <td><span><a  id="' + element['_id'] + '"class="btn btn-purple tooth-btn btn-rounded btn-sm my-0  " >Add Tooth</a></span> </td><td><span><a  id="' + element['_id'] + '"class="btn btn-amber payment-btn btn-rounded btn-sm my-0  " >Add Payment</a></span> </td><td><span><button type="button"  id="' + element['_id'] + '"class="btn btn-success profile-btn btn-rounded btn-sm my-0  ">View Patient</button></span> </td> <td> <span ><a  id="' + element['_id'] + '"class="btn btn-primary print-btn btn-rounded btn-sm my-0" >Print</a></span></td><td> <span class="table-remove"><button type="button"  id="' + element['_id'] + '"class="btn btn-danger btn-rounded btn-sm my-0">Remove</button></span></td></tr> </table>')
            })
        })
    let AddOne = (element) => {
        $('#p-tb').prepend("<tr class='animated zoomIn'><td  class='p-name'>" + element['name'] + '</td><td>' + element['phone'] + '</td> <td><span><a  id="' + element['_id'] + '"class="btn btn-purple tooth-btn btn-rounded btn-sm my-0  " >Add Tooth</a></span> </td><td><span><a  id="' + element['_id'] + '"class="btn btn-amber payment-btn btn-rounded btn-sm my-0  " >Add Payment</a></span> </td><td><span><button type="button"  id="' + element['_id'] + '"class="btn btn-success profile-btn btn-rounded btn-sm my-0  ">View Patient</button></span> </td> <td> <span ><a  id="' + element['_id'] + '"class="btn btn-primary print-btn btn-rounded btn-sm my-0" >Print</a></span></td><td> <span class="table-remove"><button type="button"  id="' + element['_id'] + '"class="btn btn-danger btn-rounded btn-sm my-0">Remove</button></span></td></tr> </table>')

    }


    getList()
    let getS = (ids, toothNumber) => $.get(url + '/view-info', data => {


        $("#statusP").prop('disabled', false)
        $(data).each((index, element) => {
            if (element._id == ids) {
                let arr = []
                $('#statusP').html('')
                $(element.teeth).each((index, element) => {
                    if (element.number == toothNumber) {
                        arr.push(element.status)
                    }
                })
                $(unique(arr)).each((i, element) => {
                    $('#statusP').append('<option value="' + element + '">' + element + '</option>')
                })
                $("#statusP").val('')

            }
        })
    })
    let getV = (ids, status, number) => $.get(url + '/view-info', data => {
        $("#value").prop('disabled', false)

        $(data).each((index, element) => {
            if (element._id == ids) {
                $('#costVal').html('cost: ---')
                $('#remVal').html("remaining: ---")
                $('#paidVal').html("paid: ---")
                $(element.teeth).each((index, element) => {

                    if (element.status == status && element.number == number) {
                        $('#paymentSubmit').attr("pid", element._id.toString());
                        $('#costVal').html("cost: " + element.cost)
                        $('#remVal').html("remaining: " + (parseInt(element.cost) - element.tot))
                        $('#paidVal').html("paid: " + element.tot)
                    }
                })
            }
        })
    })




})