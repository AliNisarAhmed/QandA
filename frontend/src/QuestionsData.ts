import { http } from "./http";
import { getAccessToken } from './Auth';

export interface QuestionData {
  questionId: number;
  title: string;
  content: string;
  userName: string;
  created: Date;
  answers: AnswerData[];
}

export interface AnswerData {
  answerId: number;
  content: string;
  userName: string;
  created: Date;
}

export interface QuestionDataFromServer {
  questionId: number;
  title: string;
  content: string;
  userName: string;
  created: string;
  answers: AnswerDataFromServer[];
}

export interface AnswerDataFromServer {
  answerId: number;
  content: string;
  userName: string;
  created: string;
}

export const mapQuestionFromServer = (
  question: QuestionDataFromServer
): QuestionData => ({
  ...question,
  created: new Date(question.created.substr(0, 19)),
  answers: question.answers?.map(answer => ({
    ...answer,
    created: new Date(answer.created.substr(0, 19))
  }))
})

export const getUnansweredQuestions = async (): Promise<QuestionData[]> => {
  try {
    const result = await http<undefined, QuestionDataFromServer[]>({
      path: '/questions/unanswered'
    })

    if (result.parsedBody) {
      return result.parsedBody.map(mapQuestionFromServer);
    } else {
      return [];
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getQuestion = async (
  questionId: number,
): Promise<QuestionData | null> => {
  try {
    const result = await http<undefined, QuestionDataFromServer>({
      path: `/questions/${questionId}`,
    });
    if (result.ok && result.parsedBody) {
      return mapQuestionFromServer(result.parsedBody);
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const searchQuestions = async (
  criteria: string,
): Promise<QuestionData[]> => {
  try {
    const result = await http<undefined, QuestionDataFromServer[]>({
      path: `/questions?search=${criteria}`,
    })
    if (result.ok && result.parsedBody) {
      return result.parsedBody.map(mapQuestionFromServer);
    } else {
      return [];
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};

export interface PostQuestionData {
  title: string;
  content: string;
  userName: string;
  created: Date;
}

export const postQuestion = async (
  question: PostQuestionData,
): Promise<QuestionData | undefined> => {
  const accessToken = await getAccessToken();
  console.log('accessToken', accessToken)
  try {
    const result = await http<PostQuestionData, QuestionDataFromServer>({
      path: '/questions',
      method: 'post',
      body: question,
      accessToken
    });

    if (result.ok && result.parsedBody) {
      return mapQuestionFromServer(result.parsedBody);
    } else {
      return undefined;
    }
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export interface PostAnswerData {
  questionId: number;
  content: string;
  userName: string;
  created: Date;
}

export const postAnswer = async (
  answer: PostAnswerData,
): Promise<AnswerData | undefined> => {
  const accessToken = await getAccessToken();
  try {
    const result = await http<PostAnswerData, AnswerData>({
      path: '/questions/answer',
      method: 'post',
      body: answer,
      accessToken
    })
    if (result.ok) {
      return result.parsedBody;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
