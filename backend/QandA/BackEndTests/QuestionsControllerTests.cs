﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ActionConstraints;
using Microsoft.Extensions.Configuration;
using Moq;
using QandA.Controllers;
using QandA.Data;
using QandA.Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace BackEndTests
{
    public class QuestionsControllerTests
    {
        [Fact]
        public async void GetQuestions_WhenNoParameters_ReturnsAll()
        {
            var mockQuestions = new List<QuestionGetManyResponse>();
            for (int i = 1; i <= 10; i++)
            {
                mockQuestions.Add(new QuestionGetManyResponse
                {
                    QuestionId = 1,
                    Title = $"Test title {i}",
                    Content = $"Test Content {i}",
                    UserName = "User1",
                    Answers = new List<AnswerGetResponse>()
                });
            }

            var mockDataRepository = new Mock<IDataRepository>();
            mockDataRepository
                    .Setup(repo => repo.GetQuestions())
                    .Returns(() => Task.FromResult(mockQuestions.AsEnumerable()));

            var mockConfigurationRoot = new Mock<IConfigurationRoot>();
            mockConfigurationRoot.SetupGet(config =>
                config[It.IsAny<string>()]
            ).Returns("some setting");

            var questionsController = new QuestionsController(
                mockDataRepository.Object, null, null, null, null, mockConfigurationRoot.Object
                );

            var result = await questionsController.GetQuestions(null, false);

            Assert.Equal(10, result.Count());

            mockDataRepository.Verify(mock => mock.GetQuestions(), Times.Once());
        }

        [Fact]
        public async void 
                GetQuestions_WhenHaveSearchParameter_ReturnsCorrectQuestions()
        {
            var mockQuestions = new List<QuestionGetManyResponse>();
            mockQuestions.Add(new QuestionGetManyResponse
            {
                QuestionId = 1,
                Title = "Test",
                Content = "Test content",
                UserName = "User1",
                Answers = new List<AnswerGetResponse>()
            });

            var mockDataRepository = new Mock<IDataRepository>();
            mockDataRepository
                .Setup(repo =>
                    repo.GetQuestionsBySearchWithPaging("Test", 1, 20))
                .Returns(() =>
                Task.FromResult(mockQuestions.AsEnumerable()));

            var mockConfigurationRoot = new Mock<IConfigurationRoot>();
            mockConfigurationRoot.SetupGet(config =>
                config[It.IsAny<string>()]
            ).Returns("some setting");

            var questionsController = new QuestionsController(
                mockDataRepository.Object, null, null, null, null, mockConfigurationRoot.Object
                );

            var result =
                await questionsController.GetQuestions("Test", false);

            Assert.Single(result);

            mockDataRepository.Verify(mock =>
                mock.GetQuestionsBySearchWithPaging("Test", 1, 20), Times.Once()
            );
        }

        [Fact]
        public async void 
            GetQuestion_WhenQuestionNotFound_Returns404()
        {
            var mockDataRepository = new Mock<IDataRepository>();
            mockDataRepository
                .Setup(repo => repo.GetQuestion(1))
                .Returns(() => Task.FromResult(default(QuestionGetSingleResponse)));

            var mockQuestionCache = new Mock<IQuestionCache>();
            mockQuestionCache
                .Setup(cache => cache.Get(1))
                .Returns(() => null);

            var mockConfigurationRoot = new Mock<IConfiguration>();
            mockConfigurationRoot
                .SetupGet(config => config[It.IsAny<string>()]).Returns("some setting");

            var questionsController = new QuestionsController(
                mockDataRepository.Object, 
                null, // AutoMapper
                null, // SignalR Hub
                mockQuestionCache.Object, 
                null, // HttpClientFactory
                mockConfigurationRoot.Object
                );

            var result = await questionsController.GetQuestion(1);

            var actionResult = Assert.IsType<ActionResult<QuestionGetSingleResponse>>(result);

            Assert.IsType<NotFoundResult>(actionResult.Result);
        }

        [Fact]
        public async void 
            GetQuestion_WhenQuestionIsFound_ReturnsQuestion()
        {
            var mockQuestion = new QuestionGetSingleResponse
            {
                QuestionId = 1,
                Title = "test"
            };

            var mockDataRepository = new Mock<IDataRepository>();
            mockDataRepository
                .Setup(repo => repo.GetQuestion(1))
                .Returns(() => Task.FromResult(mockQuestion));

            var mockQuestionCache = new Mock<IQuestionCache>();
            mockQuestionCache
                .Setup(c => c.Get(1))
                .Returns(() => mockQuestion);

            var mockConfigurationRoot = new Mock<IConfigurationRoot>();
            mockConfigurationRoot
                .SetupGet(config => config[It.IsAny<string>()]).Returns("some setting");

            var questionsController = new QuestionsController(
                 mockDataRepository.Object,
                null, // AutoMapper
                null, // SignalR Hub
                mockQuestionCache.Object,
                null, // HttpClientFactory
                mockConfigurationRoot.Object
                );

            var result = await questionsController.GetQuestion(1);

            var actionResult =
                Assert.IsType<ActionResult<QuestionGetSingleResponse>>(result);

            var questionResult =
                Assert.IsType<QuestionGetSingleResponse>(actionResult.Value);

            Assert.Equal(1, questionResult.QuestionId);
        }
    }
}
