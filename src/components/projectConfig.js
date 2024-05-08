import {ref, watch} from "vue";
import http from "@/components/http.js";
import {throttle} from 'lodash';
import domtoimage from "dom-to-image";

const projectConfig = ref({})

const throttledCommit = throttle(commitProjectConfig, 5000);
watch([() => projectConfig.value.title, () => projectConfig.value.sheets, () => projectConfig.value.answerAreas], throttledCommit, {
    deep: true
})
watch(() => projectConfig.value.title, () => {
    console.log('title change')
}, {
    deep: true
})
watch(() => projectConfig.value.sheets, () => {
    console.log('sheets change')
}, {
    deep: true
})
watch(() => projectConfig.value.answerAreas, () => {
    console.log('answerAreas change')
}, {
    deep: true
})

async function commitProjectConfig() {
    let thumbnail = await getThumbnail();
    if (thumbnail !== null) {
        projectConfig.value.thumbnail = thumbnail;
    }
    try {
        const response = await http.post('/produce/commitProject', {
            projectConfig: JSON.stringify(projectConfig.value),
            projectId: projectConfig.value.projectId,
            timestamp: Date.now()
        });
        console.log('commitProjectConfig successful:', response);
    } catch (error) {
        console.error('commitProjectConfig failed:', error.response);
    }
}

async function getThumbnail() {
    try {
        let node = document.querySelector("#sheetContainer")?.children[0];
        if (node === undefined) {
            return null;
        }
        let dataUrl = await domtoimage.toPng(node);
        return dataUrl;
    } catch (error) {
        console.error('Failed to generate thumbnail:', error);
        return null;
    }
}

export function getAnswerAreaAccordingId(id) {
    return projectConfig.value.answerAreas.find((answerArea) => answerArea.id === Number(id))
}

export function getAnswerAreaIndex(id) {
    return projectConfig.value.answerAreas.findIndex((answerArea) => answerArea.id === Number(id))
}


function decrementAfterIndex4answers(answers, index, decrementVal) {
    for (let i = index; i < answers.length; i++) {
        answers[i].questionNumber -= decrementVal
    }
}


export function incrementAfterIndex4answers(answers, index) {
    for (let i = index; i < answers.length; i++) {
        answers[i].questionNumber += 1
    }
}

export function getPreQuestionNumber(answerAreaId) {
    let answerAreaIndex = projectConfig.value.answerAreas.findIndex((answerArea) => answerArea.id === Number(answerAreaId))
    if (answerAreaIndex === 0) {
        return 0
    }
    return projectConfig.value.answerAreas[answerAreaIndex - 1].answers.slice(-1)[0].questionNumber
}

export function deleteAnswer(answerAreaId, questionNumber) {
    let answerArea = getAnswerAreaAccordingId(answerAreaId)
    let answers = answerArea.answers
    let indexOfQuestion = answers.findIndex((a) => a.questionNumber === questionNumber)
    answers.splice(indexOfQuestion, 1)
    //处理后续题目序号
    decrementAfterIndex4answers(answers, indexOfQuestion, 1)
    for (let i = getAnswerAreaIndex(answerAreaId) + 1; i < projectConfig.value.answerAreas.length; i++) {
        let answerArea = projectConfig.value.answerAreas[i]
        decrementAfterIndex4answers(answerArea.answers, 0, 1)
    }
    if (answers.length === 0) {
        deleteAnswerArea(answerAreaId)
    }
}

function addAnswer(answerAreaId, correctAnswer, score) {
    let answerArea = getAnswerAreaAccordingId(answerAreaId)
    let answers = answerArea.answers
    let nextQuestionNumber
    if (answerArea.answers.length === 0) {
        let preQuestionNumber = getPreQuestionNumber(answerAreaId)
        nextQuestionNumber = preQuestionNumber + 1
    } else {
        nextQuestionNumber = answers[answers.length - 1].questionNumber + 1
    }
    let answer = {
        questionNumber: nextQuestionNumber,
        correctAnswer: correctAnswer,
        score: score
    }
    answers.push(answer)
    //处理后续题目序号
    incrementAfterIndex4answers(answers, nextQuestionNumber + 1)
    for (let i = getAnswerAreaIndex(answerAreaId) + 1; i < projectConfig.value.answerAreas.length; i++) {
        let answerArea = projectConfig.value.answerAreas[i]
        incrementAfterIndex4answers(answerArea.answers, 0)
    }
}

export function deleteAnswerArea(answerAreaId) {
    let answerArea = getAnswerAreaAccordingId(answerAreaId)
    let decrementVal = answerArea.answers.length
    let answerAreaIndex = getAnswerAreaIndex(answerAreaId)
    projectConfig.value.answerAreas.splice(answerAreaIndex, 1)
    for (let i = answerAreaIndex; i < projectConfig.value.answerAreas.length; i++) {
        let answerArea = projectConfig.value.answerAreas[i]
        decrementAfterIndex4answers(answerArea.answers, 0, decrementVal)
    }
}


export function defaultAddAnswer(answerAreaId, correctAnswer, score) {
    let answerArea = getAnswerAreaAccordingId(answerAreaId)
    let answers = answerArea.answers
    let nextQuestionNumber
    if (answerArea.answers.length === 0) {
        let preQuestionNumber = getPreQuestionNumber(answerAreaId)
        nextQuestionNumber = preQuestionNumber + 1
    } else {
        nextQuestionNumber = answers[answers.length - 1].questionNumber + 1
    }
    let answer = {
        questionNumber: nextQuestionNumber,
        correctAnswer: correctAnswer,
        score: score
    }
    answers.push(answer)
    //处理后续题目序号
    incrementAfterIndex4answers(answers, nextQuestionNumber + 1)
    for (let i = getAnswerAreaIndex(answerAreaId) + 1; i < projectConfig.value.answerAreas.length; i++) {
        let answerArea = projectConfig.value.answerAreas[i]
        incrementAfterIndex4answers(answerArea.answers, 0)
    }
}

function essayAddAnswer(answerAreaId, correctAnswer, score, numOfLines) {
    let answerArea = getAnswerAreaAccordingId(answerAreaId)
    let answers = answerArea.answers
    let nextQuestionNumber
    if (answerArea.answers.length === 0) {
        let preQuestionNumber = getPreQuestionNumber(answerAreaId)
        nextQuestionNumber = preQuestionNumber + 1
    } else {
        nextQuestionNumber = answers[answers.length - 1].questionNumber + 1
    }
    let answer = {
        questionNumber: nextQuestionNumber,
        correctAnswer: correctAnswer,
        score: score,
        numOfLines: numOfLines
    }
    answers.push(answer)
    //处理后续题目序号
    incrementAfterIndex4answers(answers, nextQuestionNumber + 1)
    for (let i = getAnswerAreaIndex(answerAreaId) + 1; i < projectConfig.value.answerAreas.length; i++) {
        let answerArea = projectConfig.value.answerAreas[i]
        incrementAfterIndex4answers(answerArea.answers, 0)
    }
}


const typeToDefaultTitle = {
    'multipleChoiceAnswerArea': '选择题',
    'fillBlanksAnswerArea': '填空题',
    'calculatingAnswerArea': '计算题',
    'otherAnswerArea': '其它题型',
    'essayAnswerArea': '作文题'
}

export function addAnswerArea(type, idOfPreAnswerArea, idOfSubsequentAnswerArea) {
    let id = projectConfig.value.nextId
    projectConfig.value.nextId++
    projectConfig.value.answerAreas.push({
        id: id,
        type: type,
        height: 40,
        answers: [],
        title: typeToDefaultTitle[type]
    })
    if (type === 'essayAnswerArea') {
        essayAddAnswer(id, [], 0, 10)
    } else {
        defaultAddAnswer(id, [], 0)
    }
    reorderAnswerArea(idOfPreAnswerArea, idOfSubsequentAnswerArea, id)
}

export function reorderAnswerArea(idOfPreAnswerArea, idOfSubsequentAnswerArea, idOfAnswerArea) {
    if (idOfPreAnswerArea === idOfAnswerArea || idOfAnswerArea === idOfSubsequentAnswerArea) {
        return
    }
    let answerAreaArr = projectConfig.value.answerAreas
    let indexOfAnswerArea = answerAreaArr.findIndex((e) => e.id === idOfAnswerArea)
    let answerArea = answerAreaArr[indexOfAnswerArea]
    answerAreaArr.splice(indexOfAnswerArea, 1)
    if (idOfPreAnswerArea !== -1) {
        let indexOfPreAnswerArea = answerAreaArr.findIndex(
            (e) => e.id === idOfPreAnswerArea
        )
        answerAreaArr.splice(indexOfPreAnswerArea + 1, 0, answerArea)
    } else if (idOfSubsequentAnswerArea !== -1) {
        let indexOfSubsequentAnswerArea = answerAreaArr.findIndex(
            (e) => e.id === idOfSubsequentAnswerArea
        )
        answerAreaArr.splice(indexOfSubsequentAnswerArea, 0, answerArea)
    } else {
        answerAreaArr.splice(answerAreaArr.length, 0, answerArea)
    }
    projectConfig.value.answerAreas = answerAreaArr
    //修改所有的questionNumber
    let questionNumber = 1
    for (const answerArea of answerAreaArr) {
        let answers = answerArea.answers
        for (const answer of answers) {
            answer.questionNumber = questionNumber++
        }
    }
}

export default projectConfig
