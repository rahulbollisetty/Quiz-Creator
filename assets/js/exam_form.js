document.addEventListener('DOMContentLoaded', () => {
    const csrf = Cookies.get('csrftoken');

    document.querySelectorAll(".textarea-adjust").forEach(tx => {
        tx.style.height = "auto";
        tx.style.height = (10 + tx.scrollHeight)+"px";
        tx.addEventListener('input', e => {
            tx.style.height = "auto";
            tx.style.height = (10 + tx.scrollHeight)+"px";
        })
    })

    document.querySelector("#input-form-title").addEventListener("input",function(){
        fetch('edit_title', {
            method: "POST",
            headers: {'X-CSRFToken': csrf},
            body: JSON.stringify({
                "title" : this.value
            }) 
        })
        document.title = `${this.value}`
        document.querySelector('#input-form-title').value = this.value
    })
    document.querySelector("#input-form-description").addEventListener("input",function(){
        fetch('edit_desc', {
            method: "POST",
            headers: {'X-CSRFToken': csrf},
            body: JSON.stringify({
                "description": this.value
            }) 
        })

    })

    const editQuestion = () => {
        document.querySelectorAll('.input-question').forEach(question => {
            question.addEventListener('input', function(){
                let q_type;
                let req;
                document.querySelectorAll('.required-checkbox').forEach(rc => {
                    if(rc.dataset.id === this.dataset.id) req = rc.checked;
                })
                document.querySelectorAll('.question-title').forEach(q => {
                    if(q.dataset.id === this.dataset.id) q_type = q.dataset.type
                })
                fetch('edit_question', {
                    method: "POST",
                    headers: {'X-CSRFToken': csrf},
                    body: JSON.stringify({
                        "id": this.dataset.id,
                        "question": this.value,
                        "q_type" : q_type,
                        "req": req
                    })
                })
            })
        }) 
    }
    editQuestion()

    const deleteQuestion = () => {
        document.querySelectorAll('.delete-question').forEach(question => {
            question.addEventListener("click", function(){
                fetch(`delete_question/${this.dataset.id}`, {
                    method: 'DELETE',
                    headers: {'X-CSRFToken': csrf},
                })
                .then(() => {
                    document.querySelectorAll(".question").forEach(q => {
                        if(q.dataset.id === this.dataset.id){
                            q.parentNode.removeChild(q)
                        }
                    })
                })
            })
        })
    }
    deleteQuestion()
    const editRequire = () => {
        document.querySelectorAll('.required-checkbox').forEach(checkbox => {
            checkbox.addEventListener('input', function(){
                let q_type;
                let ques;
                document.querySelectorAll('.input-question').forEach(qp => {
                    if(qp.dataset.id === this.dataset.id) ques = qp.value;
                })
                document.querySelectorAll('.question-title').forEach(q => {
                    if(q.dataset.id === this.dataset.id) q_type = q.dataset.type
                })
                fetch('edit_question', {
                    method: "POST",
                    headers: {'X-CSRFToken': csrf},
                    body: JSON.stringify({
                        "id": this.dataset.id,
                        "question": ques,
                        "q_type" : q_type,
                        "req": this.checked
                    })
                })
            })
        }) 
    }
    editRequire()
    const editOption = () => {
        document.querySelectorAll(".edit-choice").forEach(option =>{
            option.addEventListener("input", function(){
                fetch('edit_choice',{
                    method: "POST",
                    headers: {'X-CSRFToken': csrf},
                    body: JSON.stringify({
                        "id": this.dataset.id,
                        "option": this.value
                    })
                })
            })
        })
    }
    editOption()
    const removeOption = () => {
        document.querySelectorAll(".remove-option").forEach(element => {
            element.addEventListener("click", function(){
                fetch('remove_choice', {
                    method: "POST",
                    headers: {'X-CSRFToken': csrf},
                    body: JSON.stringify({
                        "id": this.dataset.id
                    })
                })
                .then( () => {
                    this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode)
                })
            })
        })
    }
    removeOption()
    const addOption = () => {
        document.querySelectorAll(".add-option").forEach(question =>{
            question.addEventListener("click", function(){
                fetch('add_choice',{
                    method: "POST",
                    headers: {'X-CSRFToken': csrf},
                    body: JSON.stringify({
                        "question": this.dataset.question
                    }) 
                })
                .then(response => response.json())
                .then(result => {
                    let element = document.createElement('div')
                    element.classList.add('choice')
                    if(this.dataset.type === "mcq"){
                        element.innerHTML = `
                        <div class="form-check">
                        <input class="form-check-input" type="radio" id="${result["id"]}" disabled>
                        <input type="text" style="height: calc(.5em + .75rem + 2px);" class="form-control edit-choice" value="${result["choice"]}" data-id="${result["id"]}"><span class="remove-option" title = "Remove" data-id="${result["id"]}">&times;</span>
                        </div>
                        `;
                    }
                    else if(this.dataset.type === 'msq'){
                        element.innerHTML = `
                        <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="${result["id"]}" disabled>
                        <input type="text" style="height: calc(.5em + .75rem + 2px);" class="form-control edit-choice" value="${result["choice"]}" data-id="${result["id"]}"><span class="remove-option" title = "Remove" data-id="${result["id"]}">&times;</span>
                        </div>
                        `;
                    }
                    document.querySelectorAll(".choices").forEach(choices => {
                        if(choices.dataset.id === this.dataset.question){
                            choices.insertBefore(element, choices.childNodes[choices.childNodes.length -2]);
                            editOption()
                            removeOption()
                        }
                    })
                })
            })
        })

    }
    addOption()
    document.querySelector("#add-mcq").addEventListener("click", () => {
        fetch('add_question', {
            method: "POST",
            headers: {'X-CSRFToken': csrf},
            body: JSON.stringify({
                "type": 'mcq'
            })
        })
        .then(response => response.json())
        .then(result => {
            let element = document.createElement('div')
            element.classList.add('margin-top-bottom')
            element.classList.add('box')
            element.classList.add('question-box')
            element.classList.add('question')
            element.setAttribute("data-id", result["question"].id)
            element.innerHTML = `
            <!-- Input type text -->
            <div class="form-group">
                <label>Question</label>
                <input type="text" data-id="${result["question"].id}" data-type="${result["question"].q_type}" class="form-control question-title edit-on-click input-question" value="${result["question"].ques}">
            </div>
            
            <!-- Input type radio -->
            <div class="form-group choices" data-id="${result["question"].id}">
                <label>Options</label>
                <!-- for loop -->
                <div class="choice">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" id="${result["choices"].id}" disabled>
                        <input type="text" style="height: calc(.5em + .75rem + 2px);" class="form-control edit-choice" value="${result["choices"].optn}" data-id="${result["choices"].id}"><span class="remove-option" title = "Remove" data-id="${result["choices"].id}">&times;</span>
                    </div>
                </div>
                <!-- end for loop -->
            </div>
            <button type="button" class="btn btn-outline-dark btn-sm add-option" data-question="${result["question"].id}" data-type="${result["question"].q_type}">Add Option</button>
            <!-- Input type checkbox -->
            <hr>
            <div class="form-group choice-option">
                <div>
                    <div class="form-check">
                        <input class="form-check-input required-checkbox" type="checkbox" id="required-${result["question"].id}" data-id="${result["question"].id}" {% if question.req %}checked{% endif %}>
                        <label class="form-check-label required" for="">required</label>
                    </div>
                </div>
                <div class="float-right">
                    <img src="/static/Icon/dustbin.png" alt="Delete question icon"
                    class="question-option-icon delete-question" title="Delete question" data-id="${result["question"].id}">
                </div>
            </div>
            `;
            document.querySelector(".main-container").appendChild(element);
            editOption()
            removeOption()
            addOption()
            editQuestion()
            editRequire()
            deleteQuestion()
        })
    })
    
    document.querySelector("#add-msq").addEventListener("click", () => {
        fetch('add_question', {
            method: "POST",
            headers: {'X-CSRFToken': csrf},
            body: JSON.stringify({
                "type": 'msq'
            })
        })
        .then(response => response.json())
        .then(result => {
            let element = document.createElement('div')
            element.classList.add('margin-top-bottom')
            element.classList.add('box')
            element.classList.add('question-box')
            element.classList.add('question')
            element.setAttribute("data-id", result["question"].id)
            element.innerHTML = `
            <!-- Input type text -->
            <div class="form-group">
                <label>Question</label>
                <input type="text" data-id="${result["question"].id}" data-type="${result["question"].q_type}" class="form-control question-title edit-on-click input-question" value="${result["question"].ques}">
            </div>
            
            <!-- Input type radio -->
            <div class="form-group choices" data-id="${result["question"].id}">
                <label>Options</label>
                <!-- for loop -->
                <div class="choice">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="${result["choices"].id}" disabled>
                        <input type="text" style="height: calc(.5em + .75rem + 2px);" class="form-control edit-choice" value="${result["choices"].optn}" data-id="${result["choices"].id}"><span class="remove-option" title = "Remove" data-id="${result["choices"].id}">&times;</span>
                    </div>
                </div>
                <!-- end for loop -->
            </div>
            <button type="button" class="btn btn-outline-dark btn-sm add-option" data-question="${result["question"].id}" data-type="${result["question"].q_type}">Add Option</button>
            <!-- Input type checkbox -->
            <hr>
            <div class="form-group choice-option">
                <div>
                    <div class="form-check">
                        <input class="form-check-input required-checkbox" type="checkbox" id="required-${result["question"].id}" data-id="${result["question"].id}" {% if question.req %}checked{% endif %}>
                        <label class="form-check-label required" for="">required</label>
                    </div>
                </div>
                <div class="float-right">
                    <img src="/static/Icon/dustbin.png" alt="Delete question icon"
                    class="question-option-icon delete-question" title="Delete question" data-id="${result["question"].id}">
                </div>
            </div>
            `;
            document.querySelector(".main-container").appendChild(element);
            editOption()
            removeOption()
            addOption()
            editQuestion()
            editRequire()
            deleteQuestion()
        })
    })

    document.querySelector("#add-sa").addEventListener("click", () => {
        fetch('add_question', {
            method: "POST",
            headers: {'X-CSRFToken': csrf},
            body: JSON.stringify({
                "type": 'sa'
            })
        })
        .then(response => response.json())
        .then(result => {
            let element = document.createElement('div')
            element.classList.add('margin-top-bottom')
            element.classList.add('box')
            element.classList.add('question-box')
            element.classList.add('question')
            element.setAttribute("data-id", result["question"].id)
            element.innerHTML = `
            <!-- Input type text -->
            <div class="form-group">
                <label>Question</label>
                <input type="text" data-id="${result["question"].id}" data-type="${result["question"].q_type}" class="form-control question-title edit-on-click input-question" value="${result["question"].ques}">
            </div>
            
            <!-- Input type Short Answer -->
            <div class="form-group answer" data-id="${result["question"].id}">
                <label>Answer</label>
                <input type="text" class="form-control short-answer" disabled placeholder="Short answer text">
            </div>

            <!-- Input type checkbox -->
            <hr>
            <div class="form-group choice-option">
                <div>
                    <div class="form-check">
                        <input class="form-check-input required-checkbox" type="checkbox" id="required-${result["question"].id}" data-id="${result["question"].id}" {% if question.req %}checked{% endif %}>
                        <label class="form-check-label required" for="">required</label>
                    </div>
                </div>
                <div class="float-right">
                    <img src="/static/Icon/dustbin.png" alt="Delete question icon"
                    class="question-option-icon delete-question" title="Delete question" data-id="${result["question"].id}">
                </div>
            </div>
            `;
            document.querySelector(".main-container").appendChild(element);
            editQuestion()
            editRequire()
            deleteQuestion()
        })
    })


    document.querySelector("#add-la").addEventListener("click", () => {
        fetch('add_question', {
            method: "POST",
            headers: {'X-CSRFToken': csrf},
            body: JSON.stringify({
                "type": 'la'
            })
        })
        .then(response => response.json())
        .then(result => {
            let element = document.createElement('div')
            element.classList.add('margin-top-bottom')
            element.classList.add('box')
            element.classList.add('question-box')
            element.classList.add('question')
            element.setAttribute("data-id", result["question"].id)
            element.innerHTML = `
            <!-- Input type text -->
            <div class="form-group">
                <label>Question</label>
                <input type="text" data-id="${result["question"].id}" data-type="${result["question"].q_type}" class="form-control question-title edit-on-click input-question" value="${result["question"].ques}">
            </div>
            
            <!-- Input type Long Answer -->
            <div class="form-group answer" data-id="${result["question"].id}">
                <label>Answer</label>
                <textarea class="form-control long-answer" disabled placeholder="Long answer text"></textarea>
            </div>

            <!-- Input type checkbox -->
            <hr>
            <div class="form-group choice-option">
                <div>
                    <div class="form-check">
                        <input class="form-check-input required-checkbox" type="checkbox" id="required-${result["question"].id}" data-id="${result["question"].id}" {% if question.req %}checked{% endif %}>
                        <label class="form-check-label required" for="">required</label>
                    </div>
                </div>
                <div class="float-right">
                    <img src="/static/Icon/dustbin.png" alt="Delete question icon"
                    class="question-option-icon delete-question" title="Delete question" data-id="${result["question"].id}">
                </div>
            </div>
            `;
            document.querySelector(".main-container").appendChild(element);
            editQuestion()
            editRequire()
            deleteQuestion()
        })
    })

})