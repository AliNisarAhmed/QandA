using AutoMapper;
using QandA.Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QandA.AutoMapper
{
    public class QuestionProfile : Profile
    {
        public QuestionProfile()
        {
            CreateMap<QuestionPostRequest, QuestionPostFullRequest>()
                .ForMember(p => p.UserId, opt => opt.MapFrom((src, dest, destMem, context) => context.Items["UserId"]))
                .ForMember(p => p.UserName, opt => opt.MapFrom((src, dest, destMem, context) => context.Items["UserName"]))
                .ForMember(p => p.Created, opt => opt.MapFrom(src => DateTime.UtcNow));

            CreateMap<QuestionPostFullRequest, QuestionPostRequest>();
        }
    }
}
