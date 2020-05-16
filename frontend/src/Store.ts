import {
  QuestionData,
  getUnansweredQuestions,
  postQuestion,
  PostQuestionData,
} from './QuestionsData';
import {
  Action,
  ActionCreator,
  Dispatch,
  Reducer,
  combineReducers,
  Store,
  createStore,
  applyMiddleware,
} from 'redux';
import thunk, { ThunkAction } from 'redux-thunk';
import { connectRouter, routerMiddleware, push } from 'connected-react-router';
import { createBrowserHistory } from 'history';

interface QuestionState {
  readonly loading: boolean;
  readonly unanswered: QuestionData[] | null;
  readonly postedResult?: QuestionData;
}

export interface AppState {
  readonly questions: QuestionState;
}

const initialQuestionState: QuestionState = {
  loading: false,
  unanswered: null,
};

interface GettingUnansweredQuestionsAction
  extends Action<'GettingUnansweredQuestions'> { }

export interface GotUnansweredQuestionsAction
  extends Action<'GotUnansweredQuestions'> {
  questions: QuestionData[];
}

export interface PostedQuestionAction extends Action<'PostedQuestion'> {
  result: QuestionData | undefined;
}

type QuestionActions =
  | GettingUnansweredQuestionsAction
  | GotUnansweredQuestionsAction
  | PostedQuestionAction;

export const getUnansweredQuestionsActionCreator: ActionCreator<ThunkAction<
  Promise<void>,
  QuestionData[],
  null,
  GotUnansweredQuestionsAction
>> = () => {
  return async (dispatch: Dispatch) => {
    const gettingUnansweredQuestionsAction: GettingUnansweredQuestionsAction = {
      type: 'GettingUnansweredQuestions',
    };
    dispatch(gettingUnansweredQuestionsAction);

    const questions = await getUnansweredQuestions();
    const gotUnansweredQuestionAction: GotUnansweredQuestionsAction = {
      type: 'GotUnansweredQuestions',
      questions,
    };
    dispatch(gotUnansweredQuestionAction);
  };
};

// ThunkAction<R, S, E, A>
// R -> Return result usually wrapped in a promise
// S -> State (the return type of getState function, the second argument after dispatch)
// E -> Extra value (passed to the outer function)
// A -> Type of Action

export const postQuestionActionCreator: ActionCreator<ThunkAction<
  Promise<void>,
  QuestionData,
  PostQuestionData,
  PostedQuestionAction
>> = (question: PostQuestionData) => {
  return async (dispatch: Dispatch) => {
    const result = await postQuestion(question);
    console.log('result: ', result);
    const postedQuestionAction: PostedQuestionAction = {
      type: 'PostedQuestion',
      result,
    };

    dispatch(postedQuestionAction);
    dispatch(push('/'));
  };
};

export const clearPostedQuestionActionCreator: ActionCreator<PostedQuestionAction> = () => {
  const postedQuestionAction: PostedQuestionAction = {
    type: 'PostedQuestion',
    result: undefined,
  };
  return postedQuestionAction;
};

const questionsReducer: Reducer<QuestionState, QuestionActions> = (
  state = initialQuestionState,
  action,
) => {
  switch (action.type) {
    case 'GettingUnansweredQuestions': {
      return {
        ...state,
        unanswered: null,
        loading: true,
      };
    }
    case 'GotUnansweredQuestions': {
      return {
        ...state,
        unanswered: action.questions,
        loading: false,
      };
    }
    case 'PostedQuestion': {
      return {
        ...state,
        unanswered: action.result
          ? (state.unanswered || []).concat(action.result)
          : state.unanswered,
        postedResult: action.result,
      };
    }
    default:
      neverReached(action);
  }
  return state;
};

const neverReached = (never: never) => { };

const rootReducer = combineReducers<AppState>({
  questions: questionsReducer,
});

export const createRootReducer = (history: any) => combineReducers({
  router: connectRouter(history),
  questions: questionsReducer
});

export const history = createBrowserHistory();


export function configureStore(preloadedState?: AppState): Store<AppState> {
  const store = createStore(
    createRootReducer(history),
    preloadedState,
    applyMiddleware(
      routerMiddleware(history),
      thunk
    )
  );
  return store;
}
