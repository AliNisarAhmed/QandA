/** @jsx jsx */

import { FC, useState, Fragment, useEffect } from 'react';
import { Page } from './Page';
import { RouteComponentProps } from 'react-router-dom';
import {
  QuestionData,
  getQuestion,
  postAnswer,
  mapQuestionFromServer,
  QuestionDataFromServer,
} from './QuestionsData';
import { css, jsx } from '@emotion/core';
import { gray3, gray6 } from './Styles';
import { AnswerList } from './AnswerList';
import { Form, required, minLength, Values } from './Form';
import { Field } from './Field';

import {
  HubConnectionBuilder,
  HubConnectionState,
  HubConnection,
} from '@microsoft/signalr';
import { useAuth } from './Auth';

interface RouteParams {
  questionId: string;
}

interface IProps extends RouteComponentProps<RouteParams> {}

export const QuestionPage: FC<IProps> = ({ match }) => {
  const [question, setQuestion] = useState<QuestionData | null>(null);

  const { isAuthenticated } = useAuth();

  const setUpSignalRConnection = async (questionId: number) => {
    Object.defineProperty(WebSocket, 'OPEN', { value: 1 });

    const connection = new HubConnectionBuilder()
      .withUrl('http://localhost:53662/questionshub')
      .withAutomaticReconnect()
      .build();

    connection.on('Message', (message: string) => {
      console.log('Message', message);
    });

    connection.on('ReceiveQuestion', (question: QuestionDataFromServer) => {
      console.log('ReceiveQuestion', question);
      setQuestion(mapQuestionFromServer(question));
    });

    try {
      await connection.start();
    } catch (e) {
      console.log(e);
    }

    if (connection.state === HubConnectionState.Connected) {
      connection.invoke('SubscribeQuestion', questionId).catch((err: Error) => {
        return console.error(err.toString());
      });
    }

    return connection;
  };

  const cleanUpSignalRConnection = async (
    questionId: number,
    connection: HubConnection,
  ) => {
    if (connection.state === HubConnectionState.Connected) {
      try {
        await connection.invoke('UnsubscribeQuestion', questionId);
      } catch (error) {
        return console.error(error.toString());
      }
      connection.off('Message');
      connection.off('ReceiveQuestion');
      connection.stop();
    } else {
      connection.off('Message');
      connection.off('ReceiveQuestion');
      connection.stop();
    }
  };

  useEffect(() => {
    let connection: HubConnection;
    let cancelled = false;

    init();

    async function init() {
      if (match.params.questionId) {
        const questionId = Number(match.params.questionId);
        await doGetQuestion(questionId);
        const conn = await setUpSignalRConnection(questionId);
        connection = conn;
      }
    }

    async function doGetQuestion(questionId: number) {
      const foundQuestion = await getQuestion(questionId);
      if (!cancelled) {
        setQuestion(foundQuestion);
      }
    }

    return function cleanUp() {
      cancelled = true;
      if (match.params.questionId) {
        const questionId = Number(match.params.questionId);
        cleanUpSignalRConnection(questionId, connection);
      }
    };
  }, [match.params.questionId]);

  const handleSubmit = async (values: Values) => {
    const result = await postAnswer({
      questionId: question!.questionId,
      content: values.content,
      userName: 'Fred',
      created: new Date(),
    });

    return { success: result ? true : false };
  };

  return (
    <Page>
      <div
        css={css`
          background-color: white;
          padding: 15px 20px 20px 20px;
          border-radius: 4px;
          border: 1px solid ${gray6};
          box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.16);
        `}
      >
        <div
          css={css`
            font-size: 19px;
            font-weight: bold;
            margin: 10px 0px 5px;
          `}
        >
          {question === null ? '' : question.title}
        </div>
        {question !== null && (
          <Fragment>
            <p
              css={css`
                margin-top: 0px;
                background-color: white;
              `}
            >
              {question.content}
            </p>
            <div
              css={css`
                font-size: 12px;
                font-style: italic;
                color: ${gray3};
              `}
            >
              {`Asked by ${question.userName} on
          ${question.created.toLocaleDateString()}
          ${question.created.toLocaleTimeString()}`}
            </div>
            <AnswerList data={question.answers} />
            {isAuthenticated && (
              <div
                css={css`
                  margin-top: 20px;
                `}
              >
                <Form
                  submitCaption="Submit Your Answer"
                  validationRules={{
                    content: [
                      { validator: required },
                      { validator: minLength, arg: 50 },
                    ],
                  }}
                  onSubmit={handleSubmit}
                  failureMessage="There was a problem with your answer"
                  successMessage="Your answer was successfully submitted"
                >
                  <Field name="content" label="Your Answer" type="TextArea" />
                </Form>
              </div>
            )}
          </Fragment>
        )}
      </div>
    </Page>
  );
};
