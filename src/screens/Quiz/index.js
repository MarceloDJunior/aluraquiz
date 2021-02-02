/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Lottie } from '@crello/react-lottie';
import styled from 'styled-components';
import Widget from '../../components/Widget';
import QuizLogo from '../../components/QuizLogo';
import QuizBackground from '../../components/QuizBackground';
import QuizContainer from '../../components/QuizContainer';
import Button from '../../components/Button';
import AlternativesForm from '../../components/AlternativesForm';
import BackLinkArrow from '../../components/BackLinkArrow';
import loadingAnimation from './animations/loading.json';

const LoadingIconContainer = styled.div`
  display: flex;
  align-items: center; 
  flex-direction: column;
  padding: 30px;
`;

const ResultWidget = ({ results }) => (
  <Widget>
    <Widget.Header>
      <BackLinkArrow href="/" />
      Resultado:
    </Widget.Header>

    <Widget.Content>
      <p>
        Você acertou
        {' '}
        {results.filter((isTrue) => isTrue).length}
        {' '}
        perguntas
      </p>
      <ul>
        {results.map((result, index) => (
          <li key={`result_${result}`}>
            #
            {index + 1}
            {' '}
            Resultado:
            {' '}
            {result === true ? 'Acertou' : 'Errou'}
          </li>
        ))}
      </ul>
    </Widget.Content>
  </Widget>
);

const LoadingWidget = () => (
  <Widget>
    <Widget.Header>
      Carregando...
    </Widget.Header>

    <Widget.Content>
      <LoadingIconContainer>
        <Lottie
          width="100px"
          height="100px"
          className="lottie-container basic"
          config={{ animationData: loadingAnimation, loop: true, autoplay: true }}
        />
      </LoadingIconContainer>
    </Widget.Content>
  </Widget>
);

const QuestionWidget = ({
  question,
  questionIndex,
  totalQuestions,
  onSubmit,
  addResult,
}) => {
  const [selectedAlternative, setSelectedAlternative] = React.useState();
  const [isQuestionSubmitted, setQuestionSubmitted] = React.useState(false);
  const [isSubmitting, setSubmitting] = React.useState(false);
  const questionId = `question__${questionIndex}`;
  const isCorrect = selectedAlternative === question.answer;
  const hasAlternativeSelected = selectedAlternative !== undefined;

  return (
    <Widget>
      <Widget.Header>
        <BackLinkArrow href="/" />
        <h3>
          {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}
        </h3>
      </Widget.Header>

      <img
        alt="Descrição"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
        src={question.image}
      />
      <Widget.Content>
        <h2>
          {question.title}
        </h2>
        <p>
          {question.description}
        </p>

        <AlternativesForm
          onSubmit={(infosDoEvento) => {
            setSubmitting(true);
            infosDoEvento.preventDefault();
            setQuestionSubmitted(true);
            setTimeout(() => {
              addResult(isCorrect);
              onSubmit();
              setQuestionSubmitted(false);
              setSelectedAlternative(undefined);
              setSubmitting(false);
            }, 2 * 1000);
          }}
        >
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`;
            const isSelected = selectedAlternative === alternativeIndex;
            const rightAnswer = alternativeIndex === question.answer && !isCorrect;
            const alternativeStatus = isCorrect || rightAnswer ? 'SUCCESS' : 'ERROR';
            return (
              <Widget.Topic
                as="label"
                key={alternativeId}
                htmlFor={alternativeId}
                data-selected={isSelected || (isQuestionSubmitted && rightAnswer)}
                data-status={isQuestionSubmitted && alternativeStatus}
              >
                <input
                  style={{ display: 'none' }}
                  id={alternativeId}
                  name={questionId}
                  onChange={() => !isSubmitting && setSelectedAlternative(alternativeIndex)}
                  type="radio"
                />
                {alternative}
              </Widget.Topic>
            );
          })}

          {/* <pre>
            {JSON.stringify(question, null, 4)}
          </pre> */}
          <Button type="submit" disabled={!hasAlternativeSelected}>
            Confirmar
          </Button>
        </AlternativesForm>
      </Widget.Content>
    </Widget>
  );
};

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};

const QuizScreen = ({ externalQuestions, externalBg }) => {
  const [screenState, setScreenState] = React.useState(screenStates.LOADING);
  const [results, setResults] = useState([]);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const questionIndex = currentQuestion;
  const question = externalQuestions[questionIndex];
  const totalQuestions = externalQuestions.length;
  const bg = externalBg;

  const addResult = (result) => {
    setResults([
      ...results,
      result,
    ]);
  };

  // [React chama de: Efeitos || Effects]
  // React.useEffect
  // atualizado === willUpdate
  // morre === willUnmount
  React.useEffect(() => {
    // fetch() ...
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1 * 1000);
    // nasce === didMount
  }, []);

  function handleSubmitQuiz() {
    const nextQuestion = questionIndex + 1;
    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion);
    } else {
      setScreenState(screenStates.RESULT);
    }
  }

  return (
    <QuizBackground backgroundImage={bg}>
      <QuizContainer>
        <QuizLogo />
        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            onSubmit={handleSubmitQuiz}
            addResult={addResult}
          />
        )}

        {screenState === screenStates.LOADING && <LoadingWidget />}

        {screenState === screenStates.RESULT && <ResultWidget results={results} />}
      </QuizContainer>
    </QuizBackground>
  );
};

export default QuizScreen;
