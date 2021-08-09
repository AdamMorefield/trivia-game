// To run this assignment, right click on index.html in the Visual Studio Code file explorer to the left
// and select "Open with Live Server"

// YOUR CODE HERE!
//variable.remove() removes the html element assigned to that variable
//Step 1: Render view 1
//  View 1: Show title and start button
//      If user hits start button, render view 2
//
//
//Step 2: Render view 2
//  View 2: Shows title, points, category, question box, input box, submit button
//      remove start button OR view 1
//      render current points (starting at 0)
//      get and render a random category, limited to 100 at a time
//      get and render a random question from that category
//      render input/textarea, assign user input to a variable
//      userInput.toLowerCase(), answer.toLowerCase();
//      If user's answer is correct (userInput === answer)
//          score += 1
//          display "Correct", render next question
//      Else if user's answer is incorrect
//          set score to 0, display "Game over"
//
//class View {
//  constructor() {//possible parameters: answer(the user's answer is passed in when submit button is pressed),
//      this.index = index
//  }
//  renderView() //remove the start button, display points, category, question, input, submit btn, isGameOn = true
//
//  getCategory() //use jservice.io/api/random to get a random question, get the ID of that question, and add that id to an array of used categories
//
//  getQuestion() //take the id from getCategory, use this.index to get a question from that id, and return the question
//
//  checkAnswer() //if(userInput.toLowerCase() === answer.toLowerCase()){points += 1; getCategory()/getQuestion()/renderView()} else {
//  input.remove(); submit.remove(); let gameOver = document.createElement("h2"); gameOver.innerHTML = `Game Over! br/ Final Score: ${score}`;
//  let retry = document.createElement("button"); retry.innerHTML = "Retry?"; isGameOn = false
//  retry.addEventListener("click", renderView())}
//}
//
//
//
// fetch("https://jservice.io/api/category?id=1849")
//     .then(response => response.json())
//     .then(parsedResponse => {
//         console.log(parsedResponse)
//         console.log(parsedResponse.clues[1].question)
//         console.log(parsedResponse.clues[1].answer)
//     })

// fetch("https://jservice.io/api/random")
//     .then(response => response.json())
//     .then(parsedResponse => {
//         console.log(parsedResponse)
//         console.log(parsedResponse[0].category.id) //this gets a random question, grabs the id off that question, giving access to a random category
//         //use this url to get a random question, cycle through all questions attached to that category id, add that category id to an array of used categories
//         //use this url again to get a new random question. if the question has already been used, get another question.
//     })
//
//
//
// there are 18,418 categories

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

        startBtn.classList = "start"
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
                console.log(parsedResponse)
                this.category = parsedResponse[0].category.id

                fetch(`https://jservice.io/api/category?id=${this.category}`)
                    .then(response => response.json())
                    .then(parsedResponse => {
                        console.log(parsedResponse)
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
                console.log(this.category)

                fetch(`https://jservice.io/api/category?id=${this.category}`)
                    .then(response => response.json())
                    .then(parsedResponse => {
                        console.log(parsedResponse)
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
            console.log(this.questionsArray)
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
