import React, { useEffect, FC } from 'react';
import { Page } from './Page';
import { Form, required, minLength, Values, SubmitResult } from './Form';
import { Field } from './Field';
import { PostQuestionData, QuestionData } from './QuestionsData';
import { connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  postQuestionActionCreator,
  AppState,
  clearPostedQuestionActionCreator,
} from './Store';
import { AnyAction } from 'redux';

interface IProps {
  postQuestion: (question: PostQuestionData) => Promise<void>;
  postedQuestionResult?: QuestionData;
  clearPostedQuestion: () => void;
}

export const AskPage: FC<IProps> = ({
  postQuestion,
  postedQuestionResult,
  clearPostedQuestion,
}) => {
  const handleSubmit = (values: Values) => {
    postQuestion({
      title: values.title,
      content: values.content,
      userName: 'Fred',
      created: new Date(),
    });
  };

  useEffect(() => {
    return function cleanUp() {
      clearPostedQuestion();
    };
  }, [clearPostedQuestion]);

  let submitResult: SubmitResult | undefined;

  if (postedQuestionResult) {
    submitResult = { success: postedQuestionResult !== undefined };
  }

  return (
    <Page title="Ask a question">
      <Form
        submitCaption="Submit Your Question"
        validationRules={{
          title: [{ validator: required }, { validator: minLength, arg: 10 }],
          content: [{ validator: required }, { validator: minLength, arg: 50 }],
        }}
        onSubmit={handleSubmit}
        failureMessage="There was a problem with your question"
        successMessage="Your question was successfully submitted"
        submitResult={submitResult}
      >
        <Field name="title" label="Title" />
        <Field name="content" label="Content" type="TextArea" />
      </Form>
    </Page>
  );
};

const mapStateToProps = (store: AppState) => {
  return {
    postedQuestionResult: store.questions.postedResult,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  return {
    postQuestion: (question: PostQuestionData) =>
      dispatch(postQuestionActionCreator(question)),
    clearPostedQuestion: () => dispatch(clearPostedQuestionActionCreator()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AskPage);
