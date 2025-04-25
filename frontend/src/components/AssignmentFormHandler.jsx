import React, { useState, useEffect } from "react";

export default function AssignmentForm(information){
    const AssignmentName = information.name;
    const AssignmentDeadline = information.deadline;
    const AssignmentPostDate = information.postDate;
    const AssignmentPoster = information.poster;
    const AssignmentInfo = information.addInfo;
    const AssignmentCourse = information.course;
    const AssignmentScore = information.score;
    const AssignmentTotal = information.maxScore;
    const AssignmentRemarks = information.remarks;
    const [AssignmentInfoVis, setInfoVis] = useState("bg-white p-4 rounded-lg shadow-lg w-full none @apply hidden");
    const [AssignmentSubmitted, setSubmitted] = useState(false);
    const [AssignmentReturned, setReturned] = useState(information.isReturned);
    const [submitScore, setSubmitScore] = useState("Test");
    const [submitColor, setSubmitColor] = useState("black");
    const [submitText, setSubmitBtnText] = useState("Submit");
    const [submitClassName, setSubmitCName] = useState("w-40 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300");
    const [uploadClassName, setUploadCName] = useState("w-40 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-300");
    const [remarksClassName, setRemarksCName] = useState("bg-white p-4 rounded-lg shadow-lg w-full none @apply hidden")

    useEffect(() => {
        if(AssignmentReturned){
            setSubmitScore(AssignmentScore + "/" + AssignmentTotal)
            setSubmitColor("black")
            setRemarksCName("bg-white p-4 rounded-lg shadow-lg w-full none")
        } else {
            setRemarksCName("bg-white p-4 rounded-lg shadow-lg w-full none @apply hidden")
            if (AssignmentSubmitted){
                setSubmitScore("Submitted")
                setSubmitColor("black")
            } else {
                setSubmitScore("Assigned")
                setSubmitColor("black")
            }
        }
        if (AssignmentSubmitted){
            setSubmitBtnText("Cancel Submission")
            setSubmitCName("w-40 bg-gray-50 text-black py-3 rounded-lg hover:bg-gray-100 transition duration-300")
            setUploadCName("w-40 bg-green-500 text-white py-3 rounded-lg opacity-50")
        } else {            
            setSubmitBtnText("Submit")
            setSubmitCName("w-40 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300")
            setUploadCName("w-40 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-300")
        }
    }, [AssignmentSubmitted, AssignmentReturned]);

    function showAssignmentInfo() {
        if(AssignmentInfoVis === "bg-white p-4 rounded-lg shadow-lg w-full none"){
            setInfoVis("bg-white p-4 rounded-lg shadow-lg w-full none @apply hidden");
        } else {
            setInfoVis("bg-white p-4 rounded-lg shadow-lg w-full none");
        }
    }

    function changeSubmitStatus(){
        if(AssignmentSubmitted){
            setSubmitted(false);
        } else {
            setSubmitted(true);
        }
    }

    return(
        <form className="bg-white p-4 rounded-lg shadow-lg w-full hover:bg-gray-50 transition duration-300">
            <div className="flex justify-between" onClick={showAssignmentInfo}>
                <div>
                    <h1 className="font-bold">{AssignmentName}</h1>
                    <h2>Deadline: {new Date(AssignmentDeadline).toLocaleString()}</h2>
                </div>
                <div>
                    <p className="font-bold text-3x1" style={{color: submitColor}}>{submitScore}</p>
                </div>
            </div>
            <div className={AssignmentInfoVis}>
                <div className="flex justify-between">
                 <p className="text-sm text-gray-600">{AssignmentPoster} • {AssignmentCourse}</p>
                 <p className="text-sm text-gray-600">{AssignmentPostDate}</p>
                </div>
                <p>{AssignmentInfo}</p>
                <br />
                <div className={remarksClassName}>
                    <h1 className="font-bold">Remarks</h1>
                    <p>{AssignmentRemarks}</p>
                </div>
                <br />
                <div className="flex justify-between">
                <div></div>
                <div>
                    <button type="button" className={uploadClassName} onClick={changeSubmitStatus} disabled={AssignmentSubmitted}>Upload</button>
                    <button type="button" className={submitClassName} onClick={changeSubmitStatus}>{submitText}</button>
                </div>
                </div>
            </div>
        </form>
    )   
}