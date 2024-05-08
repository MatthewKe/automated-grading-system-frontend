import {getAnswerAreaAccordingId} from "@/components/projectConfig.js";

export default function uploadCoordinate(answerArea, sheetContainer, indexOfSheets, indexOfAnswerAreaContainers, areaId) {
    let answerArea1 = answerArea
    const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
            const {width, height} = entry.contentRect;
            console.log(`answerArea size: ${width} x ${height}`);
            console.log(`sheetContainer: ${sheetContainer}`);
            console.log(sheetContainer.children[indexOfSheets].children[indexOfAnswerAreaContainers])
            console.log(answerArea1)
            const answerAreaContainer = sheetContainer.children[indexOfSheets].children[indexOfAnswerAreaContainers]
            const answerAreaContainerRect = answerAreaContainer.getBoundingClientRect()
            const answerAreaRect = answerArea1.getBoundingClientRect()
            const relativeLeftTopX = (answerAreaRect.left - answerAreaContainerRect.left) / answerAreaContainerRect.width
            const relativeLeftTopY = (answerAreaRect.top - answerAreaContainerRect.top) / answerAreaContainerRect.height
            const relativeRightBottomX = (answerAreaRect.right - answerAreaContainerRect.left) / answerAreaContainerRect.width
            const relativeRightBottomY = (answerAreaRect.bottom - answerAreaContainerRect.top) / answerAreaContainerRect.height
            const answerArea = getAnswerAreaAccordingId(areaId)
            console.log(answerArea)
            answerArea.relativeLeftTopX = relativeLeftTopX
            answerArea.relativeLeftTopY = relativeLeftTopY
            answerArea.relativeRightBottomX = relativeRightBottomX
            answerArea.relativeRightBottomY = relativeRightBottomY
        }
    });

    if (answerArea1) {
        observer.observe(answerArea1);
    }

    return observer
}

