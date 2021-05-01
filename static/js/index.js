document.addEventListener("DOMContentLoaded", () => {
    const csrf = Cookies.get('csrftoken');
    document.querySelector("#create-blank-form").addEventListener('click',()=>{
        const csrf = Cookies.get('csrftoken');
            fetch('/create', {
                method: "POST",
                headers: {'X-CSRFToken': csrf},
                body: JSON.stringify({
                    title: "Untitled Form"
                })
            })
            .then(response => response.json())
            .then(result => {
                window.location = `${result.code}/edit`
            })
    })

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener("click", function(){
            window.location = `${this.dataset.id}/edit`
        })
    })

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener("click", function(){
            fetch('delete_form', {
                method: "DELETE",
                headers: {'X-CSRFToken': csrf},
                body: JSON.stringify({
                    "id": this.dataset.id
                })
            })
            .then(() => {
                this.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode.parentNode.parentNode)
                
            })

        })
    })

    $(document).ready(function() {
        // Setup - add a text input to each footer cell
        $('#example thead tr').clone(true).appendTo( '#example thead' );
        $('#example thead tr:eq(1) th').each( function (i) {
            var title = $(this).text();
            $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
     
            $( 'input', this ).on( 'keyup change', function () {
                if ( table.column(i).search() !== this.value ) {
                    table
                        .column(i)
                        .search( this.value )
                        .draw();
                }
            } );
        } );
     
        var table = $('#example').DataTable( {
            orderCellsTop: true,
            fixedHeader: true
        } );
    } );
})

