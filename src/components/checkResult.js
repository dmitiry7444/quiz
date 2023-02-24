import {UrlManager} from "../utils/url-manager.js";

export class Check {
    constructor() {
        this.name = sessionStorage.getItem('name');
        this.lastName = sessionStorage.getItem('lastName');
        this.email = sessionStorage.getItem('email');
        this.testId = sessionStorage.getItem('testId');
        this.userResults = JSON.parse(sessionStorage.getItem('userResults'));
        this.quizzes = [];
        this.quiz = null;
        this.resultQuiz = null;

        UrlManager.checkUserData();

        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://testologia.site/get-quizzes', false);
        xhr.send();

        if (xhr.status === 200 && xhr.responseText) {
            try {
                this.quizzes = JSON.parse(xhr.responseText)
            } catch (e) {
                location.href = '#/'
            }
        } else {
            location.href = '#/'
        }

        if (this.testId) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://testologia.site/get-quiz?id=' + this.testId, false);
            xhr.send();
            if (xhr.status === 200 && xhr.responseText) {
                try {
                    this.quiz = JSON.parse(xhr.responseText)
                } catch (e) {
                    location.href = '#/';
                }

            } else {
                location.href = '#/';
            }
        } else {
            location.href = '#/';
        }
        if (this.testId) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://testologia.site/get-quiz-right?id=' + this.testId, false);
            xhr.send();
            if (xhr.status === 200 && xhr.responseText) {
                try {
                    this.resultQuiz = JSON.parse(xhr.responseText)
                } catch (e) {
                    location.href = '#/';
                }

            } else {
                location.href = '#/';
            }
        } else {
            location.href = '#/';
        }

        this.startCheck()
        this.showAnswers()
        this.move()


    }

    startCheck() {
        document.getElementById('breadcrumbs').innerText = this.quizzes[this.testId - 1].name
        document.getElementById('check-respondent-info').innerHTML =
            'Тест выполнил <span>' + this.name + ' '
            + this.lastName + ', '
            + this.email + '</span>';
    }

    showAnswers() {
        const questions = this.quiz.questions;
        questions.forEach((question, index) => {
            const questionItem = document.createElement('div');
            questionItem.className = 'check-question-item';


            /*Рисуем заголовок*/
            const questionTitleElement = document.createElement('div');
            questionTitleElement.className = 'check-question-title common-title';
            questionTitleElement.innerHTML = '<span>Вопрос ' + question.id + ':</span> ' + question.question;
            const checkQuestions = document.getElementById('check-question');


            questionItem.appendChild(questionTitleElement)
            checkQuestions.appendChild(questionItem)

            /*Рисуем инпуты*/
            question.answers.forEach(answer => {
                const optionElement = document.createElement('div');
                optionElement.className = 'check-question-option';

                const inputId = 'answer-' + answer.id;
                const inputElement = document.createElement('input');
                inputElement.className = 'option-answer';
                inputElement.setAttribute('id', inputId);
                inputElement.setAttribute('type', 'radio');
                inputElement.setAttribute('name', 'answer');
                inputElement.setAttribute('value', answer.id);
                inputElement.setAttribute('disabled', 'disabled');


                const labelElement = document.createElement('label');
                const labelId = 'label-' + inputId;
                labelElement.setAttribute('for', inputId);
                labelElement.setAttribute('id', labelId);
                labelElement.innerText = answer.answer;


                optionElement.appendChild(inputElement);
                optionElement.appendChild(labelElement);

                questionItem.appendChild(optionElement)

                /*Проверки*/
                if (answer.id === this.userResults.find(item => item.questionId === question.id).chosenAnswerId
                    && answer.id === this.resultQuiz[index]) {
                    document.getElementById(inputId).style.border = '6px solid #5FDC33';
                    document.getElementById(labelId).style.color = '#5FDC33';
                }
                if (answer.id === this.userResults.find(item => item.questionId === question.id).chosenAnswerId
                    && answer.id !== this.resultQuiz[index]) {
                    document.getElementById(inputId).style.border = '6px solid #DC3333';
                    document.getElementById(labelId).style.color = '#DC3333';
                }

                // try {
                //     if (question.id === this.userResults.find(item => item.chosenAnswerId === null).questionId) {
                //         document.getElementById(inputId).style.borderColor = '#e2dfe7';
                //         document.getElementById(labelId).style.color = '#e2dfe7';
                //     }
                // } catch (e) {
                //
                // }
                // try {
                //     if (question.id === this.userResults.find(item => item.chosenAnswerId === null).questionId) {
                //         questionTitleElement.innerHTML = '<span>Вопрос ' + question.id + ':</span> ' + question.question +
                //             '        <span id="pass">вопрос пропущен</span>';
                //         document.getElementById('pass').style.color = '#e2dfe7';
                //         document.getElementById('pass').style.fontSize = '24px';
                //         document.getElementById('pass').style.fontFamily = '"Museo Sans Cyrl", sans-serif';
                //     }
                // } catch (e) {
                //
                // }
            })



        })
    }


    move() {
        document.getElementById('check-prev').onclick = () => {
            location.href = '#/result';
        }
    }
}
