document.addEventListener("DOMContentLoaded", () => {

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
})

