import {getAnswer, getAnswerAreaAccordingId} from "@/components/projectConfig.js";

export default function uploadAnswerCoordinate(answer, sheetContainer, indexOfSheets, indexOfAnswerAreaContainers, questionNumber) {
    let answer1 = answer
    const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
            const {width, height} = entry.contentRect;
            const answerAreaContainer = sheetContainer.children[indexOfSheets].children[indexOfAnswerAreaContainers]
            const answerAreaContainerRect = answerAreaContainer.getBoundingClientRect()
            const answerAreaRect = answer1.getBoundingClientRect()
            const relativeLeftTopX = (answerAreaRect.left - answerAreaContainerRect.left) / answerAreaContainerRect.width
            const relativeLeftTopY = (answerAreaRect.top - answerAreaContainerRect.top) / answerAreaContainerRect.height
            const relativeRightBottomX = (answerAreaRect.right - answerAreaContainerRect.left) / answerAreaContainerRect.width
            const relativeRightBottomY = (answerAreaRect.bottom - answerAreaContainerRect.top) / answerAreaContainerRect.height
            const answer = getAnswer(questionNumber)
            answer.relativeLeftTopX = relativeLeftTopX
            answer.relativeLeftTopY = relativeLeftTopY
            answer.relativeRightBottomX = relativeRightBottomX
            answer.relativeRightBottomY = relativeRightBottomY
        }
    });

    if (answer1) {
        observer.observe(answer1);
    }

    return observer
}

