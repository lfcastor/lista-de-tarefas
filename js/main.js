const Main = { //Main é o pai do objeto.

    tasks: [],

    init: function() { // responsável por iniciar as funções
        this.cacheSelectors() // a palavra this se refencia ao Main, o pai do objeto.
        this.bindEvents()
        this.getStoraged()
        this.buildTasks()
    },

    cacheSelectors: function() { // funcção responsável por selecionar os elentos no HTML
        this.$checkButtons = document.querySelectorAll('.check') // neste caso foi criada a variável usuando o this, assim a variável fica disponivel no Main.
        this.$inputTask = document.querySelector('#inputTask')
        this.$list = document.querySelector('#list')
        this.$removeButtons = document.querySelectorAll('.remove')
    },

    bindEvents: function() { // bind events, conectar os eventos, é responsável por adicionar os eventos como por exemplo de click.
        const self = this //criada a variável self para amarzenar o Main, pois o this dentro do forEach tem o comportamento de windown.

        this.$checkButtons.forEach(function(button) { // toda vairável que for amarzenar um elemento HTML vai ter um $ na frente, boa pratica.
            button.onclick = self.Events.checkButton_click // evento de clique está chamando a função checkButton_click para trocar a classe da tarefa.
        });

        this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this)// O .bind(this) é para levar o this para a função que foi chamada.

        this.$removeButtons.forEach(function(button) {
            button.onclick = self.Events.removeButton_click.bind(self)
        })
    },

    getStoraged: function() {
        const tasks = localStorage.getItem('tasks')

        if (tasks) {
            this.tasks = JSON.parse(tasks) // Este comando é para pegar os itens do local storage e salvar no Array chamado tasks.
        }else {
            localStorage.setItem('tasks', JSON.stringify([]))
        }
    },

    getTaskHtml: function(task) {
        return `
            <li>
                <div class="check"></div>
                <label class="task">${task}</label>
                <button class="remove" data-task="${task}"></button>
            </li>
        `
    },

    buildTasks: function() {
        let html = ''

        this.tasks.forEach(item => {
            html += this.getTaskHtml(item.task)
        })

        this.$list.innerHTML = html

        this.cacheSelectors()
        this.bindEvents()
    },

    Events: {
        checkButton_click: function(e) { // O 'e' é para pegar o evento de clique do mouse.
            const li = e.target.parentElement // variável para pegar o alvo que vai ser a li
            const isDone = li.classList.contains('done') // variável para verificar se a classList contem o 'done' retorno true ou false
           
            if (!isDone) { // não está feito? então coloque a class 'done'
                return li.classList.add('done')            
            }

            li.classList.remove('done') // está feito, então remove a class 'done'
        },

        inputTask_keypress: function(e) {
            const key = e.key
            const value = e.target.value

            if (key === 'Enter') {
                this.$list.innerHTML += this.getTaskHtml(value)

                e.target.value = ''

                this.cacheSelectors()
                this.bindEvents()

                const savedTasks = localStorage.getItem('tasks')
                const savedTasksObj = JSON.parse(savedTasks)

                const obj = [
                    { task: value },
                    ... savedTasksObj, //spred operation (...)
                ]

                localStorage.setItem('tasks', JSON.stringify(obj))
            }
        },

        removeButton_click: function(e) {
            const li = e.target.parentElement
            const value = e.target.dataset['task']
            
            const newTaskState = this.tasks.filter(item => item.task !== value)

            localStorage.setItem('tasks', JSON.stringify(newTaskState))

            li.classList.add('removed')

            setTimeout(function(){
                li.classList.add('hidden')
            }, 300)
        }

    },
}

Main.init() // para iniciar o objeto.