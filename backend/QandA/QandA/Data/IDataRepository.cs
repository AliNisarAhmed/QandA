using QandA.Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QandA.Data
{
    public interface IDataRepository
    {
        IEnumerable<QuestionGetManyResponse> GetQuestions();

        IEnumerable<QuestionGetManyResponse> GetQuestionsWithAnswers();

        IEnumerable<QuestionGetManyResponse> GetQuestionsBySearch(string search);

        IEnumerable<QuestionGetManyResponse> GetUnansweredQuestions();

        QuestionGetSingleResponse GetQuestion(int questionId);

        bool QuestionExists(int questionId);

        QuestionGetSingleResponse PostQuestion(QuestionPostFullRequest question);

        QuestionGetSingleResponse PutQuestion(int questionId, QuestionPutRequest question);

        void DeleteQuestion(int questionId);

        // Answer API

        AnswerGetResponse GetAnswer(int answerId);

        AnswerGetResponse PostAnswer(AnswerPostFullRequest answer);
    }
}
