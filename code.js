let gameContainer = document.getElementById("container")
let startBtn = document.createElement("button")
let pointsHTML = document.createElement("h2")
let categoryHTML = document.createElement("h2")
let questionHTML = document.createElement("h5")
let inputBox = document.createElement("input")
let submitBtn = document.createElement("button")
let retryHTML = document.createElement("h4")
let correctHTML = document.createElement("h4")
let gameOverHTML = document.createElement("h1")
class View {
    constructor() {
        this.answer
        this.userAnswer
        this.score = 0
        this.category
        this.question
        this.usedCategories = []
        this.classIndex = 0
        this.questionsArray = []
        this.categoryName = ""
        this.currentQuestionObj
        this.currentQuestion
        this.finalScore = 0


        startBtn.addEventListener("click", this.beginGame.bind(this))
        submitBtn.addEventListener("click", this.checkAnswer.bind(this))
    }

    renderTitleScreen() {
        let title = document.createElement("h1")
        title.innerHTML = "JService Jeopardy"
        gameContainer.append(title)

        startBtn.classList = "start button"
        startBtn.innerHTML = "Begin!"
        gameContainer.append(startBtn)
    }

    renderGame() {
        retryHTML.remove()
        correctHTML.remove()
        gameOverHTML.remove()
        pointsHTML.innerHTML = `Points: ${this.score}`
        gameContainer.append(pointsHTML)

        categoryHTML.innerHTML = `Category: `
        gameContainer.append(categoryHTML)


        questionHTML.innerHTML = `Question: `
        gameContainer.append(questionHTML)

        inputBox.classList = "inputbox"
        gameContainer.append(inputBox)

        submitBtn.classList = "button"
        submitBtn.innerHTML = "Submit"
        gameContainer.append(submitBtn)
    }

    beginGame() {
        startBtn.remove()
        fetch("https://jservice.io/api/random")
            .then(response => response.json())
            .then(parsedResponse => {
                this.renderGame()
                this.category = parsedResponse[0].category.id

                fetch(`https://jservice.io/api/category?id=${this.category}`)
                    .then(response => response.json())
                    .then(parsedResponse => {
                        this.displayCategory(parsedResponse)

                        this.displayQuestion(parsedResponse)
                    })

            })
    }

    getNextCategory() {
        fetch("https://jservice.io/api/random")
            .then(response => response.json())
            .then(parsedResponse => {
                this.category = parsedResponse[0].category.id

                fetch(`https://jservice.io/api/category?id=${this.category}`)
                    .then(response => response.json())
                    .then(parsedResponse => {
                        this.displayCategory(parsedResponse)
                        this.displayQuestion(parsedResponse)

                    })
            })
    }

    displayCategory(parsedResponse) {
        this.categoryName = parsedResponse.title
        categoryHTML.innerHTML = `Category: ${this.categoryName}`
    }

    displayQuestion(parsedResponse) {
        this.questionsArray = parsedResponse.clues
        this.classIndex = this.getRandomIndex()
        this.currentQuestionObj = this.questionsArray[this.classIndex]
        this.currentQuestion = this.currentQuestionObj.question
        questionHTML.innerHTML = `Question: ${this.currentQuestion}`
        this.answer = this.currentQuestionObj.answer
    }

    getNextQuestion() {
        this.currentQuestionObj = this.questionsArray[this.classIndex]
        this.currentQuestion = this.currentQuestionObj.question
        questionHTML.innerHTML = this.currentQuestion
        this.answer = this.currentQuestionObj.answer
    }

    getRandomIndex() {
        let randomIndex = Math.floor(Math.random() * this.questionsArray.length)
        return randomIndex
    }

    checkAnswer() {
        this.userAnswer = inputBox.value
        if (this.userAnswer.toLowerCase() === this.answer.toLowerCase()) {
            this.questionsArray.splice(this.classIndex, 1)
            correctHTML.innerHTML = "Correct"
            gameContainer.append(correctHTML)
            this.score += 1
            this.classIndex = this.getRandomIndex()
            pointsHTML.innerHTML = `Points: ${this.score}`
            if (this.questionsArray.length > 0) {
                this.getNextQuestion()
            } else {
                this.getNextCategory()
            }
        } else {
            correctHTML.remove()
            this.finalScore = this.score
            this.score = 0
            pointsHTML.innerHTML = `Points: ${this.score}`
            this.endGame()
        }
        inputBox.value = ""
    }

    endGame() {
        categoryHTML.remove()
        questionHTML.remove()
        inputBox.remove()
        submitBtn.remove()


        gameOverHTML.innerHTML = `Incorrect! Game Over! Final score: ${this.finalScore}`
        gameContainer.append(gameOverHTML)
        retryHTML.innerHTML = "Try again?"
        gameContainer.append(retryHTML)
        gameContainer.append(startBtn)
    }

}

let view1 = new View()
view1.renderTitleScreen()
