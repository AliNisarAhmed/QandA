using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using QandA.Data;
using QandA.Data.Model;

namespace QandA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        private readonly IDataRepository _dataRepository;
        private readonly IMapper _mapper;

        public QuestionsController(IDataRepository dataRepository, IMapper mapper)
        {
            _dataRepository = dataRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public IEnumerable<QuestionGetManyResponse> GetQuestions(string search)
        {
            if (string.IsNullOrEmpty(search))
            {
                var questions = _dataRepository.GetQuestions();
                return questions;
            } 
            else
            {
                return _dataRepository.GetQuestionsBySearch(search);
            }
        }

        [HttpGet("unanswered")]
        public IEnumerable<QuestionGetManyResponse> GetUnansweredQuestions()
        {
            return _dataRepository.GetUnansweredQuestions();
        }

        [HttpGet("{questionId}")]
        public ActionResult<QuestionGetSingleResponse> GetQuestion(int questionId)
        {
            var question = _dataRepository.GetQuestion(questionId);
            if (question == null)
                return NotFound();

            return question;
        }

        [HttpPost]
        public ActionResult<QuestionGetSingleResponse> 
            PostQuestion(QuestionPostRequest questionPostRequest)
        {
            var converted = _mapper.Map<QuestionPostFullRequest>(questionPostRequest);

            var savedQuestion = _dataRepository.PostQuestion(converted);
            
            return CreatedAtAction(
                nameof(GetQuestion),
                new { questionId = savedQuestion.QuestionId },
                savedQuestion
                );
        }

        [HttpPut("{questionId}")]
        public ActionResult<QuestionGetSingleResponse> PutQuestion(
            int questionId, 
            QuestionPutRequest questionPutRequest)
        {
            var question = _dataRepository.GetQuestion(questionId);

            if (question == null)
                return NotFound();

            questionPutRequest.Title =
                string.IsNullOrEmpty(questionPutRequest.Title) ?
                    question.Title :
                    questionPutRequest.Title;
            questionPutRequest.Content =
                string.IsNullOrEmpty(questionPutRequest.Content) ?
                    question.Content :
                    questionPutRequest.Content;

            var savedQuestion =
                _dataRepository.PutQuestion(
                    questionId,
                    questionPutRequest);

            return savedQuestion;
        }

        [HttpDelete("{questionId}")]
        public ActionResult DeleteQuestion(int questionId)
        {
            var question = _dataRepository.GetQuestion(questionId);
            if (question == null)
                return NotFound();

            _dataRepository.DeleteQuestion(questionId);
            
            return NoContent();
        }

        [HttpPost("answer")]
        public ActionResult<AnswerGetResponse> PostAnswer(AnswerPostRequest answerPostRequest)
        {
            var questionExists =
                _dataRepository.QuestionExists(answerPostRequest.QuestionId.Value);

            if (!questionExists)
                return NotFound();

            var converted = _mapper.Map<AnswerPostFullRequest>(answerPostRequest);

            var savedAnswer = _dataRepository.PostAnswer(converted);

            return savedAnswer;
        }
    }
}
