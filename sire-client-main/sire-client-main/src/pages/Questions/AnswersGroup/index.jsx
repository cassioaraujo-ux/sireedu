import React from 'react';
import "./styles.css";


const AnswersGroup = ({ nextPercent }) => {

    const handleAnswerClick = (answerValue) => {
        nextPercent(answerValue);
    };

    return (
        <ul className="answers-group-container">
            <li className="answer answer-with-after" onClick={() => handleAnswerClick(1)}>
                <span className="circle-text">Nunca se<br/>aplica a mim</span>
                <span className="circle">
                    1
                </span>
            </li>

            <li className="answer answer-with-after" onClick={() => handleAnswerClick(2)}>
                <span className="circle-text">Aplica-se<br/>raramente a mim</span>
                <span className="circle">
                    2
                </span>
            </li>

            <li className="answer answer-with-after" onClick={() => handleAnswerClick(3)}>
                <span className="circle-text">Aplica-se muitas<br/>vezes a mim</span>
                <span className="circle">
                    3
                </span>
            </li>

            <li className="answer" onClick={() => handleAnswerClick(4)}>
                <span className="circle-text">Aplica-se<br/>sempre a mim</span>
                <span className="circle">
                    4
                </span>
            </li>
        </ul>
    );
};

export default AnswersGroup;
