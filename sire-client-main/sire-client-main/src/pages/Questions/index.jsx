import React, { useEffect, useState, useCallback } from "react";
import "./styles.css";
import LinearProgress from "./LinearProgress";
import AnswersGroup from "./AnswersGroup";
import useFetch from "../../hooks/useFetch";
import useForm from "../../hooks/useForm";
import { useNavigate, useParams } from "react-router-dom";
import MessageHandler from "../../components/MessageHandler";
import PageTitleUpdater from "../../../src/components/PageTitleUpdater";
import Answered from "./Answered";
import TermDialog from "./TermDialog";
import Term from "./Term";

const Questions = () => {
	const { studyId } = useParams();
	const [percent, setPercent] = useState(1.25);
	const [index, setIndex] = useState(0);
	const [description, setDescription] = useState("");
	const [questions, setQuestions] = useState([]);
	const [currentQuestion, setCurrentQuestion] = useState("");
	const [answers, setAnswers] = useState([]);
	const [message, setMessage] = useState("");      
    const [messageType, setMessageType] = useState("success"); // 'success', 'error', 'info', 'warning'
    const [open, setOpen] = useState(false);

	const handleClose = () => {
        setOpen(false);
    };

	const { fetchAnswers } = useFetch();
	const { processAnswer } = useForm();
	const navigate = useNavigate();

	const percentageIncrement = questions.length ? 100 / questions.length : 0;

	useEffect(() => {
		const controller = new AbortController();
		const loadAnswers = async () => {
			try {
				const { data } = await fetchAnswers(studyId, controller);
				if (data) {
					const sortedQuestions = data.questions.sort((a, b) => a.position - b.position);
					setDescription(data.description);
					setQuestions(sortedQuestions);
					setCurrentQuestion(data.questions[0]);
					setPercent(percentageIncrement);
				}
			} catch (error) {
				if (error.name !== 'AbortError') {
					if (error.name === 'AxiosError') {
						if (error.response.status === 409) { // Conflict
							console.log("Questionário já respondido.");
						} else {
							console.log("Error during fetching:", error);
							navigate("/home");
						}
					}
				} 
			}
		};
		loadAnswers();
		
		return () => controller.abort();
	}, []);

	useEffect(() => {
		if (index < questions.length) {
			setCurrentQuestion(questions[index]);
			setPercent((index + 1) * percentageIncrement);
		}
	}, [index, questions, percentageIncrement]);

	useEffect(() => {
		if (index === questions.length && questions.length > 0) {
			onSubmit(studyId);
		}
	}, [index, questions.length]);

	const nextPercent = useCallback( (answerValue) => {
		  if (index < questions.length) {
			const newAnswer = {
				question: currentQuestion.id,
				answer: answerValue,
			};
			setAnswers((prevAnswers) => [...prevAnswers, newAnswer]);
			setIndex((prev) => prev + 1);
		  }
		},
		[index, currentQuestion]
	);

	const onSubmit = useCallback( async (studyId) => {
			const { success, message } = await processAnswer(studyId, answers);
			if (!success) {
				setMessageType("error");
            	setMessage(message || "Erro ao submeter formulário.");
			} else {
				setMessageType("success");
            	setMessage("Questionário completo! Submetendo respostas...");
				setTimeout(() => {
					navigate("/home/");
				}, 2000);
			}
			setOpen(true);
		},
		[answers, processAnswer, navigate]
	);

    return (
		<div className="questions">
			<PageTitleUpdater title={"Questionário"} />
			{index < questions.length ? (
			<div className="questions-container">
				<TermDialog>
					<Term />
				</TermDialog>
				<div className="questions-header">
					<p className="primary-heading">QUESTIONÁRIO</p>
					<h2>{description}</h2>
				</div>
				<div className="questions-linear-progress">
					<LinearProgress percent={percent} />
				</div>
				<div className="answers-container">
					<div className="questions-text">
						<p>{currentQuestion?.text}</p>
					</div>
					<AnswersGroup nextPercent={nextPercent} />
				</div>
			</div>
			) : (
				<div className="questions-completed">
					<Answered />
				</div>
			)}
			{open && <MessageHandler message={message} type={messageType} open={open} onClose={handleClose} />}
		</div>
    );
};

export default Questions;