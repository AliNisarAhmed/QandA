using AutoMapper;
using QandA.Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QandA.AutoMapper
{
    public class AnswerProfile : Profile
    {
        public AnswerProfile()
        {
            CreateMap<AnswerPostRequest, AnswerPostFullRequest>()
                .ForMember(p => p.UserId, opt => opt.MapFrom(src => "2"))
                .ForMember(p => p.UserName, opt => opt.MapFrom(src => "ali.test@test.com"))
                .ForMember(p => p.Created, opt => opt.MapFrom(src => DateTime.UtcNow));
        }
    }
}
