
    import "https://cdn.jsdelivr.net/npm/ipfs@0.55.4/dist/index.min.js";
document.addEventListener("DOMContentLoaded", async () => {
    const node = await Ipfs.create({
        EXPERIMENTAL:{
            pubsub:true
        }
    })

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
    document.querySelector('#example')
    $(document).ready(function() {
        var table = $('#example').DataTable( {
            fixedHeader: {
                header: true,
                footer: true
            }
        } );
    } );
})

