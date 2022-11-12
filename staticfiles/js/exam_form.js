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

    document.querySelector('.publish').addEventListener('click', function(){
        fetch('form_publish',{
            method: "POST",
            headers: {'X-CSRFToken': csrf},
            body: JSON.stringify({})
        })
        .then(()=>{
            window.location = '/form'
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
                    this.parentNode.parentNode.removeChild(this.parentNode)
                })
            })
        })
    }
    removeOption()
    const addOption = () => {
        document.querySelectorAll(".add-option").forEach(question =>{
            question.addEventListener("click", function(){
                let question_id = this.dataset.question
                fetch('add_choice',{
                    method: "POST",
                    headers: {'X-CSRFToken': csrf},
                    body: JSON.stringify({
                        "question": question_id
                    }) 
                })
                .then(response => response.json())
                .then(result => {
                    let element = document.createElement('div')
                    element.classList.add("form-check" ,"justify-content-between" ,"d-flex")
                    element.setAttribute('data-id',question_id)
                    if(this.dataset.type === "mcq"){
                        element.innerHTML = `
                        <input class="form-check-input flex-fill" id="${result["id"]}" disabled type="radio" >
                        <input class="form-control mx-2 edit-choice" value="${result["choice"]}" data-id="${result["id"]}">
                        <span class="remove-option" title = "Remove" data-id="${result["id"]}"><i class="fa-solid fa-xmark"></i></span>
                        `;
                    }
                    else if(this.dataset.type === 'msq'){
                        element.innerHTML = `
                        <input class="form-check-input flex-fill" id="${result["id"]}" disabled type="checkbox" >
                        <input class="form-control mx-2 edit-choice" value="${result["choice"]}" data-id="${result["id"]}">
                        <span class="remove-option" title = "Remove" data-id="${result["id"]}"><i class="fa-solid fa-xmark"></i></span>
                        `;
                    }
                    document.querySelectorAll(".choices").forEach(choices => {
                        if(choices.dataset.id === this.dataset.question){
                            choices.insertBefore(element, choices.childNodes[choices.childNodes.length -2]);
                            console.log(choices.childNodes.length);
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
            element.classList.add('card', 'shadow', 'mb-3', 'question')
            let len = document.querySelector(".main-container .col").childNodes.length
            element.setAttribute("data-id", result["question"].id)
            element.innerHTML = `
                            <div class="card-header py-3">
                                <p class="text-primary m-0 fw-bold">Question MCQ</p>
                            </div>
                            <div class="card-body">
                                    <div class="row">
                                        <div class="mb-3"><label class="form-label" for=""><strong>Question</strong></label>
                                            <input class="form-control question-title input-question" data-id="${result["question"].id}" data-type="${result["question"].q_type}" 
                                            type="text" name="Question" value="${result["question"].ques}" placeholder="Question"></div>
                                            </div>
                                    <div class="row">
                                        <div class="col">
                                            <div class="mb-3 choices" data-id="${result["question"].id}">
                                                <label class="form-label" for=""><strong>Options</strong><br></label>

                                                <div class="form-check justify-content-between d-flex" data-id="${result["question"].id}">
                                                    <input class="form-check-input" id="${result["choices"].id}" disabled type="radio" >
                                                    <input class="form-control mx-2 edit-choice" value="${result["choices"].optn}" data-id="${result["choices"].id}">
                                                    <span class="remove-option" title = "Remove" data-id="${result["choices"].id}"><i class="fa-solid fa-xmark"></i></span>
                                                </div>
                                                <button class="btn m-1 btn-outline-dark btn-sm add-option" type="button" data-question="${result["question"].id}" data-type="${result["question"].q_type}" style="width: 30px;height: 31px;padding: 6px 12px;padding-left: 10px;padding-right: 10px;padding-top: 4px;padding-bottom: 4px;"><Strong>+</Strong></button></div>
                                        </div>
                                    </div>
                            </div>
                            <div class="d-flex justify-content-between card-footer">
                                <div class="form-check">
                                    <input class="form-check-input required-checkbox" id="required-${result["question"].id}" 
                                    data-id="${result["question"].id}" 
                                    type="checkbox" >
                                    <label class="form-check-label required">Required</label>
                                </div>
                                <i class="fa-solid fa-trash delete-question" data-id="${result["question"].id}"></i>
                            </div>
            `;
            document.querySelector(".main-container .col").appendChild(element);
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
            element.classList.add('card', 'shadow', 'mb-3', 'question')
            let len = document.querySelector(".main-container .col").childNodes.length
            element.setAttribute("data-id", result["question"].id)
            element.innerHTML = `
                            <div class="card-header py-3">
                                <p class="text-primary m-0 fw-bold">Question MSQ</p>
                            </div>
                            <div class="card-body">
                                    <div class="row">
                                        <div class="mb-3"><label class="form-label" for=""><strong>Question</strong></label>
                                            <input class="form-control question-title input-question" data-id="${result["question"].id}" data-type="${result["question"].q_type}" 
                                            type="text" name="Question" value="${result["question"].ques}" placeholder="Question"></div>
                                            </div>
                                    <div class="row">
                                        <div class="col">
                                            <div class="mb-3 choices" data-id="${result["question"].id}">
                                                <label class="form-label" for=""><strong>Options</strong><br></label>
                                                <div class="form-check justify-content-between d-flex" data-id="${result["question"].id}">
                                                    <input class="form-check-input" id="${result["choices"].id}" disabled type="checkbox" >
                                                    <input class="form-control mx-2 edit-choice" value="${result["choices"].optn}" data-id="${result["choices"].id}">
                                                    <span class="remove-option" title = "Remove" data-id="${result["choices"].id}"><i class="fa-solid fa-xmark"></i></span>
                                                </div>
                                                <button class="btn m-1 btn-outline-dark btn-sm add-option" type="button" data-question="${result["question"].id}" data-type="${result["question"].q_type}" style="width: 30px;height: 31px;padding: 6px 12px;padding-left: 10px;padding-right: 10px;padding-top: 4px;padding-bottom: 4px;"><Strong>+</Strong></button></div>
                                        </div>
                                    </div>
                            </div>
                            <div class="d-flex justify-content-between card-footer">
                                <div class="form-check">
                                    <input class="form-check-input required-checkbox" id="required-${result["question"].id}" 
                                    data-id="${result["question"].id}" 
                                     type="checkbox" >
                                    <label class="form-check-label required">Required</label>
                                </div>
                                <i class="fa-solid fa-trash delete-question" data-id="${result["question"].id}"></i>
                            </div>
            `;
            document.querySelector(".main-container .col").appendChild(element);
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
            element.classList.add('card', 'shadow', 'mb-3', 'question')
            let len = document.querySelector(".main-container .col").childNodes.length
            element.setAttribute("data-id", result["question"].id)
            element.innerHTML = `
                            <div class="card-header py-3">
                                <p class="text-primary m-0 fw-bold">Question Short Answer</p>
                            </div>
                            <div class="card-body">
                                    <div class="row">
                                        <div class="col">
                                        <div class="mb-3"><label class="form-label" for=""><strong>Question</strong></label>
                                        <input class="form-control question-title input-question" data-id="${result["question"].id}" data-type="${result["question"].q_type}" 
                                        type="text" name="Question" value="${result["question"].ques}" placeholder="Question"></div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col">
                                            <div class="mb-3 answer" data-id="${result["question"].id}">
                                            <label class="form-label"><strong>Answer</strong><br></label>
                                            <input class="form-control short-answer" disabled type="text" placeholder="Short Answer" ></div>
                                        </div>
                                    </div>
                            </div>
                            <div class="d-flex justify-content-between card-footer">
                                <div class="form-check">
                                    <input class="form-check-input required-checkbox" id="required-${result["question"].id}" 
                                    data-id="${result["question"].id}" 
                                     type="checkbox" >
                                    <label class="form-check-label required">Required</label>
                                </div>
                                <i class="fa-solid fa-trash delete-question" data-id="${result["question"].id}"></i>
                            </div>
            `;
            document.querySelector(".main-container .col").appendChild(element);
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
            element.classList.add('card', 'shadow', 'mb-3', 'question')
            let len = document.querySelector(".main-container .col").childNodes.length
            element.setAttribute("data-id", result["question"].id)
            element.innerHTML = `
            <div class="card-header py-3">
                <p class="text-primary m-0 fw-bold">Question Long Answer</p>
            </div>
            <div class="card-body">
                    <div class="row">
                        <div class="col">
                            <div class="mb-3"><label class="form-label" for=""><strong>Question</strong></label>
                            <input class="form-control question-title input-question" data-id="${result["question"].id}" data-type="${result["question"].q_type}" 
                            type="text" name="Question" value="${result["question"].ques}" placeholder="Question"></div>
                            </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="mb-3 answer" data-id="${result["question"].id}">
                                <label class="form-label" for="">
                                <strong>Answer</strong><br></label>
                                <textarea class="form-control long-answer" disabled placeholder="Long Answer"></textarea></div>
                        </div>
                    </div>
            </div>
            <div class="d-flex justify-content-between card-footer">
                <div class="form-check">
                    <input class="form-check-input required-checkbox" type="checkbox" id="required-${result["question"].id}" 
                    data-id="${result["question"].id}" 
                    type="checkbox" >
                    <label class="form-check-label required">Required</label>
                </div>
                <i class="fa-solid fa-trash delete-question" data-id="${result["question"].id}"></i>
            </div>
            `;
            document.querySelector(".main-container .col").appendChild(element);
            editQuestion()
            editRequire()
            deleteQuestion()
        })
    })

})