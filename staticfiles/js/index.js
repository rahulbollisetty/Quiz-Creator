
document.addEventListener("DOMContentLoaded", async () => {

    const csrf = Cookies.get('csrftoken');
    document.querySelector("#create-blank-form").addEventListener('click',()=>{
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
                this.parentNode.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode.parentNode)
            })

        })
    })
  
})

